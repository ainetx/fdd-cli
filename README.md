# FDD CLI

Command-line tool for Feature-Driven Development (FDD) methodology workflows.

## Status

**Version**: 0.1.0  
**Architecture**: DRAFT (awaiting validation)  
**Features**: 🔄 IN PROGRESS (1/8 features started)

### Current Progress

- ✅ TypeScript project foundation complete
- 🔄 feature-init: setup-typescript-project completed (2026-01-03)
- ⏳ 7 features pending implementation

## Installation

```bash
# Install dependencies
npm install

# Build
npm run build

# Run CLI
node dist/index.js --help
```

## Quick Start

```bash
# Check version
fdd --version

# Show help
fdd --help
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
