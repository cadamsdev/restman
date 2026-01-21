---
name: opentui-react
description: Build terminal user interfaces (TUIs) using React with OpenTUI
license: MIT
compatibility: opencode
metadata:
  framework: react
  library: opentui
  target: terminal-ui
---

## What I do
- Guide development of OpenTUI React applications
- Explain and implement OpenTUI React components and hooks
- Help with styling, layout, and input handling in terminal UIs
- Assist with React DevTools integration for debugging

## When to use me

Use this skill when building terminal user interfaces with React in OpenTUI applications. I understand components, hooks, styling, and common TUI patterns.

Ask clarifying questions if UI layout or interaction requirements are unclear.

## Core Concepts

### Installation
```bash
bun install @opentui/react @opentui/core react
```

### Entry Point
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

### Components

**Layout & Display:**
- `<text>` - Display text with styling (`fg`, `bg`, `bold`, `italic`, `underline`)
- `<box>` - Container with borders and layout properties (`flexDirection`, `alignItems`, `justifyContent`, `padding`, `margin`, `border`, `borderColor`, `borderStyle`)
- `<scrollbox>` - Scrollable box with customizable scrollbar
- `<ascii-font>` - ASCII art text with font styles: `block`, `shade`, `slick`, `tiny`

**Input Components:**
- `<input>` - Single-line text input with `onInput`, `onSubmit`, `placeholder`
- `<textarea>` - Multi-line text input with ref for accessing plain text
- `<select>` - Dropdown with `options`, `onChange`, `focused`, `showScrollIndicator`
- `<tab-select>` - Tab-based selection interface

**Code & Diff:**
- `<code>` - Syntax-highlighted code with `content`, `filetype`, `syntaxStyle`
- `<line-number>` - Code with line numbers, diff highlights, diagnostics
- `<diff>` - Unified or split diff viewer

**Text Modifiers (must be inside `<text>`):**
- `<span>`, `<strong>`, `<em>`, `<u>`, `<b>`, `<i>`, `<br>`

### Hooks

**useKeyboard(handler, options?)**
```tsx
useKeyboard((key) => {
  if (key.name === 'escape') process.exit(0)
  if (key.name === 'return') handleSubmit()
  if (key.sequence === 's') toggleMode()
}, { release: false }) // Set release: true for key release events
```

**useTerminalDimensions()**
```tsx
const { width, height } = useTerminalDimensions()
```

**useRenderer()**
```tsx
const renderer = useRenderer()
useEffect(() => {
  renderer.console.show()
  console.log('Debug message')
}, [renderer])
```

**useOnResize(callback)**
```tsx
useOnResize((width, height) => {
  console.log(`Resized: ${width}x${height}`)
})
```

**useTimeline(options?)**
```tsx
const timeline = useTimeline({ duration: 2000, loop: false })
```

### Styling Patterns

**Direct props:**
```tsx
<box backgroundColor="blue" padding={2} border borderStyle="double">
```

**Style object:**
```tsx
<box style={{
  backgroundColor: '#1a1a1a',
  border: true,
  borderColor: '#CC8844',
  padding: 1,
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  zIndex: 1000,
}}>
```

### Color Scheme (RestMan standard)
- Primary: `#CC8844`
- Secondary: `#BB7733`
- Borders: `#555555`
- Muted: `#999999`
- Background: `#1a1a1a`

### TypeScript Config
```json
{
  "compilerOptions": {
    "lib": ["ESNext", "DOM"],
    "target": "ESNext",
    "module": "ESNext",
    "jsx": "react-jsx",
    "jsxImportSource": "@opentui/react",
    "strict": true
  }
}
```

## Common Patterns

**Focus management:**
```tsx
const [focused, setFocused] = useState('field1')
const isFocused = focused === 'field1'

<box borderColor={isFocused ? '#CC8844' : '#555555'}>
  <input focused={isFocused} />
</box>
```

**Keyboard navigation:**
```tsx
useKeyboard((key) => {
  if (key.name === 'tab') {
    setFocused(prev => fields[(fields.indexOf(prev) + 1) % fields.length])
  }
  if (key.name === 'up') {
    setSelectedIndex(Math.max(0, selectedIndex - 1))
  }
  if (key.sequence === 'g') setSelectedIndex(0) // vim-style go to top
  if (key.sequence === 'G') setSelectedIndex(items.length - 1) // vim-style go to bottom
})
```

**Modal overlays:**
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
    <box style={{
      border: 'double',
      borderColor: '#665544',
      padding: 2,
      backgroundColor: '#1a1a1a',
    }}>
      <text>Modal Content</text>
    </box>
  </box>
)}
```

**Dynamic border colors:**
```tsx
const getBorderColor = (focused: boolean, editMode: boolean): string => {
  if (focused) return '#CC8844'
  if (editMode) return '#BB7733'
  return '#555555'
}
```

## Best Practices

1. Use `useCallback` for keyboard handlers to prevent unnecessary re-renders
2. Fire-and-forget async functions with `void` to avoid linter warnings
3. Use `Date.now()` for unique IDs
4. Handle modal key events separately to prevent conflicts
5. Exit edit mode with ESC key
6. Use `fg` and `bg` props for inline color styling
7. Test keyboard navigation flow in the terminal

## React DevTools Integration

```bash
bun add --dev react-devtools-core@7
npx react-devtools@7
DEV=true bun run your-app.ts
```

## Component Extension

Create custom components by extending base renderables:
```tsx
import { BoxRenderable, RenderContext, type BoxOptions } from '@opentui/core'
import { extend } from '@opentui/react'

class CustomButton extends BoxRenderable {
  constructor(ctx: RenderContext, options: BoxOptions & { label?: string }) {
    super(ctx, { border: true, borderStyle: 'single', ...options })
  }
}

extend({ customButton: CustomButton })
// Then use: <customButton label="Click me!" />
```

## When to use me

Use this when building terminal user interfaces with React in OpenTUI applications. I understand components, hooks, styling, and common TUI patterns.

Ask clarifying questions if the UI layout or interaction requirements are unclear.
