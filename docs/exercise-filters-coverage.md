# Exercise library search, filter and sort coverage

Source: Jira [FLXD-446](https://snc-ll.atlassian.net/browse/FLXD-446) "[ADM] Ability to
search, filter and sort the exercises table" (epic FLXD-377, Exercise Library). Acceptance
criteria AC1-AC10 are the only source of expected results; there is no manual-suite tab for
this feature yet, so tests are traced as `FLXD-446 ACn`. When the cases are added to the
Flexed Web test suite, add their manual IDs to the test titles and the table below.

Spec: `tests/exercise-filters.spec.js` (admin panel, `https://admin-staging.getflexed.app/exercises`).
Manual QA of FLXD-446 was done on staging on October 9, 2026 and posted to the ticket.

## Prerequisites

All values come from the environment. Nothing here is committed to Git.

| Variable | Purpose |
| --- | --- |
| `FLEXED_CMS_EMAIL`, `FLEXED_CMS_PASSWORD` | Admin login (Content Manager or Super Admin). |
| `FLEXED_CMS_STORAGE_STATE` | Alternative: path to an authenticated storage state. Credentials take precedence. |

The suite is **read-only**: it never creates, edits or deletes an exercise, so no fixture is
needed. Expected results are derived from the app's own list responses
(`GET /admin/exercises?page&limit&sort&order&q&muscleGroup&equipment&movementCategory&difficulty&locationTags&tagId&status`),
so the tests do not hard-code exercise names. They need at least one exercise with both an
English and an Arabic name, and the unfiltered library must fit on one page (50 rows) for the
per-filter checks. Tests skip (not pass) when authentication or such data is missing.

## Case mapping

| Case | Automated checks |
| --- | --- |
| AC1 | "Search exercises" field and the seven filters (Muscle group, Equipment, Movement category, Difficulty, Location, Tag, Status) are visible and start at "All". |
| AC2 | Search by an upper-case partial English word and by an Arabic word: the exercise is returned and its name is shown. |
| AC3 | Search plus Muscle group returns the exercise; the same search with a different muscle group does not (AND). One test per filter (Muscle group, Equipment, Movement category, Difficulty, Location, Status): the response equals the baseline rows that match the chosen value. Tag: the response equals the baseline rows that carry the tag. |
| AC4 | Changed search requests `page=1&limit=50`, and "Showing {N} of {total}" is visible. **Fails today:** the line is not rendered. Kept as a real assertion, not a skip. |
| AC5 | One test per sortable header (Exercise, Muscle and equipment, Used in journeys): first click sorts in the order the request names, the rows are in that order, `aria-sort` matches; a second click reverses the order. |
| AC6 | First request is `sort=createdAt&order=desc`, `createdAt` never increases down the table, no header has an active sort. |
| AC7 | A search with no match shows the empty state (title, text, "Clear filters") and no table. |
| AC8 | After a sort, a filter and a no-match search, "Clear filters" empties the search, resets all seven filters and the sort, restores the full table and the clean URL. |
| AC9 | The term, page and page size are sent to the API, the response is already narrowed, and the table shows exactly the returned rows. |
| AC10 | "Load more" requests `page=2`, returns the next 50 matches with no repeats. **Skips** unless the library holds more than 50 exercises. |

## Pending and known limits

- **Location "Both"** is not tested. It returned no exercises on staging although two exercises
  are tagged for Home and Gym, and FLXD-446 does not define the option. Add a case once the
  expected behaviour is confirmed.
- **Tag filter** only proves consistency (and "no match" while no exercise has tags). A positive
  match needs a fixture exercise that carries a tag, which means editing data.
- **AC4 reset to the first 50 from a later page** and **AC10** need more than 50 exercises on
  staging; both are only covered when such data exists.
- Ties inside a sort (equal journey counts or muscle groups) are not asserted: the ticket does
  not define a tie-break order.
- The name sort is compared case-insensitively with `localeCompare`; confirm if the server
  collation ever differs.
- **Not yet run against staging.** The spec was written after a manual run and checked only for
  syntax, for listing its tests, and for skipping cleanly without credentials. Expect to adjust
  locators on the first real run (selects are found through their visible labels; sort headers
  through `columnheader` and `aria-sort`).
- Observed in manual QA: staging exposes all seven filters but the Tag list also holds leftover
  QA tags (`qa-test-one`, `qa-test-two`).

## Run

```sh
npx playwright test tests/exercise-filters.spec.js --workers=1
```
