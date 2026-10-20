// src/components/layout/Sidebar.tsx
import React, { useState } from 'react';
import { Search, Terminal as TerminalIcon } from 'lucide-react'; // Removed unused ChevronDown and ChevronRight
import { commandRegistry, getCategories } from '../../data/commands';
import type { CommandDoc } from '../../types';

interface SidebarProps {
    onSelectCommand: (cmd: CommandDoc) => void;
    selectedCommandId: string | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ onSelectCommand, selectedCommandId }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const categories = getCategories();

    // Filter commands based on search term
    const filteredCommands = commandRegistry.filter(cmd =>
        cmd.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cmd.shortDesc.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-80 h-full flex flex-col bg-slate-900 border-r border-slate-800">

            {/* Header & Search */}
            <div className="p-4 border-b border-slate-800">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-linux-accent/10 rounded-lg">
                        <TerminalIcon className="w-6 h-6 text-linux-accent" />
                    </div>
                    <h1 className="text-xl font-bold text-linux-text tracking-tight">Linux<span className="text-linux-accent">Sim</span></h1>
                </div>

                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    {/*
            Tailwind Fixes:
            - Removed duplicate text-color constraints. Replaced 'text-slate-200' and 'placeholder-slate-500'
              with 'text-slate-200 placeholder:text-slate-500' (v4 syntax).
            - Replaced 'focus:border-linux-accent' with standard 'focus:ring-1 focus:ring-linux-accent focus:outline-none'
              to prevent border-color class collisions.
          */}
                    <input
                        type="text"
                        placeholder="Search commands..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-9 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-linux-accent transition-all"
                    />
                </div>
            </div>

            {/* Command List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                {categories.map(category => {
                    const categoryCommands = filteredCommands.filter(c => c.category === category);

                    if (categoryCommands.length === 0) return null;

                    return (
                        <div key={category}>
                            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">
                                {category}
                            </h2>
                            <div className="space-y-1">
                                {categoryCommands.map(cmd => (
                                    <button
                                        key={cmd.id}
                                        onClick={() => onSelectCommand(cmd)}
                                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between group ${
                                            selectedCommandId === cmd.id
                                                ? 'bg-linux-accent/10 text-linux-accent font-medium'
                                                : 'text-slate-300 hover:bg-slate-800 hover:text-slate-100'
                                        }`}
                                    >
                                        <span>{cmd.name}</span>
                                        {!cmd.isSimulated && (
                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 group-hover:bg-slate-700">
                        Doc Only
                      </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};