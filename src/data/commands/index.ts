// src/data/commands/index.ts
import type { CommandDoc } from '../../types';
import basic from './basic.json';
import filesystem from './filesystem.json';
import system from './system.json';
import network from './network.json';

// We assert the type here so TypeScript knows our JSON matches our interfaces
export const commandRegistry: CommandDoc[] = [
    ...basic,
    ...filesystem,
    ...system,
    ...network
] as CommandDoc[];

// Helper to extract unique categories for our UI Sidebar
export const getCategories = (): string[] => {
    return Array.from(new Set(commandRegistry.map(cmd => cmd.category)));
};