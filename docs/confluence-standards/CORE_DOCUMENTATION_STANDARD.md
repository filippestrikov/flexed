# Core Project Documentation Standard

Version 1.0 · 2026-10-07 · Owner: QA lead

This is the normative document. It defines which pages a project must have,
how they are named and arranged, what evidence every value needs, and how the
documentation is kept current. The other files in this folder are templates
that implement it.

Keywords: **must** = required, **should** = expected unless there is a
documented reason, **may** = optional.

---

## 1. Principles

1. **Link, don't copy.** Volatile information (ticket lists, statuses, build
   numbers, open bugs, release contents) lives in its source system. Confluence
   holds a link, a Jira filter or a Jira macro, never a hand-maintained copy.
2. **One fact, one home.** Each fact has exactly one authoritative page (see
   [section 8](#8-source-of-truth-rules)). Other pages link to it.
3. **Evidence over assumption.** Every filled value can be traced to a source.
   Unknown values are marked, never guessed ([section 6](#6-evidence-and-confidence-rules)).
4. **No secrets, ever.** No passwords, tokens, API keys, private keys, session
   cookies, basic-auth pairs or 2FA seeds in Confluence, Jira or Git. Refer to
   the entry in the approved secrets manager by name.
5. **Pages only for what exists.** A CONDITIONAL page is created only when its
   trigger is met. No empty placeholder pages.
6. **Short beats complete.** A feature page that takes 5–10 minutes to write and
   is current is worth more than an exhaustive page nobody updates.

## 2. Page classification

| Level | Meaning | Rule |
|---|---|---|
| **CORE** | Needed by essentially every active project | Must exist. A short page with `TBD` markers is acceptable; a missing page is not. |
| **CONDITIONAL** | Needed when a capability, platform or process exists | Must exist when its trigger is true; must not exist when it is false. |
| **OPTIONAL** | Useful, not mandatory | Create when someone will maintain it. |

## 3. Canonical page tree

Titles below assume one Confluence space per project. In a space shared by
several projects, apply the prefix rule in [section 4](#4-page-naming-standard).

```text
<Project name>                       CORE         Project Overview (root page)
├── Project Resources                CORE         every link, one table
├── Team & Responsibilities          CORE         roles, owners, escalation
├── Environments                     CORE         per-environment facts
├── Technical Architecture           CORE*        stack, hosting, repos, integrations, deployment
├── Jira Workflow                    CORE         real statuses, issue types, conventions
├── Product Documentation            CORE         index page (auto-listed features)
│   └── <Platform or Module>         CONDITIONAL  only when >1 platform/module
│       └── <Feature pages>          CORE         one per documented feature
├── QA                               CORE         QA Overview
│   ├── QA Process                   CORE
│   ├── Test Strategy                CORE
│   ├── Test Plan – <cycle>          CONDITIONAL  formal cycle, release or client sign-off
│   ├── Test Cases                   CORE         index of suites; cases live in the test tool
│   ├── Regression                   CORE         critical-path checklist + regression scope
│   ├── Bug Reporting                CORE         project adaptation of the bug standard
│   ├── Test Data & Accounts         CONDITIONAL  test accounts, sandboxes, seeded data exist
│   ├── Automation                   CONDITIONAL  any automated test suite exists
│   ├── API Testing                  CONDITIONAL  project exposes or consumes an API under test
│   ├── Mobile Testing               CONDITIONAL  native/hybrid app, or mobile web is a primary channel
│   ├── Payment Testing              CONDITIONAL  payments or payment sandboxes are in scope
│   └── Admin Panel Testing          CONDITIONAL  a back office/CMS is in QA scope
├── Releases                         CORE         Release Process + checklists
│   ├── Release Notes                CONDITIONAL  only if Jira versions are not used for release contents
│   └── App Store Release            CONDITIONAL  App Store / Google Play distribution
├── Known Issues                     CORE         Jira filter + standing quirks
├── Upgrade Playbook                 CONDITIONAL  platform with recurring core/plugin upgrades
├── Glossary                         OPTIONAL     domain terms, abbreviations
└── Decision Log                     OPTIONAL     decisions that are not traceable in Jira
```

\* Technical Architecture may be folded into Environments for projects with no
code owned by the team (for example a QA-only engagement). Record that decision
on the Project Overview page.

Rules for the tree:

- Depth must not exceed four levels below the project root.
- Feature pages sit under Product Documentation, never next to QA pages.
- Process standards shared by many projects (company Definition of Done, coding
  standards, Jira how-tos) live once, in a company-level space or section, and
  are linked, not copied, into each project.
- Client-specific QA pages (strategy, plan, regression) belong in that client's
  tree, not under a company process page.

### Templates that implement each page

| Page | Template |
|---|---|
| Project Overview, Resources, Team, Environments, Technical Architecture, Product Documentation, Feature, Known Issues, Upgrade Playbook, Glossary | [PROJECT_DOCUMENTATION_TEMPLATE.md](PROJECT_DOCUMENTATION_TEMPLATE.md) |
| Jira Workflow | [JIRA_DOCUMENTATION_TEMPLATE.md](JIRA_DOCUMENTATION_TEMPLATE.md) |
| QA Overview, QA Process, Test Cases index, Regression, Test Data & Accounts, API/Mobile/Payment/Admin testing, test reports | [QA_DOCUMENTATION_TEMPLATE.md](QA_DOCUMENTATION_TEMPLATE.md) |
| Test Strategy | [TEST_STRATEGY_TEMPLATE.md](TEST_STRATEGY_TEMPLATE.md) |
| Test Plan | [TEST_PLAN_TEMPLATE.md](TEST_PLAN_TEMPLATE.md) |
| Test case and checklist format | [TEST_CASE_STANDARD.md](TEST_CASE_STANDARD.md) |
| Bug Reporting | [BUG_REPORT_STANDARD.md](BUG_REPORT_STANDARD.md) |
| Releases, Release Notes, App Store Release | [RELEASE_DOCUMENTATION_TEMPLATE.md](RELEASE_DOCUMENTATION_TEMPLATE.md) |
| Automation | [AUTOMATION_DOCUMENTATION_TEMPLATE.md](AUTOMATION_DOCUMENTATION_TEMPLATE.md) |

### CONDITIONAL triggers (decide with evidence)

| Page | Create when there is evidence of… | Typical evidence |
|---|---|---|
| Platform/Module level | more than one platform or independently released module | several repos, apps, store views or Jira components |
| Test Plan – \<cycle\> | a planned test cycle with defined scope, a release with more than one feature, or a client sign-off | Jira fix version, release epic, UAT request |
| Test Data & Accounts | test users, roles, sandboxes, seeded content | secrets-manager entries, seed scripts, QA notes |
| Automation | an automated test suite in any repository | `playwright.config.*`, `cypress.config.*`, `wdio.conf.*`, Appium caps, API test collections, CI test jobs |
| API Testing | an API the team builds or integrates and tests | OpenAPI/Swagger, Postman collections, API tickets |
| Mobile Testing | native or hybrid app, or mobile web as a primary channel | app repos, store listings, mobile Jira components, analytics share |
| Payment Testing | payment providers in scope | PSP modules, sandbox accounts, checkout tickets |
| Admin Panel Testing | a back office or CMS in QA scope | admin URL, admin tickets, CMS roles |
| Release Notes | releases happen but Jira fix versions are not used | release tickets without fix versions |
| App Store Release | App Store / Google Play distribution | store listings, Fastlane, TestFlight |
| Upgrade Playbook | recurring platform, plugin or framework upgrades | upgrade tickets, maintenance board |

## 4. Page naming standard

1. Use the plain names from the tree: `Environments`, `QA Process`,
   `Test Strategy`, `Known Issues`.
2. **Dedicated project space:** no project name in child titles.
3. **Shared space** (several projects in one space): Confluence enforces unique
   page titles per space, so child titles need a suffix:
   `<Page name> – <Project>`, for example `Environments – Acme Shop`. Use the
   same project short name everywhere. Do not prefix with the project name —
   the page name first keeps search results and the sidebar scannable.
4. **Feature pages:** `<Platform> | <JIRA-KEY> - <Feature name>`, for example
   `Magento 2 | ABC-42 - Gift cards`. The Jira key keeps titles unique. Omit
   `<Platform> |` when the project has a single platform.
5. **Cycle pages:** `Test Plan – <version or date>`, `Test Report – <version or date>`.
   Dates as `YYYY-MM-DD`.
6. No numeric prefixes (`00.`, `01.`) — order pages by position in the tree.
   No emojis, no status words (`DRAFT`, `NEW`) in titles; status belongs in the
   page metadata.
7. Labels: `project-<short-name>`, `doc-<page-type>` (for example
   `doc-feature`, `doc-environments`), and `platform-<name>` where relevant.
   Lowercase, hyphenated. Label-driven reports (Page Properties Report) depend
   on exact spelling.

## 5. Page anatomy

Every page starts with the same metadata block, inside a Confluence **Page
Properties** macro so reports can aggregate it:

| Field | Value |
|---|---|
| Owner | role or @mention of the accountable person |
| Status | `Draft` · `In review` · `Current` · `Outdated` |
| Last reviewed | `YYYY-MM-DD` by @name |
| Review cycle | from [section 9](#9-maintenance-rules) |
| Sources | links to the systems this page is built from |

Followed by:

1. One sentence: what this page is for.
2. The content sections defined by the template.
3. **Open questions** — items marked `TBD` that need a human, each with the
   person or role who can answer.
4. **Related** — links to neighbouring pages.

### Section specification format

Each template section carries a specification that tells a human or an AI
agent how to fill it:

> **Purpose** why the section exists ·
> **Required data** what to look for ·
> **Sources** where to look, in priority order ·
> **Validation** how to know it is right ·
> **Update** when it must be refreshed

The global missing-data behaviour ([section 6](#6-evidence-and-confidence-rules))
applies to every section unless the spec states otherwise. Specifications are
authoring guidance: they are not copied onto the published Confluence page.

## 6. Evidence and confidence rules

Every value written into a project page has one of three states.

| State | Meaning | How it is written |
|---|---|---|
| **VERIFIED** | Directly confirmed in a source system or by the owner | Plain value; the source is linked in the table's `Source` column or the page's `Sources` field |
| **INFERRED** | Strongly implied by evidence but not stated anywhere | `INFERRED: <value> — <evidence>`; must be listed under Open questions |
| **TBD** | Could not be determined | `TBD — information not found in available project sources` |

Rules:

- Never convert an INFERRED value to plain text until someone confirms it.
- Never fill a value from general knowledge of the platform ("Magento usually…").
  Platform knowledge may guide *where to look*, not *what to write*.
- Never invent: Jira statuses, transitions, issue types, custom fields,
  components, team members, roles, environment names, URLs, branch names,
  versions, dates, credentials, SLAs.
- A source older than the page's review cycle is still evidence, but note its
  date when it describes something volatile.
- When two sources disagree, write both with their sources, mark the field
  `CONFLICT`, and list it under Open questions. Do not pick one silently.
- Credentials found in plain text anywhere are reported to the owner for
  rotation, and never copied — not even partially or masked.

## 7. Required-field minimum per CORE page

A CORE page counts as **complete** when the fields below are VERIFIED (or
explicitly `N/A` with a reason). Everything else in the template may stay `TBD`.

| Page | Minimum |
|---|---|
| Project Overview | name, status, short description, platforms, PM, QA owner, Jira project link |
| Project Resources | Jira, Confluence, repository, every environment URL in use |
| Team & Responsibilities | PM, QA owner, development owner, escalation contact |
| Environments | for each environment: name, URL, purpose, deployment source |
| Technical Architecture | platform and version, hosting, repository, integrations list |
| Jira Workflow | project key, issue types, statuses in order, QA handoff status |
| Product Documentation | index exists; one feature page per feature in active QA scope |
| QA Overview | scope, environments under test, test tools, automation status |
| QA Process | ticket flow mapped to real Jira statuses |
| Test Strategy | scope, test levels/types, environments, entry and exit criteria |
| Test Cases | location of the suites and their owner |
| Regression | critical-path checklist (3–7 items) and when it runs |
| Bug Reporting | issue type, summary format, required fields, severity scale |
| Releases | who deploys, how, verification steps, rollback/escalation contact |
| Known Issues | Jira filter link |

## 8. Source-of-truth rules

| Information | Authoritative source | Confluence does |
|---|---|---|
| Tickets, statuses, assignees, open bugs | Jira | Jira filter / macro |
| Workflow statuses and transitions | Jira project configuration | Snapshot in Jira Workflow page, dated, re-checked on review |
| Release contents | Jira fix versions (or release ticket) | Link to the version report |
| Test cases and results | Test-management tool or the suite files | Index with links, counts optional |
| Automated test results | CI reports | Link to latest report |
| Code, branches, build config | Repository | Link; summarise only stable facts (branch → environment) |
| Designs | Figma (or equivalent) | Link per feature |
| API contract | OpenAPI / Swagger | Link |
| Credentials and secrets | Secrets manager | Entry name only |
| People and roles | Team & Responsibilities page | Other pages @mention roles, not lists of people |
| Environments | Environments page | Other pages link to it instead of repeating URLs |

Duplicate-information rule: if the same fact appears on two pages, one of them
must become a link. When an audit finds duplicates, keep the copy on the page
named as authoritative above.

## 9. Maintenance rules

| Page | Review cycle | Also update when |
|---|---|---|
| Project Overview, Team | quarterly | owner/role change, status change |
| Project Resources, Environments | quarterly | environment added, removed, moved or re-protected |
| Technical Architecture | quarterly | platform upgrade, new integration, hosting change |
| Jira Workflow | quarterly | workflow, issue type or board change |
| Feature pages | when the feature changes | ticket moves to QA (create/update is part of Definition of Done) |
| QA Process, Test Strategy | quarterly | process change, platform upgrade |
| Test Plan | per cycle | scope change within the cycle |
| Regression | quarterly | critical flow changes, after each platform upgrade |
| Releases | quarterly | deployment process change |
| Known Issues | monthly | — (the Jira filter updates itself) |
| Automation | per significant suite change | framework, CI or coverage change |

- A page past its review date by more than one cycle is set to `Outdated` by
  the next person (or agent) who notices.
- Reviews update `Last reviewed` even when nothing changed.
- Archive, don't delete, pages for retired features or environments; link the
  replacement.

## 10. Security rules

- Never write a secret. Write: `Credentials: secrets manager → "<entry name>"`.
- Test account *roles* (guest, B2B customer, admin) may be documented; usernames
  only if they are not sensitive and the owner approves.
- Public sandbox test data published by a provider (for example a PSP's
  documented test card numbers) may be linked; link the provider's page rather
  than copying numbers.
- Production-only restrictions (no test orders, read-only checks) must be stated
  on the Environments page and repeated as a warning on Regression and Releases.
- Before publishing generated content, scan it for secrets (see
  [PROJECT_AUDIT_CHECKLIST.md](PROJECT_AUDIT_CHECKLIST.md), step 7).

## 11. Design rationale

This standard was derived from an audit of two existing Confluence spaces (a
multi-client documentation space and a QA practice space, October 2026). The
decisions below record why the standard differs from what existed.

| Observed pattern | Decision |
|---|---|
| Per-client tree with an overview page, a technical architecture page and a feature index fed by Page Properties labels worked well | Kept: Project Overview, Technical Architecture, Product Documentation with label-driven index |
| Feature template with four short sections and a 5–10 minute budget, enforced by Definition of Done | Kept as the core of the feature schema; extended with optional QA fields |
| Short "quickstart" block (repo, hosting, runtime, integrations) at the top of the architecture page | Kept as the first section of Technical Architecture |
| "To verify" markers and open-question lists on drafted pages | Formalised as VERIFIED / INFERRED / TBD |
| Durable test strategy separated from a per-cycle test plan | Kept |
| 5-point critical regression checklist with a copyable result template for Jira comments | Kept as the Regression page core |
| QA pages for one client inside its tree, but other clients' checklists under a company process page | Standardised: all project QA pages under the project's QA page |
| Numeric prefixes (`00.`, `01.`, `02.`) used inconsistently, project name repeated in every title | Dropped prefixes; project suffix only where a shared space forces unique titles |
| Two near-identical bug templates, a third format in a repository, and different summary syntaxes | Merged into one bug standard with documented project variants |
| Test strategy saying "no automation" after an automation suite was added | Added review triggers tied to events, not just dates |
| Client pages left containing the raw template text | Pages only for what exists; minimum fields per CORE page |
| Credentials found in tickets, flagged on overview pages for rotation | Explicit rule: report, never copy |
| Release notes hand-copied from Jira | Jira fix versions are the source; Release Notes page only when versions are not used |
| QA handoff status differs per Jira project (`Review TST`, `QA`, `Review`, `REVIEW`) | QA Process must be mapped from each project's real workflow |
