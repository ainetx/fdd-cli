# Overall Design: fdd-cli

## A. Business Context

### System Vision

This is a helper tool integrated into all FDD workflows to automate routine operations for AI agents. It generates folder structures, validates files, adapters, overall and feature designs, and manifests. The tool eliminates the need for agents to write and execute code or consume excessive LLM resources. Primarily designed for automated agent workflows rather than manual execution.

### Core Capabilities

- **Project structure generation and initialization**: Creates FDD-compliant directory hierarchies and initial files for new projects
- **FDD adapter validation and verification**: Ensures adapter files are correctly structured and contain all required information
- **Overall Design (architecture) validation**: Validates architecture documents against FDD requirements, scoring ≥90/100
- **Feature Design validation**: Validates feature designs for completeness and correctness, requiring 100/100 score with 100% completeness
- **FEATURES.md manifest validation**: Verifies feature manifest structure, dependencies, and consistency
- **File structure and format validation**: Enforces FDD hierarchy and file format requirements strictly
- **Automated workflow execution support for AI agents**: Provides structured JSON output and deterministic operations for agent consumption

### Actors

- **AI Agent**: Primary user who executes FDD workflows automatically, uses CLI commands for validation, structure generation, and routine operations without writing custom code
- **Architect**: Designs system architecture, validates Overall Design documents, ensures architectural consistency across features
- **QA Engineer**: Validates design documents, verifies file structure compliance, ensures FDD methodology adherence
- **Developer**: Implements features based on validated designs, uses CLI to generate boilerplate structures and validate their work
- **Product Manager**: Reviews feature designs and manifests, tracks feature progress and dependencies
- **Project Manager**: Monitors project structure, validates manifests, ensures all design artifacts are properly tracked

## B. Requirements & Principles

### Use Cases

Primary use cases derived from actors and capabilities:

**AI Agent**:
- AI Agent can automatically validate adapter configuration before running workflows
- AI Agent can generate project structure without writing custom scripts
- AI Agent can validate design documents and receive structured feedback

**Architect**:
- Architect can validate overall architecture design for completeness
- Architect can ensure domain model and API contracts are properly defined
- Architect can verify architectural consistency across multiple features

**QA Engineer**:
- QA Engineer can validate file structure compliance with FDD standards
- QA Engineer can verify design document quality and completeness
- QA Engineer can check feature manifest consistency

**Developer**:
- Developer can generate feature scaffolding automatically
- Developer can validate their design work before implementation
- Developer can verify their code matches the design specifications

**Product Manager**:
- Product Manager can review feature manifests for completeness
- Product Manager can track feature dependencies and progress
- Product Manager can validate that features align with capabilities

**Project Manager**:
- Project Manager can validate project structure integrity
- Project Manager can ensure all design artifacts are tracked
- Project Manager can monitor overall project health

**Note**: Detailed actor flows will be designed in Feature Design documents.

### Business Rules

- All validation must be deterministic and produce consistent results regardless of execution environment
- CLI commands must return structured JSON output for easy parsing by AI agents
- File structure validation must enforce FDD hierarchy strictly (no deviations allowed)
- Overall Design must score ≥90/100 before feature generation is allowed
- Feature Design must score 100/100 with 100% completeness before implementation begins
- All operations must be idempotent (running the same command multiple times produces the same result)

### Design Principles

- **Separation of Concerns**: Clear separation between domain model, API contracts, and implementation
- **Design First**: All features designed before implementation
- **Type Safety**: Strong typing through domain model
- **Traceability**: All code traceable to design decisions
- **Automation First**: Built primarily for AI agent consumption, not manual use
- **Deterministic Operations**: All validations produce consistent, reproducible results

## C. Technical Architecture

### Architecture Overview

**Style**: CLI tool

Command-line interface following CLI design patterns and docopt.org conventions. Built with Node.js for cross-platform compatibility. Designed to be invoked programmatically by AI agents within FDD workflows.

**Key Components**:
- Domain Model: Types and business logic (GTS - Global Type System + JSON Schema)
- API Layer: CLISPEC contracts
- Implementation: Following FDD workflows

### Domain Model

**Technology**: GTS (Global Type System) + JSON Schema

**Location**: `gts/`

**Specification**: See adapter for DML syntax and validation rules. Refer to `spec/GTS/README.md` for complete type reference syntax.

**Types**:

Core domain types for FDD CLI operations:

- **ValidationResult** (`gts.ainetx.fdd-cli.validation.validation_result.v1`): Result of validation operation with score, status, and list of issues. Used by all validation commands to return structured feedback.

- **ValidationIssue** (`gts.ainetx.fdd-cli.validation.validation_issue.v1`): Individual validation problem with severity (error/warning/info), error code, message, location, and suggested fix.

- **ProjectStructure** (`gts.ainetx.fdd-cli.project.project_structure.v1`): Representation of FDD project directory structure including paths to architecture/, features/, diagrams/, domain model, and API contracts directories.

- **AdapterConfig** (`gts.ainetx.fdd-cli.adapter.adapter_config.v1`): FDD adapter configuration defining domain model technology, API contract format, locations, and project-specific conventions.

- **DesignDocument** (`gts.ainetx.fdd-cli.design.design_document.v1`): Parsed representation of Overall or Feature design document with sections content and metadata.

- **FeatureManifest** (`gts.ainetx.fdd-cli.features.feature_manifest.v1`): FEATURES.md manifest structure tracking project name, status, and list of all features.

- **Feature** (`gts.ainetx.fdd-cli.features.feature.v1`): Individual feature entry with slug, name, status (NOT_STARTED/IN_PROGRESS/IMPLEMENTED), design path, and dependencies.

All type definitions are located in `gts/*.schema.json` following GTS specification format.

**Linking**: Use GTS reference format: `gts://gts.ainetx.fdd-cli.<namespace>.<type>.v<version>` in JSON Schema $ref fields. See `spec/GTS/README.md` for complete reference syntax.

### API Contracts

**Technology**: CLISPEC

**Location**: `spec/CLI`

**Specification**: See adapter for API format and validation rules. Refer to `spec/FDD/CLISPEC.md` for complete command specification format.

**Endpoints** (CLI Commands):

**Validation Commands**:
- `fdd-cli validate adapter <path>` - Validate FDD adapter configuration
  - Input: Path to adapter directory (e.g., `spec/FDD-Adapter`)
  - Output: ValidationResult with score and issues list
  - Returns: Exit code 0 (valid), 1 (invalid)
  
- `fdd-cli validate architecture <path>` - Validate Overall Design document
  - Input: Path to architecture directory or DESIGN.md file
  - Output: ValidationResult (requires ≥90/100 to pass)
  - Returns: Detailed validation report with score and blocking issues
  
- `fdd-cli validate feature <path>` - Validate Feature Design document
  - Input: Path to feature directory or DESIGN.md file
  - Output: ValidationResult (requires 100/100 + 100% completeness)
  - Returns: Comprehensive validation with completeness check
  
- `fdd-cli validate manifest <path>` - Validate FEATURES.md manifest
  - Input: Path to FEATURES.md file
  - Output: ValidationResult with dependency cycle detection
  - Returns: Manifest consistency report

**Structure Commands**:
- `fdd-cli init [path]` - Initialize FDD project structure
  - Input: Optional target directory (defaults to current)
  - Output: ProjectStructure with created paths
  - Creates: architecture/, features/, diagrams/, domain model, API contracts directories
  
- `fdd-cli generate structure <design-path>` - Generate folder structure from design
  - Input: Path to Overall Design or Feature Design
  - Output: ProjectStructure with generated directories
  - Reads: Design document to determine required structure

**Utility Commands**:
- `fdd-cli --version` - Display CLI version information
- `fdd-cli --help` - Display general help
- `fdd-cli <command> --help` - Display command-specific help

**Global Flags** (available for all commands):
- `--json` - Output in JSON format (for AI agent consumption)
- `--verbose` - Detailed output for debugging
- `--quiet` - Minimal output (errors only)
- `--color / --no-color` - Enable/disable colored output

**Output Format**:
All validation commands return ValidationResult type in JSON when --json flag is used.
Human-readable format is default for terminal usage.

All commands follow docopt.org conventions. Full specifications in `spec/CLI/commands.clispec`.

### Security Model

No security - local CLI tool without network security requirements

### Non-Functional Requirements

- **Technology Stack**: Node.js with modern patterns and technologies
- **CLI Design**: Follow docopt.org conventions for consistent CLI interface
- **Performance**: Validation operations complete in <5 seconds for typical projects
- **Reliability**: Zero tolerance for false positives/negatives in validation
- **Portability**: Cross-platform support (Windows, macOS, Linux)
- **Machine-Readable Output**: All commands support JSON output format for agent consumption

---

**Document Status**: Initial version - ready for detailed design

**Next Steps**:
1. Fill in domain model types
2. Define API endpoints (CLI commands)
3. Validate architecture (workflow 02-validate-architecture)
4. Generate features (workflow 03-init-features)
