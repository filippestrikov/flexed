const { test, expect } = require('@playwright/test');
const content = require('./fixtures/why-flexed-works.json');

const section = page => page.locator('#how-it-works');
const heading = page => section(page).getByRole('heading', { level: 2 });
const image = (page, name) => section(page).getByRole('img', { name, exact: true });
const label = (page, name) => section(page).getByText(name, { exact: true });
const navigationLink = page => page.getByRole('navigation')
  .getByRole('link', { name: /^(?:How|Why) Flexed Works\??$/i })
  .filter({ visible: true });

test.use({ storageState: { cookies: [], origins: [] }, viewport: { width: 1440, height: 900 } });

async function expectLoaded(response) {
  expect(response, 'The store should return a response').not.toBeNull();
  expect(response.ok(), 'The store should load successfully').toBeTruthy();
}

async function scrollToSection(page) {
  await expect(section(page)).toHaveCount(1);
  await heading(page).scrollIntoViewIfNeeded();
  await expect(heading(page)).toBeVisible();
  await expect(heading(page)).toBeInViewport();
}

async function expectImageLoaded(locator) {
  await expect(locator).toBeVisible();
  await expect.poll(() => locator.evaluate(img => img.complete && img.naturalWidth > 0), {
    message: 'The feature image should load successfully',
  }).toBe(true);
}

async function setViewport(page, width) {
  await page.setViewportSize({ width, height: 900 });
  await expect.poll(() => page.evaluate(() => window.innerWidth), {
    message: 'The viewport should use the requested width',
  }).toBe(width);
}

async function expectLayout(page, singleColumn = false) {
  // Poll geometry so font loading and scroll animations can finish.
  await expect.poll(() => section(page).evaluate((root, { names, singleColumn }) => {
    const problems = [];
    const bounds = node => node.getBoundingClientRect();
    const inside = (inner, outer) => inner.left >= outer.left - 1 &&
      inner.right <= outer.right + 1 && inner.top >= outer.top - 1 && inner.bottom <= outer.bottom + 1;
    const overlaps = (a, b) => a.left < b.right - 1 && a.right > b.left + 1 &&
      a.top < b.bottom - 1 && a.bottom > b.top + 1;
    const viewportWidth = document.documentElement.clientWidth;
    const sectionBounds = bounds(root);
    let previousBottom = -Infinity;

    for (const name of names) {
      const img = Array.from(root.querySelectorAll('img')).find(node => node.alt === name);
      const text = Array.from(root.querySelectorAll('p')).find(node => node.textContent.trim() === name);
      if (!img || !text) { problems.push(`${name}: missing image or label`); continue; }
      const imageBounds = bounds(img);
      const textBounds = bounds(text);
      for (const box of [imageBounds, textBounds]) {
        if (box.width <= 0 || box.height <= 0 || box.left < -1 || box.right > viewportWidth + 1 ||
            !inside(box, sectionBounds)) problems.push(`${name}: outside section or viewport`);
      }
      if (text.scrollWidth > text.clientWidth + 1 || text.scrollHeight > text.clientHeight + 1)
        problems.push(`${name}: clipped label`);
      if (overlaps(imageBounds, textBounds)) problems.push(`${name}: image overlaps label`);
      if (!inside(imageBounds, bounds(img.parentElement))) problems.push(`${name}: overflowing image`);
      if (!['cover', 'contain', 'scale-down', 'none'].includes(getComputedStyle(img).objectFit))
        problems.push(`${name}: image may stretch`);
      const rowTop = Math.min(imageBounds.top, textBounds.top);
      if (singleColumn && rowTop < previousBottom - 1) problems.push(`${name}: overlapping mobile rows`);
      previousBottom = Math.max(imageBounds.bottom, textBounds.bottom);
    }
    if (root.scrollWidth > root.clientWidth + 1) problems.push('section has horizontal overflow');
    return problems;
  }, { names: content.features, singleColumn }), { message: 'Feature layout should fit without clipping or overlap' })
    .toEqual([]);
}

async function openSection(page) {
  await expectLoaded(await page.goto('/'));
  await expect(page).toHaveURL(/^https:\/\/staging\.getflexed\.app\/(?:en\/?)?(?:#.*)?$/);
  await scrollToSection(page);
}

test('FLXD-WFW-001: Why FLEXED Works is accessible as a guest', async ({ page }) => {
  await openSection(page);
  await expect(section(page)).toBeVisible();
  await expect(heading(page)).toHaveText(content.heading);
});

test('FLXD-WFW-002: section heading and subheading match default content', async ({ page }) => {
  await openSection(page);
  await expect(heading(page)).toHaveText(content.heading);
  const subheading = section(page).getByText(content.subheading, { exact: true });
  await expect(subheading).toBeVisible();
  await expect(subheading).toBeInViewport();
});

test('FLXD-WFW-003: all baseline feature items are displayed', async ({ page }) => {
  await openSection(page);
  await expect(section(page).getByRole('img')).toHaveCount(content.features.length);
  for (const name of content.features) await expect(label(page, name)).toBeVisible();
});

test('FLXD-WFW-004: every feature has a loaded image and readable label', async ({ page }) => {
  await openSection(page);
  for (const name of content.features) {
    await image(page, name).scrollIntoViewIfNeeded();
    await expectImageLoaded(image(page, name));
    await expect(image(page, name)).toBeInViewport();
    await expect(label(page, name)).toBeVisible();
    await expect(label(page, name)).toBeInViewport();
  }
});

test('FLXD-WFW-005: configured feature note is visible', async ({ page }) => {
  await openSection(page);
  const feature = content.notes.find(item => item.feature === 'Home & Gym Workout Options');
  expect(feature, 'The CMS fixture must contain the configured feature note').toBeDefined();
  await label(page, feature.feature).scrollIntoViewIfNeeded();
  await expect(label(page, feature.feature)).toBeInViewport();
  await expect(section(page).getByText(feature.text, { exact: true })).toBeVisible();
  await expect(section(page).getByText(feature.text, { exact: true })).toBeInViewport();
});

test('FLXD-WFW-006: configured feature without a note has no empty placeholders', async ({ page }) => {
  test.skip(content.featuresWithoutNotes.length === 0, 'All current CMS features have notes; a no-note fixture is required.');
  await openSection(page);
  for (const name of content.featuresWithoutNotes) {
    await expectImageLoaded(image(page, name));
    await expect(label(page, name)).toBeVisible();
    const paragraphs = await label(page, name).evaluate((text, name) => {
      let card = text.parentElement;
      while (card && !Array.from(card.querySelectorAll('img')).some(img => img.alt === name)) card = card.parentElement;
      if (!card) throw new Error(`Feature container not found: ${name}`);
      return Array.from(card.querySelectorAll('p')).map(node => node.textContent.trim());
    }, name);
    expect(paragraphs).toEqual([name]);
    expect(paragraphs.join(' ')).not.toMatch(/\b(?:null|undefined|NaN)\b/);
  }
});

test('FLXD-WFW-014: feature content has no links, buttons, or click actions', async ({ page, context }) => {
  await openSection(page);
  await expect(section(page).getByRole('link')).toHaveCount(0);
  await expect(section(page).getByRole('button')).toHaveCount(0);
  // Scrolling updates the section hash independently of clicks.
  const initialUrl = page.url().split('#')[0];
  for (const name of content.features) {
    for (const target of [image(page, name), label(page, name)]) {
      await target.click();
      await expect.poll(() => page.url().split('#')[0]).toBe(initialUrl);
      await expect(section(page)).toBeVisible();
      await expect(page.getByRole('dialog')).toHaveCount(0);
      expect(context.pages()).toHaveLength(1);
    }
  }
});

test('FLXD-WFW-015: section anchor is stable and unique after reload', async ({ page }) => {
  await openSection(page);
  await expect(section(page)).toHaveAttribute('id', 'how-it-works');
  await expect(page.locator('[id="how-it-works"]')).toHaveCount(1);
  await expectLoaded(await page.reload());
  await expect(heading(page)).toHaveText(content.heading);
  await expect(page.locator('[id="how-it-works"]')).toHaveCount(1);
});

test('FLXD-WFW-016: desktop navigation targets the correct section', async ({ page }) => {
  await expectLoaded(await page.goto('/en'));
  const link = navigationLink(page);
  await expect(link).toHaveCount(1);
  await expect(link).toHaveAttribute('href', '/en#how-it-works');
  await link.click();
  await expect(page).toHaveURL(/\/en#how-it-works$/);
  await expect(heading(page)).toBeInViewport();
});

test('FLXD-WFW-017: direct anchor URL brings the section into view', async ({ page }) => {
  await expectLoaded(await page.goto('/en#how-it-works'));
  await expect(page).toHaveURL(/\/en#how-it-works$/);
  await expect(heading(page)).toBeVisible();
  await expect(heading(page)).toBeInViewport();
});

test('FLXD-WFW-018: mobile features form one column without overlap or clipping', async ({ page }) => {
  await setViewport(page, 390);
  await openSection(page);
  for (const name of content.features) await expectImageLoaded(image(page, name));
  await expectLayout(page, true);
});

test('FLXD-WFW-020: configured feature note remains readable at mobile widths', async ({ page }) => {
  const feature = content.notes.find(item => item.feature === 'Home & Gym Workout Options');
  expect(feature, 'The CMS fixture must contain the configured feature note').toBeDefined();
  for (const width of [390, 320]) {
    await setViewport(page, width);
    await openSection(page);
    await label(page, feature.feature).scrollIntoViewIfNeeded();
    await expect(label(page, feature.feature)).toBeInViewport();
    const note = section(page).getByText(feature.text, { exact: true });
    await expect(note).toBeVisible();
    await note.scrollIntoViewIfNeeded();
    await expect(note).toBeInViewport();
    await expect.poll(() => note.evaluate(node => {
      const bounds = node.getBoundingClientRect();
      return bounds.left >= 0 && bounds.right <= document.documentElement.clientWidth &&
        node.scrollWidth <= node.clientWidth + 1 && node.scrollHeight <= node.clientHeight + 1;
    })).toBe(true);
  }
});

test('FLXD-WFW-021: layout adapts across desktop, tablet, and mobile widths', async ({ page }) => {
  await openSection(page);
  for (const width of [1440, 1024, 768, 390, 320]) {
    await setViewport(page, width);
    await scrollToSection(page);
    await expectLayout(page, width < 768);
    await expect.poll(() => page.evaluate(() =>
      document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1))
      .toBe(true);
  }
});

test('FLXD-WFW-023: loaded images fit the layout on desktop and mobile', async ({ page }) => {
  await openSection(page);
  for (const width of [1440, 390]) {
    await setViewport(page, width);
    await scrollToSection(page);
    for (const name of content.features) await expectImageLoaded(image(page, name));
    await expectLayout(page, width < 768);
  }
});

test('FLXD-WFW-024: informational features add no keyboard focus stops', async ({ page }) => {
  await openSection(page);
  const focusable = section(page).locator('a[href], button, input, select, textarea, [tabindex], [contenteditable="true"]');
  await expect.poll(() => focusable.evaluateAll(nodes => nodes.filter(node =>
    node.tabIndex >= 0 && node.getClientRects().length > 0).length)).toBe(0);
  const heroButton = page.getByRole('button', { name: 'Join FLEXED Now', exact: true });
  await heroButton.focus();
  await expect(heroButton).toBeFocused();
  await page.keyboard.press('Tab');
  await expect.poll(() => section(page).evaluate(root => root.contains(document.activeElement))).toBe(false);
  await expect.poll(() => page.locator(':focus').evaluate(node => node.tabIndex >= 0)).toBe(true);
  await page.keyboard.press('Shift+Tab');
  await expect(heroButton).toBeFocused();
  await navigationLink(page).focus();
  await expect(navigationLink(page)).toBeFocused();
});
