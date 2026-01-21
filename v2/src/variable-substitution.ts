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
