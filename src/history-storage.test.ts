import { describe, test, expect, beforeEach, mock } from 'bun:test';
import { join } from 'path';
import { homedir } from 'os';
import { loadHistory, saveHistory, type HistoryEntry } from './history-storage';
import type { RequestOptions } from './http-client';

// Mock fs and fs/promises modules
const mockExistsSync = mock(() => true);
const mockMkdirSync = mock(() => {});
const mockReadFile = mock(() => Promise.resolve('[]'));
const mockWriteFile = mock(() => Promise.resolve());

// Mock the modules
mock.module('fs', () => ({
  existsSync: mockExistsSync,
  mkdirSync: mockMkdirSync,
}));

mock.module('fs/promises', () => ({
  readFile: mockReadFile,
  writeFile: mockWriteFile,
}));

const RESTMAN_DIR = join(homedir(), '.restman');
const HISTORY_FILE = join(RESTMAN_DIR, 'history.json');

describe('history-storage', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    mockExistsSync.mockClear();
    mockMkdirSync.mockClear();
    mockReadFile.mockClear();
    mockWriteFile.mockClear();
  });

  describe('loadHistory', () => {
    describe('when history file does not exist', () => {
      test('should create directory if it does not exist', async () => {
        mockExistsSync.mockReturnValueOnce(false); // directory check
        mockExistsSync.mockReturnValueOnce(false); // file check

        await loadHistory();

        expect(mockMkdirSync).toHaveBeenCalledWith(RESTMAN_DIR, { recursive: true });
      });

      test('should return empty array when file does not exist', async () => {
        mockExistsSync.mockReturnValueOnce(true); // directory exists
        mockExistsSync.mockReturnValueOnce(false); // file does not exist

        const history = await loadHistory();

        expect(history).toEqual([]);
      });

      test('should not attempt to read file when it does not exist', async () => {
        mockExistsSync.mockReturnValue(false);

        await loadHistory();

        expect(mockReadFile).not.toHaveBeenCalled();
      });
    });

    describe('when history file exists', () => {
      test('should load and parse the file', async () => {
        mockExistsSync.mockReturnValue(true);
        const testHistory: HistoryEntry[] = [
          {
            id: 1,
            timestamp: new Date('2024-01-01T00:00:00.000Z'),
            request: {
              method: 'GET',
              url: 'https://api.example.com',
              headers: { 'Content-Type': 'application/json' },
            },
            status: 200,
            statusText: 'OK',
            time: 150,
          },
        ];
        mockReadFile.mockResolvedValueOnce(JSON.stringify(testHistory));

        const history = await loadHistory();

        expect(mockReadFile).toHaveBeenCalledWith(HISTORY_FILE, 'utf-8');
        expect(history).toHaveLength(1);
        expect(history[0]?.id).toBe(1);
        expect(history[0]?.timestamp).toBeInstanceOf(Date);
      });

      test('should convert timestamp strings to Date objects', async () => {
        mockExistsSync.mockReturnValue(true);
        const testHistory = [
          {
            id: 1,
            timestamp: '2024-01-01T12:00:00.000Z',
            request: {
              method: 'POST',
              url: 'https://api.example.com',
              headers: {},
            },
          },
        ];
        mockReadFile.mockResolvedValueOnce(JSON.stringify(testHistory));

        const history = await loadHistory();

        expect(history[0]?.timestamp).toBeInstanceOf(Date);
        expect(history[0]?.timestamp.toISOString()).toBe('2024-01-01T12:00:00.000Z');
      });

      test('should handle multiple history entries', async () => {
        mockExistsSync.mockReturnValue(true);
        const testHistory = [
          {
            id: 1,
            timestamp: '2024-01-01T00:00:00.000Z',
            request: { method: 'GET', url: 'https://api.example.com/1', headers: {} },
          },
          {
            id: 2,
            timestamp: '2024-01-02T00:00:00.000Z',
            request: { method: 'POST', url: 'https://api.example.com/2', headers: {} },
          },
          {
            id: 3,
            timestamp: '2024-01-03T00:00:00.000Z',
            request: { method: 'DELETE', url: 'https://api.example.com/3', headers: {} },
          },
        ];
        mockReadFile.mockResolvedValueOnce(JSON.stringify(testHistory));

        const history = await loadHistory();

        expect(history).toHaveLength(3);
        expect(history[0]?.id).toBe(1);
        expect(history[1]?.id).toBe(2);
        expect(history[2]?.id).toBe(3);
      });

      test('should preserve optional fields when present', async () => {
        mockExistsSync.mockReturnValue(true);
        const testHistory = [
          {
            id: 1,
            timestamp: '2024-01-01T00:00:00.000Z',
            request: {
              method: 'POST',
              url: 'https://api.example.com',
              headers: { Authorization: 'Bearer token' },
              body: '{"key":"value"}',
            },
            status: 201,
            statusText: 'Created',
            time: 250,
          },
        ];
        mockReadFile.mockResolvedValueOnce(JSON.stringify(testHistory));

        const history = await loadHistory();

        expect(history[0]?.status).toBe(201);
        expect(history[0]?.statusText).toBe('Created');
        expect(history[0]?.time).toBe(250);
        expect(history[0]?.request.body).toBe('{"key":"value"}');
      });

      test('should handle entries without optional fields', async () => {
        mockExistsSync.mockReturnValue(true);
        const testHistory = [
          {
            id: 1,
            timestamp: '2024-01-01T00:00:00.000Z',
            request: { method: 'GET', url: 'https://api.example.com', headers: {} },
          },
        ];
        mockReadFile.mockResolvedValueOnce(JSON.stringify(testHistory));

        const history = await loadHistory();

        expect(history[0]?.status).toBeUndefined();
        expect(history[0]?.statusText).toBeUndefined();
        expect(history[0]?.time).toBeUndefined();
      });
    });

    describe('entry validation', () => {
      test('should filter out entries missing id', async () => {
        mockExistsSync.mockReturnValue(true);
        const testHistory = [
          {
            timestamp: '2024-01-01T00:00:00.000Z',
            request: { method: 'GET', url: 'https://api.example.com', headers: {} },
          },
          {
            id: 2,
            timestamp: '2024-01-02T00:00:00.000Z',
            request: { method: 'POST', url: 'https://api.example.com', headers: {} },
          },
        ];
        mockReadFile.mockResolvedValueOnce(JSON.stringify(testHistory));

        const history = await loadHistory();

        expect(history).toHaveLength(1);
        expect(history[0]?.id).toBe(2);
      });

      test('should filter out entries missing timestamp', async () => {
        mockExistsSync.mockReturnValue(true);
        const testHistory = [
          {
            id: 1,
            request: { method: 'GET', url: 'https://api.example.com', headers: {} },
          },
          {
            id: 2,
            timestamp: '2024-01-02T00:00:00.000Z',
            request: { method: 'POST', url: 'https://api.example.com', headers: {} },
          },
        ];
        mockReadFile.mockResolvedValueOnce(JSON.stringify(testHistory));

        const history = await loadHistory();

        expect(history).toHaveLength(1);
        expect(history[0]?.id).toBe(2);
      });

      test('should filter out entries missing request object', async () => {
        mockExistsSync.mockReturnValue(true);
        const testHistory = [
          {
            id: 1,
            timestamp: '2024-01-01T00:00:00.000Z',
          },
          {
            id: 2,
            timestamp: '2024-01-02T00:00:00.000Z',
            request: { method: 'POST', url: 'https://api.example.com', headers: {} },
          },
        ];
        mockReadFile.mockResolvedValueOnce(JSON.stringify(testHistory));

        const history = await loadHistory();

        expect(history).toHaveLength(1);
        expect(history[0]?.id).toBe(2);
      });

      test('should filter out entries with request missing method', async () => {
        mockExistsSync.mockReturnValue(true);
        const testHistory = [
          {
            id: 1,
            timestamp: '2024-01-01T00:00:00.000Z',
            request: { url: 'https://api.example.com', headers: {} },
          },
          {
            id: 2,
            timestamp: '2024-01-02T00:00:00.000Z',
            request: { method: 'POST', url: 'https://api.example.com', headers: {} },
          },
        ];
        mockReadFile.mockResolvedValueOnce(JSON.stringify(testHistory));

        const history = await loadHistory();

        expect(history).toHaveLength(1);
        expect(history[0]?.id).toBe(2);
      });

      test('should filter out entries with request missing url', async () => {
        mockExistsSync.mockReturnValue(true);
        const testHistory = [
          {
            id: 1,
            timestamp: '2024-01-01T00:00:00.000Z',
            request: { method: 'GET', headers: {} },
          },
          {
            id: 2,
            timestamp: '2024-01-02T00:00:00.000Z',
            request: { method: 'POST', url: 'https://api.example.com', headers: {} },
          },
        ];
        mockReadFile.mockResolvedValueOnce(JSON.stringify(testHistory));

        const history = await loadHistory();

        expect(history).toHaveLength(1);
        expect(history[0]?.id).toBe(2);
      });

      test('should filter out entries with request missing headers', async () => {
        mockExistsSync.mockReturnValue(true);
        const testHistory = [
          {
            id: 1,
            timestamp: '2024-01-01T00:00:00.000Z',
            request: { method: 'GET', url: 'https://api.example.com' },
          },
          {
            id: 2,
            timestamp: '2024-01-02T00:00:00.000Z',
            request: { method: 'POST', url: 'https://api.example.com', headers: {} },
          },
        ];
        mockReadFile.mockResolvedValueOnce(JSON.stringify(testHistory));

        const history = await loadHistory();

        expect(history).toHaveLength(1);
        expect(history[0]?.id).toBe(2);
      });

      test('should filter out null entries', async () => {
        mockExistsSync.mockReturnValue(true);
        const testHistory = [
          null,
          {
            id: 2,
            timestamp: '2024-01-02T00:00:00.000Z',
            request: { method: 'POST', url: 'https://api.example.com', headers: {} },
          },
        ];
        mockReadFile.mockResolvedValueOnce(JSON.stringify(testHistory));

        const history = await loadHistory();

        expect(history).toHaveLength(1);
        expect(history[0]?.id).toBe(2);
      });

      test('should return only valid entries when mix of valid and invalid', async () => {
        mockExistsSync.mockReturnValue(true);
        const testHistory = [
          {
            id: 1,
            timestamp: '2024-01-01T00:00:00.000Z',
            request: { method: 'GET', url: 'https://api.example.com', headers: {} },
          },
          { id: 2 }, // missing timestamp and request
          null,
          {
            id: 4,
            timestamp: '2024-01-04T00:00:00.000Z',
            request: { method: 'POST', url: 'https://api.example.com', headers: {} },
          },
        ];
        mockReadFile.mockResolvedValueOnce(JSON.stringify(testHistory));

        const history = await loadHistory();

        expect(history).toHaveLength(2);
        expect(history[0]?.id).toBe(1);
        expect(history[1]?.id).toBe(4);
      });
    });

    describe('error handling', () => {
      test('should return empty array if file read fails', async () => {
        mockExistsSync.mockReturnValue(true);
        mockReadFile.mockRejectedValueOnce(new Error('Read error'));

        const history = await loadHistory();

        expect(history).toEqual([]);
      });

      test('should return empty array if JSON parse fails', async () => {
        mockExistsSync.mockReturnValue(true);
        mockReadFile.mockResolvedValueOnce('invalid json{');

        const history = await loadHistory();

        expect(history).toEqual([]);
      });

      test('should log error when file read fails', async () => {
        const consoleErrorSpy = mock(() => {});
        const originalConsoleError = console.error;
        console.error = consoleErrorSpy;

        mockExistsSync.mockReturnValue(true);
        mockReadFile.mockRejectedValueOnce(new Error('Read error'));

        await loadHistory();

        expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to load history:', expect.any(Error));

        console.error = originalConsoleError;
      });

      test('should handle non-array JSON data', async () => {
        mockExistsSync.mockReturnValue(true);
        mockReadFile.mockResolvedValueOnce(JSON.stringify({ not: 'an array' }));

        const history = await loadHistory();

        expect(history).toEqual([]);
      });

      test('should handle empty string file content', async () => {
        mockExistsSync.mockReturnValue(true);
        mockReadFile.mockResolvedValueOnce('');

        const history = await loadHistory();

        expect(history).toEqual([]);
      });

      test('should return empty array when parsed data is null', async () => {
        mockExistsSync.mockReturnValue(true);
        mockReadFile.mockResolvedValueOnce('null');

        const history = await loadHistory();

        expect(history).toEqual([]);
      });
    });
  });

  describe('saveHistory', () => {
    test('should save history to file with proper formatting', async () => {
      mockExistsSync.mockReturnValue(true);
      const history: HistoryEntry[] = [
        {
          id: 1,
          timestamp: new Date('2024-01-01T00:00:00.000Z'),
          request: {
            method: 'GET',
            url: 'https://api.example.com',
            headers: { 'Content-Type': 'application/json' },
          },
          status: 200,
          statusText: 'OK',
          time: 150,
        },
      ];

      await saveHistory(history);

      expect(mockWriteFile).toHaveBeenCalledWith(
        HISTORY_FILE,
        JSON.stringify(history, null, 2),
        'utf-8',
      );
    });

    test('should create directory if it does not exist', async () => {
      mockExistsSync.mockReturnValue(false);
      const history: HistoryEntry[] = [];

      await saveHistory(history);

      expect(mockMkdirSync).toHaveBeenCalledWith(RESTMAN_DIR, { recursive: true });
    });

    test('should handle empty history array', async () => {
      mockExistsSync.mockReturnValue(true);
      const history: HistoryEntry[] = [];

      await saveHistory(history);

      expect(mockWriteFile).toHaveBeenCalledWith(
        HISTORY_FILE,
        JSON.stringify([], null, 2),
        'utf-8',
      );
    });

    test('should limit history to last 100 entries', async () => {
      mockExistsSync.mockReturnValue(true);
      const history: HistoryEntry[] = Array.from({ length: 150 }, (_, i) => ({
        id: i + 1,
        timestamp: new Date('2024-01-01T00:00:00.000Z'),
        request: {
          method: 'GET',
          url: `https://api.example.com/${i}`,
          headers: {},
        },
      }));

      await saveHistory(history);

      const calls = mockWriteFile.mock.calls as unknown as Array<[string, string, string]>;
      const savedData = JSON.parse(calls[0]![1]);
      expect(savedData).toHaveLength(100);
      expect(savedData[0].id).toBe(51); // First of the last 100 entries
      expect(savedData[99].id).toBe(150); // Last entry
    });

    test('should preserve all entries when less than 100', async () => {
      mockExistsSync.mockReturnValue(true);
      const history: HistoryEntry[] = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        timestamp: new Date('2024-01-01T00:00:00.000Z'),
        request: {
          method: 'GET',
          url: `https://api.example.com/${i}`,
          headers: {},
        },
      }));

      await saveHistory(history);

      const calls = mockWriteFile.mock.calls as unknown as Array<[string, string, string]>;
      const savedData = JSON.parse(calls[0]![1]);
      expect(savedData).toHaveLength(50);
      expect(savedData[0].id).toBe(1);
      expect(savedData[49].id).toBe(50);
    });

    test('should save exactly 100 entries when history has exactly 100', async () => {
      mockExistsSync.mockReturnValue(true);
      const history: HistoryEntry[] = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        timestamp: new Date('2024-01-01T00:00:00.000Z'),
        request: {
          method: 'GET',
          url: `https://api.example.com/${i}`,
          headers: {},
        },
      }));

      await saveHistory(history);

      const calls = mockWriteFile.mock.calls as unknown as Array<[string, string, string]>;
      const savedData = JSON.parse(calls[0]![1]);
      expect(savedData).toHaveLength(100);
      expect(savedData[0].id).toBe(1);
      expect(savedData[99].id).toBe(100);
    });

    test('should preserve all fields including optional ones', async () => {
      mockExistsSync.mockReturnValue(true);
      const history: HistoryEntry[] = [
        {
          id: 1,
          timestamp: new Date('2024-01-01T12:00:00.000Z'),
          request: {
            method: 'POST',
            url: 'https://api.example.com',
            headers: { Authorization: 'Bearer token', 'Content-Type': 'application/json' },
            body: '{"key":"value"}',
          },
          status: 201,
          statusText: 'Created',
          time: 250,
        },
      ];

      await saveHistory(history);

      const calls = mockWriteFile.mock.calls as unknown as Array<[string, string, string]>;
      const savedData = JSON.parse(calls[0]![1]);
      expect(savedData[0].status).toBe(201);
      expect(savedData[0].statusText).toBe('Created');
      expect(savedData[0].time).toBe(250);
      expect(savedData[0].request.body).toBe('{"key":"value"}');
    });

    test('should handle entries without optional fields', async () => {
      mockExistsSync.mockReturnValue(true);
      const history: HistoryEntry[] = [
        {
          id: 1,
          timestamp: new Date('2024-01-01T00:00:00.000Z'),
          request: {
            method: 'GET',
            url: 'https://api.example.com',
            headers: {},
          },
        },
      ];

      await saveHistory(history);

      const calls = mockWriteFile.mock.calls as unknown as Array<[string, string, string]>;
      const savedData = JSON.parse(calls[0]![1]);
      expect(savedData[0].status).toBeUndefined();
      expect(savedData[0].statusText).toBeUndefined();
      expect(savedData[0].time).toBeUndefined();
    });

    describe('error handling', () => {
      test('should log error when write fails', async () => {
        const consoleErrorSpy = mock(() => {});
        const originalConsoleError = console.error;
        console.error = consoleErrorSpy;

        mockExistsSync.mockReturnValue(true);
        mockWriteFile.mockRejectedValueOnce(new Error('Write error'));

        const history: HistoryEntry[] = [
          {
            id: 1,
            timestamp: new Date('2024-01-01T00:00:00.000Z'),
            request: { method: 'GET', url: 'https://api.example.com', headers: {} },
          },
        ];

        await saveHistory(history);

        expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to save history:', expect.any(Error));

        console.error = originalConsoleError;
      });

      test('should not throw when write fails', async () => {
        mockExistsSync.mockReturnValue(true);
        mockWriteFile.mockRejectedValueOnce(new Error('Write error'));

        const history: HistoryEntry[] = [
          {
            id: 1,
            timestamp: new Date('2024-01-01T00:00:00.000Z'),
            request: { method: 'GET', url: 'https://api.example.com', headers: {} },
          },
        ];

        await expect(saveHistory(history)).resolves.toBeUndefined();
      });

      test('should log error when directory creation fails', async () => {
        const consoleErrorSpy = mock(() => {});
        const originalConsoleError = console.error;
        console.error = consoleErrorSpy;

        mockExistsSync.mockReturnValue(false);
        mockMkdirSync.mockImplementationOnce(() => {
          throw new Error('Directory creation failed');
        });

        const history: HistoryEntry[] = [];

        await saveHistory(history);

        expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to save history:', expect.any(Error));

        console.error = originalConsoleError;
      });
    });
  });
});
