# Hero requirement research

Research date: October 4, 2026.

Use relevant Jira acceptance criteria and explicit requirement decisions to
establish expected behavior for each manual scenario. Figma supplies supporting
visual evidence; observed CMS/storefront content is a regression snapshot, not
proof that the implementation meets requirements. Record conflicts rather than
silently choosing one source or weakening an assertion.

## Jira access findings

**Resolved:** after reconnecting and restarting, the `Filip QA` connection was
verified as Filip Pestrikov (`filip.pestrikov@sncmuseum.org`). FLXD-118,
FLXD-121, their child-item search, and related Hero tickets are now readable.
The failures below describe the previous connection, authenticated as a
different user, and no longer block research.

The connected Atlassian site is https://snc-ll.atlassian.net. Project discovery
with browse action returns Flexed, key `FLXD`, project ID `10803`.

The following searches returned no visible issues, with no further pages:

- `project = FLXD AND (text ~ "hero" OR text ~ "\"landing page\"") ORDER BY updated DESC`
- `project = FLXD ORDER BY updated DESC`

A site-wide text search for Flexed returned unrelated internal marketing tickets.
A diagnostic request for `FLXD-1` returned HTTP 404 with Jira's message that the
issue does not exist or the account lacks permission to view it. That key was
not supplied by the user and is not known to exist. These results do not prove
that Flexed has no tickets. A known relevant ticket link or corrected issue
access is needed to continue ticket and comment review.

The user subsequently identified [FLXD-118](https://snc-ll.atlassian.net/jira/browse/FLXD-118)
as the parent story, with requirements in its child items. A direct request for
this known story also returned HTTP 404 with Jira's missing-issue-or-permission
message. `parent = FLXD-118 ORDER BY key ASC` returned no visible children.
The parent and child requirements remain unread; no child keys or acceptance
criteria are inferred from those empty results. The connector account needs
access to this story and its children, including any issue-security restrictions.

The user identified [FLXD-121](https://snc-ll.atlassian.net/jira/browse/FLXD-121)
as the Hero ticket. Its direct issue request also returned HTTP 404 with the
same missing-issue-or-permission message. This is the known Hero requirement
reference; its description, acceptance criteria, and comments remain unread.

## Supporting documentation

[Admin documentation, version 9](https://snc-ll.atlassian.net/wiki/spaces/QA/pages/378372099/Admin+documentation),
updated October 1, 2026, broadly describes Hero management as including headline,
subheading, CTA, imagery, and related content. It does not specify whether the
CTA label is editable. Therefore it cannot resolve the apparent conflict with
manual cases 013–015 and the inspected CMS form, which has no CTA-label field.

[Flexed Test Plan, draft v0.1](https://snc-ll.atlassian.net/wiki/spaces/QA/pages/142704641/Test+Plan)
calls for requirement-to-test traceability and clarification of ambiguities. It
contains no concrete Hero acceptance criteria or confirmed viewport minimum.

## Items to resolve from tickets

| Manual cases | Requirement evidence needed |
| --- | --- |
| 003–005, 011 | Approved headline, subheading, three tags, and whether later CMS copy supersedes design defaults. |
| 007–010, 015, 027 | CMS field ownership, validation limits, image/crop rules, publication behavior, and test fixture constraints. |
| 012–016 | Fixed or editable CTA label, approved English/Arabic labels, and any superseding decisions. |
| 017–019, 023 | Create Account modal behavior, single-dialog requirement, close behavior, and touch interaction. |
| 006, 020–022, 024–026, 028 | Supported widths, mobile composition, intentional image overlap/cropping, and applicable design variant. |

## Verified ticket requirements and decisions

[FLXD-118 — Landing Page](https://snc-ll.atlassian.net/browse/FLXD-118) is the
parent epic. It defines a public, unauthenticated landing page and excludes
checkout/payment and authentication flows from that epic's implementation scope.
Its children include FLXD-121 (Hero) and FLXD-122 (Why FLEXED Works).

[FLXD-121 — Hero section](https://snc-ll.atlassian.net/browse/FLXD-121), Closed:

- AC1 requires headline, subheading, three value tags, primary button, and image.
- AC2 identifies headline, subheading, tags, and image as CMS-managed content;
  design copy is default content, not a mandate that later CMS copy stay equal.
- AC3 locks the bilingual primary-button label outside the CMS, with English
  default `Join FLEXED Now`.
- AC4 requires the primary button to open the Create Account modal.
- AC6 requires readable mobile stacking without cut-off text or image overlap.
- AC5 (registration/login switching) and AC7 (missing-image fallback) are struck
  out. Do not silently restore removed requirements to the Hero story.

Comment `76717` (July 22) authorized temporary structured mock data while CMS
was unavailable, moved authentication details to separate work, and described
the image as required. This is a historical implementation phase, not evidence
that the current CMS integration should remain mocked.

[FLXD-287 — Hero section](https://snc-ll.atlassian.net/browse/FLXD-287), Closed,
documents the later CMS/frontend workflow. September 8 comment `86029` lists
English/Arabic content editing, ordered tags, save/reset, images, theme/language
switching, responsive behavior, and long-text checks. It is a QA checklist;
individual proposed defects must be read with the developer's responses.

September 8 developer comment `86083` explicitly resolves these points:

- CTA text and URL are not CMS-editable; it cites FLXD-121's locked label.
- Removing a light/dark image can cause the other image to be used as fallback;
  a theme must not be assumed to have no image solely because its image was
  removed. The comment also explains that an uploaded image is reused by
  default. It does not clearly establish independent EN/AR image configuration.
- Separate mobile/desktop upload controls are not required; the frontend handles
  responsive presentation.

September 10 QA comment `86354` marks CTA editing and separate device uploads
as not bugs. Several other entries have evidence links without explicit pass
labels; do not infer that every listed issue passed because the ticket is closed.

## Related defects and traceability

| Ticket | Status at research | Relation to manual cases |
| --- | --- | --- |
| [FLXD-121](https://snc-ll.atlassian.net/browse/FLXD-121) | Closed | 001–006, 011–018, 020–026, 028: core content, locked CTA, modal trigger, mobile readability. |
| [FLXD-287](https://snc-ll.atlassian.net/browse/FLXD-287) | Closed | 003–010, 014–016, 027–028: CMS/frontend synchronization, editing, image and long-text workflows; locked CTA clarification. |
| [FLXD-340](https://snc-ll.atlassian.net/browse/FLXD-340) | Done | 020, 022, 024, 026: mobile text/chips/model must remain separated without overlap. Relevant regression reference for layout failures. |
| [FLXD-341](https://snc-ll.atlassian.net/browse/FLXD-341) | Closed | 006, 024, 028: model background geometry should match the approved composition; no numeric geometry specified. |
| [FLXD-190](https://snc-ll.atlassian.net/browse/FLXD-190) | Future Improvements | 006, 012, 020–026, 028: Hero typography, chip styling, model proportions/position, mobile CTA text color. Some wording is subjective or conditional; don't invent numeric thresholds. |
| [FLXD-363](https://snc-ll.atlassian.net/browse/FLXD-363) | Future Improvements | Adjacent tablet spacing below Hero; no exact spacing threshold. Outside the current overlap assertions. |

The earlier blanket Confluence description of CTA management is resolved by
FLXD-121 and FLXD-287's explicit locked-CTA decision. CMS copy differing from
Figma defaults alone is not sufficient evidence of a defect. Case 011 still
needs a confirmed default-content fixture and applicable design version. No
ticket reviewed specifies a minimum width or valid text-length limits.

Existing test assertions and previous execution results were not changed by
this research. No Jira issues, comments, CMS records, or source manual cases
were modified. Ticket statuses are historical workflow information, not fresh
verification that staging behavior passes today.
