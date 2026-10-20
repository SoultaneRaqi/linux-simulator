// src/utils/commandParser.ts
import type { FileSystemNode } from '../types';
import { commandRegistry } from '../data/commands';

// Import our individual simulator logic
import { executeLs } from './simulators/ls';
import { executeCd } from './simulators/cd';
import { executeCat } from './simulators/cat';

export interface ParsedCommand {
    commandName: string;
    args: string[];
    flags: string[]; // e.g., ['l', 'a']
}

export interface CommandResult {
    output: string;
    isError: boolean;
    newPath?: string; // Used specifically by commands like 'cd' that change environment state
}

/**
 * Tokenizes the raw user input string into the command name, arguments, and flags.
 * Example: "ls -la /home" -> { commandName: "ls", flags: ["l", "a"], args: ["/home"] }
 */
export const parseInput = (input: string): ParsedCommand => {
    // 1. Remove extra spaces and split by whitespace
    const parts = input.trim().split(/\s+/);
    const commandName = parts[0].toLowerCase();

    const args: string[] = [];
    const flags: string[] = [];

    // 2. Extract flags (starting with -) and arguments
    for (let i = 1; i < parts.length; i++) {
        if (parts[i].startsWith('-') && parts[i].length > 1) {
            // Handle combined flags like -la -> ['l', 'a']
            // Also handles double dashes like --help (would push '-', 'h', 'e', 'l', 'p' which is fine for simple simulation)
            const cleanFlags = parts[i].substring(1).split('');
            flags.push(...cleanFlags);
        } else {
            args.push(parts[i]);
        }
    }

    return { commandName, args, flags };
};

/**
 * The central routing engine. Takes the parsed input and executes the appropriate simulator.
 */
export const runCommand = (
    input: string,
    currentPath: string,
    fs: FileSystemNode
): CommandResult => {
    if (!input.trim()) return { output: '', isError: false };

    const { commandName, args, flags } = parseInput(input);

    // 1. Validate against the JSON registry
    const commandDoc = commandRegistry.find(c => c.id === commandName);

    if (!commandDoc) {
        return { output: `bash: ${commandName}: command not found`, isError: true };
    }

    // 2. Check if the command is meant to be simulated
    if (!commandDoc.isSimulated) {
        return {
            output: `${commandName}: simulation not yet implemented.\nCheck the documentation panel for syntax and examples.`,
            isError: false
        };
    }

    // 3. Route to the specific simulation logic
    try {
        switch (commandName) {
            case 'ls':
                return executeLs(args, flags, currentPath, fs);

            case 'cd':
                return executeCd(args, currentPath, fs);

            case 'pwd':
                return { output: currentPath, isError: false };

            case 'echo':
                // Echo simply joins all arguments back together
                return { output: args.join(' '), isError: false };

            case 'date':
                // Basic date implementation. In a real terminal, this respects formatting flags.
                return { output: new Date().toString(), isError: false };

            case 'cat':
                return executeCat(args, currentPath, fs);

            case 'mkdir':
                // Placeholder for mkdir. To implement fully, you'd need a Zustand action to mutate the global FS state.
                return { output: `mkdir: successful. (Note: File system writes are mocked for this session)`, isError: false };

            case 'touch':
                // Placeholder for touch
                return { output: `touch: successful. (Note: File system writes are mocked for this session)`, isError: false };

            // NOTE: 'clear' is not handled here. It is intercepted at the UI component level
            // because it needs to wipe the Zustand outputHistory array, not return a string.

            default:
                return { output: `bash: ${commandName}: simulated but missing execution script`, isError: true };
        }
    } catch (error: any) {
        // Catch any unexpected runtime errors in our simulator logic
        return { output: error.message || 'An unknown error occurred during execution.', isError: true };
    }
};