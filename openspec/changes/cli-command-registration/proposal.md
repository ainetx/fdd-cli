# Change: CLI Command Registration

## Why

This change implements the first phase of the project-init feature by establishing the command-line interface entry point for the `fdd init` command. This is the foundation that all subsequent changes will build upon.

The `fdd init` command is critical for FDD workflow automation - it allows AI agents and developers to bootstrap new FDD projects without manually creating the directory structure. By implementing the CLI registration first, we establish:

- The command syntax and options that users and agents will interact with
- Validation of command-line arguments before any file system operations
- Help text and usage documentation for the command
- The framework for subsequent implementation phases (directory creation, template generation, validation)

This change has no dependencies and provides a clear contract for the remaining implementation work.

## What Changes

- **Command registration**: Add `fdd init` command to commander.js CLI framework in `src/index.ts`
- **Argument parsing**: Implement `[project-path]` optional positional argument with default to current directory
- **Option parsing**: Implement command options:
  - `--force`: Allow overwriting existing FDD structure
  - `--quiet`: Suppress output messages
  - `--verbose`: Show detailed creation steps
  - `--json`: Output result as JSON format
- **Help text**: Add command description and usage examples for `fdd init --help`
- **Validation**: Basic argument validation (path format, option conflicts)

## Impact

- **Affected specs**: `cli-init` (new capability)
- **Affected code**: 
  - `src/index.ts` (command registration)
  - `src/commands/init.ts` (command handler - stub only in this change)
- **Breaking changes**: None (new command)
- **Dependencies**: None
- **Blocks**: Changes 002, 003, 004 (all require this command entry point)
