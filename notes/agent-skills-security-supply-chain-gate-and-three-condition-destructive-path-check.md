---
title: security-and-hardening says trust follows who wrote a value not the channel, requires three conditions before any delete, move or overwrite on a derived path (resolved target under an allowlisted root, at least one level below it, ownership evidence read first), blocks dependency install scripts before first execution, and audits against the committed lockfile with reachability triage and never a forced fix
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/addyosmani/agent-skills/blob/main/skills/security-and-hardening/SKILL.md
  - https://genai.owasp.org/llm-top-10/
tags: [agent-skills, security, supply-chain, prompt-injection, owasp, destructive-operations]
applies_to: [agent-skills@0.6.13]
added: 2026-10-24
last_verified: 2026-10-24
verified_by: agent
---

Beyond the standard OWASP material, the skill carries three rules aimed at agents specifically: a trust rule (another process's command line, an LLM's output, or a filename on a shared volume is as attacker-controlled as a form field), a three-part gate on destructive filesystem operations whose target came from data, and a supply-chain procedure that treats install scripts and advisories-only audits as the weak points.

## When to use

- An agent is about to delete, move or overwrite a path it derived from a payload, a config value, argv or env. A shape check on the path proves well-formedness, not authorization.
- Bootstrapping or upgrading dependencies in an agent-driven repo. Relevant to this repo's `docs/security.md`, which covers the fetch side but not the install side.

## Procedure

Destructive paths: before the call, require all three: the resolved target (symlinks resolved) is under an allowlisted root; it is at least one level below that root; it carries ownership evidence read before the operation. On refusal, log the rejected target and stop; never fall back to a broader default path. The skill's own references note the check is weaker than it reads (marker self-attestation, check-then-use races).

Supply chain: find the single lockfile and package manager and stop on competing lockfiles; block dependency scripts before first execution (bootstrap with scripts disabled or a fail-closed policy, inspect pending script source, approve the minimum, commit the policy, verify with a clean frozen install; never blanket-approve); run the native audit against the committed lockfile before every release, triaging critical and high by reachability (runtime, build, test, deploy paths) and fix availability; never run forced remediation (`npm audit fix --force`) automatically; document deferrals with a review date. Audits match known advisories only, so review new dependencies, lockfile diffs and script-policy changes together (ownership, maintenance, release age, provenance, transitive graph) and verify registry signatures (`npm audit signatures`, `pnpm audit signatures`), treating absence as a reason to look, not proof of compromise.

Other thresholds carried: bcrypt 12 rounds or more; auth rate limit about 10 attempts per 15 minutes backed by a shared store once more than one process serves; CSP starting at `default-src 'self'`; SSRF defence by scheme and host allowlist, resolving all DNS records and rejecting private and link-local ranges, no redirects, IP pinning on high-risk surfaces. Secrets that reach a remote are compromised on landing: rotate first, then purge history. LLM section mapped to OWASP LLM Top 10 (2025): model output is untrusted (LLM05), the system prompt is not a security boundary and permissions live in code (LLM01), keep secrets and other tenants' data out of context (LLM02, LLM07), validate every tool argument and confirm destructive actions (LLM06), cap tokens, rate and recursion (LLM10), partition RAG embeddings per tenant (LLM08).

## Evidence

Read from the skill; the OWASP LLM Top 10 URL is the one primary source it links, not re-read for this note. The retrofit-cost figures ("10x harder") are assertions. The three-condition path gate is a design with a stated weakness, not an evaluated control.

## Open questions

- This repo's deny list blocks package installers for the agent but does not state an install-script policy for `pnpm install` run by a human; the lockfile is committed. Worth a line in `docs/security.md`.
