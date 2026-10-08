# Video edit automation coverage

Source: Jira [FLXD-457](https://snc-ll.atlassian.net/browse/FLXD-457) "[ADM] Ability to
edit a video" (epic FLXD-448, Video Library). Acceptance criteria AC1-AC11 are the
only source of expected results; there is no manual-suite tab for this feature yet,
so tests are traced as `FLXD-457 ACn`. When the cases are added to the Flexed Web
test suite, add their manual IDs to the test titles and the table below.

Spec: `tests/video-edit.spec.js` (admin panel, `https://admin-staging.getflexed.app/videos`).
Manual QA of FLXD-457 was done on staging on October 8, 2026; the ticket was closed
with AC10 untested (see below).

## Prerequisites

All values come from the environment. Nothing here is committed to Git.

| Variable | Purpose |
| --- | --- |
| `FLEXED_CMS_EMAIL`, `FLEXED_CMS_PASSWORD` | Admin login (Content Manager or Super Admin). |
| `FLEXED_CMS_STORAGE_STATE` | Alternative: path to an authenticated storage state. Credentials take precedence. |
| `FLEXED_VIDEO_USED_ID` | Id of a Ready video used by at least one exercise. Read-only checks (AC1/2, AC7, AC9). |
| `FLEXED_VIDEO_FIXTURE_ID` | Id of a **dedicated QA video**: Ready, non-empty English title, no tags. Tests that save restore its title/description and remove test tags. |
| `FLEXED_VIDEO_OTHER_ROW_TEXT` | List text (title or file name) of a different video, for the row-switch test (AC8). |

The video id is the `video` query parameter shown after a row is selected. Tests skip
(not pass) when authentication or a fixture variable is missing.

Do not point `FLEXED_VIDEO_FIXTURE_ID` at a video with real content: a video with an
empty English title can never be restored to empty, because AC6 blocks saving it.

## Case mapping

| Case | Automated checks |
| --- | --- |
| AC1/AC2 | Panel opens by deep link with enabled Save video / Cancel, play button, and File name, Length, File size, Used in. |
| AC3 | Type radios, English/Arabic title and description, and the tag input are present and editable. |
| AC3/AC4 | Edit EN/AR title and description, save, reload, values persist. Fixture is restored afterwards. |
| AC4 | Edit the title, reload without saving, the saved value is shown. |
| AC5 | Edit several fields, Cancel, fields return to their saved values in both languages. |
| AC6 | Empty and whitespace-only English title: inline "Give the video an English title.", "wasn't saved" toast, value unchanged after reload. |
| AC7 | Type radios disabled and "N exercise(s) use(s) this video..." message on a used video. |
| AC8 | Edit, click another row: Stay keeps panel, URL and edit; Discard moves to the other video. |
| AC9 | No replace / re-upload / change-file button in the panel. This does not prove there is no file input. |
| AC10 | **Pending:** needs a video in Preparing or Failed transcoding state on staging. No test is written rather than an empty one. |
| AC11 | Add a tag, save, reload; swap it for a second tag, save, reload; only the new tag remains. Tags removed from the fixture afterwards. |

## Known limits

- **Not yet run against staging.** The spec was written after a manual run, with
  locators taken from the live panel markup (labelled inputs, `Type` and `Tags`
  fieldsets, `aria-label` language radios, `Remove <tag>` buttons). It was only
  syntax-checked and listed (10 tests) and confirmed to skip cleanly without
  credentials. Expect to adjust locators on the first real run.
- The save helper waits for a non-GET response whose URL contains `/video`. That is an
  assumption about the API path and may need tightening.
- Tags `qa-auto-a` and `qa-auto-b` are created once and stay in the shared tag list.
- Observed during manual QA, not asserted: the "N exercises use this video" message
  appears about a second after a row is selected; no success message is shown after
  saving; legacy videos with no English title cannot be saved until one is added.
- Only a narrow browser width was checked manually.

## Run

```sh
npx playwright test tests/video-edit.spec.js --workers=1
```
