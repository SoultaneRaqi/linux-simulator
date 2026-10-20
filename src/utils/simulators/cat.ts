// src/utils/simulators/cat.ts
import type { FileSystemNode } from '../../types';
import { resolvePath, getNodeAtPath } from '../fsUtils';

export const executeCat = (
    args: string[],
    currentPath: string,
    fs: FileSystemNode
): { output: string; isError: boolean } => {

    if (args.length === 0) {
        // Standard cat without args waits for stdin. We mock it as an error for simplicity.
        return { output: `cat: missing file operand`, isError: true };
    }

    const target = args[0];
    const resolvedPath = resolvePath(currentPath, target);
    const node = getNodeAtPath(fs, resolvedPath);

    if (!node) {
        return { output: `cat: ${target}: No such file or directory`, isError: true };
    }

    if (node.type === 'directory') {
        return { output: `cat: ${target}: Is a directory`, isError: true };
    }

    if (node.content === undefined) {
        return { output: ``, isError: false }; // Empty file
    }

    return { output: node.content, isError: false };
};