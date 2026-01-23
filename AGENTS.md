# RestMan Agent Guidelines

This document provides guidelines for AI agents working on the RestMan codebase.

## Build and Development Commands

```bash
# Run the application
bun run dev
bun start

# Build for current platform
bun run build

# Build for specific platforms
bun run build:linux-x64
bun run build:linux-arm64
bun run build:windows-x64
bun run build:darwin-arm64
bun run build:darwin-x64

# Format code
bun run fmt        # Format files with oxfmt
bun run fmt:check  # Check formatting without modifying

# Lint code
bun run lint       # Run oxlint with type checking
bun run lint:fix   # Fix linting issues automatically

# Note: No test framework is currently configured. Manual testing is required.
```

## Code Style Guidelines

### TypeScript Configuration
- Strict mode enabled with ESNext target
- React JSX with `@opentui/react` as import source
- `verbatimModuleSyntax: true` - no `import type` needed for type-only imports
- `noUncheckedIndexedAccess: true` - always handle undefined on indexed access

### Imports
- Use named imports: `import { useState } from 'react'`
- Single quotes only
- Group imports: external packages first, then local modules
- Local imports use relative paths: `import { App } from './src/App'`

### File Naming
- React components: PascalCase.tsx (e.g., `RequestEditor.tsx`)
- Utilities/services: camelCase.ts (e.g., `http-client.ts`, `history-storage.ts`)
- Hooks: camelCase.ts or camelCase.tsx if React types needed

### Naming Conventions
- Components: PascalCase (`RequestEditor`, `TextInput`)
- Functions/hooks: camelCase (`sendRequest`, `useKeyboard`)
- Constants: UPPER_SNAKE_CASE (`RESTMAN_DIR`, `HISTORY_FILE`)
- Interfaces/Types: PascalCase (`RequestEditorProps`, `HistoryEntry`)
- State variables: camelCase with descriptive names (`focusedField`, `editMode`)

### Component Structure
```typescript
// 1. Imports
import { useState, useCallback } from 'react';

// 2. Interfaces
interface ComponentProps {
  value: string;
  onChange: (value: string) => void;
}

// 3. Component function
export function Component({ value, onChange }: ComponentProps) {
  // Hooks first
  const [state, setState] = useState<string>('');

  // Helper functions
  const handleClick = useCallback(() => {
    // logic
  }, [dependencies]);

  // Return JSX
  return <box>{value}</box>;
}
```

### State Management
- Use React hooks: `useState`, `useEffect`, `useCallback`, `useKeyboard`
- Fire-and-forget async functions: prefix with `void` to avoid linter warnings
- Use `Date.now()` for unique IDs
- Default values for state initialization

### Async/Error Handling
- Use async/await pattern
- Check errors with `instanceof Error` before accessing `message`
- Log errors to console, return safe defaults
- Try-catch blocks should prevent crashes

```typescript
try {
  const result = await fetchData();
  return result;
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error('Operation failed:', errorMessage);
  return defaultValue;
}
```

### Formatting
- oxfmt with single quotes (`'`)
- Automatic formatting handles indentation and line breaks
- Markdown files are ignored from formatting

### JSDoc Comments
- Document functions with `@param` and `@returns`
- Keep comments concise and focused on behavior

```typescript
/**
 * Substitutes variables in a string
 * @param text - Text containing {{VARIABLE}} placeholders
 * @param variables - Record of variable names to values
 * @returns Text with substituted variables
 */
```

### OpenTUI/React Patterns
- Use `useKeyboard` hook for keyboard input
- Components render OpenTUI elements: `<box>`, `<text>`
- Style objects use kebab-case properties
- Color scheme: `#CC8844` (primary), `#BB7733` (secondary), `#555555` (borders), `#999999` (muted)
- Focus states use primary color
- Edit mode uses secondary color

### Storage/IO Operations
- Use `fs/promises` for async file operations
- Store data in `~/.restman` directory
- Ensure directories exist with `mkdirSync(path, { recursive: true })`
- Validate loaded data structure before use
- JSON.stringify with `null, 2` for readable JSON files

### Type Safety
- Define interfaces for all data structures
- Use `Record<string, string>` for headers/variables
- Use discriminated unions for variants
- Export types when used across modules

### Variable Substitution
- Format: `{{VARIABLE_NAME}}`
- Keep placeholder if variable not found
- Trim whitespace from variable names
- Recursive substitution not needed (single pass)
