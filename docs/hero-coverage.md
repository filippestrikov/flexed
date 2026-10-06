# Hero automation coverage

Source: [Flexed Web - Test Suite](https://docs.google.com/spreadsheets/d/1sJiNrwpl-t5pIm5JV7n_7lbB0znjiho_eM11XKtveSM/edit),
tab **Hero section**, rows 3–30 (28 manual scenarios).

The JavaScript suite has one independent test per implemented scenario:
20 guest storefront tests in `tests/hero.spec.js` and one read-only CMS test in
`tests/hero-cms.spec.js`. Shared helpers assert navigation responses, content,
image loading, viewport changes, clicks/taps, modal closure, and layout geometry.

Locators use the stable `#hero` and `#Tags` anchors, accessible roles, and exact
expected text. Value tags lack an accessible list role, so the count is scoped
to their `span` elements inside `#Tags`. There are no generated styling-class
selectors, positional selectors, or fixed sleeps. The item-list/active-filter
instruction does not apply: Hero has no completed-item list or active filter.

## Content and design references

`tests/fixtures/hero.json` records the English/Arabic headline, subheading, three
tags, and light/dark image URLs from read-only CMS inspection on October 4, 2026:
https://admin-staging.getflexed.app/cms/hero (`/admin/homepage/hero`).
The CMS record's observed `updatedAt` was `2026-09-29T12:46:20.700Z`.

CTA labels are a separate application UI regression baseline. The English label
is explicitly required by the sheet. The Arabic label was observed during
language switching; neither is an editable field in the inspected CMS form.

Design reference supplied by the user:
[Flexed Figma frame 988:36390](https://www.figma.com/design/GiC2vBPWkAKMbmC3qPuVX0/Flexed?node-id=988-36390).
The supplied node is the Desktop canvas, containing multiple design variants.
Figma MCP access was verified on October 4, 2026. The English light desktop
headline and tags were read from nodes `1655:23604` and `1655:23607`; they differ
from the current CMS baseline. Further reads hit the account's View-seat limit.
Figma is a supporting design reference, not the sole authority for expected
behavior or copy. Review the related Jira acceptance criteria and explicit
requirement changes before treating a design/CMS difference as a defect.
Jira access is now verified through the `Filip QA` account. FLXD-121 defines
the core Hero requirements; FLXD-287 confirms the later CMS workflow and locked
CTA decision. FLXD-340 requires mobile content to remain separated without
overlap. Their requirements and comments are mapped in the research document.
Typography, exact spacing/cropping, contrast, and approved default copy remain
unverified. Image checks cover decoded pixels, configured sources,
`object-fit: cover`, and container bounds. See [Jira research](hero-jira-research.md).

320 px is a sampled width, not a confirmed minimum supported device width.
Other samples are 390, 640, 768, 1024, 1280, and 1440 px. Mobile checks use a
900 px viewport height; touch input is enabled for the mobile CTA test.

## Case mapping

| Case | Automated checks or remaining prerequisite |
| --- | --- |
| FLXD-HERO-001 | Guest response, correct language route, unique visible Hero/headline in viewport, no authentication modal. |
| FLXD-HERO-002 | Headline, subheading, exactly three tags, one visible enabled primary CTA, decoded supporting image. |
| FLXD-HERO-003 | Exact CMS-baseline headline and measurable readability. |
| FLXD-HERO-004 | Exact CMS-baseline subheading and measurable readability. |
| FLXD-HERO-005 | Exactly three ordered tags matching the CMS baseline; visible text within viewport. |
| FLXD-HERO-006 | Image decoded and faded in; configured light/dark source and aspect-preserving object-fit. Exact design cropping is not checked. |
| FLXD-HERO-007 | Pending: a confirmed editable/restorable Hero fixture and publication workflow for headline changes. |
| FLXD-HERO-008 | Pending: a confirmed editable/restorable Hero fixture and publication workflow for subheading changes. |
| FLXD-HERO-009 | Pending: a confirmed editable/restorable Hero fixture and publication workflow for tag changes. |
| FLXD-HERO-010 | Pending: an approved replacement image plus an editable/restorable Hero fixture and upload/crop workflow. |
| FLXD-HERO-011 | Pending: Jira acceptance criteria establishing approved default content and resolving design/CMS differences. A matching storefront/CMS baseline alone does not verify requirements compliance. |
| FLXD-HERO-012 | Exactly one accessible, visible, enabled Hero CTA. Hidden desktop/mobile alternatives are excluded by role locators. Exact visual styling remains unverified. |
| FLXD-HERO-013 | Fixed English CTA label `Join FLEXED Now`. |
| FLXD-HERO-014 | Read-only English/Arabic CMS form inspection: headline, subheading, three tag fields, no CTA-label editor; Save remains disabled. Requires local CMS authentication. |
| FLXD-HERO-015 | Pending: editable/restorable CMS fixture to verify CTA label after a published content change. |
| FLXD-HERO-016 | Switch AR then EN through visible navigation links; assert route, localized headline, and exact CTA label. Application source ownership is not inferred solely from rendered text. |
| FLXD-HERO-017 | CTA opens Create Account with its heading and name/email fields; page route stays unchanged. The scroll-managed hash is excluded from route comparison. |
| FLXD-HERO-018 | Single click produces one dialog, one account heading, and no extra page. The test does not count decorative overlays by CSS class. |
| FLXD-HERO-019 | Open modal, close with Escape, assert disappearance and intact Hero content/layout. No account is submitted. |
| FLXD-HERO-020 | At 390 px, headline/subheading/tags/image/CTA form vertically ordered groups with no geometric overlap. Tags may wrap within their group. |
| FLXD-HERO-021 | Headline/subheading remain visible, within horizontal bounds, and unclipped at 390/320 px. |
| FLXD-HERO-022 | Three matching mobile tags fit and do not overlap one another or other Hero elements. |
| FLXD-HERO-023 | Visible mobile CTA can be fully scrolled into view and tapped to open Create Account. |
| FLXD-HERO-024 | At 390 px, image and other Hero elements do not overlap. Measurements include the transparent image box; approved cropping/spacing remains a design prerequisite. |
| FLXD-HERO-025 | At sampled 320 px, content fits layout/viewport and each element can be fully scrolled into view without horizontal scrolling. Confirmation of the supported minimum is outstanding. |
| FLXD-HERO-026 | Resize through seven sampled widths; check bounds, clipping, overlap, horizontal scroll, and mobile stacking below 640 px. Sampling does not verify every continuous width. |
| FLXD-HERO-027 | Pending: longer valid CMS text limits, an editable/restorable Hero fixture, and publication workflow. |
| FLXD-HERO-028 | Decoded image uses aspect-preserving cover behavior and fits its container/viewport at desktop, tablet, and mobile widths. |

Seven cases (007–011, 015, 027) are documented as pending rather than represented
by empty or falsely passing tests. No CMS records were edited.

## Verified results

October 4, 2026, Chromium 140.0.7339.186, Playwright 1.55.1, Windows 11:
**18 passed, 3 failed** with fresh CMS authentication. Without CMS authentication,
case 014 is skipped rather than reported as passing.

- **020 / 024:** at 390 px, the image's bounding box overlaps the CTA and the
  strict vertical stacking check fails. The measurement includes transparent
  image pixels; whether that overlap violates the approved requirements remains
  to be checked against related Jira tickets and the applicable design variant.
- **026:** the athlete image overlaps the headline and subheading at 768 px.
  The captured screenshot also shows text over the athlete image.

Failures remain assertions, not skips. Screenshots, page snapshots, and traces
are generated in `test-results/`; the HTML report is in `playwright-report/`.

## Run

```powershell
npx playwright test tests/hero --workers=1
```

The read-only CMS test skips when authentication is absent. To include it, supply
`FLEXED_CMS_EMAIL` and `FLEXED_CMS_PASSWORD` locally, or set
`FLEXED_CMS_STORAGE_STATE` to a valid authenticated storage-state path.
Credentials take precedence over storage state; short-lived sessions may need
renewal. Tracing is disabled in the CMS file to avoid recording authentication
requests. Credentials and `.auth/` files remain outside Git and Docker images.

The normal `npm test` command includes both Hero files and the existing
Why FLEXED Works suite. GitHub-source Jenkins runs include new tests after they
are committed and pushed; bundled runs require an image rebuild.
