# Automation Documentation Template

Template for the **Automation** page (CONDITIONAL). Create it only when an
automated test suite exists in a repository. Detailed coverage stays in the
repository (for example `docs/<area>-coverage.md`); Confluence holds the
summary and the links.

**Do not assume a framework.** Identify it from repository evidence:

| Evidence | Framework |
|---|---|
| `playwright.config.*`, `@playwright/test` in `package.json` | Playwright |
| `cypress.config.*`, `cypress/` | Cypress |
| `selenium-webdriver`, `wdio.conf.*`, Selenium in `pom.xml` / `requirements.txt` | Selenium / WebdriverIO |
| Appium capabilities, `appium` dependency | Appium |
| Postman/Newman collections, REST Assured, `supertest`, `pytest` + `requests` | API automation |
| CI job running any of the above | where and when it runs |

If several frameworks exist, document each in its own section of the page.

> **Purpose** what is automated, how to run it, how to read failures, and who owns it ·
> **Required data** the sections below ·
> **Sources** repository (config, `package.json` scripts, README, docs), CI config and recent runs, Jira (bugs filed from runs) ·
> **Validation** commands copied from `package.json` / README and run at least once; environment list matches the config's base URLs (names only); last-run numbers come from an actual report ·
> **Update** framework/CI change; coverage change; at least per quarter (refresh last-run numbers)

---

## Page body

```markdown
Automated tests for <project> on <environment(s)>. Production is <never /
only read-only smoke> — enforced by <config guard / review>. No credentials on
this page.

## Quick facts
| Framework | <name + version> |
|---|---|
| Repository | <link> (folder <path>) |
| Detailed coverage | <link to repo coverage doc> |
| Environments | <names; base URLs via env variables> |
| CI | <pipeline link; trigger: push / schedule / manual> |
| Reports | <latest report link> |
| Last results | <YYYY-MM-DD>: <total> tests – <passed> passed, <failed> failed, <skipped> skipped |
| Defects from runs | <Jira filter or report issue> |
| Owner | <@person> |

## Setup
    <install commands from README>

Configuration: environment variables in a Git-ignored `.env` (names only):
| Variable | Purpose |
|---|---|
| <BASE_URL> | <target environment> |

Secrets: secrets manager → "<entry>". Never committed.

## Running tests
    <commands from package.json scripts>

| Command | What it runs |
|---|---|

## Test structure
| Folder / project | Scope | Notes |
|---|---|---|

Naming: each test title contains the manual test case ID and title, and the
Jira key where relevant.

## Test data
| Data | Where | Cleanup |
|---|---|---|

## Reporting and Jira
- Report: <HTML / CI artifacts / dashboard>
- Failures are filed as <one bug per defect / one regression report per run>
  following Bug Reporting, labelled <labels>.

## Failure analysis
1. Open the report; check trace/screenshot/video.
2. Re-run the single test to rule out flakiness (<command>).
3. Classify: product defect → bug; test defect → fix test; environment issue
   → note in run report and notify <role>.
4. Flaky tests are tagged <tag> and tracked in <ticket>.

## Coverage
| Area | Automated | Not automated (reason) |
|---|---|---|

## Ownership
| Responsibility | Person |
|---|---|
| Suite maintenance | |
| CI pipeline | |
| Triage of failures | |
```
