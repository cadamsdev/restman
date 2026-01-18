/**
 * Substitutes variables in a string with values from an environment
 * Variables are in the format {{VARIABLE_NAME}}
 *
 * @param text - The text containing variables to substitute
 * @param variables - Record of variable names to values
 * @returns The text with variables substituted
 */
export const substituteVariables = (text: string, variables: Record<string, string>): string => {
  if (!text) return text;

  // Match {{VARIABLE_NAME}} pattern
  const variablePattern = /\{\{([^}]+)\}\}/g;

  return text.replace(variablePattern, (match, variableName) => {
    const trimmedName = variableName.trim();

    // Return the value if it exists, otherwise return the original placeholder
    if (trimmedName in variables) {
      return variables[trimmedName] || match;
    }

    return match; // Keep the placeholder if variable not found
  });
};

/**
 * Substitutes variables in a headers object
 *
 * @param headers - Record of header names to values
 * @param variables - Record of variable names to values
 * @returns New headers object with variables substituted
 */
export const substituteVariablesInHeaders = (
  headers: Record<string, string>,
  variables: Record<string, string>,
): Record<string, string> => {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(headers)) {
    result[key] = substituteVariables(value, variables);
  }

  return result;
};

/**
 * Find all variable names in a string
 *
 * @param text - The text to search for variables
 * @returns Array of unique variable names found (without {{ }})
 */
export const findVariables = (text: string): string[] => {
  if (!text) return [];

  const variablePattern = /\{\{([^}]+)\}\}/g;
  const variables: Set<string> = new Set();

  let match;
  while ((match = variablePattern.exec(text)) !== null) {
    if (match[1]) {
      variables.add(match[1].trim());
    }
  }

  return Array.from(variables);
};

/**
 * Check if a string contains any variables
 *
 * @param text - The text to check
 * @returns True if the text contains at least one variable placeholder
 */
export const hasVariables = (text: string): boolean => {
  if (!text) return false;
  return /\{\{[^}]+\}\}/.test(text);
};
