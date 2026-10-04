# flexed

Flexed Playwright coverage

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
