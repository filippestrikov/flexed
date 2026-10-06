# Subscription/pricing Playwright coverage

Source: `Files/Flexed Web - Test Suite.xlsx`, fifth tab, `Subscriptionpricing section`,
31 cases (`FLXD-SUB-001`–`031`). One independent JavaScript test per implemented
scenario, plus one accessibility regression from Jira. Target: English staging
storefront, Chromium, 1440 × 900, empty guest storage.

## Requirements and worksheet corrections

[FLXD-123](https://snc-ll.atlassian.net/browse/FLXD-123) defines the section and
Stripe as the billing source. Its later revision,
[FLXD-213](https://snc-ll.atlassian.net/browse/FLXD-213), explicitly removes radio
selectors, selected states, and clickable cards; each offer has a filled
**Get Started** button below it. Yearly keeps **Best Value**. Each button must
have an accessible name identifying its plan. The required subheading is
“Everything you need to train, progress, and reach your goals.”

Consequently, 002 uses the revised CTA; 008 and 010–013 test the replacement
behavior instead of reporting intentional removal of selection as a bug.
The older radio bug [FLXD-333](https://snc-ll.atlassian.net/browse/FLXD-333)
does not override this explicit revised acceptance criterion.
[FLXD-289](https://snc-ll.atlassian.net/browse/FLXD-289) records the later CMS
checklist and the per-plan Get Started controls.
[FLXD-233](https://snc-ll.atlassian.net/browse/FLXD-233) describes Stripe checkout;
these guest tests stop at the account modal and do not submit registration or payment.

The marketing fixture `tests/fixtures/subscription.json` records current English
storefront copy on 2026-10-06. Configured group names currently map Training,
Wellness, Growth to **Training & Progress**, **Nutrition**, and **Expert Guidance
& Support**. This snapshot supports content regression checks; it is not an
independent CMS export and does not prove CMS propagation. The required subheading
comes from FLXD-213 rather than copying the currently displayed conflicting text.
The savings copy is marketing content, not an authoritative plan price.

## Case mapping

| ID suffix | Automated check / remaining limitation |
| --- | --- |
| 001 | Guest access, successful response, stable navigation anchor, scroll destination and visible section |
| 002 | Heading, revised Jira subheading, three configured groups, two offers and CTAs |
| 003 | Training & Progress title and exact feature list against marketing snapshot |
| 004 | Nutrition title and exact feature list against marketing snapshot |
| 005 | Expert Guidance & Support title and exact feature list against marketing snapshot |
| 006 | Exactly two named offers and two CTAs |
| 007 | Yearly precedes Monthly in DOM reading order |
| 008 | Revised recommendation: Yearly-only badge and no active selection; no pixel comparison |
| 009 | Badge text, visible fill, differing text color, rounded treatment; exact design values pending |
| 010 | Revised requirement: neither landing offer has a selected state |
| 011 | Fresh isolated guest load and reload retain the revised absence of landing selection |
| 012 | Monthly title click opens no modal; its button opens Create Your Account; carried plan not yet verified |
| 013 | Repeated Yearly/Monthly CTA activation, modal open/close assertions, no landing selection; checkout persistence pending |
| 014 | Yearly price matches independent billing fixture; skipped until fixture supplied |
| 015 | Monthly price matches independent billing fixture; skipped until fixture supplied |
| 016 | Yearly period matches independent billing fixture; skipped until fixture supplied |
| 017 | Monthly period matches independent billing fixture; skipped until fixture supplied |
| 018 | Both expected USD-formatted amounts match billing fixture; skipped until fixture supplied |
| 019 | Yearly supporting copy matches marketing snapshot |
| 020 | Monthly supporting copy matches marketing snapshot |
| 021 | Monthly excludes Yearly savings copy and savings messaging |
| 022 | Pending: Yearly checkout comparison requires approved checkout fixture and test-mode billing |
| 023 | Pending: Monthly checkout comparison requires approved checkout fixture and test-mode billing |
| 024 | Pending: checkout periods and carried plan require approved checkout fixture |
| 025 | Pending: read-only CMS field inspection and billing ownership; saved CMS session currently renders login |
| 026 | Pending: isolated editable CMS record and restoration procedure for heading/subheading |
| 027 | Pending: isolated editable CMS record and restoration procedure for feature group titles |
| 028 | Pending: isolated editable CMS record and restoration procedure for feature lists |
| 029 | Pending: isolated editable CMS record and restoration procedure for badge copy |
| 030 | Pending: isolated editable CMS record and restoration procedure for supporting copy |
| 031 | Pending: worksheet steps are truncated and expected result is empty; clarify before implementing |

Supplemental `FLXD-213-AC09` checks the actual accessible name of each CTA and
requires its plan name. Content scoping lets the test find each identical visible
label without hiding the accessibility defect.

## Billing fixture

Set `FLEXED_BILLING_FIXTURE` to a local JSON export of the **currently configured
Stripe test-mode prices**, obtained independently from the storefront. The file
must contain `source: "stripe"`, `livemode: false`, and `yearly` / `monthly`
objects with `priceId`, integer `unitAmount` in cents, `currency: "usd"`,
`interval: "year"` / `"month"`, and `intervalCount: 1`. Do not put Stripe API
keys, portal session URLs, customer information, or account credentials in it.
Tests validate the contract before comparing UI values; they never derive their
expected prices from the same DOM they are checking.

The supplied private Stripe test portal was inspected read-only on 2026-10-06.
It displayed **Yearly FLEXED Pro, $887.33 per year**, matching the observed
storefront amount. It did not establish both plan price IDs, explicit USD
metadata, or Monthly pricing. A subsequent metadata inspection timed out.
This limited corroboration does not satisfy the billing fixture contract, so
014–018 remain explicitly skipped. No portal secret or customer data is stored.

## Implementation and run

`tests/subscription.spec.js` uses accessible roles, exact text, and the stable
`#subscriptions` anchor. Offer/group containers are scoped by their unique
content rather than CSS utility classes, generated IDs or numeric card positions.
Each meaningful action has an assertion. Billing cases skip with a clear fixture
reason rather than treating unknown billing values as passing expectations.
The instruction about an Active filter excluding completed items applies to a
task list; this subscription section has neither that filter nor completed items.

The helper scrolls the pricing heading into view directly. Preliminary runs that
clicked the header anchor intermittently remained at Hero or lost the pricing
heading after the URL changed. Waiting for the header logo improved initial
results but did not eliminate the issue. Header-click behavior is separate from
this content suite and needs investigation; direct scrolling does not verify it.

```powershell
$env:PLAYWRIGHT_HTML_OPEN='never'
npx playwright test tests/subscription.spec.js --workers=1 --output=test-results/subscription --reporter=list,html
```

22 tests are registered: 21 worksheet IDs and one supplemental Jira case.
Ten worksheet IDs remain unimplemented for the reasons above. Cases adapted to
FLXD-213 cover revised requirements, not the obsolete manual expectations.
Screenshots and retained traces for failures are under `test-results/subscription`;
the latest HTML report is under `playwright-report`. Neither is committed.
This run does not rerun or change the previous Hero, Why FLEXED Works or header tests.

## Latest verification — 2026-10-06

Final direct-scroll run: **10 passed, 7 failed, 5 skipped** (22 tests, one worker,
no retries, about 1.6 minutes). JavaScript syntax and Git whitespace checks passed.
The mapping table accounts for all 31 distinct worksheet IDs.

* **002:** required FLXD-213 subheading is missing. Actual copy is “Find the
  training, guidance, and support you need to reach your goals”.
* **012, 013, 019, 020, 021, FLXD-213-AC09:** pricing heading is absent on these
  fresh guest loads. Snapshots show Hero, Why FLEXED Works and Journeys but no
  pricing content. The failure occurs before each case's specific assertions,
  even with direct scrolling; it cannot be attributed solely to header navigation.
  The underlying server/data failure has not been identified.
* **014–018:** skipped because the independent billing fixture is unavailable.

The earlier run reached the accessibility assertion and confirmed that the
Yearly CTA name was only “Get Started”, without “Yearly”; read-only inspection
also showed the same name for Monthly. In the final run, missing pricing content
prevented that assertion from executing. Do not report those final six failures
as six distinct feature bugs or claim the blocked assertions passed.

No Jira issues were created, and no CMS or Stripe data was changed. Publication
does not rerun browser tests or Jenkins; the recorded results above remain the
2026-10-06 local section run.
