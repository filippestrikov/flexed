# Test Strategy Template

The Test Strategy is the **durable, project-level** QA approach (CORE). It
changes rarely. What is in scope *for a given cycle or release* belongs in a
[Test Plan](TEST_PLAN_TEMPLATE.md).

> **Purpose** how and why this project is tested the way it is ·
> **Required data** the sections below ·
> **Sources** QA owner, existing QA pages, Environments, Jira Workflow, feature pages, automation repository, client agreements ·
> **Validation** environments, tools and automation status agree with their authoritative pages; entry/exit criteria use real Jira status names ·
> **Update** quarterly; after a platform upgrade; when automation is introduced or removed; when the QA process changes

Keep it to what is true for this project. Delete subsections that do not apply
rather than filling them with generic text.

---

## Page body

```markdown
Durable QA approach for <project>. The current cycle's scope is in
<Test Plan link or "no active plan">. No credentials on this page.

**Owner:** <@person> · **Last reviewed:** <YYYY-MM-DD>

## 1. Objectives
- <What QA must protect, in business terms, e.g. "customers can always order">

## 2. Scope
### In scope
- <platforms, flows, integrations that affect users>
### Out of scope
- <what is not tested and why; who covers it if anyone>

## 3. Test levels
| Level | Who | Where | Notes |
|---|---|---|---|
| Developer self-check | Developers | <env> | entry gate before QA |
| Functional / feature testing | QA | <env> | against acceptance criteria |
| Integration testing | <who> | <env> | <systems> |
| Regression | QA | <env> | see Regression page |
| UAT | Client | <env> | business-rule confirmation |
| Production verification | <who> | production | read-only / limited |

## 4. Test types
| Type | Applies? | Approach |
|---|---|---|
| Functional | yes | |
| Regression | yes | |
| Exploratory | | |
| UI / visual vs design | | |
| Cross-browser / device | | |
| Accessibility | | |
| Performance (e.g. Core Web Vitals) | | |
| Security basics (input, permissions) | | |
| API | | |
| Localisation | | |
| Analytics / tracking | | |

## 5. Environments
Link: Environments. Summary of which test levels run where:
| Environment | Used for | Restrictions |
|---|---|---|

## 6. Devices and browsers
<Matrix or link; source: analytics / client agreement.>

## 7. Test data
<Roles and data needed; link Test Data & Accounts. No credentials.>

## 8. Risk-based approach
| Risk area | Business impact | Change frequency | Test depth |
|---|---|---|---|
| <critical flow> | High | | full regression + critical path |
| <cosmetic content> | Low | | light pass |

## 9. Regression approach
<Critical-path checklist trigger and wider regression rule; link Regression.>

## 10. Automation strategy
<Current status (none / partial / extensive), what is automated first and why,
where it runs. Link Automation page if it exists. If none: state when to
revisit.>

## 11. Entry criteria (into QA)
- Ticket in <QA handoff status> with acceptance criteria
- Developer handoff comment posted
- <Feature page linked>

## 12. Exit criteria (release-ready)
- Critical-path checklist passes on <env>
- No open defects of severity <Blocker/Critical> in scope
- <Other agreed criteria>

## 13. Defect management
Bugs follow Bug Reporting. Severity scale: <link>. Failed tickets go to
<fail status>.

## 14. Reporting
| Report | When | Where |
|---|---|---|
| QA result comment | per ticket | Jira |
| Regression result | per major change / release | Jira comment |
| Test report | per cycle | <Confluence / Jira> |

## 15. Release criteria
<Who signs off; what must be true. Link Releases.>

## 16. Roles
| Role | Responsibility |
|---|---|

## References
```
