# Why FLEXED Works automation coverage

Source: [Flexed Web - Test Suite](https://docs.google.com/spreadsheets/d/1sJiNrwpl-t5pIm5JV7n_7lbB0znjiho_eM11XKtveSM/edit), tab `"Why FLEXED Works"`, rows 3–26.

One independent JavaScript test is implemented per supported manual scenario.
The content fixture records the English CMS configuration read on October 4, 2026
from `/admin/homepage/why-flexed`. Heading, subheading, feature labels, and notes
were confirmed through authenticated, read-only CMS inspection. This is a
regression baseline, not confirmation of approved design content. Update it
only when the expected content is confirmed.

## Instruction compliance

The suite follows `Instruction for tests.txt`, with the user's clarification
that "single test" means one independent test per manual scenario.
Locators use accessible roles, exact expected text, and the tested stable
`#how-it-works` anchor. There are no generated CSS classes, positional selectors,
or fixed sleeps. DOM measurements inspect image/text geometry and focusability;
they do not use styling classes to locate controls.

Navigation responses, scroll results, clicks, viewport changes, and keyboard
actions have assertions. Shared helpers keep repeated checks concise, and the
short comments explain layout polling and the page's scroll-managed URL hash.

The active-filter/completed-item sentence describes an item-list scenario.
The Why FLEXED Works section has no such list or filter, so that assertion is
not applicable to these cases. It should be used when a real list/filter
scenario is supplied, rather than asserted against unrelated feature content.

| Case ID | Implemented checks or missing prerequisites |
| --- | --- |
| FLXD-WFW-001 | Guest navigation, successful response, visible section and heading. |
| FLXD-WFW-002 | Exact baseline heading/subheading; visible text in the viewport. Visual typography/contrast is not audited. |
| FLXD-WFW-003 | Six configured images and all expected labels, using the captured CMS fixture. |
| FLXD-WFW-004 | Each baseline label and image visible in the viewport; image has loaded pixels. |
| FLXD-WFW-005 | Exact CMS note "Workouts that fit your space and equipment" must be visible next to the named feature. Currently fails: the CMS note is not rendered. |
| FLXD-WFW-006 | Skipped because all current CMS items have notes. With a confirmed no-note fixture, checks loaded image, visible label, and absence of extra/empty paragraphs and missing-content text. Exact design spacing still needs a visual reference. |
| FLXD-WFW-007 | Not implemented: highlighted CMS fixture and approved highlight rules are required. The sheet explicitly says the rules need clarification. |
| FLXD-WFW-008 | Not implemented: known non-highlighted CMS fixture and expected standard styling are required. |
| FLXD-WFW-009 | Not implemented: mixed highlight fixture and approved highlight rules are required. |
| FLXD-WFW-010 | Not implemented: authenticated CMS access, a record safe to edit/restore, and publication workflow are required. |
| FLXD-WFW-011 | Not implemented: authenticated CMS access and a safe editable feature label/note fixture are required. |
| FLXD-WFW-012 | Not implemented: authenticated CMS access and an approved replacement image fixture are required. |
| FLXD-WFW-013 | Not implemented: approved default-design copy, notes, highlight states, and images are required. The observed live page is not its own approval oracle. |
| FLXD-WFW-014 | No accessible links/buttons; clicking images/labels preserves the page route, section visibility, dialog absence, and page count. The URL hash is excluded because scrolling alone updates it. This checks observable immediate actions; it cannot prove the absence of every possible delayed handler. |
| FLXD-WFW-015 | Unique `how-it-works` anchor remains after reload. Stability after CMS content edits still depends on the CMS fixture. |
| FLXD-WFW-016 | Visible desktop link uses the correct anchor and brings the heading into view. The current UI says "Why Flexed Works?"; the sheet calls it "How Flexed Works". |
| FLXD-WFW-017 | Direct localized anchor URL loads with the heading in view, without a test-induced scroll. |
| FLXD-WFW-018 | At 390 px, feature rows are vertically ordered without image/label overlap or horizontal clipping. |
| FLXD-WFW-019 | Not implemented: approved mobile image/label alignment reference is required. Basic non-overlap is covered by layout tests. |
| FLXD-WFW-020 | Exact configured note must be visible, inside the mobile viewport, and free of text overflow at 390/320 px. Currently fails because the note is absent. Relative note positioning still requires approved design guidance. |
| FLXD-WFW-021 | Layout sampled at 1440, 1024, 768, 390, and 320 px; no horizontal scrolling, clipping, or mobile row overlap. This is a sampled resize test, not every possible width. |
| FLXD-WFW-022 | Not implemented: verified CMS fixture with both note and highlight disabled and approved spacing is required. |
| FLXD-WFW-023 | Loaded images fit their parent containers and section without text overlap; object-fit preserves aspect ratio on desktop/mobile. Exact design cropping is not audited. |
| FLXD-WFW-024 | No visible tabbable content in the section; Tab/Shift+Tab pass the section and external navigation remains focusable. Screen-reader behavior is not audited. |

CMS: https://admin-staging.getflexed.app/cms/how-flexed-works.
CMS login and read-only inspection succeeded. All six items have notes; the
Recipes & Nutrition Education item has `highlighted: true` and the others have
`highlighted: false`. The current edit dialog exposes label, note, and light/dark
images, but no highlight control. The storefront does not render any configured
notes. No CMS records were modified.

Fifteen independent tests are implemented: twelve currently pass, two fail on
missing notes, and one requires a no-note fixture. The remaining nine cases
(007–013, 019, 022) require an editable/restorable test fixture or approved visual
expectations and are documented rather than represented by empty tests.
