# Commands Structure

This directory contains all FDD CLI commands organized by category.

## Command Pattern

Each command should follow this structure:

```typescript
import { Command } from 'commander';

export function registerCommand(program: Command): void {
  program
    .command('command-name')
    .description('Brief description')
    .option('-o, --option', 'Option description')
    .action(async (options) => {
      // Command implementation
    });
}
```

## Command Categories

### Validation Commands
- `validate-architecture` - Validate Overall Design
- `validate-feature` - Validate Feature Design
- `validate-adapter` - Validate FDD adapter
- `validate-features` - Validate FEATURES.md manifest

### Initialization Commands
- `init-project` - Initialize FDD project structure
- `init-features` - Generate features from Overall Design
- `init-feature` - Initialize single feature

### Feature Commands
- `complete-feature` - Mark feature as complete
- `fix-design` - Fix design issues

### OpenSpec Commands
- `openspec-init` - Initialize OpenSpec for feature
- `openspec-validate` - Validate OpenSpec structure

## Adding New Commands

1. Create a new file in the appropriate category directory
2. Export a `registerCommand` function
3. The command will be auto-discovered and registered

## Best Practices

- Keep commands focused and single-purpose
- Use descriptive names and help text
- Validate inputs before processing
- Provide helpful error messages
- Use the logger utility for consistent output
- Handle errors gracefully
