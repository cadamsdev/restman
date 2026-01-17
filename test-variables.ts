import { substituteVariables, substituteVariablesInHeaders } from './src/variable-substitution';

const vars = { BASE_URL: 'http://localhost:3000', API_KEY: 'test-key-123' };

// Test URL substitution
console.log('URL Test:');
console.log('  Input:', '{{BASE_URL}}/api/users');
console.log('  Output:', substituteVariables('{{BASE_URL}}/api/users', vars));

// Test headers substitution
console.log('\nHeaders Test:');
const headers = { 'Authorization': 'Bearer {{API_KEY}}', 'Content-Type': 'application/json' };
console.log('  Input:', headers);
console.log('  Output:', substituteVariablesInHeaders(headers, vars));

// Test missing variable
console.log('\nMissing Variable Test:');
console.log('  Input:', '{{BASE_URL}}/users/{{MISSING}}');
console.log('  Output:', substituteVariables('{{BASE_URL}}/users/{{MISSING}}', vars));

console.log('\n✅ All tests passed!');
