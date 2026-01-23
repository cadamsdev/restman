import { describe, test, expect, beforeEach, afterEach, mock, jest } from 'bun:test';
import { join } from 'path';
import { homedir } from 'os';
import { loadSavedRequests, saveSavedRequests, type SavedRequest } from './saved-requests-storage';
import type { RequestOptions } from './http-client';

describe('saved-requests-storage', () => {
  const RESTMAN_DIR = join(homedir(), '.restman');
  const SAVED_REQUESTS_FILE = join(RESTMAN_DIR, 'saved-requests.json');

  const mockRequest: RequestOptions = {
    method: 'GET',
    url: 'https://api.example.com/users',
    headers: { 'Content-Type': 'application/json' },
    body: '',
  };

  const mockSavedRequest: SavedRequest = {
    id: 1,
    name: 'Test Request',
    timestamp: new Date('2026-01-22T10:00:00.000Z'),
    request: mockRequest,
  };

  beforeEach(() => {
    // Reset all mocks before each test
    mock.restore();
  });

  afterEach(() => {
    // Cleanup after each test
    mock.restore();
  });

  describe('loadSavedRequests', () => {
    test('should return empty array when file does not exist', async () => {
      void mock.module('fs', () => ({
        existsSync: mock((path: string) => {
          if (path === RESTMAN_DIR) return true;
          if (path === SAVED_REQUESTS_FILE) return false;
          return false;
        }),
        mkdirSync: mock(() => {}),
      }));

      const result = await loadSavedRequests();

      expect(result).toEqual([]);
    });

    test('should create directory if it does not exist', async () => {
      const mkdirMock = mock(() => {});
      
      void mock.module('fs', () => ({
        existsSync: mock((path: string) => {
          if (path === RESTMAN_DIR) return false;
          if (path === SAVED_REQUESTS_FILE) return false;
          return false;
        }),
        mkdirSync: mkdirMock,
      }));

      await loadSavedRequests();

      expect(mkdirMock).toHaveBeenCalledWith(RESTMAN_DIR, { recursive: true });
    });

    test('should load and parse valid saved requests', async () => {
      const savedRequestsData = [
        {
          id: 1,
          name: 'Test Request',
          timestamp: '2026-01-22T10:00:00.000Z',
          request: mockRequest,
        },
        {
          id: 2,
          name: 'Another Request',
          timestamp: '2026-01-22T11:00:00.000Z',
          request: { ...mockRequest, method: 'POST' },
        },
      ];

      void mock.module('fs', () => ({
        existsSync: mock(() => true),
        mkdirSync: mock(() => {}),
      }));

      void mock.module('fs/promises', () => ({
        readFile: mock(() => Promise.resolve(JSON.stringify(savedRequestsData))),
        writeFile: mock(() => Promise.resolve()),
      }));

      const result = await loadSavedRequests();

      expect(result).toHaveLength(2);
      expect(result[0]?.id).toBe(1);
      expect(result[0]?.name).toBe('Test Request');
      expect(result[0]?.timestamp).toBeInstanceOf(Date);
      expect(result[0]?.request.method).toBe('GET');
      expect(result[1]?.id).toBe(2);
    });

    test('should filter out invalid entries missing required fields', async () => {
      const mixedData = [
        // Valid entry
        {
          id: 1,
          name: 'Valid Request',
          timestamp: '2026-01-22T10:00:00.000Z',
          request: mockRequest,
        },
        // Missing id
        {
          name: 'Missing ID',
          timestamp: '2026-01-22T10:00:00.000Z',
          request: mockRequest,
        },
        // Missing name
        {
          id: 2,
          timestamp: '2026-01-22T10:00:00.000Z',
          request: mockRequest,
        },
        // Missing request.method
        {
          id: 3,
          name: 'Missing Method',
          timestamp: '2026-01-22T10:00:00.000Z',
          request: { url: 'https://example.com', headers: {} },
        },
        // Valid entry
        {
          id: 4,
          name: 'Another Valid',
          timestamp: '2026-01-22T11:00:00.000Z',
          request: mockRequest,
        },
      ];

      void mock.module('fs', () => ({
        existsSync: mock(() => true),
        mkdirSync: mock(() => {}),
      }));

      void mock.module('fs/promises', () => ({
        readFile: mock(() => Promise.resolve(JSON.stringify(mixedData))),
        writeFile: mock(() => Promise.resolve()),
      }));

      const result = await loadSavedRequests();

      expect(result).toHaveLength(2);
      expect(result[0]?.id).toBe(1);
      expect(result[1]?.id).toBe(4);
    });

    test('should convert timestamp strings to Date objects', async () => {
      const savedRequestsData = [
        {
          id: 1,
          name: 'Test Request',
          timestamp: '2026-01-22T10:00:00.000Z',
          request: mockRequest,
        },
      ];

      void mock.module('fs', () => ({
        existsSync: mock(() => true),
        mkdirSync: mock(() => {}),
      }));

      void mock.module('fs/promises', () => ({
        readFile: mock(() => Promise.resolve(JSON.stringify(savedRequestsData))),
        writeFile: mock(() => Promise.resolve()),
      }));

      const result = await loadSavedRequests();

      expect(result[0]?.timestamp).toBeInstanceOf(Date);
      expect(result[0]?.timestamp.toISOString()).toBe('2026-01-22T10:00:00.000Z');
    });

    test('should return empty array on JSON parse error', async () => {
      const consoleErrorMock = mock(() => {});
      const originalConsoleError = console.error;
      console.error = consoleErrorMock;

      void mock.module('fs', () => ({
        existsSync: mock(() => true),
        mkdirSync: mock(() => {}),
      }));

      void mock.module('fs/promises', () => ({
        readFile: mock(() => Promise.resolve('invalid json{')),
        writeFile: mock(() => Promise.resolve()),
      }));

      const result = await loadSavedRequests();

      expect(result).toEqual([]);
      expect(consoleErrorMock).toHaveBeenCalled();

      console.error = originalConsoleError;
    });

    test('should return empty array on file read error', async () => {
      const consoleErrorMock = mock(() => {});
      const originalConsoleError = console.error;
      console.error = consoleErrorMock;

      void mock.module('fs', () => ({
        existsSync: mock(() => true),
        mkdirSync: mock(() => {}),
      }));

      void mock.module('fs/promises', () => ({
        readFile: mock(() => Promise.reject(new Error('File read failed'))),
        writeFile: mock(() => Promise.resolve()),
      }));

      const result = await loadSavedRequests();

      expect(result).toEqual([]);
      expect(consoleErrorMock).toHaveBeenCalled();

      console.error = originalConsoleError;
    });

    test('should handle empty array in file', async () => {
      void mock.module('fs', () => ({
        existsSync: mock(() => true),
        mkdirSync: mock(() => {}),
      }));

      void mock.module('fs/promises', () => ({
        readFile: mock(() => Promise.resolve('[]')),
        writeFile: mock(() => Promise.resolve()),
      }));

      const result = await loadSavedRequests();

      expect(result).toEqual([]);
    });

    test('should handle null entries in array', async () => {
      const dataWithNulls = [
        {
          id: 1,
          name: 'Valid Request',
          timestamp: '2026-01-22T10:00:00.000Z',
          request: mockRequest,
        },
        null,
        {
          id: 2,
          name: 'Another Valid',
          timestamp: '2026-01-22T11:00:00.000Z',
          request: mockRequest,
        },
      ];

      void mock.module('fs', () => ({
        existsSync: mock(() => true),
        mkdirSync: mock(() => {}),
      }));

      void mock.module('fs/promises', () => ({
        readFile: mock(() => Promise.resolve(JSON.stringify(dataWithNulls))),
        writeFile: mock(() => Promise.resolve()),
      }));

      const result = await loadSavedRequests();

      expect(result).toHaveLength(2);
      expect(result[0]?.id).toBe(1);
      expect(result[1]?.id).toBe(2);
    });
  });

  describe('saveSavedRequests', () => {
    test('should create directory if it does not exist', async () => {
      const mkdirMock = mock(() => {});

      void mock.module('fs', () => ({
        existsSync: mock((path: string) => path !== RESTMAN_DIR),
        mkdirSync: mkdirMock,
      }));

      const writeFileMock = mock(() => Promise.resolve());
      void mock.module('fs/promises', () => ({
        readFile: mock(() => Promise.resolve('[]')),
        writeFile: writeFileMock,
      }));

      await saveSavedRequests([mockSavedRequest]);

      expect(mkdirMock).toHaveBeenCalledWith(RESTMAN_DIR, { recursive: true });
    });

    test('should write saved requests to file with proper formatting', async () => {
      void mock.module('fs', () => ({
        existsSync: mock(() => true),
        mkdirSync: mock(() => {}),
      }));

      const writeFileMock = mock(() => Promise.resolve());
      void mock.module('fs/promises', () => ({
        readFile: mock(() => Promise.resolve('[]')),
        writeFile: writeFileMock,
      }));

      const requests = [mockSavedRequest];
      await saveSavedRequests(requests);

      expect(writeFileMock).toHaveBeenCalledWith(
        SAVED_REQUESTS_FILE,
        JSON.stringify(requests, null, 2),
        'utf-8'
      );
    });

    test('should save multiple requests', async () => {
      let capturedPath = '';
      let capturedData = '';
      
      void mock.module('fs', () => ({
        existsSync: mock(() => true),
        mkdirSync: mock(() => {}),
      }));

      const writeFileMock = jest.fn((path: string, data: string) => {
        capturedPath = path;
        capturedData = data;
        return Promise.resolve();
      });
      
      void mock.module('fs/promises', () => ({
        readFile: mock(() => Promise.resolve('[]')),
        writeFile: writeFileMock,
      }));

      const requests = [
        mockSavedRequest,
        {
          id: 2,
          name: 'Second Request',
          timestamp: new Date('2026-01-22T11:00:00.000Z'),
          request: { ...mockRequest, method: 'POST' },
        },
      ];

      await saveSavedRequests(requests);

      expect(writeFileMock).toHaveBeenCalled();
      expect(capturedPath).toBe(SAVED_REQUESTS_FILE);
      const writtenData = JSON.parse(capturedData);
      expect(writtenData).toHaveLength(2);
    });

    test('should save empty array', async () => {
      void mock.module('fs', () => ({
        existsSync: mock(() => true),
        mkdirSync: mock(() => {}),
      }));

      const writeFileMock = mock(() => Promise.resolve());
      void mock.module('fs/promises', () => ({
        readFile: mock(() => Promise.resolve('[]')),
        writeFile: writeFileMock,
      }));

      await saveSavedRequests([]);

      expect(writeFileMock).toHaveBeenCalledWith(
        SAVED_REQUESTS_FILE,
        JSON.stringify([], null, 2),
        'utf-8'
      );
    });

    test('should handle write errors gracefully', async () => {
      const consoleErrorMock = mock(() => {});
      const originalConsoleError = console.error;
      console.error = consoleErrorMock;

      void mock.module('fs', () => ({
        existsSync: mock(() => true),
        mkdirSync: mock(() => {}),
      }));

      void mock.module('fs/promises', () => ({
        readFile: mock(() => Promise.resolve('[]')),
        writeFile: mock(() => Promise.reject(new Error('Write failed'))),
      }));

      // Should not throw
      await saveSavedRequests([mockSavedRequest]);

      expect(consoleErrorMock).toHaveBeenCalled();

      console.error = originalConsoleError;
    });

    test('should preserve all request properties', async () => {
      let capturedData = '';
      
      void mock.module('fs', () => ({
        existsSync: mock(() => true),
        mkdirSync: mock(() => {}),
      }));

      const writeFileMock = jest.fn((path: string, data: string) => {
        capturedData = data;
        return Promise.resolve();
      });
      
      void mock.module('fs/promises', () => ({
        readFile: mock(() => Promise.resolve('[]')),
        writeFile: writeFileMock,
      }));

      const complexRequest: SavedRequest = {
        id: 123,
        name: 'Complex Request',
        timestamp: new Date('2026-01-22T10:00:00.000Z'),
        request: {
          method: 'POST',
          url: 'https://api.example.com/users',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer token123',
          },
          body: JSON.stringify({ username: 'test', email: 'test@example.com' }),
        },
      };

      await saveSavedRequests([complexRequest]);

      const writtenData = JSON.parse(capturedData);
      
      expect(writtenData[0]?.id).toBe(123);
      expect(writtenData[0]?.name).toBe('Complex Request');
      expect(writtenData[0]?.request.method).toBe('POST');
      expect(writtenData[0]?.request.headers['Authorization']).toBe('Bearer token123');
      expect(writtenData[0]?.request.body).toContain('test@example.com');
    });
  });
});
