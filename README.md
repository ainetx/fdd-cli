# FDD CLI

Command-line tool for Feature-Driven Development (FDD) methodology workflows.

## Status

**Architecture**: DRAFT (awaiting validation)  
**Features**: Not initialized

## Quick Start

```bash
# Validate Overall Design (requires ≥90/100)
fdd validate-architecture

# After validation passes, initialize features
fdd init-features

# Create and validate individual features
fdd init-feature <slug>
fdd validate-feature <slug>
```

## Structure

- `architecture/` - FDD designs and specifications
  - `DESIGN.md` - Overall Design (system architecture)
  - `cli-specs/` - CLI API specifications (CLISPEC format)
  - `domain-model/schemas/` - GTS domain model schemas
  - `features/` - Feature designs
- `spec/` - Specifications
  - `FDD/` - FDD methodology (submodule)
  - `GTS/` - Global Type System spec (submodule)
  - `fdd-cli-adapter/` - Project-specific FDD adapter

## Next Steps

1. Review and complete `architecture/DESIGN.md`
2. Run `fdd validate-architecture` (target: ≥90/100)
3. Generate features with `fdd init-features`

## Documentation

- **FDD Methodology**: `spec/FDD/AGENTS.md`
- **FDD Adapter**: `spec/fdd-cli-adapter/AGENTS.md`
- **GTS Specification**: `spec/GTS/README.md`
- **Workflows**: `spec/FDD/workflows/`
