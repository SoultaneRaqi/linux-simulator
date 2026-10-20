// src/types/index.ts

// --- 1. DOCUMENTATION TYPES (For the JSON files) ---
export interface CommandFlag {
    flag: string;
    description: string;
}

export interface CommandExample {
    cmd: string;
    description: string;
}

export interface CommandDoc {
    id: string; // e.g., 'ls', 'chmod'
    name: string;
    category: 'Basic' | 'File System' | 'Permissions' | 'Networking' | 'Process' | 'Advanced';
    shortDesc: string;
    longDesc: string;
    syntax: string;
    flags: CommandFlag[];
    examples: CommandExample[];
    isSimulated: boolean; // Crucial for scaling to 50+ commands
}

// --- 2. TERMINAL TYPES (For the UI and State) ---
export interface TerminalOutput {
    id: string;
    path: string; // The directory where the command was executed
    command: string; // What the user typed
    output: string; // The resulting output (or error message)
    isError: boolean;
}

// --- 3. FILE SYSTEM TYPES (For the Virtual OS) ---
export interface FileSystemNode {
    name: string;
    type: 'file' | 'directory';
    permissions: string; // e.g., 'drwxr-xr-x'
    owner: string;       // e.g., 'root' or 'user'
    size: number;        // in bytes
    modifiedAt: string;  // e.g., 'Oct 20 18:22'
    content?: string;    // Only for files
    children?: Record<string, FileSystemNode>; // Only for directories
}