# Jira Workflow Template

Template for the **Jira Workflow** page (CORE). This page is a dated snapshot
of the real Jira configuration plus the team's conventions. Jira remains the
source of truth; the page explains it.

**Rule:** every status, transition, issue type, field, component, label and
priority on this page is read from the project's Jira configuration. Nothing
is assumed from another project — workflows differ between projects even in
the same company.

---

## How to collect the data

| Data | How to get it (Atlassian REST or MCP equivalent) |
|---|---|
| Project key, name, lead, type | `GET /rest/api/3/project/{key}` · MCP: `listJiraProjects` with `expand=lead,issueTypes` |
| Issue types | `GET /rest/api/3/issue/createmeta/{key}/issuetypes` · MCP: `listJiraProjectIssueTypesMetadata` |
| Statuses per issue type | `GET /rest/api/3/project/{key}/statuses` · MCP: `listJiraStatuses` (mode `project`) |
| Board columns and status mapping | `GET /rest/agile/1.0/board/{id}/configuration` · MCP: `listJiraBoards`, `getJiraBoardConfig` |
| Transitions (actually available) | `GET /rest/api/3/issue/{issue}/transitions` on a sample issue of each type · MCP: `listJiraIssueTransitions` |
| Real transition paths | changelog of 10–20 recently completed issues · MCP: `listJiraIssueChangelogs` |
| Fields on the Bug type | `GET /rest/api/3/issue/createmeta/{key}/issuetypes/{id}` · MCP: `getJiraIssueTypeMetaWithFields` (`requiredFieldsOnly: false`) |
| Components | `GET /rest/api/3/project/{key}/components` · MCP: `listJiraProjectComponents` |
| Versions / releases | `GET /rest/api/3/project/{key}/versions` · MCP: `getJiraProjectVersions` |
| Labels in use | JQL sample: `project = KEY AND labels is not EMPTY ORDER BY updated DESC` |
| Priorities | Bug type field metadata (`priority` allowed values) |
| Conventions | summaries, descriptions and comments of recent issues |

If an API does not expose something (for example workflow validators or
automation rules), record it as `TBD — not exposed via API; confirm in Jira UI`
and list it under Open questions.

---

## Page body

```markdown
Snapshot of the <KEY> Jira configuration, taken <YYYY-MM-DD>. Jira is the source
of truth — if this page and Jira disagree, Jira wins and this page is updated.

## Project

| Project key | <KEY> |
|---|---|
| Project name | <name> |
| Project type | <company-managed / team-managed; scrum / kanban> |
| Project lead | <@person> |
| Board(s) | <name (id) — link> |

## Issue types

| Issue type | Used for | Sub-task? |
|---|---|---|
| <name exactly as in Jira> | <team convention> | <yes/no> |

## Workflow

Statuses in board order (exact names):

| Board column | Status(es) | Category | Meaning in this project |
|---|---|---|---|
| <column> | <status> | <To Do · In Progress · Done> | <what it means; who moves it here> |

**QA handoff status:** <the status a ticket enters when it is ready for QA>
**QA fail path:** <status a failed ticket returns to>
**Done status:** <status(es)>

Observed transition path (from changelogs): <Status A → Status B → …>

Workflow rules / validators: <e.g. field X required before status Y — or TBD>

## Fields that matter for QA

| Field | Type | Required? | Allowed values / usage |
|---|---|---|---|
| Priority | | | <values exactly as in Jira> |
| Severity (if present) | | | |
| Environment (if present) | | | |
| Affects / Fix version | | | |
| Components | | | |
| Labels | | | <labels in use + meaning> |

## Conventions

- Ticket summary format: <observed / agreed format>
- Bug summary format: see Bug Reporting
- Assignment: <who assigns; who picks up QA>
- Estimates and time logging: <rule or link to company how-to>
- Labels: <rule or link to company how-to>

## Useful filters

| Purpose | JQL |
|---|---|
| Ready for QA | `project = <KEY> AND status = "<QA handoff status>"` |
| Open bugs | `project = <KEY> AND issuetype = "<Bug type>" AND statusCategory != Done` |
| Current release | `project = <KEY> AND fixVersion = "<version>"` |

## Open questions
- [ ] <item>
```

---

## Validation

- Every status on the page appears in the `statuses` response for the project.
- Board columns match the board configuration response.
- The QA handoff status is confirmed either by the board column named for QA,
  by changelogs showing QA activity in that status, or by the QA owner.
  Otherwise mark it `INFERRED`.
- JQL in "Useful filters" runs without error (quote reserved words, e.g.
  `labels = "update"`).
