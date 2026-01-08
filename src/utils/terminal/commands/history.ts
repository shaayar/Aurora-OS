import { TerminalCommand } from '../types';

export const history: TerminalCommand = {
    name: 'history',
    description: 'Show terminal command history',
    descriptionKey: 'terminal.commands.history.description',
    usage: 'history [-c] [n]',
    usageKey: 'terminal.commands.history.usage',
    execute: ({ args, getCommandHistory, clearCommandHistory }) => {
        const commandHistory = getCommandHistory();

        // Parse arguments
        const clearFlag = args.includes('-c');

        // Handle -c flag (clear history)
        if (clearFlag) {
            clearCommandHistory();
            return { output: ['Command history cleared'] };
        }

        // Handle numeric argument (show last N commands)
        let limit = commandHistory.length;
        const numericArg = args.find(arg => !arg.startsWith('-') && !isNaN(parseInt(arg, 10)));

        if (numericArg) {
            const parsedLimit = parseInt(numericArg, 10);
            if (parsedLimit > 0) {
                limit = parsedLimit;
            }
        }

        // Display history
        if (commandHistory.length === 0) {
            return { output: [] };
        }

        // Get the last 'limit' commands
        const startIndex = Math.max(0, commandHistory.length - limit);
        const commandsToShow = commandHistory.slice(startIndex);

        // Format output with line numbers (1-indexed from the start of full history)
        const output = commandsToShow.map((cmd, index) => {
            const lineNumber = startIndex + index + 1;
            const paddedNumber = lineNumber.toString().padStart(5, ' ');
            return `${paddedNumber}  ${cmd}`;
        });

        return { output };
    },
};
