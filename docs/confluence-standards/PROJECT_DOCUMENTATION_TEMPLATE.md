# Project Documentation Template

Templates for the project-level pages of the
[Core Documentation Standard](CORE_DOCUMENTATION_STANDARD.md). Each page has:

- a **Spec** block (authoring guidance — do not publish it), and
- a **Page body** to copy into Confluence.

Placeholders are written `<like this>`. Replace them, or write
`TBD — information not found in available project sources`. Every page starts
with the metadata block from the standard, section 5:

```text
Owner: <role / @person> | Status: Draft | Last reviewed: <YYYY-MM-DD> by <@person>
Review cycle: <quarterly | per change> | Sources: <links>
```

---

## 1. Project Overview (CORE, root page)

> **Purpose** first page anyone opens; answers "what is this, who owns it, where is everything" in one screen ·
> **Required data** identity, status, platforms, owners, key links ·
> **Sources** Jira project (name, lead, description), contract/kick-off docs in Confluence, repository README, existing client pages ·
> **Validation** status matches Jira activity (open tickets, recent releases); owners exist as Jira/Confluence users; every link resolves ·
> **Update** owner or status change; quarterly

### Page body

```markdown
<One or two sentences: what the product is and who uses it.>

## Project information

| Field | Value | Source |
|---|---|---|
| Project name | <name> | |
| Client | <client or "Internal"> | |
| Project status | <Discovery · Active development · Live – maintenance · Paused · Closed> | |
| Product type | <e-commerce · SaaS · corporate site · mobile app · API/backend · internal tool> | |
| Business purpose | <what the business gets from it, one sentence> | |
| Platforms | <web · iOS · Android · API · admin panel> | |
| Primary domain(s) | <production domain(s)> — full list on Environments | |
| Start date | <YYYY-MM-DD> | |
| Project owner / PM | <@person> | |
| QA owner | <@person> | |
| Development owner | <@person> | |
| Main stakeholders | <client contacts by role> | |

## Start here

| I need… | Go to |
|---|---|
| Every link (Jira, repo, Figma, CI…) | Project Resources |
| Environment URLs and rules | Environments |
| How it is built | Technical Architecture |
| How tickets move | Jira Workflow |
| What a feature does | Product Documentation |
| How to test it | QA |
| How it is released | Releases |

## Open questions

- [ ] <TBD item> — ask <role>
```

---

## 2. Project Resources (CORE)

> **Purpose** one table of every system link, so no other page needs to repeat URLs ·
> **Required data** URL and access route for each system in use ·
> **Sources** Jira project sidebar and shortcuts, Confluence, repository settings/README, CI config, Figma links in tickets, store listings ·
> **Validation** each link opens (or is confirmed access-restricted); no duplicates; nothing listed that the project does not use ·
> **Update** a system is added or removed; quarterly

Remove rows that do not apply — do not leave rows for systems the project
does not use.

```markdown
| Resource | Link | Access via | Notes | Source |
|---|---|---|---|---|
| Production | <url> | public / login | | |
| Staging / Acceptance | <url> | HTTP auth → secrets manager "<entry>" | | |
| Development / Test | <url> | | | |
| Admin panel | <url per environment> | role-based | | |
| API base URL | <url per environment> | | | |
| API docs (Swagger/OpenAPI) | <url> | | | |
| Jira project | <url> | | key: <KEY> | |
| Jira board(s) | <url> | | board id: <id> | |
| Confluence space | <url> | | | |
| Repository | <url> | | default branch: <branch> | |
| CI/CD | <url> | | | |
| Test management | <url> | | | |
| Automation reports | <url> | | | |
| Design (Figma) | <url> | | | |
| Analytics | <url> | | | |
| Monitoring / error tracking | <url> | | | |
| App Store / Google Play | <url> | | | |
| External integrations | <name → admin/dashboard url> | | | |
| Communication | <channel name / link> | | | |
```

---

## 3. Team & Responsibilities (CORE)

> **Purpose** who decides, who builds, who tests, who to call ·
> **Required data** role → person, responsibility area, escalation path ·
> **Sources** Jira project lead and assignees (last 90 days), Confluence page authors, client overview pages, the PM ·
> **Validation** every named person is active in Jira/Confluence; every responsibility area has exactly one owner ·
> **Update** any team change

Do not list people from assignment history alone — frequent assignees are
INFERRED until the PM confirms their role.

```markdown
| Role | Person | Responsibility area | Backup |
|---|---|---|---|
| Project manager | <@person> | scope, priorities, client communication | |
| Technical owner | <@person> | architecture, code review, deployments | |
| QA owner | <@person> | test strategy, regression, release sign-off | |
| Developer(s) | <@person – area> | | |
| Designer | <@person> | | |
| Client contact(s) | <name – role> | business decisions, UAT | |

## Escalation

| Situation | Contact | Channel | Expected response |
|---|---|---|---|
| Production incident | <role> | <channel> | <time, if agreed> |
| Release blocker | <role> | | |
| Unclear requirement | <role> | Jira comment + <channel> | |
```

---

## 4. Environments (CORE)

> **Purpose** the single authoritative description of each environment ·
> **Required data** per environment: name, URL, purpose, branch, deployment, protection, data rules, limitations ·
> **Sources** repository (deploy config, CI pipelines, README), hosting notes, Jira tickets about deployments, existing architecture pages ·
> **Validation** URL resolves (a 401 behind HTTP auth counts as live); branch exists in the repo; deployment source matches CI config; never load production for anything except documented read-only checks ·
> **Update** environment added/removed/moved, protection or data rules change

Use the environment names the project actually uses (for example TST/ACC/PRD
or dev/staging/production). Do not rename them to fit this template.

```markdown
## Overview

| Environment | URL | Purpose | Branch / build | Deploys via | Protection |
|---|---|---|---|---|---|
| <name> | <url> | <dev testing · QA · UAT · production> | <branch> | <CI job / manual> | <public · HTTP auth · VPN · IP allow-list> |

## <Environment name>

| Field | Value |
|---|---|
| URL(s) | <storefront / app / store views> |
| Admin panel | <url> |
| API / backend | <url> |
| Database | <engine, shared/dedicated — no connection strings> |
| Test accounts | see Test Data & Accounts (roles only) |
| Credentials | secrets manager → "<entry name>" |
| Email / notifications | <sent · captured · disabled> |
| Payments | <sandbox · live — never test live> |
| Integrations connected | <which external systems point here> |
| Allowed testing | <e.g. full orders allowed · read-only checks only> |
| Known limitations | <e.g. no cron, shared queue, stale data> |

Repeat the section per environment.

> **Production rule:** <what is and is not allowed on production — state it explicitly>
```

---

## 5. Technical Architecture (CORE for code-owning teams)

> **Purpose** how the system is built, so a developer or tester can find the right place fast ·
> **Required data** quickstart (repo, hosting, runtime, integrations), platform/versions, components, custom code, integrations and data flows, deployment, background jobs ·
> **Sources** repository (manifest files: `package.json`, `composer.json`, `Gemfile`, `pom.xml`, Dockerfiles, CI config), hosting notes, Jira tickets on upgrades and integrations ·
> **Validation** versions read from manifests or admin, not from memory; each integration has a ticket, config or code reference ·
> **Update** platform/plugin upgrade, new integration, hosting change

```markdown
## Quickstart

| Repository | <url> · branches: <branch → environment> |
|---|---|
| Hosting | <provider / servers> |
| Runtime | <language + version, framework + version> |
| Integrations | <list; details below> |

## Platform

| Platform / framework | <name + exact version> |
|---|---|
| Frontend | <theme / framework> |
| Store / tenant structure | <websites, store views, locales, tenants> |

## Components and custom code

| Area | Module / package / path | Purpose | Ticket |
|---|---|---|---|

## Integrations and data flows

| System | Direction | Data | Mechanism (API, file, queue) | Owner | Ticket |
|---|---|---|---|---|---|

## Deployment

<How code reaches each environment. Link the pipeline; summarise only stable steps.>

## Background jobs

| Job / consumer | Schedule / trigger | Purpose | Failure impact |
|---|---|---|---|

## Important notes

- <Things that break if forgotten>
```

---

## 6. Product Documentation (CORE, index page)

> **Purpose** entry point to all feature pages ·
> **Required data** auto-generated list of feature pages, plus a coverage note of what is not yet documented ·
> **Sources** feature pages (labels), Jira epics/components ·
> **Validation** every epic or component in active QA scope has a feature page or is listed as not documented ·
> **Update** automatic (macro); coverage note quarterly

```markdown
<One sentence describing how features are organised (by platform → module → feature).>

[Page Properties Report macro: label = doc-feature AND project-<name>;
 columns: Feature, Jira, Platform, Status, Owner, Last reviewed]

## Not yet documented

| Area | Jira | Reason |
|---|---|---|
```

Hierarchy: `Product → Platform → Module → Feature → Sub-feature`. Create the
Platform and Module levels only when they exist (CONDITIONAL); a single-platform
project puts features directly under Product Documentation.

---

## 7. Feature page (CORE per documented feature)

> **Purpose** what a feature does, how it is built, how to test it and what to watch out for — written during development, 5–10 minutes ·
> **Required data** sections 1–4 below are required; section 5 fields are filled when known ·
> **Sources** the Jira ticket/epic (description, acceptance criteria, comments, linked issues), Figma frames linked in the ticket, merged PRs, test suites ·
> **Validation** behaviour matches acceptance criteria or confirmed comments; status matches Jira; designs are the frames linked from the ticket ·
> **Update** when the feature changes; creating or updating the page is part of Definition of Done before the ticket moves to the QA status

Title: `<Platform> | <JIRA-KEY> - <Feature name>`. Labels: `doc-feature`,
`project-<name>`, `platform-<name>`.

```markdown
## Feature information
[Page Properties macro]

| Feature | <name> |
|---|---|
| Jira | <KEY-123> (+ related) |
| Platform(s) | <web · iOS · Android · API · admin> |
| Status | <Planned · In progress · Live · Retired> — Jira status: <status> on <date> |
| Owner (dev) | <@person> |
| Design | <Figma frame link> |
| Last reviewed | <YYYY-MM-DD> by <@person> |

## 1. Functional description
<What it does and why, in plain language. Who uses it (actors/roles).>

**Main flow**
1. <step>

**Alternative flows / edge cases**
- <flow>

**Business and validation rules**
- <rule — source>

**Permissions**
- <role → allowed actions>

## 2. Technical implementation
<Modules, plugins, custom code locations, configuration paths.>

## 3. Integrations and dependencies
<External systems, endpoints, webhooks, queues, other features it depends on.>
Credentials: secrets manager → "<entry name>". Never paste credentials.

## 4. Risks and maintenance
- <Known limitations, workarounds, what tends to break on upgrades>

### Checks after updates
| Scenario | Expected result |
|---|---|

## 5. QA coverage
| Suite / checklist | Cases | Automated | Link |
|---|---|---|---|

## Related
- Jira: <filter for the feature's issues>
- Known issues: <filter>
```

Optional fields (add only when they carry information): Preconditions,
Analytics events, Localisation, Performance notes, SEO impact.

---

## 8. Known Issues (CORE)

> **Purpose** what is broken or limited right now, without copying Jira ·
> **Required data** live Jira filter of open defects; short list of standing limitations that are not tickets ·
> **Sources** Jira (saved filter), feature pages' risk sections, environment limitations ·
> **Validation** filter returns the expected open bugs; each standing limitation has an owner ·
> **Update** filter is live; standing list monthly

```markdown
## Open defects (live)
[Jira filter / macro: project = <KEY> AND issuetype = <Bug type> AND statusCategory != Done ORDER BY priority DESC]

## Standing limitations
| Limitation | Affects | Workaround | Owner | Ticket |
|---|---|---|---|---|
```

Use the project's actual bug issue type name(s) in the JQL — check the Jira
Workflow page.

---

## 9. Upgrade Playbook (CONDITIONAL — recurring platform upgrades)

> **Purpose** stop the same upgrade problems from recurring ·
> **Required data** current version baseline, known-issues matrix per upgrade, workarounds, process ·
> **Sources** upgrade tickets, release notes of the platform, previous playbook entries ·
> **Validation** baseline versions read from the system or manifests ·
> **Update** after every core/plugin upgrade

```markdown
## Current versions (baseline as of <YYYY-MM-DD>)
| Component | Version | Source |
|---|---|---|

## Known issues matrix
| Upgrade | Symptom | Cause | Permanent fix | Ticket |
|---|---|---|---|---|

## Workarounds and snippets
<Code or config, with the ticket that introduced it.>

## Process
1. <steps, including which regression to run where>
```

---

## 10. Glossary (OPTIONAL)

```markdown
| Term | Meaning in this project | Source |
|---|---|---|
```

Use it when the domain has terms a new team member would misread (local
language terms, internal product names, abbreviations).

## 11. Decision Log (OPTIONAL)

Only for decisions not traceable from a Jira ticket.

```markdown
| Date | Decision | Why | Decided by | Link |
|---|---|---|---|---|
```
