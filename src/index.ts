import { Command } from 'commander';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { logger } from './utils/logger.js';
import { handleError } from './utils/errors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const program = new Command();

// Read package.json for version
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf-8')
);

// Configure program
program
  .name('fdd')
  .description('Feature-Driven Development (FDD) CLI tool')
  .version(packageJson.version)
  .option('-v, --verbose', 'Enable verbose output')
  .option('-q, --quiet', 'Suppress non-error output')
  .option('--no-color', 'Disable colored output')
  .hook('preAction', (thisCommand) => {
    const opts = thisCommand.opts();
    logger.configure({
      verbose: opts.verbose,
      quiet: opts.quiet,
      noColor: !opts.color
    });
  });

// Command categories
program
  .addHelpText('after', `
Command Categories:
  Validation:  validate-architecture, validate-feature, validate-adapter
  Init:        init-project, init-features, init-feature
  Feature:     complete-feature, fix-design
  OpenSpec:    openspec-init, openspec-validate

Examples:
  $ fdd --version
  $ fdd --help
  $ fdd validate-architecture
  $ fdd init-project

Documentation:
  FDD Spec: spec/FDD/AGENTS.md
  Workflows: spec/FDD/workflows/
`);

// Future commands will be registered here via command modules
// Example:
// import { registerCommand as registerValidate } from './commands/validate.js';
// registerValidate(program);

// Handle unknown commands
program.on('command:*', function () {
  logger.error(`Invalid command: ${program.args.join(' ')}`);
  logger.info('Run "fdd --help" for a list of available commands.');
  process.exit(1);
});

// Parse arguments and handle errors
try {
  await program.parseAsync(process.argv);
} catch (error) {
  const opts = program.opts();
  handleError(error, opts.verbose);
}
