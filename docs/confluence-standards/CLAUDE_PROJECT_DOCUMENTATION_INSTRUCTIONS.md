# Claude Instructions: Project Documentation

Reusable instructions for Claude (or another AI agent) to audit and document a
project against the Core Documentation Standard.

## How to invoke

> Analyze project `<PROJECT>` using the Core Documentation Standard in
> `docs/confluence-standards/`. Inspect its Jira project, Confluence space,
> repository and available project resources. Audit the existing
> documentation, determine what is missing, and populate/update the
> documentation according to the standard.

Optional inputs that speed things up: Jira project key(s), board id,
Confluence space key or root page, repository URL(s), environment URLs, and
whether publishing to Confluence is authorised in this run.

---

## 1. Read first

Read these files in full before touching any source:

1. [CORE_DOCUMENTATION_STANDARD.md](CORE_DOCUMENTATION_STANDARD.md) — tree,
   classification, naming, evidence rules, source-of-truth rules
2. [PROJECT_AUDIT_CHECKLIST.md](PROJECT_AUDIT_CHECKLIST.md) — the 9 steps you
   will execute
3. The templates, as needed for each page you draft

## 2. Hard rules

1. **Never invent.** Not statuses, transitions, issue types, fields,
   components, labels, priorities, people, roles, environments, URLs,
   branches, versions, dates, SLAs or credentials. If it is not in a source,
   write `TBD — information not found in available project sources`.
2. **Label confidence.** VERIFIED values carry a source; INFERRED values are
   written `INFERRED: <value> — <evidence>` and listed under Open questions;
   disagreements are written `CONFLICT` with both sources.
3. **No secrets.** Never copy a password, token, key, basic-auth pair, cookie
   or connection string into any output — not in pages, files, commits, Jira
   comments or your chat reply. Refer to the secrets-manager entry by name. If
   you find plain-text credentials, report their *location* for rotation.
4. **Read-only until approved.** Steps 1–8 never create, edit, move, archive or
   delete Confluence pages or Jira issues. Publish (step 9) only when the
   request explicitly authorises it or the owner approves the draft.
5. **Never touch production systems** beyond reading documentation about them.
   Do not load, probe or run tests against production URLs unless the
   project's documented rules allow a specific read-only check.
6. **Don't assume capabilities.** A project is not web + mobile + API + admin
   by default. Create CONDITIONAL pages only when their trigger is evidenced.
7. **Preserve good content.** Restructure and reword existing pages, keep their
   facts and links. Do not overwrite a useful page just to match the template.

## 3. What to inspect, and how

Use the Atlassian MCP tools when available (`searchConfluence`,
`getConfluenceContent`, `searchJiraIssuesUsingJql`, `getJiraIssue`, and via
`discover` + `executeRead`: `listJiraProjects`, `listJiraProjectIssueTypesMetadata`,
`listJiraStatuses`, `listJiraBoards`, `getJiraBoardConfig`,
`listJiraIssueTransitions`, `listJiraIssueChangelogs`,
`getJiraIssueTypeMetaWithFields`, `listJiraProjectComponents`,
`getJiraProjectVersions`). Use `discover` to confirm an operation name before
calling it; never guess names. Otherwise use the REST endpoints listed in
[JIRA_DOCUMENTATION_TEMPLATE.md](JIRA_DOCUMENTATION_TEMPLATE.md).

| Source | Look for | Feeds |
|---|---|---|
| **Jira configuration** | project, lead, issue types, statuses per type, board columns, fields on Bug, components, versions | Jira Workflow, QA Process, Bug Reporting, Releases |
| **Jira issues** (last 6–12 months) | epics/components (features), acceptance criteria, environment URLs, Figma links, repo links, deployment/release tickets, QA comments, recurring bug areas | Product Documentation, Environments, Resources, Known Issues, Regression |
| **Jira changelogs** (10–20 done issues) | the real path tickets take; where QA happens | QA Process |
| **Confluence** | existing project tree, company process pages (DoD, how-tos), templates, test strategy/plan/checklists | every page; also the audit |
| **Repository** | README, `docs/`, manifests (versions), CI config, deploy config, test configs, `.env.example` (variable names only) | Technical Architecture, Environments, Automation |
| **CI/CD** | pipelines, environments deployed to, test jobs, latest reports | Releases, Automation |
| **Figma** | files and frames linked from tickets | Feature pages, Resources |
| **API docs** | OpenAPI/Swagger, collections | API Testing, Resources |
| **Test suites** | test-management tool, spreadsheets | Test Cases, Regression, feature QA coverage |

Large result sets: paginate fully; when output is saved to a file, read it
completely before drawing conclusions, and say so if you could not.

## 4. Pages to produce

Follow the tree in the standard, section 3. Summary:

- **CORE (always):** Project Overview · Project Resources · Team &
  Responsibilities · Environments · Technical Architecture · Jira Workflow ·
  Product Documentation (+ feature pages for features in active QA scope) ·
  QA Overview · QA Process · Test Strategy · Test Cases · Regression · Bug
  Reporting · Releases · Known Issues
- **CONDITIONAL (only with evidence):** Platform/Module levels · Test Plan ·
  Test Data & Accounts · Automation · API / Mobile / Payment / Admin Panel
  Testing · Release Notes · App Store Release · Upgrade Playbook
- **OPTIONAL:** Glossary · Decision Log

A CORE page is complete when its minimum fields (standard, section 7) are
VERIFIED or `N/A` with a reason.

Naming: plain names in a dedicated space; `<Page> – <Project>` in a shared
space; feature pages `<Platform> | <KEY> - <Feature>`. No numeric prefixes, no
emojis.

## 5. Execution

Run the [audit checklist](PROJECT_AUDIT_CHECKLIST.md) steps 1–9 in order.
Specifics for an agent:

- **Step 3/4:** produce the mapping table and gap table as files or in your
  report — they are the basis for the human review.
- **Step 5:** keep an evidence table (page, field, value, state, source). Fill
  drafts only from it.
- **Step 6:** draft as local Markdown (one file per page) or Confluence drafts.
  Strip the template's Spec blocks from published content.
- **Step 7:** run every validation item, including the secrets scan, and fix
  what fails before reporting.
- **Step 9:** when publishing is authorised, update existing pages in place
  where they map 1:1, create missing CORE pages, set `Status: In review`, and
  never delete pages.

## 6. Output

End with a concise report:

1. **Audit** — strongest existing parts, inconsistencies, duplicates, missing
   areas (with links)
2. **Mapping** — standard page → existing source → status
3. **Changes** — pages drafted/created/updated (links), or files written
4. **Needs input** — the missing-information list grouped by who can answer
5. **Security** — locations of any plain-text credentials found (no values)
6. **Assumptions** — every INFERRED value and why

## 7. Self-check before finishing

- [ ] Every status/field/issue type I wrote exists in the project's Jira config
- [ ] Every URL came from a source; none was constructed by pattern
- [ ] Every person named appears in Jira/Confluence; roles not confirmed are INFERRED
- [ ] No CONDITIONAL page without a recorded trigger
- [ ] No secrets in any output, including this report
- [ ] Nothing published without authorisation
- [ ] All TBDs appear in the needs-input list
