import { existsSync, mkdirSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { homedir } from "os";
import type { RequestOptions } from "./http-client";

const RESTMAN_DIR = join(homedir(), ".restman");
const SAVED_REQUESTS_FILE = join(RESTMAN_DIR, "saved-requests.json");

export interface SavedRequest {
  id: number;
  name: string;
  timestamp: Date;
  request: RequestOptions;
}

/**
 * Ensures the .restman directory exists
 */
const ensureDirectoryExists = (): void => {
  if (!existsSync(RESTMAN_DIR)) {
    mkdirSync(RESTMAN_DIR, { recursive: true });
  }
};

/**
 * Load saved requests from disk
 * Returns an empty array if the file doesn't exist or if there's an error
 */
export const loadSavedRequests = async (): Promise<SavedRequest[]> => {
  try {
    ensureDirectoryExists();
    
    if (!existsSync(SAVED_REQUESTS_FILE)) {
      return [];
    }

    const data = await readFile(SAVED_REQUESTS_FILE, "utf-8");
    const parsed = JSON.parse(data);
    
    // Validate and convert timestamp strings back to Date objects
    const validEntries = parsed.filter((entry: any) => {
      return entry && 
             entry.id && 
             entry.name &&
             entry.timestamp && 
             entry.request && 
             entry.request.method && 
             entry.request.url && 
             entry.request.headers;
    });
    
    return validEntries.map((entry: any) => ({
      ...entry,
      timestamp: new Date(entry.timestamp),
    }));
  } catch (error) {
    console.error("Failed to load saved requests:", error);
    return [];
  }
};

/**
 * Save requests to disk
 */
export const saveSavedRequests = async (savedRequests: SavedRequest[]): Promise<void> => {
  try {
    ensureDirectoryExists();
    
    const data = JSON.stringify(savedRequests, null, 2);
    await writeFile(SAVED_REQUESTS_FILE, data, "utf-8");
  } catch (error) {
    console.error("Failed to save saved requests:", error);
  }
};

/**
 * Delete a saved request by ID
 */
export const deleteSavedRequest = async (id: number): Promise<void> => {
  try {
    const savedRequests = await loadSavedRequests();
    const filtered = savedRequests.filter(req => req.id !== id);
    await saveSavedRequests(filtered);
  } catch (error) {
    console.error("Failed to delete saved request:", error);
  }
};
