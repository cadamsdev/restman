import { existsSync, mkdirSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { homedir } from 'os';

const RESTMAN_DIR = join(homedir(), '.restman');
const ENVIRONMENTS_FILE = join(RESTMAN_DIR, 'environments.json');

export interface Environment {
  id: number;
  name: string;
  variables: Record<string, string>;
}

export interface EnvironmentsConfig {
  activeEnvironmentId: number | null;
  environments: Environment[];
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
 * Get default environments config with example variable usage
 */
const getDefaultConfig = (): EnvironmentsConfig => {
  return {
    activeEnvironmentId: 1,
    environments: [
      {
        id: 1,
        name: 'Development',
        variables: {
          BASE_URL: 'http://localhost:3000',
          API_KEY: 'dev-api-key-12345',
          AUTH_TOKEN: 'Bearer dev-token',
        },
      },
      {
        id: 2,
        name: 'Staging',
        variables: {
          BASE_URL: 'https://staging.example.com',
          API_KEY: 'staging-api-key-67890',
          AUTH_TOKEN: 'Bearer staging-token',
        },
      },
      {
        id: 3,
        name: 'Production',
        variables: {
          BASE_URL: 'https://api.example.com',
          API_KEY: 'prod-api-key-secure',
          AUTH_TOKEN: 'Bearer prod-token',
        },
      },
    ],
  };
};

/**
 * Load environments from disk
 * Returns default config if the file doesn't exist
 */
export const loadEnvironments = async (): Promise<EnvironmentsConfig> => {
  try {
    ensureDirectoryExists();

    if (!existsSync(ENVIRONMENTS_FILE)) {
      // Create default environments file
      const defaultConfig = getDefaultConfig();
      await saveEnvironments(defaultConfig);
      return defaultConfig;
    }

    const data = await readFile(ENVIRONMENTS_FILE, 'utf-8');
    const parsed = JSON.parse(data);

    // Validate config structure
    if (!parsed || !Array.isArray(parsed.environments)) {
      return getDefaultConfig();
    }

    return parsed;
  } catch (error) {
    console.error('Failed to load environments:', error);
    return getDefaultConfig();
  }
};

/**
 * Save environments to disk
 */
export const saveEnvironments = async (config: EnvironmentsConfig): Promise<void> => {
  try {
    ensureDirectoryExists();
    const data = JSON.stringify(config, null, 2);
    await writeFile(ENVIRONMENTS_FILE, data, 'utf-8');
  } catch (error) {
    console.error('Failed to save environments:', error);
  }
};

/**
 * Get the active environment
 */
export const getActiveEnvironment = (config: EnvironmentsConfig): Environment | null => {
  if (config.activeEnvironmentId === null) {
    return null;
  }
  return config.environments.find((env) => env.id === config.activeEnvironmentId) || null;
};

/**
 * Set the active environment
 */
export const setActiveEnvironment = (
  config: EnvironmentsConfig,
  environmentId: number,
): EnvironmentsConfig => {
  return {
    ...config,
    activeEnvironmentId: environmentId,
  };
};

/**
 * Add a new environment
 */
export const addEnvironment = (
  config: EnvironmentsConfig,
  environment: Environment,
): EnvironmentsConfig => {
  return {
    ...config,
    environments: [...config.environments, environment],
  };
};

/**
 * Update an environment
 */
export const updateEnvironment = (
  config: EnvironmentsConfig,
  id: number,
  name: string,
  variables: Record<string, string>,
): EnvironmentsConfig => {
  return {
    ...config,
    environments: config.environments.map((env) =>
      env.id === id ? { ...env, name, variables } : env,
    ),
  };
};

/**
 * Delete an environment
 */
export const deleteEnvironment = (config: EnvironmentsConfig, id: number): EnvironmentsConfig => {
  const newEnvironments = config.environments.filter((env) => env.id !== id);
  const newActiveId =
    config.activeEnvironmentId === id
      ? newEnvironments.length > 0 && newEnvironments[0]
        ? newEnvironments[0].id
        : null
      : config.activeEnvironmentId;

  return {
    activeEnvironmentId: newActiveId,
    environments: newEnvironments,
  };
};
