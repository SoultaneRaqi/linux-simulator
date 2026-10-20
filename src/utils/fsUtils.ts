// src/utils/fsUtils.ts
import type { FileSystemNode } from '../types';

/**
 * Normalizes a path string.
 * Example: resolves "/home/user/../etc" to "/etc"
 */
export const resolvePath = (currentPath: string, targetPath: string): string => {
    if (!targetPath) return currentPath;

    // If target path starts with '/', it's absolute. Otherwise, it's relative.
    let fullPath = targetPath.startsWith('/')
        ? targetPath
        : targetPath.startsWith('~')
            ? `/home/user${targetPath.substring(1)}` // Handle tilde
            : `${currentPath}/${targetPath}`;

    const parts = fullPath.split('/').filter(p => p !== '' && p !== '.');
    const resolved: string[] = [];

    for (const part of parts) {
        if (part === '..') {
            if (resolved.length > 0) resolved.pop();
        } else {
            resolved.push(part);
        }
    }

    return '/' + resolved.join('/');
};

/**
 * Traverses the file system tree to find a specific node based on a resolved path.
 */
export const getNodeAtPath = (fs: FileSystemNode, path: string): FileSystemNode | null => {
    if (path === '/') return fs;

    const parts = path.split('/').filter(Boolean);
    let current: FileSystemNode = fs;

    for (const part of parts) {
        if (current.type !== 'directory' || !current.children || !current.children[part]) {
            return null; // Path does not exist
        }
        current = current.children[part];
    }

    return current;
};