---
title: Claude Code OpenTelemetry events now separate auto-mode classifier decisions from permission rules, split cache writes by lifetime, and emit a safety_event for every stopped, prompted or returned tool call
type: tool
status: inbox
evidence: T1
sources:
  - https://github.com/anthropics/claude-code/releases/tag/v2.1.300
  - https://github.com/anthropics/claude-code/releases/tag/v2.1.301
  - https://github.com/anthropics/claude-code/releases/tag/v2.1.307
tags: [claude-code, observability, unattended, evals]
applies_to: [claude-code@2.1.x]
added: 2026-10-16
last_verified: 2026-10-23
verified_by: agent
---

Three Claude Code releases added OpenTelemetry fields that make unattended and auto-mode runs auditable after the fact: which permission decisions came from the auto-mode classifier versus a rule, which built-in rule a block matched, how many cache-write tokens went to the 5-minute versus 1-hour cache, GenAI semantic-convention attributes on trace spans, and since 2.1.307 one `claude_code.safety_event` per tool call that a permission rule, auto mode, a safety check, a hook or the sandbox stopped, prompted or sent back.

## When to use

- You run Claude Code unattended or in auto mode and need to review what it was allowed to do and why.
- You are reconciling cache costs and want to know how much of the cache write was the cheaper 5-minute tier.
- You export traces to a standard OpenTelemetry backend and want vendor-neutral attribute names.

## Facts

v2.1.300:

- `api_request` event gains `cache_creation_5m_tokens` and `cache_creation_1h_tokens`.
- Trace spans gain GenAI semantic-convention attributes such as `gen_ai.provider.name`, `gen_ai.conversation.id`, `gen_ai.tool.name`, `error.type`.
- Bug fixed: a prompt rewritten or dropped by a mod `prompt.submit` hook was still recorded as typed in the `user_prompt` event.

v2.1.301:

- `tool_decision` event gains `classifier_verdict` and `permission_mode`, so classifier decisions can be told apart from permission rules.
- `tool_decision` gains `classifier_category`, naming the built-in rule a classifier block matched, only when `OTEL_LOG_TOOL_DETAILS=1`.

v2.1.307:

- New event `claude_code.safety_event`, emitted for each tool call that a permission rule, auto mode, a safety check, a hook or the sandbox stopped, prompted or sent back. This is the single stream to read after an unattended run to see every intervention, including refusals a mod made with `decider: "person"` (see [unattended runs no longer stall](claude-code-unattended-runs-no-longer-stall-on-prompts-nobody-can-answer.md)).

## Evidence

All three release notes list the fields or event by name. The behaviour was not observed directly in this run; the tier is T1 because the changelog is the first-party source.

## Open questions

- Which OpenTelemetry semantic-convention version the attribute names follow is not stated.
- Whether `classifier_category` values are documented anywhere beyond the event stream.
- The attributes carried by `safety_event` (which layer intervened, which rule, the outcome) are not listed in the changelog.
