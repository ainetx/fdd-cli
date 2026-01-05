# CLI Init Command Specification

**Capability**: cli-init  
**Change**: cli-command-registration

---

## ADDED Requirements

### Requirement: Command Registration

The system SHALL register an `fdd init` command in the CLI application that accepts optional project path and configuration flags.

**Command Signature**:
```
fdd init [project-path] [options]
```

#### Scenario: Help Text Display

- **GIVEN** user wants to understand command usage
- **WHEN** user invokes `fdd init --help`
- **THEN** system displays:
  - Command description
  - Argument specification: `[project-path]` (optional, defaults to current directory)
  - Available options: `--force`, `--quiet`, `--verbose`, `--json`
  - Usage examples

#### Scenario: Basic Command Invocation

- **GIVEN** user invokes `fdd init` without arguments
- **WHEN** command handler is called
- **THEN** system SHALL:
  - Parse project-path as current directory
  - Set all option flags to false (default)
  - Pass parsed arguments to command handler function

---

### Requirement: Argument Parsing

The system SHALL parse the optional `[project-path]` positional argument and apply default value when not provided.

#### Scenario: Explicit Project Path

- **GIVEN** user provides project path
- **WHEN** user invokes `fdd init /path/to/project`
- **THEN** system SHALL:
  - Parse project-path as "/path/to/project"
  - Pass parsed path to command handler

#### Scenario: Default Project Path

- **GIVEN** user omits project path
- **WHEN** user invokes `fdd init`
- **THEN** system SHALL:
  - Set project-path to current working directory
  - Pass current directory to command handler

#### Scenario: Invalid Path Format

- **GIVEN** user provides invalid path (e.g., contains null bytes)
- **WHEN** command validates arguments
- **THEN** system SHALL:
  - Reject invalid path
  - Display error message
  - Exit with non-zero status code

---

### Requirement: Option Flags

The system SHALL support four boolean option flags that modify command behavior.

#### Scenario: Force Overwrite Option

- **GIVEN** user wants to overwrite existing FDD structure
- **WHEN** user invokes `fdd init --force`
- **THEN** system SHALL:
  - Parse force flag as true
  - Pass flag to command handler for validation bypass

#### Scenario: Quiet Mode Option

- **GIVEN** user wants minimal output
- **WHEN** user invokes `fdd init --quiet`
- **THEN** system SHALL:
  - Parse quiet flag as true
  - Pass flag to command handler to suppress output messages

#### Scenario: Verbose Mode Option

- **GIVEN** user wants detailed output
- **WHEN** user invokes `fdd init --verbose`
- **THEN** system SHALL:
  - Parse verbose flag as true
  - Pass flag to command handler to show detailed steps

#### Scenario: JSON Output Option

- **GIVEN** user wants structured output (for AI agents)
- **WHEN** user invokes `fdd init --json`
- **THEN** system SHALL:
  - Parse json flag as true
  - Pass flag to command handler to format output as JSON

#### Scenario: Multiple Options Combined

- **GIVEN** user provides multiple options
- **WHEN** user invokes `fdd init /tmp/test --force --json`
- **THEN** system SHALL:
  - Parse project-path as "/tmp/test"
  - Parse force flag as true
  - Parse json flag as true
  - Pass all parsed values to command handler

---

### Requirement: Command Handler Stub

The system SHALL provide a stub command handler function that logs parsed arguments for verification purposes.

#### Scenario: Stub Handler Execution

- **GIVEN** command is registered
- **WHEN** user invokes `fdd init` with any valid arguments
- **THEN** stub handler SHALL:
  - Log parsed project-path
  - Log all parsed option flags
  - Return success status
  - NOT perform actual initialization (stub only)

**Note**: Full implementation of directory creation, template generation, and validation will be added in subsequent changes (002, 003, 004).

---

## Implementation Notes

**Framework**: Use commander.js for command registration and argument parsing  
**File Location**: `src/index.ts` (registration), `src/commands/init.ts` (handler stub)  
**Error Handling**: Basic validation only in this change (path format)  
**Testing**: Unit tests required for argument parsing scenarios  
**Design Reference**: Feature DESIGN.md Section B (Actor Flow: Initialize Project Structure, steps 1-3)
