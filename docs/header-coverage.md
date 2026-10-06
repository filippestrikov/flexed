# Desktop header automation coverage

Source: `Files/Flexed Web - Test Suite.xlsx`, tab **Global header & navigation (des**
(the Excel name is truncated), rows 3–39. All 37 `FLXD-HEAD` scenarios have one
independent JavaScript test in `tests/header.spec.js`.

The preceding **Mobile navigation menu** tab duplicates the Hero tab's cell
values and case IDs. The user selected desktop header coverage on October 5,
2026. Mobile cases have not been inferred from those duplicate rows.

## Requirements and selectors

[FLXD-119](https://snc-ll.atlassian.net/browse/FLXD-119) defines the desktop
header, section destinations, fixed positioning, account triggers, and keyboard
access. Its July 21 comment `76565` updates the navigation text to **Why Flexed
Works?**, directs FAQ to Frequently Asked Questions, and removes Success Stories.
July 22 comment `76714` confirms login is a modal and that authentication itself
is outside the header story. It allows deferring keyboard work if agreed; no
confirmed deferral was found, so keyboard checks remain assertions.

The account-step trigger is checked as the observed Create Your Account dialog,
with Name, Email, and password fields. Tests never submit accounts or payments.
They do not verify later funnel steps or a complete signup workflow.

English labels follow the Jira decisions. Arabic labels are an observed UI
baseline, not an approved design-copy specification. During validation the
Why link changed from `لماذا فليكسد فعّال؟` to `لماذا فلكسد فعّال؟`; the test now
uses the latter, as shown in the staging page snapshots.

Selectors use the navigation landmark, accessible roles with exact names, and
the application anchors `#hero`, `#how-it-works`, `#subscriptions`, `#journeys`,
and `#faq`. The Journeys section heading is identified by its English/Arabic
accessible name to distinguish it from journey-card headings at the same level.
If that CMS title changes legitimately, update that title baseline.

The theme control uses its visible, named label and the nested checkbox type.
The checkbox itself has zero height; the label is the pointer target. Keyboard
tests reach the input with Tab and check its state. Focus assertions accept a
changed outline, ring, border, or background only on an element with measurable
visible bounds. Generated CSS classes, positional selectors, and fixed sleeps
are not used. Each test starts with empty cookies and local storage.

## Case mapping

| Case | Automated checks |
| --- | --- |
| FLXD-HEAD-001 | Successful guest response, route, unique visible header, controls, no authentication dialog. |
| FLXD-HEAD-002 | Logo, four current links, theme label, EN/AR, Log in, Sign Up; no Success Stories. |
| FLXD-HEAD-003 | Visibility, bounds, clipping, pairwise overlap, and single-row alignment at 1024/1280/1440/1920 px. |
| FLXD-HEAD-004 | Fixed position and visible controls at four progressively lower section positions. |
| FLXD-HEAD-005 | Fixed position and visible controls while visiting progressively higher sections. |
| FLXD-HEAD-006 | Every link reaches its section heading fully in the viewport and below the header. |
| FLXD-HEAD-007 | Journeys link, route, unobscured section title, intermediate scroll positions. |
| FLXD-HEAD-008 | Why Flexed Works? link, route, unobscured heading, intermediate scroll positions. |
| FLXD-HEAD-009 | Subscription link, route, unobscured heading, intermediate scroll positions. |
| FLXD-HEAD-010 | FAQ link, route, unobscured heading, intermediate scroll positions. |
| FLXD-HEAD-011 | Four separate scrolling actions record multiple intermediate positions with requestAnimationFrame. |
| FLXD-HEAD-012 | Journeys → FAQ → Subscription → Why Flexed Works?, destination and usable fixed header after each action. |
| FLXD-HEAD-013 | Log in opens one visible login dialog with Email, preserving the language route. |
| FLXD-HEAD-014 | One click, one dialog, one login heading, no additional browser page. |
| FLXD-HEAD-015 | Open login, close with Escape, verify disappearance, navigate again. |
| FLXD-HEAD-016 | Sign Up opens Create Your Account with Name and Email, preserving the route. |
| FLXD-HEAD-017 | Account heading and fields, Confirm Password, initially disabled Continue. |
| FLXD-HEAD-018 | Logo returns from Journeys to scroll position zero and visible Hero heading. |
| FLXD-HEAD-019 | Logo returns from FAQ through intermediate scroll positions to the top. |
| FLXD-HEAD-020 | Logo at top preserves route/top, opens no dialog, produces no observed page error. |
| FLXD-HEAD-021 | Theme changes light ↔ dark, checkbox state changes, header controls remain available. |
| FLXD-HEAD-022 | Both themes retain control bounds/layout and functional navigation/login. |
| FLXD-HEAD-023 | Switch AR then EN; assert route, language, direction, localized controls. |
| FLXD-HEAD-024 | Arabic controls fit an RTL row, navigation and login remain operable. |
| FLXD-HEAD-025 | All four section destinations in Arabic and English after language changes. |
| FLXD-HEAD-026 | Tab reaches logo, visible focus treatment, Enter returns to top. |
| FLXD-HEAD-027 | Tab reaches every section link, visible focus treatment, Enter reaches destination. |
| FLXD-HEAD-028 | Tab reaches theme input, visible focus treatment, Space changes theme/state. |
| FLXD-HEAD-029 | Tab reaches AR, visible focus treatment, Enter changes language. |
| FLXD-HEAD-030 | Tab reaches Log in, visible focus treatment, Enter opens login. |
| FLXD-HEAD-031 | Tab reaches Sign Up, visible focus treatment, Enter opens account dialog. |
| FLXD-HEAD-032 | Successive Tab presses reach controls in observed visual order, including both language choices. |
| FLXD-HEAD-033 | Every section link changes its computed focus appearance. |
| FLXD-HEAD-034 | Theme and both language choices change their computed focus appearance. |
| FLXD-HEAD-035 | Both account buttons change their computed focus appearance. |
| FLXD-HEAD-036 | All focus checks repeat with the fixed header over lower page content. |
| FLXD-HEAD-037 | Keyboard-only operation of all links, logo, theme, both languages, login, and signup triggers. |

## Limits

Geometry and computed-style checks do not establish pixel-perfect design
compliance, font correctness, perceived contrast, or full accessibility. Focus
styling is a measurable regression check; visual contrast against blurred page
content still needs human review. Case 014 checks unique dialog/content, rather
than counting decorative overlays by styling classes. Cases 004/005 sample
scroll positions rather than every frame. Smooth-scroll checks run with normal
motion settings, not reduced-motion preferences. Desktop widths are samples,
not a newly approved minimum-width requirement.

No CMS values are edited. The instruction concerning completed items and an
empty Active-filter list does not apply to a navigation header.

## Run and evidence

```powershell
npx playwright test tests/header.spec.js --workers=1
```

`npm test` and the existing Jenkins pipeline discover this file automatically.
GitHub-source Jenkins needs a commit/push to include local changes; the bundled
image needs a rebuild. Failure screenshots, snapshots, and traces are generated
by the existing configuration. The validation command for this work uses
`--output=test-results/header` to preserve the earlier section's evidence.

## Verified results

Final full header run, October 6, 2026, Windows host, Chromium, Playwright 1.55.1:
**34 passed, 3 failed**, with no skips. The runner exited with code 1.

```powershell
$env:PLAYWRIGHT_HTML_OPEN='never'
npx playwright test tests/header.spec.js --workers=1 --output=test-results/header --reporter=list,html
```

Cases **028, 034, and 036** fail the same theme-focus assertion. Tab reaches
the theme checkbox, and `:focus-visible` is true, but its zero-height input and
visible label do not provide a measurable visible outline, ring, border, or
background change. The failure screenshot was visually inspected. Keyboard
activation itself succeeds in case 037; these failures concern focus visibility.
They remain failing assertions, not skips or expected failures.

Each failed case has `test-failed-1.png`, `error-context.md`, and `trace.zip`
under its case directory in `test-results/header/`. The HTML report is in
`playwright-report/`. These are local, Git-ignored artifacts; this task did not
create a Jira bug or upload evidence.

Earlier diagnostic runs intermittently lacked the Subscription heading while
its navigation link remained present. The final run passes the Subscription
and repeated-navigation checks. The intermittent content observation needs
separate investigation; it is not established as a reproducible header defect.

Test discovery was compared directly with the XLSX: all 37 header IDs occur
exactly once. The complete repository currently discovers **73 tests in four
files**. Only the header suite was executed for this change; the other sections
were not rerun.
