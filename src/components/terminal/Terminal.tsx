// src/components/terminal/Terminal.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useTerminal } from '../../store/useTerminal';
import { runCommand } from '../../utils/commandParser';
import { initialFileSystem } from '../../data/fileSystem';

export const Terminal: React.FC = () => {
    const [input, setInput] = useState('');
    const [historyIndex, setHistoryIndex] = useState(-1);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Pull state and actions from Zustand
    const { currentPath, outputHistory, inputHistory, setPath, addOutput, clearTerminal, addInputHistory } = useTerminal();

    // Auto-scroll to bottom when new output is added
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [outputHistory]);

    // Keep focus on the input field when clicking anywhere in the terminal
    const handleTerminalClick = () => {
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (!input.trim()) {
                addOutput('', ''); // Just print a new empty prompt line
                return;
            }

            // Intercept the 'clear' command directly at the UI level
            if (input.trim().toLowerCase() === 'clear') {
                clearTerminal();
                setInput('');
                return;
            }

            // Run the parser engine
            const result = runCommand(input, currentPath, initialFileSystem);

            // Update global state
            addInputHistory(input);
            addOutput(input, result.output, result.isError);

            if (result.newPath) {
                setPath(result.newPath);
            }

            // Reset local input state
            setInput('');
            setHistoryIndex(-1);
        }

        // History navigation: UP Arrow
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (inputHistory.length > 0) {
                const nextIndex = historyIndex < inputHistory.length - 1 ? historyIndex + 1 : historyIndex;
                setHistoryIndex(nextIndex);
                setInput(inputHistory[inputHistory.length - 1 - nextIndex]);
            }
        }

        // History navigation: DOWN Arrow
        else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                const prevIndex = historyIndex - 1;
                setHistoryIndex(prevIndex);
                setInput(inputHistory[inputHistory.length - 1 - prevIndex]);
            } else if (historyIndex === 0) {
                setHistoryIndex(-1);
                setInput('');
            }
        }
    };

    return (
        <div
            className="flex flex-col h-full bg-linux-panel rounded-lg shadow-xl border border-slate-700 font-mono text-sm overflow-hidden"
            onClick={handleTerminalClick}
        >
            {/* Terminal Header */}
            <div className="flex items-center px-4 py-2 bg-slate-900 border-b border-slate-700">
                <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="mx-auto text-slate-400 text-xs font-semibold">user@linux-simulator:~</div>
            </div>

            {/* Terminal Body */}
            <div className="flex-1 overflow-y-auto p-4 text-linux-text space-y-2">

                {/* Welcome Message */}
                <div className="text-slate-400 mb-4">
                    Welcome to the Linux Simulator. Type <span className="text-linux-accent">help</span> to see available commands, or select a command from the left panel.
                </div>

                {/* Output History */}
                {outputHistory.map((item) => (
                    <div key={item.id} className="space-y-1">
                        <div className="flex items-center space-x-2">
                            <span className="text-green-400 font-bold">user@linux-simulator</span>
                            <span className="text-linux-text">:</span>
                            <span className="text-linux-accent font-bold">{item.path}</span>
                            <span className="text-linux-text">$</span>
                            <span className="text-slate-200">{item.command}</span>
                        </div>
                        {item.output && (
                            <div className={`whitespace-pre-wrap ${item.isError ? 'text-red-400' : 'text-slate-300'}`}>
                                {item.output}
                            </div>
                        )}
                    </div>
                ))}

                {/* Active Input Line */}
                <div className="flex items-center space-x-2">
                    <span className="text-green-400 font-bold">user@linux-simulator</span>
                    <span className="text-linux-text">:</span>
                    <span className="text-linux-accent font-bold">{currentPath}</span>
                    <span className="text-linux-text">$</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 bg-transparent outline-none border-none text-slate-200 caret-linux-text"
                        autoFocus
                        spellCheck={false}
                        autoComplete="off"
                    />
                </div>

                {/* Anchor for auto-scrolling */}
                <div ref={bottomRef} />
            </div>
        </div>
    );
};