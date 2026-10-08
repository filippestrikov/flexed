const { test: base, expect } = require('@playwright/test');

// FLXD-457: [ADM] Ability to edit a video (admin video library, details panel).
// Acceptance criteria are traced as "FLXD-457 ACn" in each test title.
//
// Prerequisites (all via environment, never committed):
//   FLEXED_CMS_EMAIL + FLEXED_CMS_PASSWORD, or FLEXED_CMS_STORAGE_STATE
//   FLEXED_VIDEO_USED_ID      id of a Ready video used by at least one exercise (read-only checks)
//   FLEXED_VIDEO_FIXTURE_ID   id of a dedicated QA video: Ready, NON-EMPTY English title, no tags.
//                             Tests that save restore its title/description and remove test tags.
//   FLEXED_VIDEO_OTHER_ROW_TEXT  list text (title or file name) of a different video, for the row-switch test
// The video id is the `video` query parameter shown when a row is selected.

const ADMIN = 'https://admin-staging.getflexed.app';
const USED_ID = process.env.FLEXED_VIDEO_USED_ID;
const FIXTURE_ID = process.env.FLEXED_VIDEO_FIXTURE_ID;
const OTHER_ROW = process.env.FLEXED_VIDEO_OTHER_ROW_TEXT;
const TAG_A = 'qa-auto-a';
const TAG_B = 'qa-auto-b';

const credentials = process.env.FLEXED_CMS_EMAIL && process.env.FLEXED_CMS_PASSWORD;
const storageState = process.env.FLEXED_CMS_STORAGE_STATE;

// Tracing stays off so authentication requests are not recorded.
const test = base.extend({
  admin: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: credentials ? undefined : storageState });
    const page = await context.newPage();
    if (credentials) {
      await page.goto(`${ADMIN}/login`, { waitUntil: 'domcontentloaded' });
      await page.getByRole('textbox', { name: 'Email', exact: true }).fill(process.env.FLEXED_CMS_EMAIL);
      await page.getByRole('textbox', { name: 'Password', exact: true }).fill(process.env.FLEXED_CMS_PASSWORD);
      await page.getByRole('button', { name: 'Log In', exact: true }).click();
      await expect(page.getByRole('button', { name: 'Landing page CMS', exact: true })).toBeVisible();
    }
    try { await use(page); } finally { await context.close(); }
  },
});

test.use({ trace: 'off' });
test.skip(!credentials && !storageState,
  'Provide CMS credentials or an authenticated FLEXED_CMS_STORAGE_STATE for the admin video tests.');

const saveButton = (page) => page.getByRole('button', { name: 'Save video', exact: true });
const cancelButton = (page) => page.getByRole('button', { name: 'Cancel', exact: true });
const language = (page, name) => page.getByRole('radio', { name, exact: true });
const title = (page) => page.getByLabel('Title', { exact: true }).filter({ visible: true });
const description = (page) => page.getByLabel('Description', { exact: true }).filter({ visible: true });
const tagsGroup = (page) => page.getByRole('group', { name: 'Tags' });
// Scoped to the Tags group: other (hidden) admin forms use the same placeholder.
const tagInput = (page) => tagsGroup(page).getByPlaceholder('Search or create a tag');
const toast = (page) => page.getByText("The video wasn't saved. Fix the highlighted fields and try again.");

async function openVideo(page, id) {
  const response = await page.goto(`${ADMIN}/videos?video=${id}`, { waitUntil: 'domcontentloaded' });
  expect(response, 'The admin must return a response').not.toBeNull();
  expect(response.ok()).toBe(true);
  await expect(saveButton(page)).toBeVisible();
}

async function selectLanguage(page, name) {
  await language(page, name).check();
  await expect(language(page, name)).toBeChecked();
}

async function readTags(page) {
  const chips = tagsGroup(page).getByRole('button').filter({ hasNotText: /^Remove / });
  return (await chips.allInnerTexts()).map((text) => text.trim()).filter(Boolean);
}

async function readFields(page) {
  await selectLanguage(page, 'English');
  const fields = { enTitle: await title(page).inputValue(), enDescription: await description(page).inputValue() };
  await selectLanguage(page, 'Arabic');
  fields.arTitle = await title(page).inputValue();
  fields.arDescription = await description(page).inputValue();
  fields.tags = await readTags(page);
  return fields;
}

async function fillFields(page, fields) {
  await selectLanguage(page, 'English');
  await title(page).fill(fields.enTitle);
  await description(page).fill(fields.enDescription);
  await selectLanguage(page, 'Arabic');
  await title(page).fill(fields.arTitle);
  await description(page).fill(fields.arDescription);
}

// Clicks Save and waits for the write request to finish, so a following reload cannot race it.
async function save(page) {
  const [response] = await Promise.all([
    page.waitForResponse((r) => r.request().method() !== 'GET' && r.url().includes('/video')),
    saveButton(page).click(),
  ]);
  expect(response.ok(), 'Saving a valid video must succeed').toBe(true);
}

async function addTag(page, name) {
  await tagInput(page).fill(name);
  // An existing tag is offered by name, a new one as "Create tag".
  const create = page.getByRole('button', { name: `Create tag "${name}"` });
  const existing = tagsGroup(page).getByRole('button', { name, exact: true });
  await expect(create.or(existing).first()).toBeVisible();
  await create.or(existing).first().click();
  await expect(tagsGroup(page).getByRole('button', { name: `Remove ${name}` })).toBeVisible();
}

async function removeAllTags(page) {
  for (const name of await readTags(page)) {
    await tagsGroup(page).getByRole('button', { name: `Remove ${name}` }).click();
  }
  await expect(tagsGroup(page).getByRole('button', { name: /^Remove / })).toHaveCount(0);
}

// Puts the fixture back to its recorded state. Tags created by tests stay in the shared tag list.
async function restoreFixture(page, original) {
  await openVideo(page, FIXTURE_ID);
  await fillFields(page, original);
  await removeAllTags(page);
  await save(page);
}

async function openFixture(page) {
  test.skip(!FIXTURE_ID, 'Set FLEXED_VIDEO_FIXTURE_ID to a dedicated, restorable QA video.');
  await openVideo(page, FIXTURE_ID);
  const original = await readFields(page);
  test.skip(!original.enTitle.trim(), 'The fixture video must have a non-empty English title so it can be restored.');
  test.skip(original.tags.length > 0, 'The fixture video must have no tags so it can be restored.');
  return original;
}

test.describe('FLXD-457 edit a video', () => {
  test('FLXD-457 AC1/AC2: row opens a panel with Save/Cancel and the video details', async ({ admin: page }) => {
    test.skip(!USED_ID, 'Set FLEXED_VIDEO_USED_ID to a video used by at least one exercise.');
    await openVideo(page, USED_ID);
    await expect(saveButton(page)).toBeEnabled();
    await expect(cancelButton(page)).toBeEnabled();
    await expect(page.getByRole('button', { name: 'Play video', exact: true })).toBeVisible();
    for (const label of ['File name', 'Length', 'File size', 'Used in']) {
      await expect(page.getByText(label, { exact: true })).toBeVisible();
    }
  });

  test('FLXD-457 AC3: type, English/Arabic title and description, and tags are editable', async ({ admin: page }) => {
    await openFixture(page);
    const type = page.getByRole('group', { name: 'Type' });
    await expect(type.getByRole('radio', { name: 'Demo', exact: true })).toBeVisible();
    await expect(type.getByRole('radio', { name: 'Loop', exact: true })).toBeVisible();
    for (const name of ['English', 'Arabic']) {
      await selectLanguage(page, name);
      await expect(title(page)).toBeEditable();
      await expect(description(page)).toBeEditable();
    }
    await expect(tagInput(page)).toBeEditable();
  });

  test('FLXD-457 AC4: changes are not saved until Save video is clicked', async ({ admin: page }) => {
    const original = await openFixture(page);
    await selectLanguage(page, 'English');
    await title(page).fill(`${original.enTitle} (unsaved)`);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(saveButton(page)).toBeVisible();
    await selectLanguage(page, 'English');
    await expect(title(page)).toHaveValue(original.enTitle);
  });

  test('FLXD-457 AC3/AC4: saved title and description persist after a reload', async ({ admin: page }) => {
    const original = await openFixture(page);
    const edited = {
      enTitle: `${original.enTitle} QA`,
      enDescription: 'QA description',
      arTitle: 'اختبار الجودة',
      arDescription: 'وصف اختبار الجودة',
    };
    try {
      await fillFields(page, edited);
      await save(page);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await expect(saveButton(page)).toBeVisible();
      expect(await readFields(page)).toMatchObject(edited);
    } finally {
      await restoreFixture(page, original);
    }
  });

  test('FLXD-457 AC5: Cancel returns the fields to their saved values', async ({ admin: page }) => {
    const original = await openFixture(page);
    await selectLanguage(page, 'English');
    await title(page).fill('Cancelled title');
    await description(page).fill('Cancelled description');
    await selectLanguage(page, 'Arabic');
    await title(page).fill('عنوان ملغى');
    await cancelButton(page).click();
    expect(await readFields(page)).toMatchObject(original);
  });

  test('FLXD-457 AC6: an empty or blank English title is not saved', async ({ admin: page }) => {
    const original = await openFixture(page);
    await selectLanguage(page, 'English');
    for (const value of ['', '   ']) {
      await title(page).fill(value);
      await saveButton(page).click();
      await expect(page.getByText('Give the video an English title.', { exact: true })).toBeVisible();
      await expect(toast(page)).toBeVisible();
    }
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(saveButton(page)).toBeVisible();
    await selectLanguage(page, 'English');
    await expect(title(page)).toHaveValue(original.enTitle);
  });

  test('FLXD-457 AC7: type is locked while exercises use the video', async ({ admin: page }) => {
    test.skip(!USED_ID, 'Set FLEXED_VIDEO_USED_ID to a video used by at least one exercise.');
    await openVideo(page, USED_ID);
    const type = page.getByRole('group', { name: 'Type' });
    await expect(type.getByRole('radio', { name: 'Demo', exact: true })).toBeDisabled();
    await expect(type.getByRole('radio', { name: 'Loop', exact: true })).toBeDisabled();
    await expect(page.getByText(/\d+ exercises? uses? this video\. Take it off them before changing the type\./)).toBeVisible();
  });

  test('FLXD-457 AC8: switching rows with unsaved changes asks to Stay or Discard', async ({ admin: page }) => {
    test.skip(!OTHER_ROW, 'Set FLEXED_VIDEO_OTHER_ROW_TEXT to the list text of a different video.');
    const original = await openFixture(page);
    const warning = page.getByText('You have unsaved changes. Discard them and select another item?', { exact: true });
    await selectLanguage(page, 'English');
    await title(page).fill(`${original.enTitle} (edit)`);
    const urlBefore = page.url();

    await page.getByText(OTHER_ROW, { exact: true }).first().click();
    await expect(warning).toBeVisible();
    await page.getByRole('button', { name: 'Stay', exact: true }).click();
    await expect(warning).toBeHidden();
    expect(page.url()).toBe(urlBefore);
    await expect(title(page)).toHaveValue(`${original.enTitle} (edit)`);

    await page.getByText(OTHER_ROW, { exact: true }).first().click();
    await expect(warning).toBeVisible();
    await page.getByRole('button', { name: 'Discard', exact: true }).click();
    await expect(page).not.toHaveURL(urlBefore);
  });

  test('FLXD-457 AC9: the video file cannot be replaced from the panel', async ({ admin: page }) => {
    test.skip(!USED_ID, 'Set FLEXED_VIDEO_USED_ID to a video used by at least one exercise.');
    await openVideo(page, USED_ID);
    await expect(page.getByRole('button', { name: /replace|re-?upload|change (the )?file/i })).toHaveCount(0);
  });

  test('FLXD-457 AC11: changing the tags replaces the whole set', async ({ admin: page }) => {
    const original = await openFixture(page);
    try {
      await addTag(page, TAG_A);
      await save(page);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await expect(saveButton(page)).toBeVisible();
      expect(await readTags(page)).toEqual([TAG_A]);

      await tagsGroup(page).getByRole('button', { name: `Remove ${TAG_A}` }).click();
      await addTag(page, TAG_B);
      await save(page);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await expect(saveButton(page)).toBeVisible();
      expect(await readTags(page)).toEqual([TAG_B]);
    } finally {
      await restoreFixture(page, original);
    }
  });
});
