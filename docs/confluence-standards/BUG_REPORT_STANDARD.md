# Bug Report Standard

Canonical structure for defects reported in Jira. Each project's **Bug
Reporting** page adapts it to the real Jira configuration: issue type name,
available fields, priority values, required labels.

This standard merges three formats that were in use (a "general steps"
template, a "separated steps" template, and a repository-level Jira
instruction). Their intent is preserved: environment and direct link first,
numbered steps, actual vs expected with evidence, and a precise device record.

---

## 1. Rules

- **One defect per issue.** Exception: an agreed *regression report* — one
  issue per automated run listing several defects, each with its own steps —
  when the project's Bug Reporting page says so.
- Search open bugs first; comment on a duplicate instead of filing a new one.
- Steps must reproduce from a clean start: starting URL, role, data.
- Expected result must have a source (acceptance criteria, design, confirmed
  comment, test case ID). Never invent the expected behaviour; if unknown,
  write `Expected: to be confirmed by <PM>` and ask.
- Record the environment actually used. Unknown details are `Not verified`.
- Name account **roles**, never credentials.
- Evidence (screenshot, video, console/network log, test report) is attached
  to the issue, not linked from a personal drive.

## 2. Summary

```text
[BUG] [<Area>] <Short description of the observed defect>
```

- `<Area>` is the module/feature name used in Product Documentation.
- Put the environment in the summary only when the bug is environment-specific:
  `[BUG] [Checkout] [ACC] Payment step shows no methods`.
- Describe the symptom, not the cause: "Cart loses typed quantity on drawer
  close", not "Blur handler missing".

**Project variants.** A project may keep an established variant if its Bug
Reporting page documents it, for example `[BUG] <section>> <description>` or
`[<environment>] <Area> > <Summary>`. Do not mix formats inside one project.

## 3. Description

```text
Environment:        <environment name> – <direct URL or admin path>
Platform / device:  <OS (version) – resolution – browser (version)>, e.g. Windows 11 – 1920×1080 – Chrome 141
Build / version:    <release, commit or "Not verified">
Account role:       <guest / customer type / admin role>
Design:             <Figma frame link, if UI>

Preconditions:
- <state needed before step 1>

Steps to reproduce:
1. <Open URL / screen>
2. <Action>
3. <Action that exposes the defect>

Actual result:
<What happened. Exact error text. Reference the evidence.>

Expected result:
<What should happen> — source: <ticket / test case ID / design / comment>

Reproducibility:    <Always · Intermittent (n of m) · Once>
Severity:           <Blocker · Critical · Major · Minor>
Evidence:           <screenshot / video / log attached>
Related ticket:     <KEY-123>
Also seen on:       <other environments/devices, or "Not checked">
```

When one ticket has several defects that share setup (a test report rather
than a bug), use one numbered block per defect, each with its own steps,
actual, expected and evidence.

## 4. Jira fields

| Field | Rule |
|---|---|
| Issue type | The project's bug type (`Bug`, `Sub-bug`, or sub-task under the story — see Jira Workflow page) |
| Priority | Project's priority values; set from severity unless the PM overrides |
| Severity | Use the field if it exists; otherwise state it in the description |
| Components / labels | As defined on the project's Bug Reporting page |
| Affects version / environment | If the fields exist |
| Linked issue | "relates to" / "is caused by" the story or ticket under test |
| Assignee | Project rule (developer of the story, or unassigned for triage) |

Never add a field that does not exist in the project — check the Bug type's
field metadata first.

## 5. Severity scale

| Severity | Definition | User impact | Examples |
|---|---|---|---|
| **Blocker** | Product or a key function is unusable; further testing of it is impossible | No way to complete the target action | Checkout fails, cannot add to cart, payment broken, site down |
| **Critical** | Core business logic wrong; a workaround exists but is not obvious | Many users frustrated, likely to leave | Search broken, badly broken styles, wrong product images on listing/product pages, CMS blocks broken |
| **Major** | Obvious UI/UX or non-core function issue; easy workaround | Some friction | Text/UI issues, broken content links, usability problems |
| **Minor** | Cosmetic or barely visible; no workaround needed | None worth noting | Typos on secondary pages, small misalignment |

## 6. Bug lifecycle

Map to the project's real statuses on the QA Process page:
New → triaged → in progress → ready for retest → retest passed (closed) or
failed (reopened with a comment and new evidence).

On retest, comment with the environment, build and result — do not edit the
original description.

## 7. Copyable template (Jira wiki / plain text)

```text
Environment:
Platform / device:
Build / version:
Account role:
Design:

Preconditions:
-

Steps to reproduce:
1.
2.
3.

Actual result:

Expected result:
 — source:

Reproducibility:
Severity:
Evidence:
Related ticket:
Also seen on:
```
