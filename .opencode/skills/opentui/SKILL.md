---
name: opentui
description: Build and modify terminal user interfaces using OpenTUI with React or Core API. Use when implementing terminal UIs, TUIs, CLI applications, interactive terminal components, keyboard navigation, terminal styling, or when the user mentions OpenTUI, terminal rendering, or RestMan UI components.
metadata:
  author: restman
  version: "2.0"
compatibility: Requires @opentui/core and optionally @opentui/react for React integration
---

## When to use this skill

Use this skill when:
- Building or modifying OpenTUI applications (React or Core API)
- Implementing terminal UI components (boxes, inputs, selects, tabs)
- Adding keyboard navigation or input handling
- Styling terminal interfaces with colors and borders
- Debugging rendering or layout issues
- Working on RestMan UI features
- User mentions TUI, terminal UI, or CLI interfaces

## What this skill does

This skill guides development of terminal user interfaces using OpenTUI. It provides:
- Instructions for both React (declarative) and Core (imperative) approaches
- Component usage patterns and keyboard handling
- Styling guidelines and RestMan color scheme standards
- Layout system (Yoga/Flexbox) guidance
- Focus management and interactive component best practices

## Quick Start

### Installation

```bash
# Core only
bun install @opentui/core

# With React (recommended for RestMan)
bun install @opentui/react @opentui/core react
```

### TypeScript Config

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@opentui/react"
  }
}
```

### Basic React App

```tsx
import { createCliRenderer } from '@opentui/core'
import { createRoot } from '@opentui/react'

function App() {
  return <text>Hello, world!</text>
}

const renderer = await createCliRenderer({ exitOnCtrlC: false })
const root = createRoot(renderer)
root.render(<App />)
```

### Basic Core App

```typescript
import { createCliRenderer, Text } from '@opentui/core'

const renderer = await createCliRenderer({ exitOnCtrlC: false })
const greeting = Text({ content: 'Hello, world!' })
renderer.root.add(greeting)
```

## Key Concepts

### Rendering Approaches

**React (Recommended for RestMan):**
- Declarative, component-based
- Use hooks: `useState`, `useEffect`, `useKeyboard`
- Familiar React patterns

**Core (For utilities and low-level control):**
- Imperative API with Renderables
- Direct control over rendering
- VNodes/Constructs for composition

### Interactive Components MUST Be Focused

Components like `<input>`, `<select>`, and `<tab-select>` **MUST be focused** to receive keyboard input:

```tsx
// React
<input focused={isFocused} />

// Core
input.focus()
```

### RestMan Color Scheme

Always use these colors for consistency:
- **Primary (focus):** `#CC8844`
- **Secondary (edit mode):** `#BB7733`
- **Borders:** `#555555`
- **Muted text:** `#999999`
- **Background:** `#1a1a1a`

## Common Components

### Text

```tsx
// React
<text fg="#FFFF00" bold underline>
  Important Message
</text>

// Core
import { TextRenderable, t, bold, fg } from '@opentui/core'
const text = new TextRenderable(renderer, {
  content: t`${bold('Important')} ${fg('#FF0000')('Message')}`,
})
```

### Box (Container)

```tsx
// React
<box
  width={30}
  height={10}
  backgroundColor="#333366"
  borderStyle="double"
  borderColor="#FFFFFF"
  padding={2}
>
  {children}
</box>

// Core
import { BoxRenderable } from '@opentui/core'
const box = new BoxRenderable(renderer, {
  width: 30,
  height: 10,
  backgroundColor: '#333366',
  borderStyle: 'double',
  padding: 2,
})
```

### Input (Text Field)

```tsx
// React
<input
  width={25}
  placeholder="Enter name..."
  onInput={(value) => setValue(value)}
  onSubmit={(value) => handleSubmit(value)}
  focused={isFocused}
/>

// Core
import { InputRenderable, InputRenderableEvents } from '@opentui/core'
const input = new InputRenderable(renderer, {
  width: 25,
  placeholder: 'Enter name...',
})
input.on(InputRenderableEvents.CHANGE, (value) => console.log(value))
input.focus()
```

### Select (List)

```tsx
// React - Keys: up/k, down/j, enter to select
<select
  width={30}
  height={8}
  options={[
    { name: 'Option 1', description: 'First option' },
    { name: 'Option 2', description: 'Second option' },
  ]}
  onChange={(index, option) => handleSelect(option)}
  focused={isFocused}
/>
```

### TabSelect (Horizontal Tabs)

```tsx
// React - Keys: left/[, right/], enter to select
<tab-select
  width={60}
  options={tabOptions}
  onChange={(index, option) => setActiveTab(index)}
  focused={isFocused}
/>
```

### Other Components

**React-specific:**
- `<scrollbox>` - Scrollable container
- `<textarea>` - Multi-line input
- `<code>` - Syntax-highlighted code
- `<line-number>` - Code with line numbers
- `<diff>` - Diff viewer
- `<ascii-font>` - ASCII art text

## Keyboard Input

### React Hook (Recommended)

```tsx
import { useKeyboard } from '@opentui/react'

useKeyboard((key) => {
  if (key.name === 'escape') setShowModal(false)
  if (key.name === 'return') handleSubmit()
  if (key.name === 'tab') moveFocus()
  if (key.ctrl && key.name === 'c') console.log('Ctrl+C')
})
```

### Core Events

```typescript
renderer.keyInput.on('keypress', (key) => {
  console.log('Key name:', key.name)      // 'escape', 'return', 'tab'
  console.log('Sequence:', key.sequence)  // Raw character
  console.log('Modifiers:', key.ctrl, key.shift, key.meta)
})
```

## Layout System

OpenTUI uses Yoga (CSS Flexbox) for layouts:

```tsx
<box flexDirection="row" justifyContent="space-between" alignItems="center">
  <box flexGrow={1} backgroundColor="#444" />
  <box width={20} backgroundColor="#666" />
</box>
```

**Common layout props:**
- `flexDirection`: `'row'` | `'column'`
- `justifyContent`: `'flex-start'` | `'center'` | `'space-between'` | etc.
- `alignItems`: `'flex-start'` | `'center'` | `'stretch'` | etc.
- `flexGrow`, `flexShrink`, `flexBasis`
- `width`, `height`, `padding`, `margin`

## Common Patterns

### Focus Management

```tsx
const [focusedField, setFocusedField] = useState('field1')

<box borderColor={focusedField === 'field1' ? '#CC8844' : '#555555'}>
  <input focused={focusedField === 'field1'} />
</box>
```

### Dynamic Border Colors

```tsx
const getBorderColor = (focused: boolean, editMode: boolean): string => {
  if (focused) return '#CC8844'
  if (editMode) return '#BB7733'
  return '#555555'
}
```

### Modal Overlays

```tsx
{showModal && (
  <box style={{
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  }}>
    <box borderStyle="double" borderColor="#665544" padding={2}>
      <text>Modal Content</text>
    </box>
  </box>
)}
```

### Keyboard Navigation

```tsx
useKeyboard((key) => {
  if (key.name === 'tab') {
    // Cycle through fields
    setFocused(fields[(fields.indexOf(focused) + 1) % fields.length])
  }
  if (key.name === 'up') setSelectedIndex(Math.max(0, selectedIndex - 1))
  if (key.name === 'down') setSelectedIndex(Math.min(max, selectedIndex + 1))
  if (key.sequence === 'g') setSelectedIndex(0) // vim-style
  if (key.sequence === 'G') setSelectedIndex(items.length - 1)
})
```

## React Hooks

**useKeyboard(callback, options?)** - Handle keyboard input
```tsx
useKeyboard((key) => {}, { release: false })
```

**useTerminalDimensions()** - Get terminal size
```tsx
const { width, height } = useTerminalDimensions()
```

**useRenderer()** - Access renderer instance
```tsx
const renderer = useRenderer()
```

**useOnResize(callback)** - Handle terminal resize
```tsx
useOnResize((width, height) => console.log('Resized'))
```

## Best Practices

1. **Choose the right approach:** Use React for RestMan UI (stateful, complex). Use Core for simple utilities.
2. **Always ensure focus:** Interactive components MUST be focused to work.
3. **Use RestMan colors:** Stick to the standard color scheme for consistency.
4. **Implement proper keyboard navigation:** Use `useKeyboard` hook in React.
5. **Style consistently:** Use kebab-case in style objects, direct props when possible.
6. **Use useCallback for handlers:** Prevents unnecessary re-renders in React.
7. **Fire-and-forget async:** Use `void asyncFunction()` to avoid lint warnings.
8. **Test in terminal:** Always test keyboard navigation flow.
9. **Handle modal keys separately:** Prevent conflicts with underlying UI.
10. **Exit edit mode with ESC:** Standard pattern for RestMan.

## Styling

### Direct Props (Recommended)

```tsx
<box backgroundColor="blue" padding={2} border borderStyle="double">
```

### Style Object

```tsx
<box style={{
  backgroundColor: '#1a1a1a',
  borderColor: '#CC8844',
  padding: 1,
  flexDirection: 'column',
  position: 'absolute',
  zIndex: 1000,
}}>
```

### Colors

OpenTUI uses the `RGBA` class for colors:

```typescript
import { RGBA } from '@opentui/core'

RGBA.fromHex('#00FF00')           // Hex string
RGBA.fromInts(255, 0, 0, 255)     // RGB integers (0-255)
RGBA.fromValues(0.0, 0.0, 1.0, 1.0) // Float values (0.0-1.0)
```

## Detailed Reference

For comprehensive documentation on all components, events, and advanced features, see:

- [Complete API Reference](references/REFERENCE.md) - All renderables, props, events, and methods
- RestMan codebase examples in `src/` directory

## Debugging

### Console Overlay

```typescript
const renderer = await createCliRenderer({
  consoleOptions: {
    position: ConsolePosition.BOTTOM,
    sizePercent: 30,
  },
})

console.log('Debug message')
renderer.console.toggle() // Show/hide
// When focused: arrows scroll, +/- adjust size
```

### React DevTools

```bash
bun add --dev react-devtools-core@7
npx react-devtools@7
DEV=true bun run your-app.ts
```

## RestMan Integration Notes

When working on RestMan:
1. Follow the component structure in `src/components/`
2. Use established patterns from `RequestEditor.tsx`, `HistoryView.tsx`, etc.
3. Maintain consistent focus management across views
4. Use the standard color scheme defined in AGENTS.md
5. Test all keyboard shortcuts thoroughly
6. Ensure proper state management with React hooks
