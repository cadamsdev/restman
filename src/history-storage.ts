import { existsSync, mkdirSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { homedir } from 'os';
import type { HistoryEntry } from './components/HistoryPanel';

const RESTMAN_DIR = join(homedir(), '.restman');
const HISTORY_FILE = join(RESTMAN_DIR, 'history.json');

/**
 * Ensures the .restman directory exists
 */
const ensureDirectoryExists = (): void => {
  if (!existsSync(RESTMAN_DIR)) {
    mkdirSync(RESTMAN_DIR, { recursive: true });
  }
};

/**
 * Load history from disk
 * Returns an empty array if the file doesn't exist or if there's an error
 */
export const loadHistory = async (): Promise<HistoryEntry[]> => {
  try {
    ensureDirectoryExists();

    if (!existsSync(HISTORY_FILE)) {
      return [];
    }

    const data = await readFile(HISTORY_FILE, 'utf-8');
    const parsed = JSON.parse(data);

    // Validate and convert timestamp strings back to Date objects
    const validEntries = parsed.filter((entry: any) => {
      // Ensure entry has required fields
      return (
        entry &&
        entry.id &&
        entry.timestamp &&
        entry.request &&
        entry.request.method &&
        entry.request.url &&
        entry.request.headers
      );
    });

    return validEntries.map((entry: any) => ({
      ...entry,
      timestamp: new Date(entry.timestamp),
    }));
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
};

/**
 * Save history to disk
 */
export const saveHistory = async (history: HistoryEntry[]): Promise<void> => {
  try {
    ensureDirectoryExists();

    // Limit history to last 100 entries to prevent file from growing too large
    const limitedHistory = history.slice(-100);

    const data = JSON.stringify(limitedHistory, null, 2);
    await writeFile(HISTORY_FILE, data, 'utf-8');
  } catch (error) {
    console.error('Failed to save history:', error);
  }
};

/**
 * Clear all history from disk
 */
export const clearHistory = async (): Promise<void> => {
  try {
    if (existsSync(HISTORY_FILE)) {
      await writeFile(HISTORY_FILE, '[]', 'utf-8');
    }
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
};
