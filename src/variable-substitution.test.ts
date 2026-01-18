import { describe, test, expect } from 'bun:test';
import { substituteVariables, substituteVariablesInHeaders } from './variable-substitution';

describe('Variable Substitution', () => {
  const vars = { BASE_URL: 'http://localhost:3000', API_KEY: 'test-key-123' };

  describe('substituteVariables', () => {
    test('should substitute single variable in URL', () => {
      const input = '{{BASE_URL}}/api/users';
      const output = substituteVariables(input, vars);
      expect(output).toBe('http://localhost:3000/api/users');
    });

    test('should substitute multiple variables', () => {
      const input = '{{BASE_URL}}/api/{{API_KEY}}';
      const output = substituteVariables(input, vars);
      expect(output).toBe('http://localhost:3000/api/test-key-123');
    });

    test('should leave missing variables unchanged', () => {
      const input = '{{BASE_URL}}/users/{{MISSING}}';
      const output = substituteVariables(input, vars);
      expect(output).toBe('http://localhost:3000/users/{{MISSING}}');
    });

    test('should handle strings with no variables', () => {
      const input = 'https://api.example.com/users';
      const output = substituteVariables(input, vars);
      expect(output).toBe('https://api.example.com/users');
    });

    test('should handle empty string', () => {
      const output = substituteVariables('', vars);
      expect(output).toBe('');
    });
  });

  describe('substituteVariablesInHeaders', () => {
    test('should substitute variables in header values', () => {
      const headers = { 
        'Authorization': 'Bearer {{API_KEY}}', 
        'Content-Type': 'application/json' 
      };
      const output = substituteVariablesInHeaders(headers, vars);
      expect(output).toEqual({
        'Authorization': 'Bearer test-key-123',
        'Content-Type': 'application/json'
      });
    });

    test('should handle multiple variables in single header', () => {
      const headers = { 
        'X-Custom': '{{BASE_URL}}/{{API_KEY}}' 
      };
      const output = substituteVariablesInHeaders(headers, vars);
      expect(output).toEqual({
        'X-Custom': 'http://localhost:3000/test-key-123'
      });
    });

    test('should handle empty headers object', () => {
      const output = substituteVariablesInHeaders({}, vars);
      expect(output).toEqual({});
    });

    test('should not modify original headers object', () => {
      const headers = { 'Authorization': 'Bearer {{API_KEY}}' };
      const originalHeaders = { ...headers };
      substituteVariablesInHeaders(headers, vars);
      expect(headers).toEqual(originalHeaders);
    });
  });
});
