import { existsSync, mkdirSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { homedir } from 'os';
import type { RequestOptions } from './http-client';

const RESTMAN_DIR = join(homedir(), '.restman');
const SAVED_REQUESTS_FILE = join(RESTMAN_DIR, 'saved-requests.json');

export interface SavedRequest {
  id: number;
  name: string;
  timestamp: Date;
  request: RequestOptions;
}

const ensureDirectoryExists = (): void => {
  if (!existsSync(RESTMAN_DIR)) {
    mkdirSync(RESTMAN_DIR, { recursive: true });
  }
};

export const loadSavedRequests = async (): Promise<SavedRequest[]> => {
  try {
    ensureDirectoryExists();

    if (!existsSync(SAVED_REQUESTS_FILE)) {
      return [];
    }

    const data = await readFile(SAVED_REQUESTS_FILE, 'utf-8');
    const parsed = JSON.parse(data);

    const validEntries = parsed.filter((entry: any) => {
      return (
        entry &&
        entry.id &&
        entry.name &&
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
    console.error('Failed to load saved requests:', error);
    return [];
  }
};

export const saveSavedRequests = async (savedRequests: SavedRequest[]): Promise<void> => {
  try {
    ensureDirectoryExists();
    const data = JSON.stringify(savedRequests, null, 2);
    await writeFile(SAVED_REQUESTS_FILE, data, 'utf-8');
  } catch (error) {
    console.error('Failed to save saved requests:', error);
  }
};
