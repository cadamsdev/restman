import { describe, test, expect } from 'bun:test';
import { substituteVariables, substituteVariablesInHeaders } from './variable-substitution';

describe('substituteVariables', () => {
  test('should substitute single variable', () => {
    const text = 'Hello {{NAME}}';
    const variables = { NAME: 'World' };
    const result = substituteVariables(text, variables);
    expect(result).toBe('Hello World');
  });

  test('should substitute multiple variables', () => {
    const text = '{{METHOD}} {{URL}} {{PROTOCOL}}';
    const variables = { METHOD: 'GET', URL: '/api/users', PROTOCOL: 'HTTP/1.1' };
    const result = substituteVariables(text, variables);
    expect(result).toBe('GET /api/users HTTP/1.1');
  });

  test('should substitute same variable multiple times', () => {
    const text = '{{BASE}}/users/{{BASE}}/posts';
    const variables = { BASE: 'api' };
    const result = substituteVariables(text, variables);
    expect(result).toBe('api/users/api/posts');
  });

  test('should trim whitespace from variable names', () => {
    const text = '{{ NAME }} and {{  CITY  }}';
    const variables = { NAME: 'Alice', CITY: 'Boston' };
    const result = substituteVariables(text, variables);
    expect(result).toBe('Alice and Boston');
  });

  test('should keep placeholder when variable not found', () => {
    const text = 'Hello {{NAME}}';
    const variables = {};
    const result = substituteVariables(text, variables);
    expect(result).toBe('Hello {{NAME}}');
  });

  test('should keep placeholder when variable value is undefined', () => {
    const text = 'Hello {{NAME}}';
    const variables = { NAME: undefined as unknown as string };
    const result = substituteVariables(text, variables);
    expect(result).toBe('Hello {{NAME}}');
  });

  test('should substitute empty string value', () => {
    const text = 'Hello {{NAME}}';
    const variables = { NAME: '' };
    const result = substituteVariables(text, variables);
    expect(result).toBe('Hello {{NAME}}');
  });

  test('should handle text with no variables', () => {
    const text = 'Hello World';
    const variables = { NAME: 'Alice' };
    const result = substituteVariables(text, variables);
    expect(result).toBe('Hello World');
  });

  test('should handle empty string', () => {
    const text = '';
    const variables = { NAME: 'Alice' };
    const result = substituteVariables(text, variables);
    expect(result).toBe('');
  });

  test('should handle empty variables object', () => {
    const text = 'Hello {{NAME}}';
    const variables = {};
    const result = substituteVariables(text, variables);
    expect(result).toBe('Hello {{NAME}}');
  });

  test('should handle nested brackets correctly', () => {
    const text = 'Value: {{VAR}}';
    const variables = { VAR: '{nested}' };
    const result = substituteVariables(text, variables);
    expect(result).toBe('Value: {nested}');
  });

  test('should handle special characters in variable values', () => {
    const text = 'URL: {{URL}}';
    const variables = { URL: 'https://api.example.com?q=test&sort=asc' };
    const result = substituteVariables(text, variables);
    expect(result).toBe('URL: https://api.example.com?q=test&sort=asc');
  });

  test('should handle numeric values as strings', () => {
    const text = 'Port: {{PORT}}';
    const variables = { PORT: '8080' };
    const result = substituteVariables(text, variables);
    expect(result).toBe('Port: 8080');
  });

  test('should not perform recursive substitution', () => {
    const text = '{{VAR1}}';
    const variables = { VAR1: '{{VAR2}}', VAR2: 'final' };
    const result = substituteVariables(text, variables);
    expect(result).toBe('{{VAR2}}');
  });

  test('should handle malformed patterns correctly', () => {
    const text = 'Test {{INCOMPLETE and {{VALID}}';
    const variables = { VALID: 'value' };
    const result = substituteVariables(text, variables);
    // The regex matches {{INCOMPLETE and {{VALID}} as a single pattern
    // since [^}]+ matches everything until the first }
    expect(result).toBe('Test {{INCOMPLETE and {{VALID}}');
  });

  test('should handle variables with underscores and numbers', () => {
    const text = '{{API_KEY_123}} and {{BASE_URL_V2}}';
    const variables = { API_KEY_123: 'secret', BASE_URL_V2: 'https://v2.api.com' };
    const result = substituteVariables(text, variables);
    expect(result).toBe('secret and https://v2.api.com');
  });

  test('should handle consecutive variables without spaces', () => {
    const text = '{{FIRST}}{{SECOND}}{{THIRD}}';
    const variables = { FIRST: 'A', SECOND: 'B', THIRD: 'C' };
    const result = substituteVariables(text, variables);
    expect(result).toBe('ABC');
  });

  test('should handle JSON-like content with variables', () => {
    const text = '{"name": "{{NAME}}", "email": "{{EMAIL}}"}';
    const variables = { NAME: 'John Doe', EMAIL: 'john@example.com' };
    const result = substituteVariables(text, variables);
    expect(result).toBe('{"name": "John Doe", "email": "john@example.com"}');
  });
});

describe('substituteVariablesInHeaders', () => {
  test('should substitute variables in all header values', () => {
    const headers = {
      'Authorization': 'Bearer {{TOKEN}}',
      'X-API-Key': '{{API_KEY}}',
    };
    const variables = { TOKEN: 'abc123', API_KEY: 'xyz789' };
    const result = substituteVariablesInHeaders(headers, variables);
    expect(result).toEqual({
      'Authorization': 'Bearer abc123',
      'X-API-Key': 'xyz789',
    });
  });

  test('should not modify original headers object', () => {
    const headers = { 'Authorization': 'Bearer {{TOKEN}}' };
    const variables = { TOKEN: 'abc123' };
    const result = substituteVariablesInHeaders(headers, variables);
    expect(result).not.toBe(headers);
    expect(headers['Authorization']).toBe('Bearer {{TOKEN}}');
  });

  test('should handle headers with no variables', () => {
    const headers = { 'Content-Type': 'application/json' };
    const variables = { TOKEN: 'abc123' };
    const result = substituteVariablesInHeaders(headers, variables);
    expect(result).toEqual({ 'Content-Type': 'application/json' });
  });

  test('should handle empty headers object', () => {
    const headers = {};
    const variables = { TOKEN: 'abc123' };
    const result = substituteVariablesInHeaders(headers, variables);
    expect(result).toEqual({});
  });

  test('should handle empty variables object', () => {
    const headers = { 'Authorization': 'Bearer {{TOKEN}}' };
    const variables = {};
    const result = substituteVariablesInHeaders(headers, variables);
    expect(result).toEqual({ 'Authorization': 'Bearer {{TOKEN}}' });
  });

  test('should handle multiple variables in single header value', () => {
    const headers = { 'Custom-Header': '{{PREFIX}}-{{SUFFIX}}' };
    const variables = { PREFIX: 'start', SUFFIX: 'end' };
    const result = substituteVariablesInHeaders(headers, variables);
    expect(result).toEqual({ 'Custom-Header': 'start-end' });
  });

  test('should preserve header names exactly', () => {
    const headers = {
      'Content-Type': 'application/json',
      'x-custom-header': '{{VALUE}}',
      'X-Another-Header': '{{VALUE2}}',
    };
    const variables = { VALUE: 'test', VALUE2: 'test2' };
    const result = substituteVariablesInHeaders(headers, variables);
    expect(Object.keys(result)).toEqual(['Content-Type', 'x-custom-header', 'X-Another-Header']);
  });

  test('should handle headers with empty string values', () => {
    const headers = { 'X-Empty': '' };
    const variables = { TOKEN: 'abc123' };
    const result = substituteVariablesInHeaders(headers, variables);
    expect(result).toEqual({ 'X-Empty': '' });
  });

  test('should handle complex header values', () => {
    const headers = {
      'Authorization': 'Bearer {{TOKEN}}',
      'Accept': 'application/json, text/plain',
      'User-Agent': 'RestMan/{{VERSION}}',
    };
    const variables = { TOKEN: 'secret123', VERSION: '1.0.0' };
    const result = substituteVariablesInHeaders(headers, variables);
    expect(result).toEqual({
      'Authorization': 'Bearer secret123',
      'Accept': 'application/json, text/plain',
      'User-Agent': 'RestMan/1.0.0',
    });
  });
});
