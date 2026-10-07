# Test Case and Checklist Standard

Defines the canonical test-case format and when a checklist is used instead.
Test cases live in the test-management tool or suite files; Confluence holds
the [Test Cases index](QA_DOCUMENTATION_TEMPLATE.md#3-test-cases-core-index-page).

---

## 1. Test case fields

Required fields are kept to what is needed to execute and trace a case.
Everything else is optional and should be added only when the team will
maintain it.

| Field | Required | Content |
|---|---|---|
| **ID** | yes | `<PROJECT>-<AREA>-<NNN>`, e.g. `ACME-CHK-014`. Never reused, never renumbered. |
| **Section** | yes | Module / feature (matches the feature page name) |
| **Title** | yes | Verb + object + condition: "Apply a gift card when the cart total is below its balance" |
| **Preconditions** | when needed | State that must exist before step 1 (role, data, settings) |
| **Steps** | yes | Numbered, one action per step, starting from a URL or screen |
| **Expected result** | yes | Observable outcome; per step only when intermediate results matter |
| **Priority** | yes | `Critical` · `High` · `Medium` · `Low` (see section 3) |
| **References** | yes | Jira key(s) of the requirement; design frame if the case checks UI |
| Test data | optional | Data values or role names — never credentials |
| Platform | optional | When not all platforms apply |
| Environment | optional | When the case cannot run everywhere (e.g. "not on production") |
| Automation status | optional | `Manual` · `Automated` · `Not automatable` (+ reason) |
| Type | optional | `Functional` · `Regression` · `Smoke` · `UI` · `API` … |
| Estimate | optional | Execution time, if the team plans by it |

Automated tests keep the manual case ID and title in the test name, so results
can be traced back.

### Writing rules

- One behaviour per case. If the expected result has "and" joining unrelated
  outcomes, split it.
- Expected results come from a source: acceptance criteria, approved design,
  confirmed comment, or the feature page. Record the source in References. If
  there is none, the case is `Draft` until the PM confirms the behaviour.
- No environment URLs or credentials in steps — say "open the storefront" and
  let the Environments page provide the URL.
- Negative paths are separate cases: invalid input, empty states, permissions,
  double submit, back/refresh mid-flow, timeouts.
- Write for someone new to the project: no undefined internal abbreviations
  (use the Glossary).

### Example

```text
ID:             ACME-CRT-003
Section:        Cart
Title:          Typed quantity is saved when the cart drawer is closed
Preconditions:  Logged in as B2B customer; one product in the cart
Steps:          1. Open the cart drawer
                2. Type 5 in the quantity field of the product
                3. Close the drawer without pressing Enter
                4. Open the cart page
Expected:       The cart shows quantity 5 for the product
Priority:       Critical
References:     ACME-43
Automation:     Automated
```

## 2. Checklist standard

A **checklist** is a list of short verifiable items without detailed steps. It
is faster to run and maintain, and it relies on the tester knowing the product.

| Use a checklist for… | Use detailed test cases for… |
|---|---|
| Smoke testing after deploy | New features |
| Production verification | Complex business rules and calculations |
| Critical-path regression | Integrations and data flows |
| Release verification | Cases that will be automated |
| Device / browser compatibility passes | Anything a new tester must be able to run |
| Payment method verification | Defect regression for high-severity bugs |
| Onboarding / account flows quick pass | Compliance or client-audited flows |

Checklist item format:

```text
| # | Item | Expected result | Environment rule |
| 1 | Log in as <role> | Lands on <page>, logged in | all |
```

Rules:

- 3–7 items for a critical-path checklist; up to ~25 for a smoke checklist.
- Each item still has an observable expected result.
- Each item links to the suite that covers it in depth (if any).
- Results are recorded with the template on the Regression page, not by
  editing the checklist.

## 3. Priority

| Priority | Meaning |
|---|---|
| Critical | Failure stops users from completing a core business action (log in, buy, order, pay) |
| High | Important function broken or wrong, workaround exists |
| Medium | Secondary function or noticeable UI/UX issue |
| Low | Cosmetic or rare |

Priority of a test case is about **which cases to run first**; it maps onto
bug severity ([BUG_REPORT_STANDARD.md](BUG_REPORT_STANDARD.md)) but is not
the same field.

## 4. Suite organisation

- One suite per feature or critical-path item; sections inside follow the
  feature's flows.
- Suite name: `<Project> – <Area> Test Suite`.
- A spreadsheet suite uses the field names above as column headers, in that
  order, so it can be imported into a test-management tool later.
- Retired cases are marked `Obsolete`, not deleted, so IDs referenced in Jira
  stay resolvable.
