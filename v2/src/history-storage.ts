import { existsSync, mkdirSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { homedir } from 'os';
import type { RequestOptions } from './http-client';

const RESTMAN_DIR = join(homedir(), '.restman');
const HISTORY_FILE = join(RESTMAN_DIR, 'history.json');

export interface HistoryEntry {
  id: number;
  timestamp: Date;
  request: RequestOptions;
  status?: number;
  statusText?: string;
  time?: number;
}

const ensureDirectoryExists = (): void => {
  if (!existsSync(RESTMAN_DIR)) {
    mkdirSync(RESTMAN_DIR, { recursive: true });
  }
};

export const loadHistory = async (): Promise<HistoryEntry[]> => {
  try {
    ensureDirectoryExists();

    if (!existsSync(HISTORY_FILE)) {
      return [];
    }

    const data = await readFile(HISTORY_FILE, 'utf-8');
    const parsed = JSON.parse(data);

    const validEntries = parsed.filter((entry: any) => {
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

export const saveHistory = async (history: HistoryEntry[]): Promise<void> => {
  try {
    ensureDirectoryExists();
    const limitedHistory = history.slice(-100);
    const data = JSON.stringify(limitedHistory, null, 2);
    await writeFile(HISTORY_FILE, data, 'utf-8');
  } catch (error) {
    console.error('Failed to save history:', error);
  }
};
