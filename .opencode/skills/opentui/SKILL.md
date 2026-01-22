---
name: opentui
description: A skill for building terminal user interfaces with opentui and react.
---

## When to use

Use this skill when building UIs with opentui and react.

## What I do
- Guide development of OpenTUI applications (both core and React)
- Explain and implement OpenTUI renderables, components, and hooks
- Help with styling, layout, keyboard/mouse input, and rendering
- Assist with console integration and debugging

## Installation

```bash
# Core only
bun install @opentui/core

# With React
bun install @opentui/react @opentui/core react
```

## Core Concepts

### Renderer

The `CliRenderer` manages terminal output, input events, and the rendering loop. It can run in "live" mode with `renderer.start()` for a capped FPS loop, or without starting for render-on-demand.

```typescript
import { createCliRenderer } from '@opentui/core'

const renderer = await createCliRenderer({
  exitOnCtrlC: false,
  targetFps: 30,
})

// Optional: Start FPS-capped rendering loop
renderer.start()
```

### Renderables (Core)

Building blocks of your UI - hierarchical objects that can be positioned, styled, and nested. Uses Yoga layout engine for flexbox-like positioning.

```typescript
import { TextRenderable, BoxRenderable } from '@opentui/core'

const box = new BoxRenderable(renderer, {
  id: 'container',
  width: 30,
  height: 10,
  backgroundColor: '#333366',
  borderStyle: 'double',
  borderColor: '#FFFFFF',
  position: 'absolute',
  left: 10,
  top: 5,
})

const text = new TextRenderable(renderer, {
  id: 'greeting',
  content: 'Hello, OpenTUI!',
  fg: '#00FF00',
})

box.add(text)
renderer.root.add(box)
```

### Constructs (Core Components)

Declarative way to compose renderables without React. Look like components but are constructors that return VNodes.

```typescript
import { Box, Text } from '@opentui/core'

const greeting = Text({
  content: 'Hello, OpenTUI!',
  fg: '#00FF00',
  position: 'absolute',
  left: 10,
  top: 5,
})

renderer.root.add(greeting)
```

### React Integration

Use React for declarative, reactive UIs with familiar hooks and patterns.

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

## Available Renderables/Components

### Text

Display styled text with colors, attributes, and text selection.

**Core:**
```typescript
import { TextRenderable, TextAttributes, t, bold, underline, fg } from '@opentui/core'

const text = new TextRenderable(renderer, {
  id: 'styled-text',
  content: t`${bold('Important')} ${fg('#FF0000')(underline('Message'))}`,
  fg: '#FFFF00',
  attributes: TextAttributes.BOLD | TextAttributes.UNDERLINE,
})
```

**React:**
```tsx
<text fg="#FFFF00" bold underline>
  Important Message
</text>
```

### Box

Container with borders, background colors, and flexbox layout capabilities.

**Core:**
```typescript
import { BoxRenderable } from '@opentui/core'

const panel = new BoxRenderable(renderer, {
  id: 'panel',
  width: 30,
  height: 10,
  backgroundColor: '#333366',
  borderStyle: 'double',
  borderColor: '#FFFFFF',
  title: 'Settings',
  titleAlignment: 'center',
  flexDirection: 'column',
  padding: 2,
})
```

**React:**
```tsx
<box
  width={30}
  height={10}
  backgroundColor="#333366"
  borderStyle="double"
  borderColor="#FFFFFF"
  flexDirection="column"
  padding={2}
>
  {/* children */}
</box>
```

### Input

Single-line text input with cursor, placeholder, and focus states. **Must be focused to receive input.**

**Core:**
```typescript
import { InputRenderable, InputRenderableEvents } from '@opentui/core'

const input = new InputRenderable(renderer, {
  id: 'name-input',
  width: 25,
  placeholder: 'Enter your name...',
  textColor: '#FFFFFF',
  cursorColor: '#FFFF00',
  maxLength: 50,
})

input.on(InputRenderableEvents.CHANGE, (value) => {
  console.log('Input:', value)
})

input.focus()
```

**React:**
```tsx
<input
  width={25}
  placeholder="Enter your name..."
  onInput={(value) => console.log(value)}
  onSubmit={(value) => console.log(value)}
  focused={isFocused}
/>
```

### Select

List selection with keyboard navigation. **Must be focused.** Keys: `up/k`, `down/j`, `enter` to select.

**Core:**
```typescript
import { SelectRenderable, SelectRenderableEvents } from '@opentui/core'

const select = new SelectRenderable(renderer, {
  id: 'menu',
  width: 30,
  height: 8,
  options: [
    { name: 'New File', description: 'Create a new file' },
    { name: 'Open File', description: 'Open existing file' },
  ],
})

select.on(SelectRenderableEvents.ITEM_SELECTED, (index, option) => {
  console.log('Selected:', option.name)
})

select.focus()
```

**React:**
```tsx
<select
  width={30}
  height={8}
  options={options}
  onChange={(index, option) => console.log(option.name)}
  focused={isFocused}
/>
```

### TabSelect

Horizontal tab selection. **Must be focused.** Keys: `left/[`, `right/]`, `enter` to select.

**Core:**
```typescript
import { TabSelectRenderable, TabSelectRenderableEvents } from '@opentui/core'

const tabs = new TabSelectRenderable(renderer, {
  id: 'tabs',
  width: 60,
  options: [
    { name: 'Home', description: 'Dashboard' },
    { name: 'Settings', description: 'App settings' },
  ],
  tabWidth: 20,
})

tabs.on(TabSelectRenderableEvents.ITEM_SELECTED, (index, option) => {
  console.log('Tab:', option.name)
})

tabs.focus()
```

**React:**
```tsx
<tab-select
  width={60}
  options={options}
  onChange={(index, option) => console.log(option.name)}
  focused={isFocused}
/>
```

### Other Components

**React-specific:**
- `<scrollbox>` - Scrollable container with customizable scrollbar
- `<textarea>` - Multi-line text input with ref access
- `<code>` - Syntax-highlighted code (`content`, `filetype`, `syntaxStyle`)
- `<line-number>` - Code with line numbers and diff highlights
- `<diff>` - Unified or split diff viewer
- `<ascii-font>` - ASCII art text with font styles (`block`, `shade`, `slick`, `tiny`)

**Core-specific:**
- `ASCIIFontRenderable` - ASCII art text with multiple font styles
- `FrameBufferRenderable` - Low-level rendering surface for custom graphics

### Text Modifiers (React only, must be inside `<text>`)

`<span>`, `<strong>`, `<em>`, `<u>`, `<b>`, `<i>`, `<br>`

## Keyboard Input

### Core

```typescript
import type { KeyEvent } from '@opentui/core'

renderer.keyInput.on('keypress', (key: KeyEvent) => {
  console.log('Key:', key.name)      // 'escape', 'return', 'tab', etc.
  console.log('Sequence:', key.sequence)  // Raw character
  console.log('Ctrl:', key.ctrl)
  console.log('Shift:', key.shift)
  console.log('Alt:', key.meta)
  
  if (key.name === 'escape') process.exit(0)
  if (key.ctrl && key.name === 'c') console.log('Ctrl+C')
})
```

### React Hook

```tsx
import { useKeyboard } from '@opentui/react'

useKeyboard((key) => {
  if (key.name === 'escape') process.exit(0)
  if (key.name === 'return') handleSubmit()
  if (key.sequence === 's') toggleMode()
}, { release: false }) // Set release: true for key release events
```

## React Hooks

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

## Styling

### Colors

OpenTUI uses the `RGBA` class for color representation.

```typescript
import { RGBA } from '@opentui/core'

const red = RGBA.fromInts(255, 0, 0, 255)       // RGB integers (0-255)
const blue = RGBA.fromValues(0.0, 0.0, 1.0, 1.0) // Float values (0.0-1.0)
const green = RGBA.fromHex('#00FF00')           // Hex strings
const transparent = RGBA.fromValues(1.0, 1.0, 1.0, 0.5) // Semi-transparent
```

The `parseColor()` utility accepts RGBA objects, hex strings, CSS color names, or `"transparent"`.

### React Style Props

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

## Layout System

OpenTUI uses the Yoga layout engine for CSS Flexbox-like layouts.

**Core:**
```typescript
import { GroupRenderable, BoxRenderable } from '@opentui/core'

const container = new GroupRenderable(renderer, {
  id: 'container',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  height: 10,
})

const leftPanel = new BoxRenderable(renderer, {
  id: 'left',
  flexGrow: 1,
  height: 10,
  backgroundColor: '#444',
})

const rightPanel = new BoxRenderable(renderer, {
  id: 'right',
  width: 20,
  height: 10,
  backgroundColor: '#666',
})

container.add(leftPanel)
container.add(rightPanel)
```

**React:**
```tsx
<box flexDirection="row" justifyContent="space-between" alignItems="center">
  <box flexGrow={1} backgroundColor="#444" />
  <box width={20} backgroundColor="#666" />
</box>
```

## Console Overlay

Built-in console overlay that captures `console.log`, `console.info`, `console.warn`, `console.error`, and `console.debug`.

```typescript
const renderer = await createCliRenderer({
  consoleOptions: {
    position: ConsolePosition.BOTTOM,
    sizePercent: 30,
    colorInfo: '#00FFFF',
    colorWarn: '#FFFF00',
    colorError: '#FF0000',
    startInDebugMode: false,
  },
})

console.log('This appears in the overlay')
renderer.console.toggle() // Show/hide console
// When focused: arrow keys scroll, +/- adjust size
```

## FrameBuffer (Custom Rendering)

Low-level rendering surface for custom graphics and effects.

```typescript
import { FrameBufferRenderable, RGBA } from '@opentui/core'

const canvas = new FrameBufferRenderable(renderer, {
  id: 'canvas',
  width: 50,
  height: 20,
})

// Custom rendering
canvas.frameBuffer.fillRect(10, 5, 20, 8, RGBA.fromHex('#FF0000'))
canvas.frameBuffer.drawText('Custom Graphics', 12, 7, RGBA.fromHex('#FFFFFF'))
canvas.frameBuffer.setCell(15, 10, '█', RGBA.fromHex('#00FF00'), RGBA.fromHex('#000000'))
```

## Common Patterns

### Focus Management (React)

```tsx
const [focused, setFocused] = useState('field1')
const isFocused = focused === 'field1'

<box borderColor={isFocused ? '#CC8844' : '#555555'}>
  <input focused={isFocused} />
</box>
```

### Keyboard Navigation (React)

```tsx
useKeyboard((key) => {
  if (key.name === 'tab') {
    setFocused(prev => fields[(fields.indexOf(prev) + 1) % fields.length])
  }
  if (key.name === 'up') {
    setSelectedIndex(Math.max(0, selectedIndex - 1))
  }
  if (key.sequence === 'g') setSelectedIndex(0) // vim-style
  if (key.sequence === 'G') setSelectedIndex(items.length - 1)
})
```

### Modal Overlays (React)

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

### Dynamic Border Colors

```tsx
const getBorderColor = (focused: boolean, editMode: boolean): string => {
  if (focused) return '#CC8844'
  if (editMode) return '#BB7733'
  return '#555555'
}
```

### VNode Composition (Core)

```typescript
import { Box, Text, delegate } from '@opentui/core'

function Button(props: { title: string; onClick: () => void }) {
  return Box(
    {
      border: true,
      onMouseDown: props.onClick,
    },
    Text({ content: props.title }),
  )
}

// Delegate add/remove operations to specific child
function Container(props: { id: string }, children: VNode[] = []) {
  return delegate(
    { add: `${props.id}_inner`, remove: `${props.id}_inner` },
    Box({ id: `${props.id}_outer`, border: true }, [
      Box({ id: `${props.id}_inner`, padding: 1 }, children),
    ]),
  )
}

const container = Container({ id: 'my-container' })
renderer.root.add(container)

// This will be added to the inner box, not the outer one
container.add(Button({ title: 'Click me', onClick: () => console.log('clicked') }))
```

## Best Practices

1. Use `useCallback` for keyboard handlers (React) to prevent re-renders
2. Fire-and-forget async with `void` to avoid linter warnings
3. Use `Date.now()` for unique IDs
4. Handle modal key events separately to prevent conflicts
5. Exit edit mode with ESC key
6. Use `fg` and `bg` props for inline color styling (React)
7. Test keyboard navigation flow in the terminal
8. Focus components before expecting keyboard input
9. Use `renderer.start()` only when you need FPS-capped live rendering
10. Prefer Constructs/VNodes over Renderables for cleaner composition (Core)

## React DevTools Integration

```bash
bun add --dev react-devtools-core@7
npx react-devtools@7
DEV=true bun run your-app.ts
```

## Component Extension (React)

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
// Use: <customButton label="Click me!" />
```

## TypeScript Config

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
