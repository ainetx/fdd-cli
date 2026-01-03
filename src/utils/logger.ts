import chalk from 'chalk';

export interface LoggerOptions {
  verbose?: boolean;
  quiet?: boolean;
  noColor?: boolean;
}

class Logger {
  private options: LoggerOptions = {};

  configure(options: LoggerOptions): void {
    this.options = options;
  }

  info(message: string): void {
    if (!this.options.quiet) {
      const prefix = this.options.noColor ? 'ℹ' : chalk.blue('ℹ');
      console.log(prefix + ' ' + message);
    }
  }

  success(message: string): void {
    if (!this.options.quiet) {
      const prefix = this.options.noColor ? '✓' : chalk.green('✓');
      console.log(prefix + ' ' + message);
    }
  }

  warn(message: string): void {
    if (!this.options.quiet) {
      const prefix = this.options.noColor ? '⚠' : chalk.yellow('⚠');
      console.warn(prefix + ' ' + message);
    }
  }

  error(message: string): void {
    const prefix = this.options.noColor ? '✖' : chalk.red('✖');
    console.error(prefix + ' ' + message);
  }

  debug(message: string): void {
    if (this.options.verbose) {
      const prefix = this.options.noColor ? '[DEBUG]' : chalk.gray('[DEBUG]');
      console.log(prefix + ' ' + message);
    }
  }

  log(message: string): void {
    if (!this.options.quiet) {
      console.log(message);
    }
  }
}

export const logger = new Logger();
