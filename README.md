# flexed

Flexed Playwright coverage

## Manual test cases

[Flexed Web - Test Suite](https://docs.google.com/spreadsheets/d/1sJiNrwpl-t5pIm5JV7n_7lbB0znjiho_eM11XKtveSM/edit)
is the source for Playwright scenarios. Read the relevant sheet rows before
preparing tests, and retain each manual case ID in the test title.
The `"Why FLEXED Works"` tab contains the existing `FLXD-WFW-001` and
`FLXD-WFW-002` scenarios.

See [Why FLEXED Works coverage](docs/why-flexed-works-coverage.md) for all 24
manual cases, implemented checks, and outstanding fixture/design requirements.
Expected English copy is stored in `tests/fixtures/why-flexed-works.json`.
CMS credentials belong in local environment variables; authenticated browser
state belongs in the Git-ignored `.auth/` directory.

See [Hero coverage](docs/hero-coverage.md) for the `Hero section` tab, its 21
implemented tests, CMS content baseline, and pending mutation/design cases.
Run that coverage with `npx playwright test tests/hero --workers=1`.

See [Desktop header coverage](docs/header-coverage.md) for all 37 `FLXD-HEAD`
scenarios, current Jira requirements, selectors, and validation limits.
Run it with `npx playwright test tests/header.spec.js --workers=1`.

See [Subscription/pricing coverage](docs/subscription-coverage.md) for the next
XLSX tab, its Jira requirement changes, billing fixture contract, and pending cases.
Run it with `npx playwright test tests/subscription.spec.js --workers=1`.

See [Exercise library coverage](docs/exercise-filters-coverage.md) for the admin
exercises table search, filters and sorting (FLXD-446), and its pending cases.
Run it with `npx playwright test tests/exercise-filters.spec.js --workers=1`.

Requires Node.js 18 or newer. Playwright 1.55.1 is pinned for compatibility
with the Node.js 18 installation in this workspace.

## Setup

```sh
npm ci
npx playwright install chromium
```

## Run

```sh
npm test
npm run test:headed
npm run test:ui
npm run test:report
```

Tests target https://staging.getflexed.app/. The guest scenario starts with
empty cookies and local storage. Failure screenshots and traces are saved
in `test-results/`; the HTML report is saved in `playwright-report/`.

## Jenkins

See [Jenkins setup](docs/jenkins.md) for the local Docker server, generated
administrator login, pipeline source options, and test reports.

## Jira bug reports

Use [Jira bug report instructions](docs/jira-bug-report-instructions.md)
for the required report structure and reusable template in the `FLXD` project.

## Confluence documentation standards

[Confluence documentation standards](docs/confluence-standards/README.md)
define the reusable project and QA documentation structure for any client or
Jira project: required vs optional pages, templates, the project audit
workflow, and instructions for Claude. The `FLXD` bug instructions above are
this project's documented variant of the
[bug report standard](docs/confluence-standards/BUG_REPORT_STANDARD.md).
