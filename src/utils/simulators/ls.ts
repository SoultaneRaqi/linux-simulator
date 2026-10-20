// src/utils/simulators/ls.ts
import type { FileSystemNode } from '../../types';
import { resolvePath, getNodeAtPath } from '../fsUtils';

export const executeLs = (
    args: string[],
    flags: string[],
    currentPath: string,
    fs: FileSystemNode
): { output: string; isError: boolean } => {

    const target = args[0] || '.';
    const resolvedPath = resolvePath(currentPath, target);
    const node = getNodeAtPath(fs, resolvedPath);

    if (!node) {
        return { output: `ls: cannot access '${target}': No such file or directory`, isError: true };
    }

    if (node.type !== 'directory' || !node.children) {
        // If they ls a specific file, just return the file info
        return { output: node.name, isError: false };
    }

    const showHidden = flags.includes('a');
    const useLongFormat = flags.includes('l');

    let entries = Object.values(node.children);

    if (!showHidden) {
        entries = entries.filter(child => !child.name.startsWith('.'));
    }

    // Sort alphabetically
    entries.sort((a, b) => a.name.localeCompare(b.name));

    if (useLongFormat) {
        const lines = entries.map(child => {
            // Format: permissions 1 owner group size date name
            return `${child.permissions} 1${child.owner} ${child.owner}${child.size.toString().padStart(5)} ${child.modifiedAt}${child.name}`;
        });
        // Prepend total block count (mocked)
        return { output: `total ${entries.length * 4}\n` + lines.join('\n'), isError: false };
    }

    // Default short format: space separated
    return { output: entries.map(c => c.name).join('  '), isError: false };
};