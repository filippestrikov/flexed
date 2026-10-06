const { test, expect } = require('@playwright/test');
const content = require('./fixtures/hero.json');

const hero = page => page.locator('#hero');
const headline = page => hero(page).getByRole('heading', { level: 1 });
const subheading = (page, language = 'en') => hero(page).getByText(content[language].subheading, { exact: true });
const tags = page => hero(page).locator('#Tags').locator('span');
const cta = (page, language = 'en') => hero(page).getByRole('button', { name: content[language].cta, exact: true });
const image = (page, language = 'en') => hero(page).getByRole('img', { name: content[language].imageAlt, exact: true });
const accountModal = page => page.getByRole('dialog').filter({
  has: page.getByRole('heading', { name: 'Create Your Account', exact: true }),
});

test.use({ storageState: { cookies: [], origins: [] }, viewport: { width: 1440, height: 900 } });

async function openHero(page, language = 'en') {
  const response = await page.goto(`/${language}`, { waitUntil: 'domcontentloaded' });
  expect(response, 'The storefront must return a response').not.toBeNull();
  expect(response.ok(), 'The storefront must load successfully').toBe(true);
  await expect(page).toHaveURL(new RegExp(`/${language}(?:#.*)?$`));
  await expect(hero(page)).toHaveCount(1);
  await expect(headline(page)).toHaveText(content[language].headline);
  await expect(headline(page)).toBeVisible();
}

async function setViewport(page, width) {
  await page.setViewportSize({ width, height: 900 });
  await expect.poll(() => page.evaluate(() => innerWidth)).toBe(width);
}

async function expectImageLoaded(page) {
  await expect(image(page)).toBeVisible();
  await expect.poll(() => image(page).evaluate(node =>
    node.complete && node.naturalWidth > 0 && node.naturalHeight > 0 &&
    Number(getComputedStyle(node).opacity) > 0), { message: 'The Hero image must load and finish its fade-in' })
    .toBe(true);
}

async function expectContent(page) {
  await expect(headline(page)).toHaveText(content.en.headline);
  await expect(subheading(page)).toBeVisible();
  await expect(tags(page)).toHaveText(content.en.tags);
  for (const text of content.en.tags) await expect(hero(page).getByText(text, { exact: true })).toBeVisible();
  await expect(cta(page)).toHaveCount(1);
  await expect(cta(page)).toBeVisible();
  await expect(cta(page)).toBeEnabled();
  await expectImageLoaded(page);
}

async function expectReadable(locator) {
  await expect(locator).toBeVisible();
  await expect.poll(() => locator.evaluate(node => {
    const box = node.getBoundingClientRect();
    const style = getComputedStyle(node);
    return box.width > 0 && box.height > 0 && box.left >= -1 &&
      box.right <= document.documentElement.clientWidth + 1 &&
      node.scrollWidth <= node.clientWidth + 1 &&
      (!['hidden', 'clip'].includes(style.overflowY) || node.scrollHeight <= node.clientHeight + 1);
  }), { message: 'Text must fit the viewport without truncation or clipping' }).toBe(true);
}

async function expectLayout(page, { singleColumn = false, checkOverlap = true, tagsOnly = false } = {}) {
  // Poll geometry while fonts and responsive layout settle.
  await expect.poll(() => hero(page).evaluate((root, { copy, singleColumn, checkOverlap, tagsOnly }) => {
    const text = Array.from(root.querySelectorAll('p')).find(node => node.textContent.trim() === copy.subheading);
    const elements = [root.querySelector('h1'), text, ...root.querySelectorAll('#Tags span'),
      ...Array.from(root.querySelectorAll('button')).filter(node => node.getClientRects().length), root.querySelector('img')];
    if (elements.some(node => !node)) return ['Missing Hero element'];
    const boxes = elements.map(node => node.getBoundingClientRect());
    const problems = [];
    const bounds = root.getBoundingClientRect();
    elements.forEach((node, index) => {
      if (tagsOnly && (index < 2 || index >= boxes.length - 2)) return;
      const box = boxes[index];
      if (box.width <= 0 || box.height <= 0 || box.left < -1 ||
          box.right > document.documentElement.clientWidth + 1 ||
          box.top < bounds.top - 1 || box.bottom > bounds.bottom + 1)
        problems.push(`${node.tagName}: outside viewport or Hero`);
      const style = getComputedStyle(node);
      if (node.tagName !== 'IMG' && (node.scrollWidth > node.clientWidth + 1 ||
          (['hidden', 'clip'].includes(style.overflowY) && node.scrollHeight > node.clientHeight + 1)))
        problems.push(`${node.tagName}: clipped content`);
    });
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        if (!checkOverlap || (tagsOnly && ![i, j].some(index => index >= 2 && index < boxes.length - 2))) continue;
        const a = boxes[i], b = boxes[j];
        if (a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1)
          problems.push(`${elements[i].tagName}/${elements[j].tagName}: overlap`);
      }
    }
    if (singleColumn) {
      const headingBox = boxes[0], subtitleBox = boxes[1];
      const imageBox = boxes[boxes.length - 1], buttonBox = boxes[boxes.length - 2];
      const tagBottom = Math.max(...boxes.slice(2, -2).map(box => box.bottom));
      if (headingBox.bottom > subtitleBox.top + 1 || subtitleBox.bottom > Math.min(...boxes.slice(2, -2).map(box => box.top)) + 1 ||
          tagBottom > imageBox.top + 1 || imageBox.bottom > buttonBox.top + 1)
        problems.push('Mobile content is not stacked in one column');
    }
    if (document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)
      problems.push('Page has horizontal scrolling');
    return problems;
  }, { copy: content.en, singleColumn, checkOverlap, tagsOnly }), { message: 'Hero content must satisfy the scenario layout checks' }).toEqual([]);
}

async function openAccountModal(page, tap = false) {
  await expectImageLoaded(page);
  await expect(cta(page)).toHaveCount(1);
  await expect(cta(page)).toBeEnabled();
  const route = page.url().split('#')[0];
  if (tap) await cta(page).tap(); else await cta(page).click();
  await expect(accountModal(page)).toBeVisible();
  await expect(accountModal(page).getByRole('heading', { name: 'Create Your Account', exact: true })).toBeVisible();
  await expect.poll(() => page.url().split('#')[0]).toBe(route);
}

test('FLXD-HERO-001: Hero is displayed to a guest', async ({ page }) => {
  await openHero(page);
  await expect(hero(page)).toBeVisible();
  await expect(headline(page)).toBeInViewport();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('FLXD-HERO-002: all required Hero elements are displayed', async ({ page }) => {
  await openHero(page);
  await expectContent(page);
  await expect(tags(page)).toHaveCount(3);
});

test('FLXD-HERO-003: headline matches the CMS baseline and is readable', async ({ page }) => {
  await openHero(page);
  await expect(headline(page)).toHaveText(content.en.headline);
  await expectReadable(headline(page));
});

test('FLXD-HERO-004: subheading matches the CMS baseline and is readable', async ({ page }) => {
  await openHero(page);
  await expect(subheading(page)).toHaveText(content.en.subheading);
  await expectReadable(subheading(page));
});

test('FLXD-HERO-005: exactly three value tags match the CMS baseline', async ({ page }) => {
  await openHero(page);
  await expect(tags(page)).toHaveCount(3);
  await expect(tags(page)).toHaveText(content.en.tags);
  for (const text of content.en.tags) await expectReadable(hero(page).getByText(text, { exact: true }));
});

test('FLXD-HERO-006: supporting image loads from the configured CMS source', async ({ page }) => {
  await openHero(page);
  await expectImageLoaded(page);
  const sources = Object.values(content.images);
  await expect.poll(() => image(page).evaluate(node => {
    const source = new URL(node.currentSrc || node.src, location.href);
    return source.searchParams.get('url') || source.href;
  }).then(source => sources.includes(source))).toBe(true);
  await expect(image(page)).toHaveCSS('object-fit', 'cover');
});

test('FLXD-HERO-012: one visible primary CTA is available', async ({ page }) => {
  await openHero(page);
  await expect(cta(page)).toHaveCount(1);
  await expect(cta(page)).toBeVisible();
  await expect(cta(page)).toBeEnabled();
});

test('FLXD-HERO-013: primary CTA has the default English label', async ({ page }) => {
  await openHero(page);
  await expect(cta(page)).toHaveText('Join FLEXED Now');
});

test('FLXD-HERO-016: primary CTA follows English and Arabic language switching', async ({ page }) => {
  await openHero(page);
  for (const [language, linkText] of [['ar', 'AR'], ['en', 'EN']]) {
    await page.getByRole('navigation').getByRole('link', { name: linkText, exact: true }).filter({ visible: true }).click();
    await expect(page).toHaveURL(new RegExp(`/${language}(?:#.*)?$`));
    await expect(headline(page)).toHaveText(content[language].headline);
    await expect(cta(page, language)).toHaveText(content[language].cta);
    await expect(cta(page, language)).toBeVisible();
  }
});

test('FLXD-HERO-017: primary CTA opens Create Account without leaving the page', async ({ page }) => {
  await openHero(page);
  await openAccountModal(page);
  await expect(accountModal(page).getByRole('textbox', { name: 'Name', exact: true })).toBeVisible();
  await expect(accountModal(page).getByRole('textbox', { name: 'Email', exact: true })).toBeVisible();
});

test('FLXD-HERO-018: one CTA click opens exactly one Create Account modal', async ({ page, context }) => {
  await openHero(page);
  await openAccountModal(page);
  await expect(page.getByRole('dialog')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'Create Your Account', exact: true })).toHaveCount(1);
  expect(context.pages()).toHaveLength(1);
});

test('FLXD-HERO-019: Hero remains intact after closing Create Account', async ({ page }) => {
  await openHero(page);
  await openAccountModal(page);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expectContent(page);
  await expectLayout(page);
});

test('FLXD-HERO-020: mobile Hero content is stacked in one column', async ({ page }) => {
  await setViewport(page, 390);
  await openHero(page);
  await expectContent(page);
  await expectLayout(page, { singleColumn: true });
});

test('FLXD-HERO-021: headline and subheading remain readable at mobile widths', async ({ page }) => {
  await openHero(page);
  for (const width of [390, 320]) {
    await setViewport(page, width);
    await expectReadable(headline(page));
    await expectReadable(subheading(page));
  }
});

test('FLXD-HERO-022: mobile value tags remain readable without overlap', async ({ page }) => {
  await setViewport(page, 390);
  await openHero(page);
  await expect(tags(page)).toHaveCount(3);
  await expect(tags(page)).toHaveText(content.en.tags);
  for (const text of content.en.tags) await expectReadable(hero(page).getByText(text, { exact: true }));
  await expectLayout(page, { tagsOnly: true });
});

test('FLXD-HERO-023: mobile CTA is visible and opens Create Account on tap', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 900 }, hasTouch: true,
    storageState: { cookies: [], origins: [] } });
  try {
    const page = await context.newPage();
    await openHero(page);
    await cta(page).scrollIntoViewIfNeeded();
    await expect(cta(page)).toBeInViewport({ ratio: 1 });
    await openAccountModal(page, true);
  } finally { await context.close(); }
});

test('FLXD-HERO-024: mobile image does not overlap text, tags, or CTA', async ({ page }) => {
  await setViewport(page, 390);
  await openHero(page);
  await expectImageLoaded(page);
  await expectLayout(page, { singleColumn: true });
});

test('FLXD-HERO-025: all Hero content can be viewed at 320 px without horizontal scrolling', async ({ page }) => {
  await setViewport(page, 320);
  await openHero(page);
  await expectContent(page);
  await expectLayout(page, { checkOverlap: false });
  for (const target of [headline(page), subheading(page), ...content.en.tags.map(text => hero(page).getByText(text, { exact: true })), image(page), cta(page)]) {
    await target.scrollIntoViewIfNeeded();
    await expect(target).toBeVisible();
    await expect(target).toBeInViewport({ ratio: 1 });
  }
});

test('FLXD-HERO-026: Hero adapts across desktop, tablet, and mobile widths', async ({ page }) => {
  await openHero(page);
  await expectImageLoaded(page);
  for (const width of [1440, 1280, 1024, 768, 640, 390, 320]) {
    await setViewport(page, width);
    await expectLayout(page, { singleColumn: width < 640 });
  }
});

test('FLXD-HERO-028: Hero image preserves proportions across viewport widths', async ({ page }) => {
  await openHero(page);
  for (const width of [1440, 768, 390, 320]) {
    await setViewport(page, width);
    await expectImageLoaded(page);
    await expect(image(page)).toHaveCSS('object-fit', 'cover');
    await expect.poll(() => image(page).evaluate(node => {
      const box = node.getBoundingClientRect(), parent = node.parentElement.getBoundingClientRect();
      return box.width > 0 && box.height > 0 && box.left >= parent.left - 1 &&
        box.right <= parent.right + 1 && box.top >= parent.top - 1 && box.bottom <= parent.bottom + 1 &&
        box.left >= -1 && box.right <= document.documentElement.clientWidth + 1;
    })).toBe(true);
  }
});
