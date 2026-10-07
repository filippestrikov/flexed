# Confluence Documentation Standards

A reusable standard for project documentation in Confluence: what pages a
project needs, how they are named and arranged, what goes in them, where the
information comes from, and how to keep it current. It works for new and
existing projects, for client and internal work, and for web, mobile, API and
SaaS products.

## Why this exists

Project documentation tends to grow page by page: different templates per
project, the same environment table on four pages, QA pages in different
places, test strategies that no longer match reality. This standard gives
every project the same shape so that a new team member, a PM, or an AI agent
can find the same information in the same place on any project — and it
stops volatile information from being copied where it will go stale.

## Files

| File | What it is |
|---|---|
| [CORE_DOCUMENTATION_STANDARD.md](CORE_DOCUMENTATION_STANDARD.md) | **The rules.** Page tree, CORE/CONDITIONAL/OPTIONAL, naming, evidence, source of truth, maintenance, security |
| [PROJECT_DOCUMENTATION_TEMPLATE.md](PROJECT_DOCUMENTATION_TEMPLATE.md) | Overview, Resources, Team, Environments, Technical Architecture, Product Documentation, Feature page, Known Issues, Upgrade Playbook, Glossary |
| [JIRA_DOCUMENTATION_TEMPLATE.md](JIRA_DOCUMENTATION_TEMPLATE.md) | Jira Workflow page, built from the real Jira configuration |
| [QA_DOCUMENTATION_TEMPLATE.md](QA_DOCUMENTATION_TEMPLATE.md) | QA Overview, QA Process, Test Cases index, Regression, Test Data, platform testing pages, test reports |
| [TEST_STRATEGY_TEMPLATE.md](TEST_STRATEGY_TEMPLATE.md) | Durable project-level QA approach |
| [TEST_PLAN_TEMPLATE.md](TEST_PLAN_TEMPLATE.md) | Per-cycle plan |
| [TEST_CASE_STANDARD.md](TEST_CASE_STANDARD.md) | Test-case fields and when to use a checklist instead |
| [BUG_REPORT_STANDARD.md](BUG_REPORT_STANDARD.md) | Jira bug structure and severity scale |
| [RELEASE_DOCUMENTATION_TEMPLATE.md](RELEASE_DOCUMENTATION_TEMPLATE.md) | Release process, checklists, verification stages, rollback |
| [AUTOMATION_DOCUMENTATION_TEMPLATE.md](AUTOMATION_DOCUMENTATION_TEMPLATE.md) | Automation summary page (any framework) |
| [PROJECT_AUDIT_CHECKLIST.md](PROJECT_AUDIT_CHECKLIST.md) | The 9-step audit and documentation workflow |
| [CLAUDE_PROJECT_DOCUMENTATION_INSTRUCTIONS.md](CLAUDE_PROJECT_DOCUMENTATION_INSTRUCTIONS.md) | Instructions for Claude / AI agents |

## Page levels

**CORE** — every active project:
Project Overview · Project Resources · Team & Responsibilities · Environments ·
Technical Architecture · Jira Workflow · Product Documentation (+ feature
pages) · QA Overview · QA Process · Test Strategy · Test Cases · Regression ·
Bug Reporting · Releases · Known Issues

**CONDITIONAL** — only when evidence shows the capability or process exists:
Platform/Module levels · Test Plan · Test Data & Accounts · Automation ·
API Testing · Mobile Testing · Payment Testing · Admin Panel Testing ·
Release Notes · App Store Release · Upgrade Playbook

**OPTIONAL** — Glossary · Decision Log

Triggers for each CONDITIONAL page are in the standard, section 3.

## Workflow

```text
Project
   ↓
Discover sources
   ↓
Inspect Jira + Confluence + Repository
   ↓
Map against Core Standard
   ↓
Detect missing documentation
   ↓
Collect verified information
   ↓
Generate / update documentation
   ↓
Validate
   ↓
Human review where required
```

Details: [PROJECT_AUDIT_CHECKLIST.md](PROJECT_AUDIT_CHECKLIST.md).

### New project

1. Create the project root page (Project Overview) and the CORE pages from the
   templates — short pages with `TBD` markers are fine.
2. Fill the minimum fields (standard, section 7) as soon as they are known.
3. Build the Jira Workflow page from the real Jira configuration once the
   project exists.
4. Add CONDITIONAL pages when their trigger becomes true (first automated test,
   first mobile build, first payment provider…).
5. Feature pages are written during development, as part of Definition of
   Done.

### Existing project

1. Run the audit checklist, steps 1–8. This is read-only.
2. Review the mapping, gap list and missing-information report with the
   project owner.
3. Restructure: move and rename pages into the standard tree, merge
   duplicates (keep the authoritative copy), archive superseded pages. Keep
   good existing content.
4. Fill gaps from verified sources.

## Using it with Claude

Give Claude this folder and the project's sources:

> Analyze project `<PROJECT>` using the Core Documentation Standard. Inspect its
> Jira project, Confluence space, repository and available project resources.
> Audit the existing documentation, determine what is missing, and
> populate/update the documentation according to the standard.

Claude follows
[CLAUDE_PROJECT_DOCUMENTATION_INSTRUCTIONS.md](CLAUDE_PROJECT_DOCUMENTATION_INSTRUCTIONS.md).
It inspects Jira configuration and issues, Confluence, repositories (README,
manifests, CI, test configs), Figma links, API docs and test suites; works
read-only until publishing is approved; and ends with an audit, a mapping,
the changes made, and a list of what needs human input.

### What must never be invented

Jira statuses, transitions, issue types and fields · team members and roles ·
environments, URLs and branches · versions and dates · credentials. Projects
differ: the same company can have a QA handoff status called `Review TST` in
one project and `QA` in another.

### How missing data is written

| State | Written as |
|---|---|
| Verified | the value, with its source linked |
| Inferred | `INFERRED: <value> — <evidence>` and listed under Open questions |
| Unknown | `TBD — information not found in available project sources` |
| Sources disagree | `CONFLICT` with both values and sources |

## Security

No passwords, tokens, API keys, private keys, basic-auth pairs, session cookies
or connection strings in Confluence, Jira or this repository. Pages refer to
the secrets-manager entry by name. Credentials found in plain text are
reported for rotation and never copied.

## Changing the standard

Change the standard through a pull request that updates the affected
templates in the same change, so the rules and the templates never drift
apart. Bump the version line at the top of
[CORE_DOCUMENTATION_STANDARD.md](CORE_DOCUMENTATION_STANDARD.md).
