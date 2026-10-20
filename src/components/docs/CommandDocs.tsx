// src/components/docs/CommandDocs.tsx
import React from 'react';
import { Play, Info, CheckCircle2 } from 'lucide-react';
import type { CommandDoc } from '../../types';

interface CommandDocsProps {
    command: CommandDoc | null;
}

export const CommandDocs: React.FC<CommandDocsProps> = ({ command }) => {
    if (!command) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                <Info className="w-12 h-12 opacity-50" />
                <p className="text-lg">Select a command from the sidebar to view details</p>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto p-8 custom-scrollbar">
            <div className="max-w-3xl mx-auto space-y-8">

                {/* Header */}
                <div>
                    <div className="flex items-center space-x-3 mb-2">
                        <h1 className="text-4xl font-bold text-linux-text tracking-tight">{command.name}</h1>
                        {command.isSimulated && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Playable in Terminal
              </span>
                        )}
                    </div>
                    <p className="text-xl text-slate-400">{command.shortDesc}</p>
                </div>

                {/* Description */}
                <div className="prose prose-invert max-w-none">
                    <p className="text-slate-300 leading-relaxed">{command.longDesc}</p>
                </div>

                {/* Syntax */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Syntax
                    </div>
                    <div className="p-4 font-mono text-sm text-linux-accent">
                        {command.syntax}
                    </div>
                </div>

                {/* Flags Table */}
                {command.flags.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold text-linux-text mb-4">Common Flags</h3>
                        <div className="border border-slate-800 rounded-xl overflow-hidden">
                            <table className="min-w-full divide-y divide-slate-800">
                                <tbody className="divide-y divide-slate-800 bg-slate-900">
                                {command.flags.map((flag, idx) => (
                                    <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-linux-accent w-24 border-r border-slate-800">
                                            {flag.flag}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-300">
                                            {flag.description}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Examples */}
                {command.examples.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold text-linux-text mb-4">Examples</h3>
                        <div className="space-y-3">
                            {command.examples.map((ex, idx) => (
                                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                                    <div className="font-mono text-sm text-linux-accent mb-2 flex items-center">
                                        <Play className="w-3 h-3 mr-2 text-slate-500" />
                                        {ex.cmd}
                                    </div>
                                    <p className="text-sm text-slate-400 ml-5">{ex.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};