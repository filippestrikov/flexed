# QA Documentation Template

Templates for the pages under a project's **QA** page. Test Strategy, Test
Plan, test cases and bug reports have their own files:

- [TEST_STRATEGY_TEMPLATE.md](TEST_STRATEGY_TEMPLATE.md)
- [TEST_PLAN_TEMPLATE.md](TEST_PLAN_TEMPLATE.md)
- [TEST_CASE_STANDARD.md](TEST_CASE_STANDARD.md) (includes the checklist standard)
- [BUG_REPORT_STANDARD.md](BUG_REPORT_STANDARD.md)
- [AUTOMATION_DOCUMENTATION_TEMPLATE.md](AUTOMATION_DOCUMENTATION_TEMPLATE.md)

---

## 1. QA Overview (CORE, the "QA" page)

> **Purpose** one-screen summary of how this project is tested ·
> **Required data** scope, owners, platforms, environments under test, tools, test-management link, automation status ·
> **Sources** Test Strategy, Environments page, test-suite location, repository (automation), Jira (QA activity) ·
> **Validation** environments and platforms match the Environments page; automation status matches the repository ·
> **Update** quarterly; when tools or automation status change

```markdown
| QA scope | <what is tested — one line; detail in Test Strategy> |
|---|---|
| QA owner | <@person> |
| Platforms | <web desktop · mobile web · iOS · Android · API · admin> |
| Environments under test | <names — link Environments> |
| Test management | <tool + link (TestRail, Xray, Zephyr, spreadsheets in Drive…)> |
| Test tools | <BrowserStack, Postman, devtools, proxies…> |
| Automation | <None · Partial (<scope>) · Extensive> — link Automation page |
| Current test plan | <link or "none — no active cycle"> |

## QA pages
- QA Process · Test Strategy · Test Cases · Regression · Bug Reporting
- <CONDITIONAL pages that exist: Test Data & Accounts, Automation, API Testing…>
```

---

## 2. QA Process (CORE)

> **Purpose** how a ticket moves through QA, mapped onto this project's real Jira statuses ·
> **Required data** each generic stage → actual status name, who moves it, what happens ·
> **Sources** Jira Workflow page (statuses, board), changelogs, team agreements, company Definition of Done ·
> **Validation** every status named exists in the project's workflow; stages with no matching status are marked `No status — <how it is handled>` ·
> **Update** workflow or process change

The generic flow below is a *map*, not a workflow to impose. Many projects
merge or skip stages.

```markdown
| Generic stage | Jira status in <KEY> | Who moves it | What happens |
|---|---|---|---|
| Requirement / ticket ready | <status> | PM | acceptance criteria present |
| Development | <status> | Developer | developer self-check before handoff |
| Ready for QA | <status> | Developer | handoff comment posted (template below) |
| QA testing | <status or "same as Ready for QA"> | QA | test against acceptance criteria, design, regression scope |
| Failed / returned | <status> | QA | bug sub-tasks or linked bugs created; comment with findings |
| Retest | <status> | Developer → QA | fresh test of the fix + affected area |
| Regression | <status or "no status — run before release"> | QA | Regression page checklist |
| Release candidate | <status / fix version> | PM / Tech owner | release checklist |
| Production verification | <status or "no status"> | QA / deployer | production smoke within <time> |
| Done | <status> | <role> | |

## Handoff to QA
A ticket may enter <QA handoff status> when:
- [ ] acceptance criteria are met and listed
- [ ] developer self-check done (devices/browsers stated)
- [ ] feature page created or updated and linked in the ticket
- [ ] environment + direct link given

Developer handoff comment:

    Developer handoff
    Environment + link:
    What changed:
    Devices / browsers tested:
    Negative-path checks:
    Regression (critical path): pass / fail / N/A (reason)
    Assumptions / open points:

## QA result comment

    QA result: PASSED / FAILED
    Environment + build:
    Tested on: <devices / browsers / OS>
    Checked: <acceptance criteria / test cases / checklist>
    Defects: <keys>
    Notes:

## Return rules
<Project or company rule for returning tickets, e.g. "3 oversight bugs within the
first 10 minutes → return untested". Link the company rule instead of copying it.>
```

---

## 3. Test Cases (CORE, index page)

> **Purpose** where the test cases are and what they cover; cases themselves live in the test tool ·
> **Required data** suite list with location, scope, owner, case count (optional), automation share (optional) ·
> **Sources** test-management tool, Drive folders, repository docs ·
> **Validation** every link opens; every critical-path checklist item has at least one suite ·
> **Update** suite added or retired

```markdown
Test cases follow the Test Case Standard. Source of truth: <tool / folder link>.

| Suite | Area / feature | Location | Owner | Cases | Automated |
|---|---|---|---|---|---|
| <name> | <feature page link> | <link> | <@person> | <n or omit> | <n / none> |

## Not covered by any suite
- <area> — <reason / plan>
```

---

## 4. Regression (CORE)

> **Purpose** what to re-test, when, and how to record it ·
> **Required data** critical-path checklist (3–7 business-critical functions), trigger for running it, environments, wider regression scope, result template ·
> **Sources** feature pages, analytics/business priorities, past production incidents, PM/client confirmation ·
> **Validation** each critical item is confirmed by PM or technical owner (until then `INFERRED`); production steps respect the production rule on Environments ·
> **Update** quarterly; after each platform upgrade; when a critical flow changes

```markdown
## When to run
- Critical-path checklist: every **major change** — before <QA handoff status>
  and right after the production deploy.
- Full regression: <release candidates / platform upgrades / on request>.

A change is major when it touches <project-specific list, e.g. login, pricing,
cart, checkout, integrations, shared templates, platform/plugin versions>.
When in doubt, treat it as major.

## Critical-path checklist
| # | Function | Test action | Expected result | Production? |
|---|---|---|---|---|
| 1 | <function> | <short action> | <observable result> | <full / up to last step / skip> |

Test accounts needed: <roles> — see Test Data & Accounts.

## Recording the result (Jira comment)

    Regression (<project> critical path) – <environment>
    1 <Function>: pass / fail
    2 <Function>: pass / fail
    …
    Build / version:
    Notes:

Any fail before QA → ticket does not move to <QA handoff status>.
Any fail after a production deploy → notify <escalation role> immediately;
they decide on hotfix or rollback.

## Wider regression scope
| Area | Suite | When included |
|---|---|---|

## Automated coverage
| # | Function | Automated | Not automated |
|---|---|---|---|
```

---

## 5. Test Data & Accounts (CONDITIONAL)

Trigger: test accounts, roles, sandboxes or seeded data exist.

> **Purpose** what test data exists and how to get access, without exposing it ·
> **Required data** account roles per environment, secrets-manager entry names, sandbox providers, seeded data and cleanup rules ·
> **Sources** secrets manager (entry names only), seed scripts, QA notes ·
> **Validation** every entry name exists in the secrets manager; no credential values on the page ·
> **Update** account or sandbox added/removed

```markdown
| Role / data | Environment(s) | Access | Notes |
|---|---|---|---|
| <e.g. B2B customer, price list X> | <env> | secrets manager → "<entry>" | |

## Sandboxes
| Provider | Purpose | Provider test-data docs |
|---|---|---|
| <PSP / shipping / email> | | <link to the provider's public test-data page> |

## Seeded / permanent test data
| Data | Created by | Must not be deleted because | Cleanup |
|---|---|---|---|

## Rules
- Test records are labelled <e.g. "TEST <name>"> so they can be found and removed.
- <Production rule from Environments.>
```

---

## 6. Platform-specific testing pages (CONDITIONAL)

Create only the ones whose trigger is met (see the standard, section 3).
Each uses the same skeleton:

```markdown
| Scope | <what is covered> |
|---|---|
| Environments | <which> |
| Tools | <tools> |
| Test data | <link to Test Data & Accounts> |

## Coverage matrix
| Area | Cases / checklist | Automated | Notes |
|---|---|---|---|

## How to test
<Project-specific steps, setup, gotchas.>

## Known limitations
```

Additional required content per page:

| Page | Also include |
|---|---|
| **API Testing** | API docs link, auth method (no secrets), environments' base URLs (link Environments), contract/negative/permission coverage, collections location |
| **Mobile Testing** | supported OS/device matrix, build distribution (TestFlight, Firebase, internal track), install/upgrade testing, permissions, offline/background behaviour, deep links, push |
| **Payment Testing** | providers and methods per environment, sandbox docs links, refund/cancel/failed-payment flows, production rule (no live payments) |
| **Admin Panel Testing** | roles and permissions matrix, critical admin flows, content-editing rules (restore originals), data side effects |

### Device and browser matrix

Use the project's analytics or client agreement as the source. If neither is
available, mark the matrix `INFERRED` from the company default and list it
under Open questions.

```markdown
| Category | OS / version | Device / resolution | Browser / version |
|---|---|---|---|
| Desktop | | | |
| Mobile | | | |
| Tablet | | | |
```

Record a test device as: `OS (version) – resolution – browser (version)`, for
example `Windows 11 – 1920×1080 – Chrome 141`.

---

## 7. Test report templates

Use as Jira comments or Confluence pages. One structure, three depths.

### Smoke / production verification report

```text
Smoke Test Report – <PASSED / FAILED>
Environment + URL:
Build / version:
Tested on: <device record(s)>

Checklist:
- <item> – passed / failed (<bug key>)
- …

Notes:
```

### Test report (single requirement set)

```text
Test Report – <Interim / Final>
Ticket(s):
Environment + direct link:
Design: <link>
Build / version:

Checked:
- <requirement / test point> – passed / failed (<bug key>)

Tested on:
- Desktop: <device record> – <evidence link>
- Mobile: <device record> – <evidence link>
- Tablet: <device record> – <evidence link>

Defects: <keys>
Notes:
```

### Test report (several unrelated requirements)

Repeat per requirement:

```text
<n>. <Requirement / test point>
Steps:
1. …
Status: passed / failed (<bug key>)
Tested on: <device records + evidence links>
```
