const { test: base, expect } = require('@playwright/test');

// FLXD-446: [ADM] Ability to search, filter and sort the exercises table.
// Acceptance criteria are traced as "FLXD-446 ACn" in each test title.
//
// Read-only: no exercise is created, edited or deleted. Expectations are derived from the
// app's own list responses (GET /admin/exercises?...), so the tests do not depend on specific
// exercises, but they need a library that holds at least one exercise with an English and an
// Arabic name. The unfiltered library must fit on one page (50 rows) unless a test says otherwise.
//
// Environment (never committed): FLEXED_CMS_EMAIL + FLEXED_CMS_PASSWORD, or FLEXED_CMS_STORAGE_STATE.

const ADMIN = 'https://admin-staging.getflexed.app';
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
  'Provide CMS credentials or an authenticated FLEXED_CMS_STORAGE_STATE for the admin exercise tests.');

const FILTER_LABELS = ['Muscle group', 'Equipment', 'Movement category', 'Difficulty', 'Location', 'Tag', 'Status'];

// Filter -> query parameter, and how a row matches a chosen option value.
// "Location = Both" and a positive "Tag" match are documented as pending (see docs).
const FILTERS = [
  { label: 'Muscle group', param: 'muscleGroup', has: (row, value) => row.muscleGroup === value },
  { label: 'Equipment', param: 'equipment', has: (row, value) => JSON.stringify(row.equipment || []).includes(`"${value}"`) },
  { label: 'Movement category', param: 'movementCategory', has: (row, value) => row.movementCategory === value },
  { label: 'Difficulty', param: 'difficulty', has: (row, value) => row.difficulty === value },
  { label: 'Location', param: 'locationTags', has: (row, value) => (row.locationTags || []).includes(value), skipValues: ['both'] },
  { label: 'Status', param: 'status', has: (row, value) => row.status === value },
];

const COLUMNS = [
  { header: /^Exercise/, sort: 'name', key: (row) => englishName(row), compare: (a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }) },
  { header: /^Muscle and equipment/, sort: 'muscleGroup', key: (row) => row.muscleGroup, compare: (a, b) => (a < b ? -1 : a > b ? 1 : 0) },
  { header: /^Used in journeys/, sort: 'journeyCount', key: (row) => row.journeyCount, compare: (a, b) => a - b },
];

const searchBox = (page) => page.getByRole('searchbox', { name: 'Search exercises' });
// Each select sits inside a visible <label> that starts with its name.
const filterSelect = (page, label) => page.locator('label')
  .filter({ hasText: new RegExp(`^${label}`) }).locator('select').filter({ visible: true }).first();
const columnHeader = (page, name) => page.getByRole('columnheader', { name });
const emptyTitle = (page) => page.getByText('No exercise matches these filters', { exact: true });
const emptyText = (page) => page.getByText('Clear the filters, or add the movement to the library.', { exact: true });
const clearButton = (page) => page.getByRole('button', { name: 'Clear filters', exact: true });
const exerciseButton = (page, name) => page.getByRole('button', { name, exact: true });

const hasArabic = (text) => /[؀-ۿ]/.test(text);
const names = (row) => (row.translations || []).map((t) => t.name).filter(Boolean);
const englishName = (row) => names(row).find((n) => !hasArabic(n));
const arabicName = (row) => names(row).find((n) => hasArabic(n));
const ids = (rows) => rows.map((r) => r.id).sort();

const isList = (response) => response.request().method() === 'GET'
  && /\/admin\/exercises\?/.test(response.url()) && response.status() === 200;
const queryOf = (response) => new URL(response.url()).searchParams;

// Runs an action and returns the matching list response (the app retries once after a session refresh,
// so only successful responses count).
async function listAfter(page, action, match = () => true) {
  const [response] = await Promise.all([
    page.waitForResponse((r) => isList(r) && match(queryOf(r))),
    action(),
  ]);
  return { query: queryOf(response), body: await response.json() };
}

async function openLibrary(page) {
  const loaded = await listAfter(page, async () => {
    const response = await page.goto(`${ADMIN}/exercises`, { waitUntil: 'domcontentloaded' });
    expect(response, 'The admin must return a response').not.toBeNull();
    expect(response.ok()).toBe(true);
  });
  await expect(searchBox(page)).toBeVisible();
  return loaded;
}

function inOrder(values, order, compare) {
  return values.every((value, i) => i === 0
    || (order === 'asc' ? compare(values[i - 1], value) <= 0 : compare(values[i - 1], value) >= 0));
}

test.describe('FLXD-446 search, filter and sort the exercises table', () => {
  test('FLXD-446 AC1: filter bar has the search field and seven filters, each starting at "All"', async ({ admin: page }) => {
    await openLibrary(page);
    await expect(searchBox(page)).toHaveValue('');
    for (const label of FILTER_LABELS) {
      await expect(filterSelect(page, label), `${label} filter`).toBeVisible();
      await expect(filterSelect(page, label).locator('option:checked')).toHaveText('All');
    }
  });

  test('FLXD-446 AC2: search matches the English name and the Arabic name', async ({ admin: page }) => {
    const { body } = await openLibrary(page);
    const row = body.data.find((r) => englishName(r) && arabicName(r));
    test.skip(!row, 'Needs an exercise that has both an English and an Arabic name.');
    // Upper case and a partial word also prove the match is case-insensitive and not whole-word.
    const terms = [englishName(row).trim().slice(0, 4).trim().toUpperCase(), arabicName(row).trim().split(/\s+/)[0]];
    for (const term of terms) {
      const found = await listAfter(page, () => searchBox(page).fill(term), (q) => q.get('q') === term);
      expect(ids(found.body.data), `search "${term}" must return the exercise`).toContain(row.id);
      await expect(exerciseButton(page, englishName(row))).toBeVisible();
    }
  });

  test('FLXD-446 AC3: search and a filter narrow the table together (AND)', async ({ admin: page }) => {
    const { body } = await openLibrary(page);
    const row = body.data.find((r) => englishName(r) && r.muscleGroup);
    test.skip(!row, 'Needs an exercise with an English name and a muscle group.');
    const term = englishName(row).trim().split(/\s+/)[0];
    await listAfter(page, () => searchBox(page).fill(term), (q) => q.get('q') === term);

    const matching = await listAfter(page, () => filterSelect(page, 'Muscle group').selectOption(row.muscleGroup),
      (q) => q.get('q') === term && q.get('muscleGroup') === row.muscleGroup);
    expect(ids(matching.body.data)).toContain(row.id);

    const values = await filterSelect(page, 'Muscle group').locator('option').evaluateAll((options) => options.map((o) => o.value).filter(Boolean));
    const other = values.find((value) => value !== row.muscleGroup);
    test.skip(!other, 'Needs a second muscle group option.');
    const excluded = await listAfter(page, () => filterSelect(page, 'Muscle group').selectOption(other),
      (q) => q.get('q') === term && q.get('muscleGroup') === other);
    expect(ids(excluded.body.data), 'a row must match the search AND every filter').not.toContain(row.id);
  });

  for (const filter of FILTERS) {
    test(`FLXD-446 AC3: ${filter.label} filter returns exactly the matching exercises`, async ({ admin: page }) => {
      const { body: baseline } = await openLibrary(page);
      test.skip(baseline.total > baseline.data.length, 'The unfiltered library must fit on one page for this check.');
      const values = await filterSelect(page, filter.label).locator('option')
        .evaluateAll((options) => options.map((o) => o.value).filter(Boolean));
      const value = values.find((v) => !(filter.skipValues || []).includes(v) && baseline.data.some((r) => filter.has(r, v)));
      test.skip(!value, `No exercise has a ${filter.label} value to filter by.`);

      const { query, body } = await listAfter(page, () => filterSelect(page, filter.label).selectOption(value),
        (q) => q.get(filter.param) === value);
      expect(query.get('page')).toBe('1');
      expect(ids(body.data)).toEqual(ids(baseline.data.filter((r) => filter.has(r, value))));
      expect(body.total).toBe(body.data.length);
    });
  }

  test('FLXD-446 AC3: Tag filter returns exactly the exercises that carry the tag', async ({ admin: page }) => {
    const { body: baseline } = await openLibrary(page);
    test.skip(baseline.total > baseline.data.length, 'The unfiltered library must fit on one page for this check.');
    const values = await filterSelect(page, 'Tag').locator('option').evaluateAll((options) => options.map((o) => o.value).filter(Boolean));
    // Prefer a tag that is on at least one exercise; otherwise the check only proves "no match".
    const value = values.find((v) => baseline.data.some((r) => JSON.stringify(r.tags || []).includes(`"${v}"`))) || values[0];
    test.skip(!value, 'No tags exist.');
    const { body } = await listAfter(page, () => filterSelect(page, 'Tag').selectOption(value), (q) => q.get('tagId') === value);
    expect(ids(body.data)).toEqual(ids(baseline.data.filter((r) => JSON.stringify(r.tags || []).includes(`"${value}"`))));
  });

  test('FLXD-446 AC4: a changed search shows the first 50 matches and "Showing N of total"', async ({ admin: page }) => {
    const { body } = await openLibrary(page);
    const row = body.data.find((r) => englishName(r));
    test.skip(!row, 'Needs an exercise with an English name.');
    const term = englishName(row).trim().split(/\s+/)[0];
    const { query, body: found } = await listAfter(page, () => searchBox(page).fill(term), (q) => q.get('q') === term);
    expect(query.get('page')).toBe('1');
    expect(query.get('limit')).toBe('50');
    // Known defect when written (Oct 9, 2026): the line is not rendered. Kept as a real assertion, not a skip.
    await expect(page.getByText(`Showing ${found.data.length} of ${found.total}`, { exact: true })).toBeVisible();
  });

  for (const column of COLUMNS) {
    test(`FLXD-446 AC5: "${column.sort}" header sorts, and a second click reverses the order`, async ({ admin: page }) => {
      await openLibrary(page);
      const header = columnHeader(page, column.header);
      const sortedBy = (row) => column.key(row) !== undefined && column.key(row) !== null;

      const first = await listAfter(page, () => header.getByRole('button').click(), (q) => q.get('sort') === column.sort);
      const firstOrder = first.query.get('order');
      expect(['asc', 'desc']).toContain(firstOrder);
      await expect(header).toHaveAttribute('aria-sort', firstOrder === 'asc' ? 'ascending' : 'descending');
      expect(inOrder(first.body.data.filter(sortedBy).map(column.key), firstOrder, column.compare)).toBe(true);

      const second = await listAfter(page, () => header.getByRole('button').click(),
        (q) => q.get('sort') === column.sort && q.get('order') !== firstOrder);
      const secondOrder = second.query.get('order');
      await expect(header).toHaveAttribute('aria-sort', secondOrder === 'asc' ? 'ascending' : 'descending');
      expect(inOrder(second.body.data.filter(sortedBy).map(column.key), secondOrder, column.compare)).toBe(true);
      expect(ids(second.body.data)).toEqual(ids(first.body.data));
    });
  }

  test('FLXD-446 AC6: with no header chosen the order is newest first by creation date', async ({ admin: page }) => {
    const { query, body } = await openLibrary(page);
    expect(query.get('sort')).toBe('createdAt');
    expect(query.get('order')).toBe('desc');
    const created = body.data.map((r) => Date.parse(r.createdAt));
    expect(created.every((time, i) => i === 0 || created[i - 1] >= time), 'createdAt must not increase down the table').toBe(true);
    for (const name of ['Exercise', 'Muscle and equipment', 'Used in journeys']) {
      await expect(columnHeader(page, new RegExp(`^${name}`))).toHaveAttribute('aria-sort', 'none');
    }
  });

  test('FLXD-446 AC7: with no match the table is replaced by the empty state', async ({ admin: page }) => {
    await openLibrary(page);
    const term = 'zzzz-no-such-exercise';
    const { body } = await listAfter(page, () => searchBox(page).fill(term), (q) => q.get('q') === term);
    expect(body.data).toHaveLength(0);
    await expect(emptyTitle(page)).toBeVisible();
    await expect(emptyText(page)).toBeVisible();
    await expect(clearButton(page)).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /^Exercise/ })).toHaveCount(0);
  });

  test('FLXD-446 AC8: Clear filters resets the search, every filter and the order', async ({ admin: page }) => {
    const { body: baseline } = await openLibrary(page);
    // Build a state that has a sort, a filter and a search with no match.
    await listAfter(page, () => columnHeader(page, /^Used in journeys/).getByRole('button').click(), (q) => q.get('sort') === 'journeyCount');
    const value = (await filterSelect(page, 'Status').locator('option').evaluateAll((options) => options.map((o) => o.value).filter(Boolean)))[0];
    await listAfter(page, () => filterSelect(page, 'Status').selectOption(value), (q) => q.get('status') === value);
    await searchBox(page).fill('zzzz-no-such-exercise');
    await expect(emptyTitle(page)).toBeVisible();

    const cleared = await listAfter(page, () => clearButton(page).click(),
      (q) => !q.get('q') && !q.get('status') && q.get('sort') === 'createdAt');
    expect(cleared.query.get('order')).toBe('desc');
    expect(cleared.body.total).toBe(baseline.total);
    await expect(searchBox(page)).toHaveValue('');
    for (const label of FILTER_LABELS) {
      await expect(filterSelect(page, label).locator('option:checked')).toHaveText('All');
    }
    await expect(emptyTitle(page)).toBeHidden();
    await expect(columnHeader(page, /^Used in journeys/)).toHaveAttribute('aria-sort', 'none');
    await expect(page).toHaveURL(`${ADMIN}/exercises`);
  });

  test('FLXD-446 AC9: search runs on the server, not on the loaded rows', async ({ admin: page }) => {
    const { body: baseline } = await openLibrary(page);
    const row = baseline.data.find((r) => englishName(r));
    test.skip(!row, 'Needs an exercise with an English name.');
    const term = englishName(row).trim().split(/\s+/)[0];
    const { query, body } = await listAfter(page, () => searchBox(page).fill(term), (q) => q.get('q') === term);
    // The term, the page and the page size go to the API, and the API response is already narrowed.
    expect(query.get('page')).toBe('1');
    expect(query.get('limit')).toBe('50');
    expect(body.total).toBeLessThanOrEqual(baseline.total);
    // What the table shows is what the server returned.
    for (const returned of body.data.filter((r) => englishName(r))) {
      await expect(exerciseButton(page, englishName(returned))).toBeVisible();
    }
    for (const dropped of baseline.data.filter((r) => englishName(r) && !ids(body.data).includes(r.id))) {
      await expect(exerciseButton(page, englishName(dropped))).toHaveCount(0);
    }
  });

  test('FLXD-446 AC10: Load more loads the next 50 matches', async ({ admin: page }) => {
    const { body } = await openLibrary(page);
    test.skip(body.total <= 50, 'Needs more than 50 exercises in the library.');
    const next = await listAfter(page, () => page.getByRole('button', { name: 'Load more', exact: true }).click(),
      (q) => q.get('page') === '2');
    expect(next.query.get('limit')).toBe('50');
    expect(next.body.total).toBe(body.total);
    expect(next.body.data.length).toBe(Math.min(50, body.total - 50));
    expect(ids(next.body.data).filter((id) => ids(body.data).includes(id))).toHaveLength(0);
  });
});
