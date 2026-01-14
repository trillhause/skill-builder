'use client';

import { useEffect, useRef, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import {
  mockCommandHandler,
  CommandHistory,
  getPrompt,
  type Environment
} from '@/utils/mockTerminal';

export default function TerminalTab() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const [environment, setEnvironment] = useState<Environment>('bash');
  const commandHistoryRef = useRef<CommandHistory>(new CommandHistory());
  const currentLineRef = useRef<string>('');

  useEffect(() => {
    if (!terminalRef.current || xtermRef.current) return;

    // Create terminal instance
    const terminal = new Terminal({
      cursorBlink: true,
      cursorStyle: 'block',
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      fontSize: 14,
      theme: {
        background: '#0d1117',
        foreground: '#e6edf3',
        cursor: '#58a6ff',
        cursorAccent: '#0d1117',
        selectionBackground: 'rgba(88, 166, 255, 0.3)',
        black: '#484f58',
        red: '#ff7b72',
        green: '#3fb950',
        yellow: '#d29922',
        blue: '#58a6ff',
        magenta: '#bc8cff',
        cyan: '#76e3ea',
        white: '#e6edf3',
        brightBlack: '#6e7681',
        brightRed: '#ffa198',
        brightGreen: '#56d364',
        brightYellow: '#e3b341',
        brightBlue: '#79c0ff',
        brightMagenta: '#d2a8ff',
        brightCyan: '#b3f0ff',
        brightWhite: '#f0f6fc',
      },
      scrollback: 1000,
      allowTransparency: false,
    });

    // Create fit addon
    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);

    // Open terminal
    terminal.open(terminalRef.current);
    fitAddon.fit();

    // Store references
    xtermRef.current = terminal;
    fitAddonRef.current = fitAddon;

    // Write initial prompt
    terminal.writeln('Skill Builder Terminal');
    terminal.writeln('Type "help" for available commands\r\n');
    terminal.write(getPrompt(environment));

    // Handle input
    let currentLine = '';
    terminal.onData((data) => {
      const code = data.charCodeAt(0);

      // Handle Enter key (execute command)
      if (code === 13) { // Enter
        terminal.write('\r\n');
        const command = currentLine.trim();

        if (command) {
          // Add to history
          commandHistoryRef.current.add(command);

          // Execute command
          const output = mockCommandHandler.execute(command, environment);

          // Handle clear command
          if (command === 'clear' || command === '.clear') {
            terminal.clear();
          } else if (output) {
            terminal.writeln(output);
          }
        }

        // Reset line and show new prompt
        currentLine = '';
        currentLineRef.current = '';
        commandHistoryRef.current.reset();
        terminal.write(getPrompt(environment));
      }
      // Handle Backspace
      else if (code === 127) {
        if (currentLine.length > 0) {
          currentLine = currentLine.slice(0, -1);
          currentLineRef.current = currentLine;
          terminal.write('\b \b');
        }
      }
      // Handle Up Arrow (previous command in history)
      else if (data === '\x1b[A') {
        const prevCommand = commandHistoryRef.current.getPrevious();
        if (prevCommand !== null) {
          // Clear current line
          terminal.write('\r' + getPrompt(environment) + ' '.repeat(currentLine.length) + '\r' + getPrompt(environment));
          // Write previous command
          terminal.write(prevCommand);
          currentLine = prevCommand;
          currentLineRef.current = currentLine;
        }
      }
      // Handle Down Arrow (next command in history)
      else if (data === '\x1b[B') {
        const nextCommand = commandHistoryRef.current.getNext();
        if (nextCommand !== null) {
          // Clear current line
          terminal.write('\r' + getPrompt(environment) + ' '.repeat(currentLine.length) + '\r' + getPrompt(environment));
          // Write next command
          terminal.write(nextCommand);
          currentLine = nextCommand;
          currentLineRef.current = currentLine;
        }
      }
      // Handle regular input
      else if (code >= 32) {
        currentLine += data;
        currentLineRef.current = currentLine;
        terminal.write(data);
      }
    });

    // Handle window resize
    const handleResize = () => {
      fitAddon.fit();
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      terminal.dispose();
    };
  }, [environment]);

  const handleEnvironmentChange = (newEnv: Environment) => {
    if (xtermRef.current) {
      // Clear terminal
      xtermRef.current.clear();

      // Reset state
      currentLineRef.current = '';
      commandHistoryRef.current = new CommandHistory();

      // Update environment
      setEnvironment(newEnv);

      // Write new welcome message
      xtermRef.current.writeln(`Switched to ${newEnv === 'bash' ? 'Bash' : 'Node.js'} environment`);
      xtermRef.current.writeln('Type "help" for available commands\r\n');
      xtermRef.current.write(getPrompt(newEnv));
    }
  };

  return (
    <div className="terminal-tab">
      <div className="terminal-header">
        <div className="environment-selector">
          <label htmlFor="env-select">Environment:</label>
          <select
            id="env-select"
            value={environment}
            onChange={(e) => handleEnvironmentChange(e.target.value as Environment)}
          >
            <option value="bash">Bash</option>
            <option value="node">Node.js</option>
          </select>
        </div>
      </div>
      <div
        ref={terminalRef}
        className="terminal-container"
      />
    </div>
  );
}
