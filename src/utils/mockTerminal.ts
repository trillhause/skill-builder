// Mock Terminal Command Handler
// Provides simulated responses for common terminal commands

export type Environment = 'bash' | 'node';

export interface CommandHandler {
  execute: (command: string, environment: Environment) => string;
}

// Command history storage
export class CommandHistory {
  private history: string[] = [];
  private currentPosition: number = -1;

  add(command: string): void {
    if (command.trim()) {
      this.history.push(command);
      this.currentPosition = this.history.length;
    }
  }

  getPrevious(): string | null {
    if (this.history.length === 0) return null;
    if (this.currentPosition > 0) {
      this.currentPosition--;
    }
    return this.history[this.currentPosition] || null;
  }

  getNext(): string | null {
    if (this.history.length === 0) return null;
    if (this.currentPosition < this.history.length - 1) {
      this.currentPosition++;
      return this.history[this.currentPosition];
    } else {
      this.currentPosition = this.history.length;
      return '';
    }
  }

  getAll(): string[] {
    return [...this.history];
  }

  reset(): void {
    this.currentPosition = this.history.length;
  }
}

// Bash command responses
const bashCommands: { [key: string]: string } = {
  pwd: '/Users/workspace/skill-builder',
  whoami: 'developer',
  date: new Date().toString(),
  hostname: 'skill-builder-workspace',
  uname: 'Darwin skill-builder-workspace 23.0.0',
  'uname -a': 'Darwin skill-builder-workspace 23.0.0 Darwin Kernel Version 23.0.0',
};

function executeBashCommand(command: string): string {
  const trimmed = command.trim();

  // Handle empty command
  if (!trimmed) return '';

  // Handle clear command
  if (trimmed === 'clear') return '\x1b[2J\x1b[H';

  // Check for exact matches
  if (bashCommands[trimmed]) {
    return bashCommands[trimmed];
  }

  // Handle ls command
  if (trimmed === 'ls' || trimmed.startsWith('ls ')) {
    return 'Skill.md\nREADME.md\nscripts/\ntypes/\nconfig.json';
  }

  // Handle echo command
  if (trimmed.startsWith('echo ')) {
    const message = trimmed.substring(5).replace(/^["']|["']$/g, '');
    return message;
  }

  // Handle cat command
  if (trimmed.startsWith('cat ')) {
    return `Content of ${trimmed.substring(4)} (mock data)`;
  }

  // Handle mkdir, touch, rm
  if (trimmed.startsWith('mkdir ') || trimmed.startsWith('touch ')) {
    return `Created: ${trimmed.split(' ').slice(1).join(' ')}`;
  }

  if (trimmed.startsWith('rm ')) {
    return `Removed: ${trimmed.split(' ').slice(1).join(' ')}`;
  }

  // Handle cd command
  if (trimmed.startsWith('cd ')) {
    return '';
  }

  // Handle help command
  if (trimmed === 'help') {
    return `Available commands:
  ls          - List files
  pwd         - Print working directory
  echo        - Print message
  cat         - Display file contents
  mkdir       - Create directory
  touch       - Create file
  rm          - Remove file
  cd          - Change directory
  whoami      - Display current user
  date        - Display current date
  clear       - Clear terminal
  help        - Show this help`;
  }

  // Unknown command
  return `bash: ${trimmed.split(' ')[0]}: command not found`;
}

// Node.js command responses
function executeNodeCommand(command: string): string {
  const trimmed = command.trim();

  // Handle empty command
  if (!trimmed) return '';

  // Handle clear command
  if (trimmed === 'clear' || trimmed === '.clear') {
    return '\x1b[2J\x1b[H';
  }

  // Handle .exit
  if (trimmed === '.exit') {
    return 'Exiting Node.js REPL...';
  }

  // Handle .help
  if (trimmed === '.help') {
    return `.break    Sometimes you get stuck, this gets you out
.clear    Clear the REPL
.exit     Exit the REPL
.help     Print this help message
.save     Save all evaluated commands to a file
.load     Load JS from a file into the REPL session`;
  }

  // Try to evaluate as JavaScript
  try {
    // Handle simple expressions
    if (trimmed.match(/^\d+\s*[\+\-\*\/]\s*\d+$/)) {
      // eslint-disable-next-line no-eval
      return String(eval(trimmed));
    }

    // Handle console.log
    if (trimmed.startsWith('console.log(')) {
      const message = trimmed.match(/console\.log\((.*)\)/)?.[1] || '';
      try {
        // eslint-disable-next-line no-eval
        return String(eval(message));
      } catch {
        return 'undefined';
      }
    }

    // Handle variable declarations
    if (trimmed.startsWith('let ') || trimmed.startsWith('const ') || trimmed.startsWith('var ')) {
      return 'undefined';
    }

    // Handle simple string or number literals
    if (trimmed.match(/^['"`].*['"`]$/) || trimmed.match(/^\d+$/)) {
      // eslint-disable-next-line no-eval
      return String(eval(trimmed));
    }

    // Default for other JavaScript
    return `'${trimmed}' (expression evaluation simulated)`;
  } catch (error) {
    return `Error: ${(error as Error).message}`;
  }
}

// Main command handler
export const mockCommandHandler: CommandHandler = {
  execute: (command: string, environment: Environment): string => {
    // Add simulated delay for realism (handled by caller)
    if (environment === 'bash') {
      return executeBashCommand(command);
    } else {
      return executeNodeCommand(command);
    }
  },
};

// Export utility for getting prompt based on environment
export function getPrompt(environment: Environment): string {
  if (environment === 'bash') {
    return '$ ';
  } else {
    return '> ';
  }
}
