// src/utils/simulators/cd.ts
import type { FileSystemNode } from '../../types';
import { resolvePath, getNodeAtPath } from '../fsUtils';

export const executeCd = (
    args: string[],
    currentPath: string,
    fs: FileSystemNode
): { output: string; isError: boolean; newPath?: string } => {

    const target = args[0] || '~'; // Default to home if no args provided
    const resolvedPath = resolvePath(currentPath, target);

    const node = getNodeAtPath(fs, resolvedPath);

    if (!node) {
        return { output: `bash: cd: ${target}: No such file or directory`, isError: true };
    }

    if (node.type !== 'directory') {
        return { output: `bash: cd: ${target}: Not a directory`, isError: true };
    }

    return { output: '', isError: false, newPath: resolvedPath };
};