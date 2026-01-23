# OpenTUI Usage in ralph-tui

This document analyzes how the ralph-tui project uses OpenTUI to build its terminal user interface.

## Overview

ralph-tui is an AI Agent Loop Orchestrator with a Terminal User Interface built using **OpenTUI**, a React-based framework for creating terminal applications. OpenTUI provides React components and hooks for building interactive CLI applications, similar to how Ink works but with its own rendering engine and component system.

## Dependencies

From [package.json](temp/ralph-tui/package.json):

```json
"dependencies": {
  "@opentui/core": "^0.1.72",
  "@opentui/react": "^0.1.72",
  // ...other dependencies
}
```

OpenTUI consists of two packages:
- **@opentui/core**: Core rendering engine and CLI renderer
- **@opentui/react**: React integration with hooks and components

## TypeScript Configuration

From [tsconfig.json](temp/ralph-tui/tsconfig.json):

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@opentui/react"
  }
}
```

The `jsxImportSource` setting tells TypeScript to use OpenTUI's JSX factory instead of React's default, enabling OpenTUI-specific JSX transformations.

## Core Usage Patterns

### 1. Application Bootstrapping

Ralph-tui uses OpenTUI's rendering system to mount React components in command files. The pattern is consistent across commands:

**From [src/commands/run.tsx](temp/ralph-tui/src/commands/run.tsx):**

```tsx
import { createCliRenderer } from '@opentui/core';
import { createRoot } from '@opentui/react';

// Create the CLI renderer
const renderer = createCliRenderer();

// Create and mount the React root
const root = createRoot(renderer);
root.render(<RunApp {...props} />);

// Later: cleanup
root.unmount();
renderer.dispose();
```

This pattern appears in:
- `src/commands/run.tsx` - Main execution command
- `src/commands/resume.tsx` - Resume session command
- `src/commands/create-prd.tsx` - PRD creation command

### 2. React Hooks from OpenTUI

OpenTUI provides several custom hooks for terminal interaction:

#### `useKeyboard` - Keyboard Input Handling

**From [src/tui/components/App.tsx](temp/ralph-tui/src/tui/components/App.tsx):**

```tsx
import { useKeyboard } from '@opentui/react';

export function App({ onQuit }: AppProps) {
  const handleKeyboard = useCallback((key: { name: string }) => {
    switch (key.name) {
      case 'q':
      case 'escape':
        onQuit?.();
        process.exit(0);
        break;
      case 'up':
      case 'k':
        // Navigate up
        break;
      case 'down':
      case 'j':
        // Navigate down
        break;
    }
  }, [state]);

  useKeyboard(handleKeyboard);
}
```

Used in components:
- `App.tsx` - Main navigation
- `RunApp.tsx` - Complex keyboard handling for multiple modes
- `PrdChatApp.tsx` - Chat interface input
- `ChatView.tsx` - Text editing
- `EpicSelectionApp.tsx` - Epic selection
- `RemoteManagementOverlay.tsx` - Remote management
- `SettingsView.tsx` - Settings navigation
- `EpicLoaderOverlay.tsx` - Loader overlay

#### `useTerminalDimensions` - Responsive Layout

**From [src/tui/components/App.tsx](temp/ralph-tui/src/tui/components/App.tsx):**

```tsx
import { useTerminalDimensions } from '@opentui/react';

export function App() {
  const { width, height } = useTerminalDimensions();
  
  // Calculate panel dimensions based on terminal size
  const leftPanelWidth = Math.floor(width * 0.3);
  const rightPanelWidth = width - leftPanelWidth - 1;
}
```

This hook enables responsive TUI layouts that adapt to terminal size changes.

#### `useRenderer` - Direct Renderer Access

**From [src/tui/components/PrdChatApp.tsx](temp/ralph-tui/src/tui/components/PrdChatApp.tsx):**

```tsx
import { useRenderer } from '@opentui/react';

export function PrdChatApp() {
  const renderer = useRenderer();
  
  // Can interact with renderer directly if needed
  // Used for advanced rendering control
}
```

### 3. Type Definitions from OpenTUI

OpenTUI exports TypeScript types for enhanced type safety:

**From [src/tui/components/PrdChatApp.tsx](temp/ralph-tui/src/tui/components/PrdChatApp.tsx):**

```tsx
import type { KeyEvent } from '@opentui/core';

// KeyEvent provides detailed keyboard event information
function handleKey(event: KeyEvent) {
  // event.key, event.ctrl, event.shift, etc.
}
```

**From [src/tui/components/ChatView.tsx](temp/ralph-tui/src/tui/components/ChatView.tsx):**

```tsx
import type { TextareaRenderable, KeyEvent } from '@opentui/core';

// TextareaRenderable for textarea component types
```

### 4. Component Architecture

OpenTUI components use JSX with special element types. Ralph-tui uses standard HTML-like tags that OpenTUI renders to the terminal:

**From [src/tui/components/FormattedText.tsx](temp/ralph-tui/src/tui/components/FormattedText.tsx):**

```tsx
export function FormattedText({ segments }: FormattedTextProps) {
  return (
    <text fg={COLOR_MAP.default}>
      {segments.map((segment, index) => {
        const color = segment.color;
        return (
          <span key={index} fg={COLOR_MAP[color]} bg={panelBg}>
            {segment.text}
          </span>
        );
      })}
    </text>
  );
}
```

Key OpenTUI JSX elements used:
- `<text>` - Text rendering with color support (`fg`, `bg` props)
- `<span>` - Inline text with styling
- `<box>` - Layout container
- `<scrollbox>` - Scrollable container

## OpenTUI-Specific Considerations

### 1. Text Editing

**From [src/tui/components/PrdChatApp.tsx](temp/ralph-tui/src/tui/components/PrdChatApp.tsx):**

```tsx
/**
 * Text editing is handled by the native OpenTUI input component
 */
```

OpenTUI provides built-in text input components that handle cursor positioning and editing.

### 2. Auto-Scrolling

**From [src/tui/components/SubagentTreePanel.tsx](temp/ralph-tui/src/tui/components/SubagentTreePanel.tsx):**

```tsx
// Note: In @opentui/react, scrollbox auto-scrolls when content exceeds height
```

OpenTUI's `scrollbox` component automatically handles scrolling behavior when content overflows.

### 3. Background Color Limitations

**From [src/tui/components/FormattedText.tsx](temp/ralph-tui/src/tui/components/FormattedText.tsx):**

```tsx
/**
 * Note: We use the panel background color (bg.secondary) instead of "transparent"
 * because OpenTUI doesn't properly support transparent span backgrounds.
 */
```

OpenTUI has some limitations with transparent backgrounds, requiring explicit background colors.

### 4. ANSI Code Handling

**From [src/tui/components/RightPanel.tsx](temp/ralph-tui/src/tui/components/RightPanel.tsx):**

```tsx
// ALWAYS strip ANSI codes - they cause black background artifacts in OpenTUI
```

```tsx
// Note: Full segment-based coloring (FormattedText) disabled due to OpenTUI
// background handling - using plain text instead
```

OpenTUI prefers its native color system over ANSI escape codes. Ralph-tui strips ANSI codes and uses OpenTUI's `fg`/`bg` props instead.

### 5. Opacity Syntax

**From [src/tui/components/HelpOverlay.tsx](temp/ralph-tui/src/tui/components/HelpOverlay.tsx):**

```tsx
backgroundColor: '#000000B3', // 70% opacity black (OpenTUI doesn't support rgba syntax)
```

OpenTUI uses hex color codes with alpha channel instead of CSS rgba() syntax.

## Component Structure

Ralph-tui's TUI module exports OpenTUI-based components:

**From [src/tui/index.ts](temp/ralph-tui/src/tui/index.ts):**

```typescript
/**
 * This module exports OpenTUI React components for the ralph-tui terminal interface.
 */

// Components
export * from './components/index.js';

// Theme and styling
export * from './theme.js';

// Type definitions
export * from './types.js';
```

## Key Components Using OpenTUI

1. **RunApp** - Main execution view with real-time progress
2. **PrdChatApp** - Interactive chat interface for PRD generation
3. **EpicSelectionApp** - Epic/task selection interface
4. **App** - Main layout component with responsive panels
5. **ChatView** - Text input and message display
6. **FormattedText** - Colored text rendering using OpenTUI's color system

## Lifecycle Management

Ralph-tui properly manages OpenTUI lifecycle:

```tsx
// 1. Create renderer
const renderer = createCliRenderer();

// 2. Create root and mount
const root = createRoot(renderer);
root.render(<Component />);

// 3. Handle updates (React manages re-renders)

// 4. Cleanup on exit
root.unmount();
renderer.dispose();
```

## Advantages of OpenTUI for ralph-tui

1. **React Integration** - Familiar React patterns (hooks, components, state)
2. **Type Safety** - Full TypeScript support with type definitions
3. **Responsive Layouts** - `useTerminalDimensions` for adaptive UI
4. **Keyboard Handling** - Simple `useKeyboard` hook for input
5. **Component Architecture** - Reusable UI components
6. **Native Terminal Rendering** - Efficient terminal output without ANSI workarounds

## Migration from Ink

Ralph-tui uses OpenTUI instead of Ink (another popular React-for-terminal framework). Key differences:

- **JSX Import Source**: `@opentui/react` instead of React default
- **Renderer Creation**: `createCliRenderer()` + `createRoot()`
- **Hook Names**: OpenTUI-specific hooks like `useTerminalDimensions`
- **Color System**: Native `fg`/`bg` props instead of ANSI codes
- **Component Names**: `<text>`, `<span>`, `<box>` elements

## Best Practices from ralph-tui

1. **Strip ANSI codes** - Use OpenTUI's native color props
2. **Use explicit backgrounds** - Avoid transparent backgrounds
3. **Leverage hooks** - `useKeyboard`, `useTerminalDimensions`, `useRenderer`
4. **Proper cleanup** - Always unmount and dispose renderer
5. **Type safety** - Import and use OpenTUI types for events
6. **Responsive design** - Calculate layouts based on terminal dimensions

## Summary

Ralph-tui effectively uses OpenTUI as its TUI framework, leveraging:

- **@opentui/core** for rendering infrastructure
- **@opentui/react** for React integration and hooks
- Native color system instead of ANSI codes
- Keyboard and dimension hooks for interactivity
- Proper lifecycle management for clean startup/shutdown

The project demonstrates OpenTUI's capabilities for building complex, interactive terminal applications with familiar React patterns while working within terminal-specific constraints like color handling and text rendering.
