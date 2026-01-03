export class CliError extends Error {
  constructor(message: string, public exitCode: number = 1) {
    super(message);
    this.name = 'CliError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends CliError {
  constructor(message: string) {
    super(message, 1);
    this.name = 'ValidationError';
  }
}

export class ConfigurationError extends CliError {
  constructor(message: string) {
    super(message, 1);
    this.name = 'ConfigurationError';
  }
}

export function handleError(error: unknown, verbose: boolean = false): void {
  if (error instanceof CliError) {
    console.error(`Error: ${error.message}`);
    if (verbose && error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    process.exit(error.exitCode);
  } else if (error instanceof Error) {
    console.error(`Unexpected error: ${error.message}`);
    if (verbose && error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    process.exit(1);
  } else {
    console.error('An unknown error occurred');
    process.exit(1);
  }
}
