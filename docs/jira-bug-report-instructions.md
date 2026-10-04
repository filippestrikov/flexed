# Jira bug report instructions

Use this structure for future bug reports in the Flexed Jira project (`FLXD`).

- Report one defect per issue.
- Set the Jira summary to `[BUG] {section}> {section_description}`. Replace
  `{section}` with the affected area and `{section_description}` with a concise
  description of the observed defect.
- Use the template below for the Jira description, keeping its section order.
- Write numbered reproduction steps with the starting URL, relevant
  preconditions, and the actions needed to reproduce the defect.
- Describe what actually happened in **Actual Result**. Include available
  screenshots, recordings, error messages, or Playwright/Jenkins evidence here.
- Describe the required behavior in **Expected Result**, based on the manual
  test case, confirmed CMS content, or approved design. Identify the source and
  test case ID when available; do not invent an expectation.
- Record the environment actually used. Mark unknown details as `Not verified`.
  Include account roles rather than credentials.

## Copyable template

```text
Bug Report

Need to fix:

- [BUG] {section}> {section_description}

Steps to reproduce:

1. {Starting URL and relevant preconditions}
2. {Action}
3. {Action that exposes the defect}

Actual Result:

{Observed behavior and available evidence}

Expected Result:

{Required behavior and its source or manual test case ID}

Test Environments:

- Environment / URL: {Actual environment and URL}
- Browser / version: {Browser and version used}
- OS / version: {Operating system and version used}
- Device / viewport: {Device or viewport dimensions used}
- Account role: {Guest or authenticated role}
- Build / commit: {Version tested, if known; otherwise Not verified}
```
