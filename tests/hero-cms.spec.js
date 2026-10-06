const { test, expect } = require('@playwright/test');

test.use({ trace: 'off' });

test('FLXD-HERO-014: CMS Hero fields do not expose a CTA label editor', async ({ browser }) => {
  const credentials = process.env.FLEXED_CMS_EMAIL && process.env.FLEXED_CMS_PASSWORD;
  test.skip(!credentials && !process.env.FLEXED_CMS_STORAGE_STATE,
    'Provide CMS environment credentials or an authenticated FLEXED_CMS_STORAGE_STATE for this read-only check.');
  const context = await browser.newContext({ storageState: credentials ? undefined : process.env.FLEXED_CMS_STORAGE_STATE });
  try {
    const admin = await context.newPage();
    if (credentials) {
      await admin.goto('https://admin-staging.getflexed.app/login', { waitUntil: 'domcontentloaded' });
      await admin.getByRole('textbox', { name: 'Email', exact: true }).fill(process.env.FLEXED_CMS_EMAIL);
      await expect(admin.getByRole('textbox', { name: 'Email', exact: true })).toHaveValue(process.env.FLEXED_CMS_EMAIL);
      await admin.getByRole('textbox', { name: 'Password', exact: true }).fill(process.env.FLEXED_CMS_PASSWORD);
      await expect(admin.getByRole('button', { name: 'Log In', exact: true })).toBeEnabled();
      await admin.getByRole('button', { name: 'Log In', exact: true }).click();
      await expect(admin.getByRole('button', { name: 'Landing page CMS', exact: true })).toBeVisible();
    }
    const response = await admin.goto('https://admin-staging.getflexed.app/cms/hero', { waitUntil: 'domcontentloaded' });
    expect(response, 'The CMS must return a response').not.toBeNull();
    expect(response.ok()).toBe(true);
    const main = admin.getByRole('main');
    await expect(main.getByRole('heading', { name: 'Hero', exact: true })).toBeVisible();
    for (const language of ['English', 'Arabic']) {
      await main.getByRole('radio', { name: language, exact: true }).check();
      await expect(main.getByRole('radio', { name: language, exact: true })).toBeChecked();
      await expect(main.getByRole('textbox')).toHaveCount(5);
      await expect(main.getByRole('textbox', { name: 'Headline', exact: true })).toBeVisible();
      await expect(main.getByRole('textbox', { name: 'Subheading', exact: true })).toBeVisible();
      await expect(main.getByRole('textbox', { name: 'Value tag', exact: true })).toHaveCount(3);
      await expect(main.getByRole('textbox', { name: /CTA|button label|button text/i })).toHaveCount(0);
    }
    await expect(main.getByRole('button', { name: 'Save changes', exact: true })).toBeDisabled();
  } finally { await context.close(); }
});
