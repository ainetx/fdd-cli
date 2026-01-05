# OpenSpec Project Conventions: FDD CLI Tool

This document defines project-specific conventions for creating OpenSpec changes and specifications.

**Read this before creating any changes or specs.**

---

## Project Overview

**System**: FDD CLI Tool

**Architecture**: CLI tool

**Technology Stack**:
- Domain Model: GTS (Global Type System) + JSON Schema
- API Contracts: CLISPEC

---

## Naming Conventions

Use verb-led kebab-case for changes (add-, update-, fix-), descriptive kebab-case for spec names

### Change ID Format

Use verb-led kebab-case for change IDs:
- `add-*` - New features or capabilities
- `update-*` - Modifications to existing features
- `fix-*` - Bug fixes (use only for bugs, not enhancements)
- `refactor-*` - Code restructuring without behavior changes
- `remove-*` - Deprecation or removal

**Examples**:
- `add-user-authentication`
- `update-payment-validation`
- `fix-session-timeout`

### Spec Naming

Use descriptive kebab-case for spec names:
- Format: `fdd-{project-slug}-feature-{feature-slug}`
- Keep names concise but clear
- Match feature names from `architecture/features/`

---

## Code Standards

Follow Node.js best practices with ESLint. Use modern JavaScript patterns (async/await, destructuring). All GTS identifiers must be lowercase with underscores. CLI commands follow docopt conventions. Maintain clear separation between CLI layer, business logic, and FDD workflows.

### Required Practices

- Follow language-specific style guides
- Use consistent formatting (automated formatters preferred)
- Document public APIs and complex logic
- Avoid anti-patterns specific to this project

---

## Testing Requirements

Unit tests for business logic and workflow validation. Integration tests for CLI command execution. GTS schema validation tests. OpenSpec workflow end-to-end tests.

### Coverage Expectations

- Unit tests: Test business logic and algorithms
- Integration tests: Test API endpoints and external integrations
- Contract tests: Verify external service contracts
- Performance tests: Benchmark critical paths (if applicable)

### Test Documentation

- Include test scenarios in Feature DESIGN.md Section F
- Reference test scenarios in OpenSpec change specs
- Keep tests maintainable and readable

---

## Deployment Context

Published as npm package. Local CLI installation via npm install -g. Development workflow uses npm link for local testing. CI validates all changes before merge.

### Environments

- Development: Local and CI
- Staging: Pre-production validation
- Production: Live environment

### CI/CD Pipeline

- All changes must pass automated tests
- Changes require review before merge
- Deployments follow project deployment strategy

---

## Change Proposal Guidelines

### When to Create a Proposal

Create OpenSpec change proposal for:
- New features or capabilities
- Breaking changes (API, schema, contracts)
- Architecture or pattern changes
- Performance optimizations that change behavior
- Security pattern updates

### When to Skip Proposal

Skip proposal for:
- Bug fixes (restore intended behavior)
- Typos, formatting, comments
- Dependency updates (non-breaking)
- Configuration changes
- Tests for existing behavior

### Proposal Structure

Every change must include:
1. **proposal.md** - Why, what changes, impact
2. **tasks.md** - Implementation checklist
3. **specs/{spec-name}/spec.md** - Delta specifications (ADDED/MODIFIED/REMOVED)
4. **design.md** (optional) - Technical decisions if complexity requires

---

## Spec Writing Guidelines

### Requirement Format

- Use `SHALL` or `MUST` for normative requirements
- Every requirement needs at least one `#### Scenario:`
- Use `**WHEN**` and `**THEN**` in scenarios
- Keep requirements atomic and testable

### Delta Operations

- `## ADDED Requirements` - New capabilities
- `## MODIFIED Requirements` - Changed behavior (include full requirement)
- `## REMOVED Requirements` - Deprecated features (with reason and migration)
- `## RENAMED Requirements` - Name changes only

---

## Integration with FDD

### Feature Design Alignment

- OpenSpec specs derive from Feature DESIGN.md Section G (Requirements)
- OpenSpec changes implement Feature DESIGN.md Section H (Implementation Plan)
- Always maintain traceability: Requirement → Change → Code

### Validation Workflow

1. Create change → `openspec validate {change-id} --strict`
2. Implement change → Follow tasks.md checklist
3. Complete change → `openspec archive {change-id} -y`
4. Validate structure → `openspec validate --all --no-interactive`

---

**Document Status**: Project conventions defined

**Last Updated**: 2026-01-05
