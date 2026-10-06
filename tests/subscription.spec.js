const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const content = require('./fixtures/subscription.json');

test.use({ storageState: { cookies: [], origins: [] }, viewport: { width: 1440, height: 900 } });

const section = page => page.locator('#subscriptions');
const text = (scope, value) => scope.getByText(value, { exact: true });

function plan(page, key) {
  const other = key === 'yearly' ? 'monthly' : 'yearly';
  // Scope by content and action rather than generated classes or card position.
  return section(page).locator('div')
    .filter({ has: text(page, content.plans[key].name) })
    .filter({ has: page.getByRole('button', { name: /Get Started/i }) })
    .filter({ hasNot: text(page, content.plans[other].name) });
}

function group(page, index) {
  const entry = content.groups[index];
  return section(page).locator('div')
    .filter({ has: text(page, entry.title) })
    .filter({ has: text(page, entry.features[0]) })
    .filter({ hasNot: text(page, content.groups[(index + 1) % 3].title) });
}

async function openSection(page) {
  const response = await page.goto('/en', { waitUntil: 'domcontentloaded' });
  expect(response, 'The storefront must return a response').not.toBeNull();
  expect(response.ok()).toBe(true);
  await expect(page).toHaveURL(/\/en$/);
  const logo = page.getByRole('navigation').getByRole('img', { name: 'FLEXED logo', exact: true });
  await expect.poll(() => logo.evaluate(node =>
    node.complete && node.naturalWidth > 0 && Number(getComputedStyle(node).opacity) > 0),
  { timeout: 15000, message: 'Header is rendered before navigation' }).toBe(true);
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Subscription', exact: true }))
    .toHaveAttribute('href', /^(?:\/en)?#subscriptions$/);
  const heading = section(page).getByRole('heading', { name: content.heading, exact: true });
  await expect(heading).toBeVisible();
  await heading.scrollIntoViewIfNeeded();
  await expect(heading).toBeInViewport();
}

async function expectNoSelection(page) {
  await expect(section(page).getByRole('radio')).toHaveCount(0);
  await expect(section(page).locator('[aria-selected="true"], [aria-checked="true"], input:checked')).toHaveCount(0);
  for (const key of ['yearly', 'monthly']) {
    await expect(plan(page, key)).toHaveCount(1);
    await expect(plan(page, key).getByRole('button', { name: /Get Started/i })).toBeEnabled();
  }
}

test('FLXD-SUB-001: pricing is available to a guest', async ({ page }) => {
  await openSection(page);
  await expect(section(page)).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('FLXD-SUB-002: required content and revised per-plan CTAs are displayed', async ({ page }) => {
  await openSection(page);
  for (const entry of content.groups) await expect(text(section(page), entry.title)).toBeVisible();
  for (const key of ['yearly', 'monthly']) {
    await expect(text(plan(page, key), content.plans[key].name)).toBeVisible();
    await expect(plan(page, key).getByRole('button', { name: /Get Started/i })).toBeVisible();
  }
  await expect(text(section(page), content.requiredSubheading)).toBeVisible();
});

for (const [index, id] of ['003', '004', '005'].entries()) {
  test(`FLXD-SUB-${id}: configured ${content.groups[index].title} features are displayed`, async ({ page }) => {
    await openSection(page);
    await expect(group(page, index)).toHaveCount(1);
    await expect(group(page, index).locator('p')).toHaveText([
      content.groups[index].title, ...content.groups[index].features,
    ]);
    for (const value of content.groups[index].features) await expect(text(group(page, index), value)).toBeVisible();
  });
}

test('FLXD-SUB-006: exactly Yearly and Monthly plan offers are displayed', async ({ page }) => {
  await openSection(page);
  await expect(section(page).getByRole('button', { name: /Get Started/i })).toHaveCount(2);
  await expect(plan(page, 'yearly')).toHaveCount(1);
  await expect(plan(page, 'monthly')).toHaveCount(1);
  await expect(section(page).getByText(/^(Yearly|Monthly) FLEXED Pro$/)).toHaveCount(2);
});

test('FLXD-SUB-007: Yearly precedes Monthly in reading order', async ({ page }) => {
  await openSection(page);
  await expect(section(page).getByText(/^(Yearly|Monthly) FLEXED Pro$/))
    .toHaveText([content.plans.yearly.name, content.plans.monthly.name]);
});

test('FLXD-SUB-008: Yearly recommendation uses an exclusive badge under FLXD-213', async ({ page }) => {
  await openSection(page);
  await expect(text(plan(page, 'yearly'), content.plans.yearly.badge)).toBeVisible();
  await expect(text(plan(page, 'monthly'), content.plans.yearly.badge)).toHaveCount(0);
  await expectNoSelection(page);
});

test('FLXD-SUB-009: Best Value badge is visible and has a filled treatment', async ({ page }) => {
  await openSection(page);
  const badge = text(plan(page, 'yearly'), content.plans.yearly.badge);
  await expect(badge).toBeVisible();
  const style = await badge.evaluate(node => {
    const css = getComputedStyle(node);
    return { background: css.backgroundColor, color: css.color, radius: parseFloat(css.borderRadius) };
  });
  expect(style.background).not.toMatch(/^transparent$|rgba\(0, 0, 0, 0\)/);
  expect(style.color).not.toBe(style.background);
  expect(style.radius).toBeGreaterThan(0);
});

test('FLXD-SUB-010: landing plans have no default selection under FLXD-213', async ({ page }) => {
  await openSection(page);
  await expectNoSelection(page);
});

test('FLXD-SUB-011: a fresh guest load does not restore a landing selection', async ({ page }) => {
  await openSection(page);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(section(page)).toBeVisible();
  await expectNoSelection(page);
});

test('FLXD-SUB-012: Monthly starts through its button rather than card selection', async ({ page }) => {
  await openSection(page);
  await text(plan(page, 'monthly'), content.plans.monthly.name).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await plan(page, 'monthly').getByRole('button', { name: /Get Started/i }).click();
  await expect(page.getByRole('dialog').getByRole('heading', { name: 'Create Your Account', exact: true })).toBeVisible();
});

test('FLXD-SUB-013: both plan buttons open the funnel without a landing selected state', async ({ page }) => {
  await openSection(page);
  for (const key of ['yearly', 'monthly', 'yearly']) {
    await plan(page, key).getByRole('button', { name: /Get Started/i }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('heading', { name: 'Create Your Account', exact: true })).toBeVisible();
    await dialog.getByRole('button', { name: 'close', exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await expectNoSelection(page);
  }
});

function billingFixture() {
  test.skip(!process.env.FLEXED_BILLING_FIXTURE,
    'Provide an independently exported Stripe test-mode billing fixture; storefront prices are not a billing oracle.');
  const fixture = JSON.parse(fs.readFileSync(process.env.FLEXED_BILLING_FIXTURE, 'utf8'));
  expect(fixture.source).toBe('stripe');
  expect(fixture.livemode).toBe(false);
  for (const key of ['yearly', 'monthly']) {
    const value = fixture[key];
    expect(value.priceId).toMatch(/^price_/);
    expect(Number.isInteger(value.unitAmount)).toBe(true);
    expect(value.unitAmount).toBeGreaterThan(0);
    expect(value.currency).toBe('usd');
    expect(value.interval).toBe(key === 'yearly' ? 'year' : 'month');
    expect(value.intervalCount).toBe(1);
  }
  return fixture;
}

for (const [id, key, field] of [
  ['014', 'yearly', 'price'], ['015', 'monthly', 'price'],
  ['016', 'yearly', 'period'], ['017', 'monthly', 'period'],
]) {
  test(`FLXD-SUB-${id}: ${key} ${field} matches the independent billing fixture`, async ({ page }) => {
    const billing = billingFixture()[key];
    await openSection(page);
    const expected = field === 'price'
      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: billing.currency }).format(billing.unitAmount / 100)
      : `/${billing.interval}`;
    await expect(text(plan(page, key), expected)).toBeVisible();
  });
}

test('FLXD-SUB-018: both USD prices match the independent billing fixture', async ({ page }) => {
  const billing = billingFixture();
  await openSection(page);
  for (const key of ['yearly', 'monthly']) {
    const expected = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(billing[key].unitAmount / 100);
    await expect(text(plan(page, key), expected)).toBeVisible();
  }
});

for (const [id, key] of [['019', 'yearly'], ['020', 'monthly']]) {
  test(`FLXD-SUB-${id}: ${key} supporting copy matches the marketing baseline`, async ({ page }) => {
    await openSection(page);
    await expect(text(plan(page, key), content.plans[key].subtext)).toBeVisible();
  });
}

test('FLXD-SUB-021: Monthly does not repeat Yearly savings messaging', async ({ page }) => {
  await openSection(page);
  await expect(text(plan(page, 'yearly'), content.plans.yearly.subtext)).toBeVisible();
  await expect(text(plan(page, 'monthly'), content.plans.monthly.subtext)).toBeVisible();
  await expect(plan(page, 'monthly').getByText(/save\s*\d+%|just\s*\$|savings/i)).toHaveCount(0);
  await expect(text(plan(page, 'monthly'), content.plans.yearly.subtext)).toHaveCount(0);
});

test('FLXD-213-AC09: each Get Started button names its plan for assistive technology', async ({ page }) => {
  await openSection(page);
  for (const key of ['yearly', 'monthly']) {
    await expect(plan(page, key).getByRole('button')).toHaveAccessibleName(new RegExp(key, 'i'));
  }
});
