# Init - Feature Design

**Status**: ⏳ NOT_STARTED  
**Module**: fdd-cli

---

## A. Feature Context

### Overview

Create minimal CLI project structure. This establishes the compilable TypeScript/Node.js skeleton for implementing validation and structure generation features.

**Critical Scope Constraint**: Init creates **structure only**, NO business logic.

### Purpose

Initialize the project with:
- Empty compilable TypeScript structure
- Node.js CLI framework integration (e.g., commander.js or yargs)
- Build tooling (tsup for bundling)
- Package configuration ready for features

### Actors

- **Developer/Architect**: Creates project structure
- **AI Agent**: Uses initialized structure to implement features

### References

- Overall Design: [`@/architecture/DESIGN.md`](../../DESIGN.md)
- Domain Model: [`@/gts/`](../../../gts/)
- API Contracts: [`@/spec/CLI/commands.clispec`](../../../spec/CLI/commands.clispec)

### What Init IS vs IS NOT

**Init creates** (✅):
- Project structure (src/, dist/, etc.)
- TypeScript configuration
- Build configuration (tsup)
- Package.json with dependencies
- CLI entry point skeleton
- Empty command structure

**Init does NOT create** (❌):
- Business logic (validation, generation)
- Command implementations
- Domain model parsing
- Any feature-specific code

---

## B. Actor Flows

*Intentionally minimal for init.*

**Developer** runs init → creates skeleton → verifies compilation → confirms structure is ready for feature implementation.

---

## C. Algorithms

*Intentionally minimal for init.*

Init is purely structural. See implementation for file generation details.

---

## D. States

*Not applicable* (structural feature only)

---

## E. Technical Details

### Structure Created

```
fdd-cli/
├── src/
│   ├── index.ts          # CLI entry point
│   ├── cli.ts            # Command registration
│   ├── commands/         # Command handlers (empty)
│   ├── validators/       # Validators (empty)
│   ├── generators/       # Generators (empty)
│   └── types/            # Type exports
├── dist/                 # Build output
├── tsconfig.json         # TypeScript config
├── tsup.config.ts        # Build config
├── package.json          # Dependencies
└── README.md             # Basic usage
```

### Dependencies

**Production**:
- CLI framework (commander.js or yargs)
- File system utilities (fs-extra)

**Development**:
- TypeScript
- tsup (bundler)
- @types/node

### Configuration

- **TypeScript**: Target ES2020+, module: ESM or CommonJS
- **Build**: Single executable bundle via tsup
- **Entry**: `src/index.ts` → `dist/index.js`

---

## F. Validation & Implementation

### Testing

1. **Compilation Test**: Verify TypeScript compiles without errors
2. **CLI Test**: Verify CLI entry point can be invoked (`fdd --help`)
3. **Structure Test**: Verify all directories exist

### Implementation Plan

**OpenSpec Changes**:

1. **001-setup-typescript-project**
   - Create package.json with dependencies
   - Add TypeScript configuration
   - Add tsup build configuration
   - Create directory structure

2. **002-cli-entry-point**
   - Create src/index.ts with CLI framework
   - Register placeholder commands
   - Add help and version commands
   - Test compilation

**Success Criteria**:
- `npm run build` succeeds
- `node dist/index.js --help` displays help
- `node dist/index.js --version` displays version
- All directories created and empty

---
