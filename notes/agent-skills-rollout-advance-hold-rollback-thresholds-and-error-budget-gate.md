---
title: shipping-and-launch replaces rollout judgement with a numeric table (advance within 10% of baseline error rate and 20% latency, hold at up to 2x errors or 50% latency or new client errors under 0.1% of sessions, roll back beyond) plus an error-budget gate (over 20% remaining ship normally, 0 to 20% slow rollouts only, exhausted freeze features) where a high burn rate during a canary is a hold even when every threshold is green
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/addyosmani/agent-skills/blob/main/skills/shipping-and-launch/SKILL.md
tags: [agent-skills, deploy, rollout, feature-flags, slo, error-budget, rollback]
applies_to: [agent-skills@0.6.13]
added: 2026-10-24
last_verified: 2026-10-24
verified_by: agent
---

The skill's distinctive content is two decision tables that an agent or an on-call human can apply without taste: per-stage advance, hold or roll back thresholds against the pre-rollout baseline, and an error-budget release gate. Everything else (pre-launch checklist, first-hour checks, rollback plan template) is standard and is in the skill for completeness.

## When to use

- Deciding at each canary stage whether to widen exposure. The thresholds are defaults to copy into a rollout plan and tune per service, not measured optima.
- Deciding whether to ship at all this week: read the error budget first.

## Procedure

Rollout stages: flag OFF in production, team-only enable with a 24-hour watch, 5% canary for 24 to 48 hours, then 25%, 50%, 100% with the same monitoring at each step and the ability to drop back a stage, then one week of monitoring and flag cleanup.

Decision thresholds at each stage, compared with baseline:

| Metric | Advance | Hold and investigate | Roll back |
| --- | --- | --- | --- |
| Error rate | within 10% of baseline | 10 to 100% above | over 2x baseline |
| P95 latency | within 20% | 20 to 50% above | over 50% above |
| Client JS errors | no new error types | new errors under 0.1% of sessions | new errors over 0.1% of sessions |
| Business metrics | neutral or positive | decline under 5% (may be noise) | decline over 5% |

Immediate rollback regardless of stage: error rate over 2x, P95 over 50% up, a spike in user reports, data integrity issues, a discovered security vulnerability.

Error-budget gate (the fraction of requests or time the SLO allows to fail): over 20% remaining, ship normally and monitor; 0 to 20%, slow rollouts only and no high-risk changes; exhausted, freeze feature work for reliability; on reset, resume and bake in the fix that recovered it. A high burn rate during a canary (budget consumed faster than baseline pace) is a hold signal even when the table above is green. The rationalization "the error rate looks fine, let's keep shipping" is rebutted with: check the burn rate, not the current rate.

Rollback plan template, required before any GO: trigger conditions, steps (disable flag, or revert and redeploy), verification, communication, database considerations (the migration's verified down path, what happens to data the feature wrote), and time targets: flag under 1 minute, redeploy under 5 minutes, database rollback under 15 minutes. The `/ship` command makes the plan mandatory before a GO verdict; see [the orchestration note](agent-skills-personas-do-not-invoke-personas-ship-fans-out-and-merges.md).

## Evidence

Read from the skill. The thresholds and budget bands are prescribed defaults with no derivation or incident data; the error-budget mechanism is SRE practice the skill does not cite. The expand/contract rule for the database half of a rollback is in [the schema migration note](agent-skills-expand-contract-schema-change-in-five-deploys-never-rename-in-place.md).

## Open questions

- The business-metric row needs a defined set of metrics and a noise floor per service; "decline under 5% may be noise" assumes traffic large enough that 5% is above variance.
