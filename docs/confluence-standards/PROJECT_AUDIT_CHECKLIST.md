# Project Audit Checklist

The operational workflow for auditing a project against the
[Core Documentation Standard](CORE_DOCUMENTATION_STANDARD.md) and producing
or updating its documentation. Humans and AI agents follow the same steps.

```text
Project
   ↓
1 Discover sources
   ↓
2 Inventory (Jira + Confluence + repository + other systems)
   ↓
3 Map against the Core Standard
   ↓
4 Detect gaps
   ↓
5 Collect verified evidence
   ↓
6 Draft documentation
   ↓
7 Validate
   ↓
8 Report missing information
   ↓
9 Publish (after approval) → human review
```

Steps 1–8 are **read-only** for existing documentation. Nothing in Confluence
or Jira is changed until step 9, and step 9 needs approval from the project
owner (or explicit authorisation in the request).

---

## Step 1 — Discovery

Find every source. Record each in the inventory table (step 2) with its link.

- [ ] Jira: project key(s) — a client may have several projects or a renamed
      older project; boards; saved filters
- [ ] Confluence: the project's space or page tree; company-level process
      pages it relies on; search for the project name and keys across spaces
- [ ] Repositories: links from Jira (development panel), Confluence, README
- [ ] README files, `docs/` folders, `CONTRIBUTING`, `CLAUDE.md` / agent files
- [ ] CI/CD: pipeline config in the repo (`Jenkinsfile`, `.github/workflows`,
      `bitbucket-pipelines.yml`, `.gitlab-ci.yml`, Buddy, etc.)
- [ ] Figma (or other design tool): links in Jira descriptions and comments
- [ ] Environments: URLs in Jira, Confluence, repo config, `.env.example`
- [ ] QA tools: test-management tool, suite folders, automation repos,
      BrowserStack or device-cloud projects
- [ ] API docs: Swagger/OpenAPI files or URLs, Postman collections
- [ ] Analytics, monitoring, store listings, integration dashboards

Discovery rules:

- Production URLs may be recorded from sources. **Do not load or probe
  production** unless the project's rules explicitly allow read-only checks.
- Never open or copy credential files' values; record only that they exist.

## Step 2 — Inventory

```markdown
| System | Item | Link | Last updated | Owner | Notes |
|---|---|---|---|---|---|
| Jira | <KEY> project, board <id> | | | | |
| Confluence | <page> | | <date> | | |
| Repo | <name> | | <last commit date> | | |
| … | | | | | |
```

## Step 3 — Template mapping

For each page in the canonical tree, decide its status:

```markdown
| Standard page | Level | Trigger met? (evidence) | Existing source(s) | Status |
|---|---|---|---|---|
| Project Overview | CORE | — | <page> | Good / Needs standardisation / Missing / Outdated / Duplicate |
| Automation | CONDITIONAL | yes — playwright.config.js in <repo> | <page> | |
| Mobile Testing | CONDITIONAL | no — no app, mobile web only as secondary | — | Not applicable |
```

Status values: **Good and reusable** · **Needs standardisation** ·
**Project-specific** (keep, but outside the standard tree) · **Duplicate** ·
**Missing** · **Outdated** · **Not applicable**.

## Step 4 — Gap detection

```markdown
| Area | Current state | Issue | Recommendation | Required/Optional |
|---|---|---|---|---|
```

Check especially whether each reader can do their job:

- [ ] New QA engineer: can find environments, test accounts (via secrets
      manager), suites, and the QA handoff status
- [ ] Developer: can find repo, branches → environments, deployment, integrations
- [ ] PM: can see status, owners, release process, open defects
- [ ] Anyone: can reproduce a defect (environments + bug standard + device record)
- [ ] Anyone: can run regression (critical-path checklist + accounts + result template)
- [ ] Anyone: can prepare a release (release checklist + rollback contact)
- [ ] Anyone: understands the Jira workflow (real statuses documented)
- [ ] AI agent: can find all of the above via links from the Project Overview

Look for these frequent defects:

- [ ] pages still containing raw template text
- [ ] pages contradicting each other (e.g. "no automation" while a suite exists)
- [ ] status/version/date values copied from Jira that are now stale
- [ ] the same table (environments, people) maintained on several pages
- [ ] project QA pages located outside the project tree
- [ ] credentials or credential hints in plain text (report for rotation; do not copy)

## Step 5 — Evidence collection

For every value to be written, record source and state:

```markdown
| Page | Field | Value | State (VERIFIED/INFERRED/TBD/CONFLICT) | Source |
|---|---|---|---|---|
```

Source priority when they disagree: system configuration (Jira config, repo
files, CI) → recent tickets/comments by the owner → Confluence pages → older
tickets. Record conflicts; do not resolve them silently.

## Step 6 — Draft documentation

- Use the templates in this folder; keep section order.
- Fill only from the evidence table. Everything else is
  `TBD — information not found in available project sources`.
- Keep good existing content: rewrite structure and wording, keep facts and
  links. Note in the draft which existing page each section came from.
- Do not create CONDITIONAL pages whose trigger is not met.
- Drafts live outside the live space (local Markdown files, a draft page, or a
  sandbox space) until step 9.

## Step 7 — Validation

- [ ] **Consistency:** environments, owners and versions identical across pages
      (or linked from one authoritative page)
- [ ] **Links:** every internal and external link resolves (or is confirmed
      access-restricted); production links are checked from the source, not by
      loading production
- [ ] **Duplicates:** each fact has one home (standard, section 8)
- [ ] **Freshness:** volatile values dated or replaced by live macros/filters
- [ ] **Environments:** names and URLs match repo/CI config
- [ ] **Jira:** every status, issue type, field and label exists in the project
- [ ] **Terminology:** feature and area names match between Jira, feature pages
      and test suites
- [ ] **Hierarchy and naming:** tree and titles follow the standard, sections 3–4
- [ ] **Evidence:** every non-TBD value has a source; every INFERRED value is
      in Open questions
- [ ] **Secrets scan:** no passwords, tokens, keys, connection strings, basic-auth
      pairs, session cookies or private URLs with embedded tokens. Quick scan:
      `grep -inE "pass(word)?|secret|token|api[_-]?key|bearer|private key|://[^/ ]+:[^@ ]+@" <draft files>`
      and review every hit manually

## Step 8 — Missing-information report

A short list for humans, grouped by who can answer:

```markdown
## Needs input — <project> (<YYYY-MM-DD>)

### <Role, e.g. Technical owner>
- [ ] <Page> → <field>: <what is missing / the conflict>

### <Role, e.g. PM>
- [ ] …

### Security
- [ ] Credentials found in plain text at <location> — rotate and remove (values not copied)
```

## Step 9 — Publish

- [ ] Approval obtained to create/update pages (name the approver)
- [ ] Existing pages updated in place where they map 1:1; never deleted —
      superseded pages are archived with a link to their replacement
- [ ] Moves of existing pages agreed with their owners
- [ ] Metadata block filled (`Status: In review` until an owner confirms)
- [ ] Labels applied; Page Properties reports render
- [ ] Missing-information report posted (Confluence page comment or Jira task)
- [ ] Review dates set according to the standard, section 9
