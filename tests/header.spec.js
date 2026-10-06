const { test, expect } = require('@playwright/test');

const copy = {
  en: { links: ['Why Flexed Works?', 'Subscription', 'Journeys', 'FAQ'], theme: 'Toggle theme', login: 'Log in', signup: 'Sign Up' },
  ar: { links: ['لماذا فلكسد فعّال؟', 'اشتراك', 'الرحلات', 'الأسئلة الشائعة'], theme: 'تبديل المظهر', login: 'تسجيل الدخول', signup: 'إنشاء حساب' },
};
const sections = ['how-it-works', 'subscriptions', 'journeys', 'faq'];
const header = page => page.getByRole('navigation');
const link = (page, name) => header(page).getByRole('link', { name, exact: true }).filter({ visible: true });
const button = (page, name) => header(page).getByRole('button', { name, exact: true });
const logo = page => link(page, 'FLEXED logo');
const themeLabel = (page, language = 'en') => header(page).locator(`label[aria-label="${copy[language].theme}"]`).filter({ visible: true });
const themeInput = (page, language = 'en') => themeLabel(page, language).locator('input[type="checkbox"]');
const heading = (page, id) => page.locator(`#${id}`).getByRole('heading', {
  level: id === 'hero' ? 1 : 2,
  ...(id === 'journeys' ? { name: /^(Science-Based Journeys For Every Goal!|رحلات مبنية على أسس علمية لكل هدف)$/ } : {}),
});
const controls = (page, language = 'en') => [logo(page), ...copy[language].links.map(name => link(page, name)),
  themeLabel(page, language), link(page, 'EN'), link(page, 'AR'), button(page, copy[language].login), button(page, copy[language].signup)];

test.use({ storageState: { cookies: [], origins: [] }, viewport: { width: 1440, height: 900 } });
test.beforeEach(async ({ page }) => {
  const response = await page.goto('/en', { waitUntil: 'domcontentloaded' });
  expect(response?.ok(), 'Guest storefront loads successfully').toBe(true);
  await expect(page).toHaveURL(/\/en(?:#.*)?$/);
  await expect(header(page)).toHaveCount(1);
  await expect(header(page)).toBeVisible();
  await expect.poll(() => logo(page).getByRole('img').evaluate(node =>
    node.complete && node.naturalWidth > 0 && Number(getComputedStyle(node).opacity) > 0),
  { timeout: 15000, message: 'Header logo loads and becomes visible' }).toBe(true);
});

async function expectControls(page, language = 'en') {
  for (const control of controls(page, language)) {
    await expect(control).toHaveCount(1);
    await expect(control).toBeVisible();
    await expect(control).toBeInViewport({ ratio: 1 });
  }
  await expect(header(page).getByRole('link', { name: 'Success Stories', exact: true })).toHaveCount(0);
}

async function expectLayout(page, language = 'en') {
  await expectControls(page, language);
  const boxes = [];
  for (const control of controls(page, language)) {
    const box = await control.boundingBox();
    expect(box).not.toBeNull();
    boxes.push(box);
    await expect.poll(() => control.evaluate(node => {
      const box = node.getBoundingClientRect(), walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
      let text;
      while ((text = walker.nextNode())) if (text.textContent.trim()) {
        const range = document.createRange(); range.selectNodeContents(text);
        for (const rect of range.getClientRects()) if (rect.left < box.left - 1 || rect.right > box.right + 1 ||
          rect.top < box.top - 1 || rect.bottom > box.bottom + 1) return false;
      }
      return true;
    }), { message: 'Header text fits its control bounds' }).toBe(true);
  }
  for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
    const a = boxes[i], b = boxes[j];
    expect(Math.min(a.x + a.width, b.x + b.width) <= Math.max(a.x, b.x) + 1 ||
      Math.min(a.y + a.height, b.y + b.height) <= Math.max(a.y, b.y) + 1, `Header controls ${i} and ${j} do not overlap`).toBe(true);
  }
  const centers = boxes.map(box => box.y + box.height / 2);
  expect(Math.max(...centers) - Math.min(...centers), 'Controls share one aligned row').toBeLessThanOrEqual(2);
}

async function expectFixed(page) {
  await expect(header(page)).toHaveCSS('position', 'fixed');
  await expect.poll(() => header(page).evaluate(node => Math.abs(node.getBoundingClientRect().top))).toBeLessThanOrEqual(1);
  await expectControls(page);
}

async function scrollTo(page, id) {
  await page.locator(`#${id}`).evaluate(node => node.scrollIntoView({ behavior: 'instant', block: 'start' }));
  await expect(page.locator(`#${id}`)).toBeInViewport();
}

async function expectDestination(page, id) {
  await expect(heading(page, id)).toBeInViewport({ ratio: 1 });
  await expect.poll(async () => {
    const title = await heading(page, id).boundingBox(), nav = await header(page).boundingBox();
    return title && nav && title.y >= nav.y + nav.height - 1;
  }, { message: `${id} heading is not obscured by the fixed header` }).toBe(true);
}

async function navigate(page, id, language = 'en', keyboard = false) {
  const control = link(page, copy[language].links[sections.indexOf(id)]);
  await expect(control).toHaveAttribute('href', `/${language}#${id}`);
  if (keyboard) { await tabTo(page, control); await page.keyboard.press('Enter'); }
  else await control.click();
  await expect(page).toHaveURL(new RegExp(`/${language}#${id}$`));
  await expectDestination(page, id);
}

async function expectTop(page) {
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThanOrEqual(1);
  await expect(heading(page, 'hero')).toBeInViewport({ ratio: 1 });
}

async function smoothAction(page, action, destination) {
  // Record real scroll frames; fixed sleeps cannot prove a smooth transition.
  await page.evaluate(() => {
    window.headerScrollSamples = [scrollY];
    const sample = () => { window.headerScrollSamples.push(scrollY); window.headerScrollFrame = requestAnimationFrame(sample); };
    window.headerScrollFrame = requestAnimationFrame(sample);
  });
  await action();
  await destination();
  const samples = await page.evaluate(() => {
    cancelAnimationFrame(window.headerScrollFrame);
    return window.headerScrollSamples;
  });
  const start = samples[0], end = samples[samples.length - 1];
  expect(Math.abs(end - start), 'Action scrolls to a different position').toBeGreaterThan(100);
  expect(new Set(samples.filter(y => y > Math.min(start, end) + 2 && y < Math.max(start, end) - 2)).size,
    'Scroll contains multiple intermediate positions').toBeGreaterThan(1);
}

async function openModal(page, kind, keyboard = false) {
  const control = button(page, copy.en[kind]);
  const route = new URL(page.url()).pathname;
  if (keyboard) { await tabTo(page, control); await page.keyboard.press('Enter'); }
  else await control.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toHaveCount(1);
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('heading', { name: kind === 'login' ? 'Log in' : 'Create Your Account', exact: true })).toBeVisible();
  await expect(dialog.getByRole('textbox', { name: 'Email', exact: true })).toBeVisible();
  if (kind === 'signup') await expect(dialog.getByRole('textbox', { name: 'Name', exact: true })).toBeVisible();
  expect(new URL(page.url()).pathname).toBe(route);
}

async function closeModal(page) {
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
}

async function toggleTheme(page, keyboard = false) {
  const before = await page.locator('html').getAttribute('data-theme');
  expect(['light', 'dark']).toContain(before);
  const checked = await themeInput(page).isChecked();
  if (keyboard) { await tabTo(page, themeInput(page)); await page.keyboard.press('Space'); }
  else await themeLabel(page).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', before === 'dark' ? 'light' : 'dark');
  await expect(themeInput(page)).toBeChecked({ checked: !checked });
  await expectControls(page);
}

async function switchLanguage(page, language, keyboard = false) {
  if (keyboard) { await tabTo(page, link(page, language.toUpperCase())); await page.keyboard.press('Enter'); }
  else await link(page, language.toUpperCase()).click();
  await expect(page).toHaveURL(new RegExp(`/${language}(?:#.*)?$`));
  await expect(page.locator('html')).toHaveAttribute('lang', language);
  await expect(page.locator('html')).toHaveAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
  await expectControls(page, language);
}

async function tabTo(page, target) {
  if (await target.evaluate(node => node === document.activeElement)) { await expect(target).toBeFocused(); return; }
  for (let i = 0; i < 30; i++) {
    await page.keyboard.press('Tab');
    if (await target.evaluate(node => node === document.activeElement)) { await expect(target).toBeFocused(); return; }
  }
  throw new Error(`Control is not reachable using Tab: ${await target.evaluate(node => node.outerHTML)}`);
}

async function appearance(target) {
  return target.evaluate(node => {
    const style = element => {
      const s = getComputedStyle(element);
      const box = element.getBoundingClientRect();
      return { width: box.width, height: box.height, outlineStyle: s.outlineStyle, outlineWidth: s.outlineWidth, outlineColor: s.outlineColor,
        boxShadow: s.boxShadow, background: s.backgroundColor, border: s.borderColor, color: s.color };
    };
    return [style(node), ...(node.tagName === 'INPUT' ? [style(node.parentElement)] : [])];
  });
}

async function expectFocus(page, target) {
  const before = await appearance(target);
  await tabTo(page, target);
  await expect(target).toBeFocused();
  expect(await target.evaluate(node => node.matches(':focus-visible'))).toBe(true);
  await expect.poll(async () => {
    const after = await appearance(target);
    return after.some((s, i) => s.width > 0 && s.height > 0 && JSON.stringify(s) !== JSON.stringify(before[i]) &&
      ((s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0 && !/rgba\([^)]*, 0\)$/.test(s.outlineColor)) ||
        s.boxShadow !== before[i].boxShadow || s.background !== before[i].background || s.border !== before[i].border));
  }, { message: 'Focused control has an outline, ring, border, or background change' }).toBe(true);
  const visual = await target.evaluate(node => {
    const r = (node.tagName === 'INPUT' ? node.parentElement : node).getBoundingClientRect();
    return r.width > 0 && r.height > 0 && r.top >= 0 && r.bottom <= innerHeight;
  });
  expect(visual, 'Focus treatment belongs to a visible control').toBe(true);
}

function scenario(number, summary, run) { test(`FLXD-HEAD-${String(number).padStart(3, '0')}: ${summary}`, run); }

scenario(1, 'desktop header is displayed for a guest', async ({ page }) => {
  await expectControls(page);
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
scenario(2, 'all required controls are displayed', async ({ page }) => { await expectControls(page); });
scenario(3, 'desktop controls fit without overlap or wrapping', async ({ page }) => {
  for (const width of [1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(() => page.evaluate(() => innerWidth)).toBe(width);
    await expectLayout(page);
  }
});
scenario(4, 'header remains fixed while scrolling down', async ({ page }) => {
  for (const id of ['how-it-works', 'subscriptions', 'journeys', 'faq']) { await scrollTo(page, id); await expectFixed(page); }
});
scenario(5, 'header remains fixed while scrolling up', async ({ page }) => {
  await scrollTo(page, 'faq'); await expectFixed(page);
  for (const id of ['journeys', 'subscriptions', 'how-it-works', 'hero']) { await scrollTo(page, id); await expectFixed(page); }
});
scenario(6, 'navigation headings are not obscured', async ({ page }) => {
  for (const id of sections) await navigate(page, id);
});
for (const [number, id] of [[7, 'journeys'], [8, 'how-it-works'], [9, 'subscriptions'], [10, 'faq']]) {
  scenario(number, `${id} navigation reaches the correct section smoothly`, async ({ page }) => {
    await smoothAction(page, () => navigate(page, id), () => expectDestination(page, id));
  });
}
scenario(11, 'all section links scroll through intermediate positions', async ({ page }) => {
  for (const id of sections) {
    await scrollTo(page, 'hero');
    await smoothAction(page, () => navigate(page, id), () => expectDestination(page, id));
  }
});
scenario(12, 'repeated section navigation keeps the header usable', async ({ page }) => {
  for (const id of ['journeys', 'faq', 'subscriptions', 'how-it-works']) { await navigate(page, id); await expectFixed(page); }
});
scenario(13, 'Log in opens its modal without redirecting', async ({ page }) => { await openModal(page, 'login'); });
scenario(14, 'one Log in click opens one modal', async ({ page, context }) => {
  await openModal(page, 'login');
  await expect(page.getByRole('heading', { name: 'Log in', exact: true })).toHaveCount(1);
  expect(context.pages()).toHaveLength(1);
});
scenario(15, 'header works after closing Log in', async ({ page }) => {
  await openModal(page, 'login'); await closeModal(page); await navigate(page, 'journeys'); await expectFixed(page);
});
scenario(16, 'Sign Up opens the account step', async ({ page }) => { await openModal(page, 'signup'); });
scenario(17, 'Sign Up displays account fields rather than another funnel step', async ({ page }) => {
  await openModal(page, 'signup');
  await expect(page.getByRole('dialog').getByRole('textbox', { name: 'Confirm Password', exact: true })).toBeVisible();
  await expect(page.getByRole('dialog').getByRole('button', { name: 'Continue', exact: true })).toBeDisabled();
});
scenario(18, 'logo returns to the Hero', async ({ page }) => {
  await scrollTo(page, 'journeys'); await logo(page).click(); await expectTop(page);
});
scenario(19, 'logo scrolls smoothly to the top', async ({ page }) => {
  await scrollTo(page, 'faq'); await smoothAction(page, () => logo(page).click(), () => expectTop(page));
});
scenario(20, 'logo at the top causes no redirect or modal', async ({ page }) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await logo(page).click(); await expectTop(page);
  await expect(page).toHaveURL(/\/en(?:#hero)?$/);
  await expect(page.getByRole('dialog')).toHaveCount(0); expect(errors).toEqual([]);
});
scenario(21, 'theme toggle changes the theme', async ({ page }) => { await toggleTheme(page); });
scenario(22, 'controls fit and remain operable in both themes', async ({ page }) => {
  await toggleTheme(page); await expectLayout(page); await navigate(page, 'faq');
  await toggleTheme(page); await expectLayout(page); await openModal(page, 'login');
});
scenario(23, 'language toggle switches EN and AR', async ({ page }) => {
  await switchLanguage(page, 'ar'); await switchLanguage(page, 'en');
});
scenario(24, 'Arabic header fits RTL layout and remains usable', async ({ page }) => {
  await switchLanguage(page, 'ar'); await expectLayout(page, 'ar');
  await navigate(page, 'journeys', 'ar');
  await button(page, copy.ar.login).click(); await expect(page.getByRole('dialog')).toBeVisible();
});
scenario(25, 'all navigation destinations work after language changes', async ({ page }) => {
  test.setTimeout(60000);
  for (const language of ['ar', 'en']) { await switchLanguage(page, language); for (const id of sections) await navigate(page, id, language); }
});
scenario(26, 'logo is reachable, visibly focused, and keyboard operable', async ({ page }) => {
  await scrollTo(page, 'faq'); await expectFocus(page, logo(page)); await page.keyboard.press('Enter'); await expectTop(page);
});
scenario(27, 'all menu links have keyboard focus and activation', async ({ page }) => {
  for (const id of sections) {
    await expectFocus(page, link(page, copy.en.links[sections.indexOf(id)]));
    await page.keyboard.press('Enter'); await expect(page).toHaveURL(new RegExp(`/en#${id}$`)); await expectDestination(page, id);
  }
});
scenario(28, 'theme toggle is keyboard accessible', async ({ page }) => {
  await expectFocus(page, themeInput(page)); await toggleTheme(page, true);
});
scenario(29, 'language toggle is keyboard accessible', async ({ page }) => {
  await expectFocus(page, link(page, 'AR')); await switchLanguage(page, 'ar', true);
});
scenario(30, 'Log in is keyboard accessible', async ({ page }) => {
  await expectFocus(page, button(page, 'Log in')); await openModal(page, 'login', true);
});
scenario(31, 'Sign Up is keyboard accessible', async ({ page }) => {
  await expectFocus(page, button(page, 'Sign Up')); await openModal(page, 'signup', true);
});
scenario(32, 'Tab follows the visible header order without skipping controls', async ({ page }) => {
  const targets = controls(page).map((control, index) => index === 5 ? themeInput(page) : control);
  for (const target of targets) { await page.keyboard.press('Tab'); await expect(target).toBeFocused(); }
});
scenario(33, 'navigation links show visible keyboard focus', async ({ page }) => {
  for (const name of copy.en.links) await expectFocus(page, link(page, name));
});
scenario(34, 'theme and language toggles show visible keyboard focus', async ({ page }) => {
  for (const target of [themeInput(page), link(page, 'EN'), link(page, 'AR')]) await expectFocus(page, target);
});
scenario(35, 'Log in and Sign Up show visible keyboard focus', async ({ page }) => {
  for (const name of ['Log in', 'Sign Up']) await expectFocus(page, button(page, name));
});
scenario(36, 'keyboard focus remains visible over scrolled content', async ({ page }) => {
  await scrollTo(page, 'journeys'); await expectFixed(page);
  for (const target of [logo(page), ...copy.en.links.map(name => link(page, name)), themeInput(page), link(page, 'EN'), link(page, 'AR'), button(page, 'Log in'), button(page, 'Sign Up')]) await expectFocus(page, target);
});
scenario(37, 'all header controls can be operated without a mouse', async ({ page }) => {
  test.setTimeout(60000);
  for (const id of sections) await navigate(page, id, 'en', true);
  await tabTo(page, logo(page)); await page.keyboard.press('Enter'); await expectTop(page);
  await toggleTheme(page, true); await switchLanguage(page, 'ar', true); await switchLanguage(page, 'en', true);
  await openModal(page, 'login', true); await closeModal(page); await openModal(page, 'signup', true);
});
