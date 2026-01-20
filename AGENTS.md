# RestMan - Agent Development Guide

This guide provides build commands, testing instructions, and code style conventions for agentic coding in this repository.

## Development Commands

### Running the Application
```bash
bun run dev          # Run the TUI application (also available as bun start or bun run src/cli.ts)
```

### Testing
```bash
bun test                    # Run all tests
bun test src/filename.test.ts       # Run specific test file
bun test -t "test name pattern"     # Run tests matching name pattern
bun test --only              # Run only tests marked with .only()
bun test --coverage          # Generate coverage report
```

### Code Quality
```bash
bun run lint                 # Run oxlint type-aware linting
bun run lint:fix             # Auto-fix lint issues
bun run fmt                  # Format code with oxfmt
bun run fmt:check            # Check formatting without changes
```

### Building
```bash
bun run build                # Compile to dist/restman (generic)
bun run build:linux-x64      # Build for Linux x64
bun run build:darwin-arm64   # Build for macOS ARM64 (Apple Silicon)
bun run build:windows-x64    # Build for Windows x64
```

## Code Style Guidelines

### Project Overview
RestMan is a Terminal User Interface (TUI) REST API client built with Bun, React, and Ink. Key architectural decisions:
- **Single Component State**: All state lives in `src/App.tsx`, flows down via props
- **Modal-based Views**: Exclusive modes (response, history, saved requests, edit) controlled by boolean flags
- **Persistent Storage**: User data stored in `~/.restman/` as JSON files

### TypeScript Configuration
- Strict mode enabled with all strict flags (strictNullChecks, noImplicitAny, etc.)
- `"jsx": "react-jsx"` enables automatic React imports (no `import React` needed)
- `"moduleResolution": "bundler"` and `"allowImportingTsExtensions": true` for Bun
- `"noEmit": true` - no compilation step, only type checking

### Import Conventions
```typescript
// Third-party imports first
import React from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';

// Local imports second (use relative paths)
import { URLInput } from './components/URLInput';
import { loadHistory, saveHistory } from './history-storage';

// Type imports grouped with related imports
import type { RequestOptions, Response } from './http-client';
```

### File Naming
- **Components**: PascalCase in `src/components/` (e.g., `URLInput.tsx`, `MethodSelector.tsx`)
- **Utilities**: kebab-case in `src/` (e.g., `http-client.ts`, `variable-substitution.ts`)
- **Tests**: `.test.ts` suffix matching the source file (e.g., `variable-substitution.test.ts`)
- **Storage modules**: `-storage.ts` suffix (e.g., `history-storage.ts`, `environment-storage.ts`)

### Component Patterns
```typescript
import React from 'react';
import { Text } from 'ink';
import TextInput from 'ink-text-input';

interface ComponentProps {
  value: string;
  onChange: (value: string) => void;
  focused: boolean;
  editMode: boolean;
}

export const ComponentName: React.FC<ComponentProps> = ({ value, onChange, focused, editMode }) => {
  return (
    // UI implementation
  );
};
```

- Use functional components with `React.FC<Props>` type annotation
- Define interfaces for props inline above the component
- All input components receive `focused` (visual highlight) and `editMode` (editable state) props

### State Management
❌ **Never mutate state directly** - Always use setter functions:
```typescript
// Bad
state.items.push(newItem);

// Good
setState(prev => ({ ...prev, items: [...prev.items, newItem] }));
```

### Keyboard Handling (Critical)
All keyboard input is handled by a single `useInput` hook in `App.tsx`. When adding shortcuts:

1. **Never add duplicate hotkeys** - the first matching condition wins
2. **Always check edit mode** before adding global shortcuts:
   ```typescript
   if (!editMode && input.key === 'q') {
     // Handle quit
   }
   ```
3. **Priority order**: Modal handlers → View mode handlers → Edit mode → Readonly shortcuts
4. **Document shortcuts** in `src/components/Instructions.tsx`

### Error Handling
```typescript
// Async operations with try-catch
try {
  const response = await fetch(url);
  // Handle success
} catch (error) {
  // Handle error (e.g., set error state, show toast)
  console.error('Request failed:', error);
}
```

### Variable Substitution Pattern
Environment variables use `{{VARIABLE_NAME}}` syntax:
```typescript
import { substituteVariables, substituteVariablesInHeaders } from './variable-substitution';

const url = substituteVariables('{{BASE_URL}}/api/users', variables);
const headers = substituteVariablesInHeaders({ Authorization: 'Bearer {{API_KEY}}' }, variables);
```

### Storage Pattern
Persistent storage modules follow this pattern:
```typescript
import { homedir } from 'node:os';
import { join } from 'node:path';
import { ensureFileSync, readFileSync, writeFileSync } from 'node:fs';

const CONFIG_PATH = join(homedir(), '.restman', 'config.json');

export function loadData(): DataType[] {
  try {
    const data = readFileSync(CONFIG_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return []; // Return empty array on missing/invalid file
  }
}

export function saveData(data: DataType[]): void {
  ensureFileSync(CONFIG_PATH);
  writeFileSync(CONFIG_PATH, JSON.stringify(data, null, 2));
}
```

**Always use `homedir()` from `os` module, NOT `process.cwd()`**

### Formatting and Linting
- Single quotes only (`oxfmt` enforces this)
- 2-space indentation for JSON
- No trailing whitespace
- Run `bun run lint` and `bun run fmt` before committing

### Testing
Use Bun test framework:
```typescript
import { describe, test, expect } from 'bun:test';
import { functionToTest } from './module';

describe('Feature Description', () => {
  test('should do something specific', () => {
    const result = functionToTest(input);
    expect(result).toBe(expectedOutput);
  });
});
```

### Common Pitfalls

❌ **Don't add global keyboard shortcuts without edit mode check** - Users typing in fields should not trigger navigation

❌ **Don't forget to update Instructions component** - Document new shortcuts in `src/components/Instructions.tsx`

❌ **Don't mutate state directly** - Always create new arrays/objects with spread operators or `.map()`

❌ **Don't use process.cwd() for user data** - Always use `homedir()` for `~/.restman/` directory

### Resources
- [Keyboard Shortcuts](docs/KEYBOARD_SHORTCUTS.md)
- [Environment Variables](docs/ENVIRONMENT_VARIABLES.md)
- [Copilot Instructions](.github/copilot-instructions.md) for detailed architecture and patterns
