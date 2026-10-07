# Test Plan Template

A Test Plan is **per cycle** (CONDITIONAL): a release, a sprint with a client
sign-off, a migration, a platform upgrade. It follows the
[Test Strategy](TEST_STRATEGY_TEMPLATE.md) and only records what is specific
to this cycle.

Create one when there is a planned test cycle with defined scope, a release
with more than one feature, or a client sign-off. Small single-ticket changes
need no plan — the QA result comment is enough.

Title: `Test Plan – <version or YYYY-MM-DD>` (shared space: add `– <Project>`).

> **Purpose** what will be tested in this cycle, by whom, with what, and when it is done ·
> **Required data** the sections below ·
> **Sources** Jira fix version / epic / sprint, feature pages, Test Cases index, Environments, Test Strategy ·
> **Validation** the scope list equals the Jira filter for the cycle at the time of writing; every feature in scope has a suite or a reason ·
> **Update** scope change within the cycle; closed with a result summary at the end

---

## Page body

```markdown
Plan for <cycle>. Approach: <Test Strategy link>. No credentials on this page.

**Owner:** <@person> · **Cycle:** <version / dates> · **Status:** <Planned · Running · Closed>

## 1. Scope
Live scope: [Jira filter: fixVersion = "<version>" / sprint / epic]

| Feature | Jira | Feature page | Suite / checklist | Test types |
|---|---|---|---|---|

## 2. Out of scope
- <item — reason>

## 3. Environments and builds
| Environment | Build / branch | Used for |
|---|---|---|

## 4. Test types for this cycle
<Subset of the strategy's types, plus anything special (e.g. data migration
checks).>

## 5. Dependencies
- <integrations, data, other teams, client input>

## 6. Test data requirements
- <roles / data; link Test Data & Accounts>

## 7. Risks and mitigations
| Risk | Impact | Mitigation | Owner |
|---|---|---|---|

## 8. Schedule
<Dates if agreed; otherwise the trigger sequence, e.g. "feature QA → critical
path on ACC → release → production smoke".>

## 9. Responsibilities
| Role | Person | Responsibility in this cycle |
|---|---|---|

## 10. Entry criteria
<As strategy, plus cycle-specific items.>

## 11. Exit criteria
<As strategy, plus cycle-specific items.>

## 12. Deliverables
- QA result per ticket (Jira)
- Regression result (Jira comment)
- Test report at cycle end (this page, section 13)

## 13. Result summary (fill at close)
| Executed | Passed | Failed | Blocked | Open defects (by severity) |
|---|---|---|---|---|
Release recommendation: <go / no-go / go with known issues (links)>
```
