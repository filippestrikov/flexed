const { test, expect } = require('@playwright/test');

// Start with no saved authentication.
test.use({ storageState: { cookies: [], origins: [] } });

test('FLXD-WFW-001: Why FLEXED Works is accessible as a guest', async ({ page }) => {
  const response = await page.goto('https://staging.getflexed.app/');

  expect(response, 'The store should return a response').not.toBeNull();
  expect(response.ok(), 'The store should load successfully').toBeTruthy();
  // The store redirects guests to the English homepage.
  await expect(page).toHaveURL(/^https:\/\/staging\.getflexed\.app\/(?:en\/?)?(?:#.*)?$/);

  const sectionHeading = page.getByRole('heading', {
    name: 'Why FLEXED Works',
    exact: true,
  });

  await expect(sectionHeading).toBeAttached();

  await sectionHeading.scrollIntoViewIfNeeded();

  await expect(sectionHeading).toBeVisible();
  await expect(sectionHeading).toBeInViewport();
});

test('FLXD-WFW-002: Why FLEXED Works heading and subheading match default content', async ({ page }) => {
  const response = await page.goto('/');
  expect(response, 'The store should return a response').not.toBeNull();
  expect(response.ok(), 'The store should load successfully').toBeTruthy();
  await expect(page).toHaveURL(/^https:\/\/staging\.getflexed\.app\/(?:en\/?)?(?:#.*)?$/);

  const heading = page.getByRole('heading', {
    name: 'Why FLEXED Works',
    level: 2,
    exact: true,
  });
  // Default copy verified on staging; update when approved CMS copy changes.
  const subheading = page.getByText(
    "Premium, scientifically-backed features built for women's physiology and performance.",
    { exact: true },
  );

  await expect(heading).toBeAttached();
  await heading.scrollIntoViewIfNeeded();
  await expect(heading).toBeVisible();
  await expect(heading).toBeInViewport();
  await expect(subheading).toBeVisible();
  await expect(subheading).toBeInViewport();
});
