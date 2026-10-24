---
title: api-and-interface-design says accepting an Idempotency-Key is the contract and honouring it is the implementation; derive the key from the intent not the attempt, claim it with a unique-constraint insert, reject a reused key with a different payload (422), give in-flight duplicates 409 or a bounded wait or 202, record intent before calling out, and retain keys longer than the longest replay path
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/addyosmani/agent-skills/blob/main/skills/api-and-interface-design/SKILL.md
tags: [agent-skills, api-design, idempotency, retries, distributed-systems, review]
applies_to: [agent-skills@0.6.13]
added: 2026-10-24
last_verified: 2026-10-24
verified_by: agent
---

A server that accepts an idempotency key but handles it carelessly is worse than one with no key, because the client now believes retrying is safe. The skill's section on honouring the key is a six-rule implementation contract concrete enough to use as a review checklist for any endpoint with side effects (charges, sends, provisioning).

## When to use

- Reviewing or writing any handler that performs a non-reversible side effect and is reachable by a retrying client, queue consumer or scheduler.
- Reviewing a claim that a queue "guarantees exactly-once"; the skill's position is that no queue does across a consumer crash, so design for at-least-once plus idempotent processing.

## Procedure

1. Key from the intent, stable across retries of one intent and different across distinct intents. The client generates it once and reuses it on retry, or it derives from an immutable identifier (`charge:v1:<orderId>`). Wrong: a per-attempt UUID (every retry is a new charge), `userId:amount` (two legitimate identical charges collapse), `orderId:timestamp` (a UUID in disguise). The key never comes from the layer doing the retrying.
2. Claim atomically. Check-then-insert is a time-of-check to time-of-use race: two concurrent retries both read "not seen" and both charge. Insert `{key, state: in_progress, requestHash}` and let the unique constraint pick the winner; on a unique violation, replay the stored response or reject. A store that cannot enforce uniqueness in one operation cannot back this.
3. Guard the payload. Store a hash of the request body with the key; the same key with a different body is a client bug and returns 422 rather than the first response.
4. Decide what an in-flight duplicate gets, since under retry storms the first request is still running when the second arrives: reject with 409 (simplest, safest, client retries later), wait bounded for the result (caller needs it synchronously), or return 202 with a status URL (long-running effects). Never let the second caller through because the first "seems stuck"; an attempt whose fate is unknown is when duplicating costs most.
5. Three outcomes, not two: success, failure, unknown. A timeout says nothing about whether the effect applied. Record the intent before calling out so a crash between call and response leaves evidence that something must be resolved, rather than a silently retried charge.
6. Retention from the longest retry chain, not disk cost. Keys must outlive every path that can redeliver the intent, including a dead-letter queue replayed a week later and provider dispute windows. A 24-hour key TTL behind a 7-day DLQ is a duplicate waiting to happen.

Rationalizations the skill rebuts: "accepting the header is enough" (the header is the contract, storing the key against the result is the implementation); "duplicates are rare" (they are correlated; retries spike exactly when a dependency is degraded).

## Evidence

Read from the skill. The rules are standard distributed-systems practice stated as a checklist; the skill cites no source and reports no incident data. The rest of the skill (contract-first design, one error shape with a status map, Hyrum's Law, the One-Version Rule, additive-only field changes, pagination on every list) is generic and not recorded here.

## Open questions

- The contract covers a single store with a unique constraint; multi-region or eventually consistent stores need a different claim mechanism the skill does not address.
