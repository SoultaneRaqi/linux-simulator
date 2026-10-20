// src/store/useTerminal.ts
import { create } from 'zustand';
import type { TerminalOutput } from '../types';

interface TerminalState {
    currentPath: string;
    outputHistory: TerminalOutput[];
    inputHistory: string[]; // For Up/Down arrow navigation

    // Actions
    setPath: (newPath: string) => void;
    addOutput: (command: string, output: string, isError?: boolean) => void;
    clearTerminal: () => void;
    addInputHistory: (command: string) => void;
}

export const useTerminal = create<TerminalState>((set) => ({
    currentPath: '~', // Start in the home directory
    outputHistory: [],
    inputHistory: [],

    setPath: (newPath) => set({ currentPath: newPath }),

    addOutput: (command, output, isError = false) => set((state) => ({
        outputHistory: [
            ...state.outputHistory,
            {
                id: crypto.randomUUID(),
                path: state.currentPath,
                command,
                output,
                isError,
            }
        ]
    })),

    clearTerminal: () => set({ outputHistory: [] }),

    addInputHistory: (command) => set((state) => {
        // Prevent adding duplicates back-to-back, and keep history trim
        if (state.inputHistory[state.inputHistory.length - 1] === command) return state;
        return { inputHistory: [...state.inputHistory, command].slice(-50) };
    }),
}));