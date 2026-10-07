# Release Documentation Template

Templates for the **Releases** page (CORE) and its CONDITIONAL children.

Release *contents* come from Jira (fix versions or the release ticket). The
Releases page documents the *process*, not the list of tickets.

---

## 1. Verification stages

The standard distinguishes four stages. A project may merge stages, but must
state which ones it uses.

| Stage | Where | Goal | Checklist |
|---|---|---|---|
| **Staging verification** | test / acceptance environment | each ticket passes QA | ticket QA + critical path for major changes |
| **Release candidate verification** | the environment that mirrors production (often acceptance) with the exact release build | the release as a whole works together | critical path + release regression scope |
| **Production smoke** | production, immediately after deploy | deploy succeeded, critical paths work | smoke checklist, within the agreed time window |
| **Post-release verification** | production, hours–days after | no delayed failures (jobs, integrations, emails, analytics) | post-release checks |

Production checks obey the production rule on the Environments page (for
example "checkout up to the last step only").

---

## 2. Releases page (CORE)

> **Purpose** how a change gets to production safely, and what to do when it goes wrong ·
> **Required data** cadence, who deploys, deployment method, freeze rules, checklists, rollback/escalation ·
> **Sources** CI/CD config, deployment tickets and their comments, technical owner, Environments ·
> **Validation** deployment method matches the pipeline config; rollback contact is a current team member ·
> **Update** process change; quarterly

```markdown
## Release process
| Cadence | <per sprint · on demand · scheduled date> |
|---|---|
| Release contents | Jira: <fix version report link / release ticket convention> |
| Who approves | <role> |
| Who deploys | <role> |
| How | <pipeline link; branch → environment> |
| Downtime / maintenance mode | <yes/no; client notification rule> |
| Content not in the release | <e.g. CMS content set up manually on production> |

Steps:
1. Scope fixed in Jira (<fix version / release ticket>)
2. Release candidate built and deployed to <environment>
3. Release candidate verification (checklist below)
4. Go/no-go by <role>
5. Deploy to production (<window>)
6. Production smoke within <time> — result as Jira comment
7. Post-release verification after <time>
8. Release closed in Jira; release notes published (<where>)

## Release checklist
- [ ] All tickets in the release passed QA (<filter>)
- [ ] No open Blocker/Critical bugs in scope (<filter>)
- [ ] Critical-path checklist passed on <RC environment>
- [ ] Config / migrations / manual steps listed: <link>
- [ ] Rollback plan confirmed
- [ ] Client informed (if required)

## Regression checklist
Link: Regression page (critical path + release scope).

## Production verification
| # | Check | Expected | Rule |
|---|---|---|---|
| 1 | <critical function> | | <read-only / limited> |

Record:

    Production smoke – <release> – <YYYY-MM-DD HH:MM>
    1 <check>: pass / fail
    …
    Notes:

## Post-release verification
- [ ] Background jobs / queues running (<how to check>)
- [ ] Integrations exchanging data (<which>)
- [ ] Transactional emails sent
- [ ] Error monitoring shows no new spikes (<link>)
- [ ] Analytics events arriving (<link>)

## Rollback and escalation
| Situation | Action | Who decides | Contact |
|---|---|---|---|
| Critical-path failure on production | hotfix or rollback | <role> | <channel> |
| Deploy failed | <rollback procedure link> | <role> | |

## Known issues
Link: Known Issues page (live Jira filter). Known issues accepted for this
release are listed in the release ticket.
```

---

## 3. Release Notes (CONDITIONAL — only if Jira fix versions are not used)

If fix versions exist, link the version report instead of keeping this page.

```markdown
| Date | Release ticket | Included tickets (JQL) | Notes (hotfixes, issues found) |
|---|---|---|---|
| <YYYY-MM-DD> | <KEY-n> | `project = <KEY> AND resolutiondate >= "<last release>" AND resolutiondate <= "<this release>"` | |
```

Add a row when a release ticket is closed.

---

## 4. App Store Release (CONDITIONAL — App Store / Google Play)

```markdown
| Store | App ID / listing | Track(s) | Who submits | Review lead time |
|---|---|---|---|---|
| App Store | <link> | TestFlight → production | | |
| Google Play | <link> | internal → closed → production | | |

## Release steps
1. Version and build number set (<convention>)
2. Build distributed to testers (<TestFlight / internal track>)
3. RC verification on the device matrix
4. Store metadata, screenshots, privacy details checked
5. Submit; phased rollout <yes/no, %>
6. Post-release: crash-free rate, reviews, analytics (<links>)

## Rollback
<Halt phased rollout · expedited fix · server-side feature flag>
```
