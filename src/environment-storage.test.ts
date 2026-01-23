import { describe, test, expect, beforeEach, mock } from 'bun:test';
import { join } from 'path';
import { homedir } from 'os';
import {
  loadEnvironments,
  saveEnvironments,
  getActiveEnvironment,
  setActiveEnvironment,
  addEnvironment,
  updateEnvironment,
  deleteEnvironment,
  type Environment,
  type EnvironmentsConfig,
} from './environment-storage';

// Mock fs and fs/promises modules
const mockExistsSync = mock(() => true);
const mockMkdirSync = mock(() => {});
const mockReadFile = mock(() => Promise.resolve('{}'));
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
const ENVIRONMENTS_FILE = join(RESTMAN_DIR, 'environments.json');

describe('environment-storage', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    mockExistsSync.mockClear();
    mockMkdirSync.mockClear();
    mockReadFile.mockClear();
    mockWriteFile.mockClear();
  });

  describe('loadEnvironments', () => {
    describe('when environments file does not exist', () => {
      test('should create directory if it does not exist', async () => {
        mockExistsSync.mockReturnValueOnce(false); // directory check
        mockExistsSync.mockReturnValueOnce(false); // file check

        await loadEnvironments();

        expect(mockMkdirSync).toHaveBeenCalledWith(RESTMAN_DIR, { recursive: true });
      });

      test('should return default config with 3 environments', async () => {
        mockExistsSync.mockReturnValue(false);

        const config = await loadEnvironments();

        expect(config.environments).toHaveLength(3);
        expect(config.environments[0]?.name).toBe('Development');
        expect(config.environments[1]?.name).toBe('Staging');
        expect(config.environments[2]?.name).toBe('Production');
      });

      test('should set Development as active environment', async () => {
        mockExistsSync.mockReturnValue(false);

        const config = await loadEnvironments();

        expect(config.activeEnvironmentId).toBe(1);
      });

      test('should save default config to disk', async () => {
        mockExistsSync.mockReturnValue(false);

        await loadEnvironments();

        expect(mockWriteFile).toHaveBeenCalledWith(ENVIRONMENTS_FILE, expect.any(String), 'utf-8');
      });

      test('should include variables in default environments', async () => {
        mockExistsSync.mockReturnValue(false);

        const config = await loadEnvironments();

        expect(config.environments[0]?.variables).toEqual({
          BASE_URL: 'http://localhost:3000',
          API_KEY: 'dev-api-key-12345',
          AUTH_TOKEN: 'Bearer dev-token',
        });
        expect(config.environments[1]?.variables).toHaveProperty('BASE_URL');
        expect(config.environments[2]?.variables).toHaveProperty('BASE_URL');
      });
    });

    describe('when environments file exists', () => {
      test('should load and parse the file', async () => {
        mockExistsSync.mockReturnValue(true);
        const testConfig: EnvironmentsConfig = {
          activeEnvironmentId: 5,
          environments: [{ id: 5, name: 'Test', variables: { KEY: 'value' } }],
        };
        mockReadFile.mockResolvedValueOnce(JSON.stringify(testConfig));

        const config = await loadEnvironments();

        expect(mockReadFile).toHaveBeenCalledWith(ENVIRONMENTS_FILE, 'utf-8');
        expect(config).toEqual(testConfig);
      });

      test('should not create directory if it already exists', async () => {
        mockExistsSync.mockReturnValue(true);
        mockReadFile.mockResolvedValueOnce(
          JSON.stringify({ activeEnvironmentId: null, environments: [] }),
        );

        await loadEnvironments();

        expect(mockMkdirSync).not.toHaveBeenCalled();
      });

      test('should handle empty environments array', async () => {
        mockExistsSync.mockReturnValue(true);
        const emptyConfig: EnvironmentsConfig = {
          activeEnvironmentId: null,
          environments: [],
        };
        mockReadFile.mockResolvedValueOnce(JSON.stringify(emptyConfig));

        const config = await loadEnvironments();

        expect(config).toEqual(emptyConfig);
      });

      test('should handle null active environment ID', async () => {
        mockExistsSync.mockReturnValue(true);
        const configWithNull: EnvironmentsConfig = {
          activeEnvironmentId: null,
          environments: [{ id: 1, name: 'Test', variables: {} }],
        };
        mockReadFile.mockResolvedValueOnce(JSON.stringify(configWithNull));

        const config = await loadEnvironments();

        expect(config.activeEnvironmentId).toBeNull();
      });
    });

    describe('error handling', () => {
      test('should return default config if file read fails', async () => {
        mockExistsSync.mockReturnValue(true);
        mockReadFile.mockRejectedValueOnce(new Error('Read error'));

        const config = await loadEnvironments();

        expect(config.environments).toHaveLength(3);
        expect(config.activeEnvironmentId).toBe(1);
      });

      test('should return default config if JSON parse fails', async () => {
        mockExistsSync.mockReturnValue(true);
        mockReadFile.mockResolvedValueOnce('invalid json{');

        const config = await loadEnvironments();

        expect(config.environments).toHaveLength(3);
        expect(config.activeEnvironmentId).toBe(1);
      });

      test('should return default config if parsed data is null', async () => {
        mockExistsSync.mockReturnValue(true);
        mockReadFile.mockResolvedValueOnce('null');

        const config = await loadEnvironments();

        expect(config.environments).toHaveLength(3);
      });

      test('should return default config if environments is not an array', async () => {
        mockExistsSync.mockReturnValue(true);
        mockReadFile.mockResolvedValueOnce(
          JSON.stringify({ activeEnvironmentId: 1, environments: 'not an array' }),
        );

        const config = await loadEnvironments();

        expect(config.environments).toHaveLength(3);
      });

      test('should return default config if environments property is missing', async () => {
        mockExistsSync.mockReturnValue(true);
        mockReadFile.mockResolvedValueOnce(JSON.stringify({ activeEnvironmentId: 1 }));

        const config = await loadEnvironments();

        expect(config.environments).toHaveLength(3);
      });

      test('should log error when file read fails', async () => {
        const consoleErrorSpy = mock(() => {});
        const originalConsoleError = console.error;
        console.error = consoleErrorSpy;

        mockExistsSync.mockReturnValue(true);
        mockReadFile.mockRejectedValueOnce(new Error('Read error'));

        await loadEnvironments();

        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Failed to load environments:',
          expect.any(Error),
        );

        console.error = originalConsoleError;
      });
    });
  });

  describe('saveEnvironments', () => {
    test('should save config to file with proper formatting', async () => {
      mockExistsSync.mockReturnValue(true);
      const config: EnvironmentsConfig = {
        activeEnvironmentId: 1,
        environments: [{ id: 1, name: 'Test', variables: { KEY: 'value' } }],
      };

      await saveEnvironments(config);

      expect(mockWriteFile).toHaveBeenCalledWith(
        ENVIRONMENTS_FILE,
        JSON.stringify(config, null, 2),
        'utf-8',
      );
    });

    test('should create directory if it does not exist', async () => {
      mockExistsSync.mockReturnValue(false);
      const config: EnvironmentsConfig = {
        activeEnvironmentId: null,
        environments: [],
      };

      await saveEnvironments(config);

      expect(mockMkdirSync).toHaveBeenCalledWith(RESTMAN_DIR, { recursive: true });
    });

    test('should handle empty environments array', async () => {
      mockExistsSync.mockReturnValue(true);
      const config: EnvironmentsConfig = {
        activeEnvironmentId: null,
        environments: [],
      };

      await saveEnvironments(config);

      expect(mockWriteFile).toHaveBeenCalledWith(
        ENVIRONMENTS_FILE,
        JSON.stringify(config, null, 2),
        'utf-8',
      );
    });

    test('should handle null active environment ID', async () => {
      mockExistsSync.mockReturnValue(true);
      const config: EnvironmentsConfig = {
        activeEnvironmentId: null,
        environments: [{ id: 1, name: 'Test', variables: {} }],
      };

      await saveEnvironments(config);

      expect(mockWriteFile).toHaveBeenCalled();
      const calls = mockWriteFile.mock.calls as unknown as Array<[string, string, string]>;
      const savedData = JSON.parse(calls[0]![1]);
      expect(savedData.activeEnvironmentId).toBeNull();
    });

    describe('error handling', () => {
      test('should log error when write fails', async () => {
        const consoleErrorSpy = mock(() => {});
        const originalConsoleError = console.error;
        console.error = consoleErrorSpy;

        mockExistsSync.mockReturnValue(true);
        mockWriteFile.mockRejectedValueOnce(new Error('Write error'));

        const config: EnvironmentsConfig = {
          activeEnvironmentId: 1,
          environments: [],
        };

        await saveEnvironments(config);

        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Failed to save environments:',
          expect.any(Error),
        );

        console.error = originalConsoleError;
      });

      test('should not throw when write fails', async () => {
        mockExistsSync.mockReturnValue(true);
        mockWriteFile.mockRejectedValueOnce(new Error('Write error'));

        const config: EnvironmentsConfig = {
          activeEnvironmentId: 1,
          environments: [],
        };

        await expect(saveEnvironments(config)).resolves.toBeUndefined();
      });
    });
  });

  describe('getActiveEnvironment', () => {
    test('should return the active environment when it exists', () => {
      const config: EnvironmentsConfig = {
        activeEnvironmentId: 2,
        environments: [
          { id: 1, name: 'Dev', variables: {} },
          { id: 2, name: 'Staging', variables: { KEY: 'value' } },
          { id: 3, name: 'Prod', variables: {} },
        ],
      };

      const result = getActiveEnvironment(config);

      expect(result).toEqual({ id: 2, name: 'Staging', variables: { KEY: 'value' } });
    });

    test('should return null when active environment ID is null', () => {
      const config: EnvironmentsConfig = {
        activeEnvironmentId: null,
        environments: [{ id: 1, name: 'Dev', variables: {} }],
      };

      const result = getActiveEnvironment(config);

      expect(result).toBeNull();
    });

    test('should return null when active environment ID does not match any environment', () => {
      const config: EnvironmentsConfig = {
        activeEnvironmentId: 999,
        environments: [
          { id: 1, name: 'Dev', variables: {} },
          { id: 2, name: 'Staging', variables: {} },
        ],
      };

      const result = getActiveEnvironment(config);

      expect(result).toBeNull();
    });

    test('should return null when environments array is empty', () => {
      const config: EnvironmentsConfig = {
        activeEnvironmentId: 1,
        environments: [],
      };

      const result = getActiveEnvironment(config);

      expect(result).toBeNull();
    });

    test('should return first matching environment if multiple have same ID', () => {
      const config: EnvironmentsConfig = {
        activeEnvironmentId: 1,
        environments: [
          { id: 1, name: 'First', variables: { A: 'a' } },
          { id: 1, name: 'Second', variables: { B: 'b' } },
        ],
      };

      const result = getActiveEnvironment(config);

      expect(result?.name).toBe('First');
    });
  });

  describe('setActiveEnvironment', () => {
    test('should update active environment ID', () => {
      const config: EnvironmentsConfig = {
        activeEnvironmentId: 1,
        environments: [
          { id: 1, name: 'Dev', variables: {} },
          { id: 2, name: 'Staging', variables: {} },
        ],
      };

      const result = setActiveEnvironment(config, 2);

      expect(result.activeEnvironmentId).toBe(2);
    });

    test('should return new config object', () => {
      const config: EnvironmentsConfig = {
        activeEnvironmentId: 1,
        environments: [{ id: 1, name: 'Dev', variables: {} }],
      };

      const result = setActiveEnvironment(config, 2);

      expect(result).not.toBe(config);
    });

    test('should preserve environments array', () => {
      const config: EnvironmentsConfig = {
        activeEnvironmentId: 1,
        environments: [
          { id: 1, name: 'Dev', variables: {} },
          { id: 2, name: 'Staging', variables: {} },
        ],
      };

      const result = setActiveEnvironment(config, 2);

      expect(result.environments).toBe(config.environments);
      expect(result.environments).toHaveLength(2);
    });

    test('should allow setting to non-existent environment ID', () => {
      const config: EnvironmentsConfig = {
        activeEnvironmentId: 1,
        environments: [{ id: 1, name: 'Dev', variables: {} }],
      };

      const result = setActiveEnvironment(config, 999);

      expect(result.activeEnvironmentId).toBe(999);
    });

    test('should not mutate original config', () => {
      const config: EnvironmentsConfig = {
        activeEnvironmentId: 1,
        environments: [{ id: 1, name: 'Dev', variables: {} }],
      };
      const originalActiveId = config.activeEnvironmentId;

      setActiveEnvironment(config, 2);

      expect(config.activeEnvironmentId).toBe(originalActiveId);
    });
  });

  describe('addEnvironment', () => {
    test('should add environment to the end of the array', () => {
      const config: EnvironmentsConfig = {
        activeEnvironmentId: 1,
        environments: [{ id: 1, name: 'Dev', variables: {} }],
      };
      const newEnv: Environment = { id: 2, name: 'Staging', variables: { KEY: 'value' } };

      const result = addEnvironment(config, newEnv);

      expect(result.environments).toHaveLength(2);
      expect(result.environments[1]).toEqual(newEnv);
    });

    test('should return new config object', () => {
      const config: EnvironmentsConfig = {
        activeEnvironmentId: 1,
        environments: [{ id: 1, name: 'Dev', variables: {} }],
      };
      const newEnv: Environment = { id: 2, name: 'Staging', variables: {} };

      const result = addEnvironment(config, newEnv);

      expect(result).not.toBe(config);
    });

    test('should preserve active environment ID', () => {
      const config: EnvironmentsConfig = {
        activeEnvironmentId: 1,
        environments: [{ id: 1, name: 'Dev', variables: {} }],
      };
      const newEnv: Environment = { id: 2, name: 'Staging', variables: {} };

      const result = addEnvironment(config, newEnv);

      expect(result.activeEnvironmentId).toBe(1);
    });

    test('should add to empty environments array', () => {
      const config: EnvironmentsConfig = {
        activeEnvironmentId: null,
        environments: [],
      };
      const newEnv: Environment = { id: 1, name: 'First', variables: {} };

      const result = addEnvironment(config, newEnv);

      expect(result.environments).toHaveLength(1);
      expect(result.environments[0]).toEqual(newEnv);
    });

    test('should not mutate original config', () => {
      const config: EnvironmentsConfig = {
        activeEnvironmentId: 1,
        environments: [{ id: 1, name: 'Dev', variables: {} }],
      };
      const originalLength = config.environments.length;
      const newEnv: Environment = { id: 2, name: 'Staging', variables: {} };

      addEnvironment(config, newEnv);

      expect(config.environments).toHaveLength(originalLength);
    });

    test('should preserve all variables in new environment', () => {
      const config: EnvironmentsConfig = {
        activeEnvironmentId: 1,
        environments: [],
      };
      const newEnv: Environment = {
        id: 1,
        name: 'Test',
        variables: { KEY1: 'value1', KEY2: 'value2', KEY3: 'value3' },
      };

      const result = addEnvironment(config, newEnv);

      expect(result.environments[0]?.variables).toEqual(newEnv.variables);
    });
  });

  describe('updateEnvironment', () => {
    test('should update environment with matching ID', () => {
      const config: EnvironmentsConfig = {
        activeEnvironmentId: 1,
        environments: [
          { id: 1, name: 'Dev', variables: { OLD: 'old' } },
          { id: 2, name: 'Staging', variables: {} },
        ],
      };

      const result = updateEnvironment(config, 1, 'Development', { NEW: 'new' });

      expect(result.environments[0]).toEqual({
        id: 1,
        name: 'Development',
        variables: { NEW: 'new' },
      });
    });

    test('should not modify other environments', () => {
      const config: EnvironmentsConfig = {
        activeEnvironmentId: 1,
        environments: [
          { id: 1, name: 'Dev', variables: {} },
          { id: 2, name: 'Staging', variables: { KEY: 'value' } },
        ],
      };

      const result = updateEnvironment(config, 1, 'Development', {});

      expect(result.environments[1]).toEqual({
        id: 2,
        name: 'Staging',
        variables: { KEY: 'value' },
      });
    });

    test('should return new config object', () => {
      const config: EnvironmentsConfig = {
        activeEnvironmentId: 1,
        environments: [{ id: 1, name: 'Dev', variables: {} }],
      };

      const result = updateEnvironment(config, 1, 'Development', {});

      expect(result).not.toBe(config);
    });

    test('should preserve active environment ID', () => {
      const config: EnvironmentsConfig = {
        activeEnvironmentId: 2,
        environments: [{ id: 1, name: 'Dev', variables: {} }],
      };

      const result = updateEnvironment(config, 1, 'Development', {});

      expect(result.activeEnvironmentId).toBe(2);
    });

    test('should not modify config when environment ID does not exist', () => {
      const config: EnvironmentsConfig = {
        activeEnvironmentId: 1,
        environments: [{ id: 1, name: 'Dev', variables: {} }],
      };

      const result = updateEnvironment(config, 999, 'NonExistent', { KEY: 'value' });

      expect(result.environments[0]).toEqual({ id: 1, name: 'Dev', variables: {} });
    });

    test('should not mutate original config', () => {
      const config: EnvironmentsConfig = {
        activeEnvironmentId: 1,
        environments: [{ id: 1, name: 'Dev', variables: { OLD: 'old' } }],
      };
      const originalName = config.environments[0]?.name;

      updateEnvironment(config, 1, 'NewName', {});

      expect(config.environments[0]?.name).toBe(originalName);
    });

    test('should handle empty variables object', () => {
      const config: EnvironmentsConfig = {
        activeEnvironmentId: 1,
        environments: [{ id: 1, name: 'Dev', variables: { KEY: 'value' } }],
      };

      const result = updateEnvironment(config, 1, 'Dev', {});

      expect(result.environments[0]?.variables).toEqual({});
    });

    test('should preserve environment ID when updating', () => {
      const config: EnvironmentsConfig = {
        activeEnvironmentId: 1,
        environments: [{ id: 5, name: 'Dev', variables: {} }],
      };

      const result = updateEnvironment(config, 5, 'NewName', { NEW: 'new' });

      expect(result.environments[0]?.id).toBe(5);
    });
  });

  describe('deleteEnvironment', () => {
    test('should remove environment with matching ID', () => {
      const config: EnvironmentsConfig = {
        activeEnvironmentId: 1,
        environments: [
          { id: 1, name: 'Dev', variables: {} },
          { id: 2, name: 'Staging', variables: {} },
        ],
      };

      const result = deleteEnvironment(config, 1);

      expect(result.environments).toHaveLength(1);
      expect(result.environments[0]?.id).toBe(2);
    });

    test('should set active ID to first environment when deleting active environment', () => {
      const config: EnvironmentsConfig = {
        activeEnvironmentId: 1,
        environments: [
          { id: 1, name: 'Dev', variables: {} },
          { id: 2, name: 'Staging', variables: {} },
        ],
      };

      const result = deleteEnvironment(config, 1);

      expect(result.activeEnvironmentId).toBe(2);
    });

    test('should set active ID to null when deleting last environment', () => {
      const config: EnvironmentsConfig = {
        activeEnvironmentId: 1,
        environments: [{ id: 1, name: 'Dev', variables: {} }],
      };

      const result = deleteEnvironment(config, 1);

      expect(result.activeEnvironmentId).toBeNull();
      expect(result.environments).toHaveLength(0);
    });

    test('should preserve active ID when deleting non-active environment', () => {
      const config: EnvironmentsConfig = {
        activeEnvironmentId: 1,
        environments: [
          { id: 1, name: 'Dev', variables: {} },
          { id: 2, name: 'Staging', variables: {} },
        ],
      };

      const result = deleteEnvironment(config, 2);

      expect(result.activeEnvironmentId).toBe(1);
      expect(result.environments).toHaveLength(1);
    });

    test('should return new config object', () => {
      const config: EnvironmentsConfig = {
        activeEnvironmentId: 1,
        environments: [{ id: 1, name: 'Dev', variables: {} }],
      };

      const result = deleteEnvironment(config, 1);

      expect(result).not.toBe(config);
    });

    test('should not modify config when environment ID does not exist', () => {
      const config: EnvironmentsConfig = {
        activeEnvironmentId: 1,
        environments: [{ id: 1, name: 'Dev', variables: {} }],
      };

      const result = deleteEnvironment(config, 999);

      expect(result.environments).toHaveLength(1);
      expect(result.activeEnvironmentId).toBe(1);
    });

    test('should not mutate original config', () => {
      const config: EnvironmentsConfig = {
        activeEnvironmentId: 1,
        environments: [
          { id: 1, name: 'Dev', variables: {} },
          { id: 2, name: 'Staging', variables: {} },
        ],
      };
      const originalLength = config.environments.length;

      deleteEnvironment(config, 1);

      expect(config.environments).toHaveLength(originalLength);
    });

    test('should handle deleting from empty environments array', () => {
      const config: EnvironmentsConfig = {
        activeEnvironmentId: null,
        environments: [],
      };

      const result = deleteEnvironment(config, 1);

      expect(result.environments).toHaveLength(0);
      expect(result.activeEnvironmentId).toBeNull();
    });

    test('should delete all matching IDs when multiple environments have same ID', () => {
      const config: EnvironmentsConfig = {
        activeEnvironmentId: 1,
        environments: [
          { id: 1, name: 'First', variables: {} },
          { id: 1, name: 'Second', variables: {} },
          { id: 2, name: 'Third', variables: {} },
        ],
      };

      const result = deleteEnvironment(config, 1);

      expect(result.environments).toHaveLength(1);
      expect(result.environments[0]?.id).toBe(2);
    });

    test('should set active ID to first remaining environment ID when deleting active', () => {
      const config: EnvironmentsConfig = {
        activeEnvironmentId: 5,
        environments: [
          { id: 5, name: 'First', variables: {} },
          { id: 10, name: 'Second', variables: {} },
          { id: 15, name: 'Third', variables: {} },
        ],
      };

      const result = deleteEnvironment(config, 5);

      expect(result.activeEnvironmentId).toBe(10);
      expect(result.environments).toHaveLength(2);
    });
  });
});
