// src/data/fileSystem.ts
import type { FileSystemNode } from '../types';

export const initialFileSystem: FileSystemNode = {
    name: '/',
    type: 'directory',
    permissions: 'drwxr-xr-x',
    owner: 'root',
    size: 4096,
    modifiedAt: 'Oct 20 18:00',
    children: {
        'home': {
            name: 'home',
            type: 'directory',
            permissions: 'drwxr-xr-x',
            owner: 'root',
            size: 4096,
            modifiedAt: 'Oct 20 18:00',
            children: {
                'user': {
                    name: 'user',
                    type: 'directory',
                    permissions: 'drwxr-xr-x',
                    owner: 'user',
                    size: 4096,
                    modifiedAt: 'Oct 20 18:22',
                    children: {
                        'documents': {
                            name: 'documents',
                            type: 'directory',
                            permissions: 'drwxr-xr-x',
                            owner: 'user',
                            size: 4096,
                            modifiedAt: 'Oct 20 18:25',
                            children: {
                                'notes.txt': {
                                    name: 'notes.txt',
                                    type: 'file',
                                    permissions: '-rw-r--r--',
                                    owner: 'user',
                                    size: 1024,
                                    modifiedAt: 'Oct 20 18:30',
                                    content: 'Linux simulator project notes.'
                                }
                            }
                        },
                        // A hidden file to test `ls -a`
                        '.bashrc': {
                            name: '.bashrc',
                            type: 'file',
                            permissions: '-rw-r--r--',
                            owner: 'user',
                            size: 220,
                            modifiedAt: 'Oct 20 18:00',
                            content: '# ~/.bashrc\nexport PATH=$PATH:/usr/local/bin'
                        }
                    }
                }
            }
        },
        'etc': {
            name: 'etc',
            type: 'directory',
            permissions: 'drwxr-xr-x',
            owner: 'root',
            size: 4096,
            modifiedAt: 'Oct 20 18:00',
            children: {}
        }
    }
};