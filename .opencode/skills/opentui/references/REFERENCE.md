# OpenTUI Complete API Reference

This document provides comprehensive documentation for all OpenTUI renderables, components, props, events, and advanced features.

## Table of Contents

1. [Renderer Configuration](#renderer-configuration)
2. [Core Renderables](#core-renderables)
3. [React Components](#react-components)
4. [Text Styling](#text-styling)
5. [Events and Handlers](#events-and-handlers)
6. [Advanced Features](#advanced-features)
7. [Component Extension](#component-extension)

## Renderer Configuration

### createCliRenderer(options)

Creates a CLI renderer instance that manages terminal output and input.

```typescript
import { createCliRenderer, ConsolePosition } from '@opentui/core'

const renderer = await createCliRenderer({
  exitOnCtrlC: false,      // Don't exit on Ctrl+C
  targetFps: 30,           // Target frames per second
  consoleOptions: {
    position: ConsolePosition.BOTTOM,
    sizePercent: 30,       // 30% of screen height
    colorInfo: '#00FFFF',
    colorWarn: '#FFFF00',
    colorError: '#FF0000',
    startInDebugMode: false,
  },
})

// Optional: Start FPS-capped rendering loop
renderer.start()

// Without start(), renderer updates on-demand only
```

**Properties:**
- `renderer.root` - Root renderable node
- `renderer.keyInput` - Keyboard input event emitter
- `renderer.console` - Console overlay control

**Methods:**
- `start()` - Start FPS-capped rendering loop
- `stop()` - Stop rendering loop

## Core Renderables

### TextRenderable

Display styled text with colors and attributes.

```typescript
import { TextRenderable, TextAttributes, t, bold, underline, fg, bg } from '@opentui/core'

const text = new TextRenderable(renderer, {
  id: 'styled-text',
  content: 'Plain text',
  fg: '#FFFF00',                              // Foreground color
  bg: '#000000',                              // Background color
  attributes: TextAttributes.BOLD | TextAttributes.UNDERLINE,
})

// Using template literal styling
const styledText = new TextRenderable(renderer, {
  content: t`${bold('Important')} ${fg('#FF0000')(underline('Message'))}`,
})
```

**Options:**
- `id` - Unique identifier
- `content` - Text content (string or styled template)
- `fg` - Foreground color (hex string or RGBA)
- `bg` - Background color
- `attributes` - TextAttributes flags (BOLD, UNDERLINE, ITALIC, etc.)
- `wrap` - Text wrapping mode
- Layout props (width, height, padding, etc.)

**Text Attributes:**
- `TextAttributes.BOLD`
- `TextAttributes.UNDERLINE`
- `TextAttributes.ITALIC`
- `TextAttributes.BLINK`
- `TextAttributes.INVERSE`
- `TextAttributes.DIM`

**Template Helpers:**
- `bold(text)` - Bold text
- `underline(text)` - Underlined text
- `italic(text)` - Italic text
- `fg(color)(text)` - Colored foreground
- `bg(color)(text)` - Colored background

### BoxRenderable

Container with borders, background, and layout capabilities.

```typescript
import { BoxRenderable } from '@opentui/core'

const box = new BoxRenderable(renderer, {
  id: 'panel',
  width: 30,
  height: 10,
  backgroundColor: '#333366',
  borderStyle: 'double',
  borderColor: '#FFFFFF',
  title: 'Panel Title',
  titleAlignment: 'center',      // 'left' | 'center' | 'right'
  flexDirection: 'column',
  padding: 2,
  position: 'absolute',
  left: 10,
  top: 5,
})

box.add(childRenderable)
```

**Options:**
- `backgroundColor` - Fill color
- `borderStyle` - `'single'` | `'double'` | `'rounded'` | `'bold'` | `'none'`
- `borderColor` - Border color
- `title` - Optional title text
- `titleAlignment` - Title position
- Layout props (flexDirection, padding, margin, etc.)

### InputRenderable

Single-line text input with cursor and placeholder.

```typescript
import { InputRenderable, InputRenderableEvents } from '@opentui/core'

const input = new InputRenderable(renderer, {
  id: 'name-input',
  width: 25,
  placeholder: 'Enter your name...',
  textColor: '#FFFFFF',
  cursorColor: '#FFFF00',
  maxLength: 50,
  value: 'Initial value',
})

input.on(InputRenderableEvents.CHANGE, (value: string) => {
  console.log('Input changed:', value)
})

input.on(InputRenderableEvents.SUBMIT, (value: string) => {
  console.log('Submitted:', value)
})

input.focus()  // REQUIRED for keyboard input
```

**Options:**
- `placeholder` - Placeholder text
- `textColor` - Input text color
- `cursorColor` - Cursor color
- `maxLength` - Maximum character limit
- `value` - Initial value
- `width` - Input width

**Events:**
- `InputRenderableEvents.CHANGE` - Fires on text change
- `InputRenderableEvents.SUBMIT` - Fires on Enter key

**Methods:**
- `focus()` - Focus the input
- `blur()` - Remove focus
- `setValue(value)` - Set input value programmatically

### SelectRenderable

List selection with keyboard navigation.

```typescript
import { SelectRenderable, SelectRenderableEvents } from '@opentui/core'

const select = new SelectRenderable(renderer, {
  id: 'menu',
  width: 30,
  height: 8,
  options: [
    { name: 'New File', description: 'Create a new file' },
    { name: 'Open File', description: 'Open existing file' },
    { name: 'Save', description: 'Save current file' },
  ],
  selectedIndex: 0,
})

select.on(SelectRenderableEvents.ITEM_SELECTED, (index: number, option: any) => {
  console.log('Selected:', option.name)
})

select.on(SelectRenderableEvents.ACTIVE_INDEX_CHANGED, (index: number) => {
  console.log('Highlighted:', index)
})

select.focus()  // REQUIRED
```

**Options:**
- `options` - Array of `{ name, description? }` objects
- `selectedIndex` - Initially selected index
- `width`, `height` - Dimensions

**Events:**
- `SelectRenderableEvents.ITEM_SELECTED` - Fires on Enter key
- `SelectRenderableEvents.ACTIVE_INDEX_CHANGED` - Fires when highlight moves

**Keyboard:**
- `up` or `k` - Move up
- `down` or `j` - Move down
- `enter` - Select item

### TabSelectRenderable

Horizontal tab selection.

```typescript
import { TabSelectRenderable, TabSelectRenderableEvents } from '@opentui/core'

const tabs = new TabSelectRenderable(renderer, {
  id: 'tabs',
  width: 60,
  options: [
    { name: 'Home', description: 'Dashboard view' },
    { name: 'Settings', description: 'App settings' },
    { name: 'History', description: 'Request history' },
  ],
  tabWidth: 20,
  selectedIndex: 0,
})

tabs.on(TabSelectRenderableEvents.ITEM_SELECTED, (index: number, option: any) => {
  console.log('Tab selected:', option.name)
})

tabs.focus()  // REQUIRED
```

**Options:**
- `options` - Array of `{ name, description? }` objects
- `tabWidth` - Width of each tab
- `selectedIndex` - Initially selected index

**Events:**
- `TabSelectRenderableEvents.ITEM_SELECTED` - Fires on Enter
- `TabSelectRenderableEvents.ACTIVE_INDEX_CHANGED` - Fires when highlight moves

**Keyboard:**
- `left` or `[` - Move left
- `right` or `]` - Move right
- `enter` - Select tab

### GroupRenderable

Container for layout without visual styling.

```typescript
import { GroupRenderable } from '@opentui/core'

const container = new GroupRenderable(renderer, {
  id: 'container',
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
  height: 10,
})
```

### ASCIIFontRenderable

ASCII art text with various font styles.

```typescript
import { ASCIIFontRenderable } from '@opentui/core'

const asciiText = new ASCIIFontRenderable(renderer, {
  id: 'logo',
  content: 'RESTMAN',
  font: 'block',  // 'block' | 'shade' | 'slick' | 'tiny'
  fg: '#CC8844',
})
```

### FrameBufferRenderable

Low-level rendering surface for custom graphics.

```typescript
import { FrameBufferRenderable, RGBA } from '@opentui/core'

const canvas = new FrameBufferRenderable(renderer, {
  id: 'canvas',
  width: 50,
  height: 20,
})

// Custom rendering methods
canvas.frameBuffer.fillRect(10, 5, 20, 8, RGBA.fromHex('#FF0000'))
canvas.frameBuffer.drawText('Custom', 12, 7, RGBA.fromHex('#FFFFFF'))
canvas.frameBuffer.setCell(15, 10, '█', fgColor, bgColor)
canvas.frameBuffer.clear(RGBA.fromHex('#000000'))
```

**FrameBuffer Methods:**
- `fillRect(x, y, width, height, color)` - Fill rectangle
- `drawText(text, x, y, color)` - Draw text at position
- `setCell(x, y, char, fg, bg)` - Set individual cell
- `clear(color)` - Clear buffer with color
- `getCell(x, y)` - Get cell data

## React Components

### Common Props

All React components accept these layout props:

```tsx
<component
  width={30}
  height={10}
  padding={1}
  margin={2}
  flexDirection="row"
  justifyContent="center"
  alignItems="center"
  flexGrow={1}
  flexShrink={0}
  position="absolute"
  left={5}
  top={5}
  zIndex={100}
/>
```

### text

```tsx
<text 
  fg="#FFFF00" 
  bg="#000000"
  bold
  underline
  italic
>
  Styled text
</text>
```

**Props:**
- `fg` - Foreground color
- `bg` - Background color
- `bold` - Bold text
- `underline` - Underlined
- `italic` - Italic
- `children` - Text content

**Text Modifiers (nested inside `<text>`):**
- `<span fg="color">` - Colored text
- `<strong>` or `<b>` - Bold
- `<em>` or `<i>` - Italic
- `<u>` - Underline
- `<br>` - Line break

### box

```tsx
<box
  backgroundColor="#333366"
  borderStyle="double"
  borderColor="#FFFFFF"
  title="Panel Title"
  padding={2}
>
  {children}
</box>
```

**Props:**
- `backgroundColor` - Fill color
- `borderStyle` - Border type
- `borderColor` - Border color
- `title` - Title text
- `padding`, `margin` - Spacing

### input

```tsx
<input
  width={25}
  placeholder="Enter text..."
  value={text}
  onInput={(value) => setText(value)}
  onSubmit={(value) => handleSubmit(value)}
  focused={isFocused}
  textColor="#FFFFFF"
  cursorColor="#FFFF00"
  maxLength={50}
/>
```

**Props:**
- `placeholder` - Placeholder text
- `value` - Controlled value
- `onInput` - Change handler
- `onSubmit` - Submit handler (Enter key)
- `focused` - Focus state (REQUIRED)
- `textColor` - Input text color
- `cursorColor` - Cursor color
- `maxLength` - Max characters

### select

```tsx
<select
  width={30}
  height={8}
  options={options}
  selectedIndex={0}
  onChange={(index, option) => handleSelect(option)}
  onActiveIndexChange={(index) => handleHighlight(index)}
  focused={isFocused}
/>
```

**Props:**
- `options` - Array of `{ name, description? }`
- `selectedIndex` - Selected index
- `onChange` - Selection handler
- `onActiveIndexChange` - Highlight handler
- `focused` - Focus state (REQUIRED)

### tab-select

```tsx
<tab-select
  width={60}
  options={options}
  selectedIndex={0}
  tabWidth={20}
  onChange={(index, option) => handleTabChange(index)}
  focused={isFocused}
/>
```

**Props:**
- `options` - Array of `{ name, description? }`
- `selectedIndex` - Selected tab index
- `tabWidth` - Width per tab
- `onChange` - Tab change handler
- `focused` - Focus state (REQUIRED)

### scrollbox

Scrollable container with scrollbar.

```tsx
<scrollbox
  width={40}
  height={20}
  scrollbarColor="#888888"
  scrollbarPosition="right"
>
  {longContent}
</scrollbox>
```

**Props:**
- `scrollbarColor` - Scrollbar color
- `scrollbarPosition` - `'right'` | `'left'`
- Standard layout props

### textarea

Multi-line text input.

```tsx
import { useRef } from 'react'

const textareaRef = useRef(null)

<textarea
  ref={textareaRef}
  width={40}
  height={10}
  placeholder="Enter text..."
  focused={isFocused}
  onInput={(value) => setText(value)}
/>

// Access methods via ref
textareaRef.current?.setValue('New text')
textareaRef.current?.focus()
```

**Props:**
- `placeholder` - Placeholder text
- `focused` - Focus state
- `onInput` - Change handler
- `ref` - React ref for methods

### code

Syntax-highlighted code block.

```tsx
<code
  content={sourceCode}
  filetype="typescript"
  syntaxStyle="monokai"
  width={60}
  height={20}
/>
```

**Props:**
- `content` - Source code string
- `filetype` - Language (`'typescript'`, `'javascript'`, `'python'`, etc.)
- `syntaxStyle` - Syntax theme

### line-number

Code with line numbers and diff highlights.

```tsx
<line-number
  content={sourceCode}
  filetype="typescript"
  startLine={1}
  highlightLines={[5, 6, 7]}
  diffAdded={[10]}
  diffRemoved={[12]}
  width={60}
  height={20}
/>
```

**Props:**
- `content` - Source code
- `filetype` - Language
- `startLine` - Starting line number
- `highlightLines` - Lines to highlight
- `diffAdded` - Added lines (green)
- `diffRemoved` - Removed lines (red)

### diff

Unified or split diff viewer.

```tsx
<diff
  oldContent={original}
  newContent={modified}
  mode="unified"
  width={80}
  height={30}
/>
```

**Props:**
- `oldContent` - Original content
- `newContent` - Modified content
- `mode` - `'unified'` | `'split'`
- Display props

### ascii-font

ASCII art text.

```tsx
<ascii-font
  content="RESTMAN"
  font="block"
  fg="#CC8844"
/>
```

**Props:**
- `content` - Text to render
- `font` - `'block'` | `'shade'` | `'slick'` | `'tiny'`
- `fg` - Color

## Text Styling

### Core Template Literals

```typescript
import { t, bold, underline, italic, fg, bg } from '@opentui/core'

const styled = t`
  ${bold('Bold text')}
  ${underline('Underlined')}
  ${italic('Italic')}
  ${fg('#FF0000')('Red text')}
  ${bg('#0000FF')('Blue background')}
  ${bold(fg('#00FF00')('Bold green'))}
`
```

### React Inline Styling

```tsx
<text>
  Normal <strong>bold</strong> <em>italic</em>
  <span fg="#FF0000">colored</span>
  <u>underlined</u>
  <br />
  New line
</text>
```

## Events and Handlers

### Keyboard Events (Core)

```typescript
import type { KeyEvent } from '@opentui/core'

renderer.keyInput.on('keypress', (key: KeyEvent) => {
  // Properties
  key.name       // 'escape', 'return', 'tab', 'up', 'down', etc.
  key.sequence   // Raw character (e.g., 'a', 'Z', '\r')
  key.ctrl       // boolean
  key.shift      // boolean
  key.meta       // boolean (Alt/Option)
  
  // Special keys
  if (key.name === 'escape') handleEscape()
  if (key.name === 'return') handleSubmit()
  if (key.ctrl && key.name === 'c') handleCtrlC()
})
```

### Mouse Events (Core)

```typescript
renderable.on('mousedown', (event) => {
  console.log('Mouse button:', event.button)  // 0=left, 1=middle, 2=right
  console.log('Position:', event.x, event.y)
})

renderable.on('mouseup', (event) => {})
renderable.on('mousemove', (event) => {})
```

### React Event Handlers

```tsx
<box
  onMouseDown={(event) => console.log('Clicked')}
  onMouseUp={(event) => console.log('Released')}
  onMouseMove={(event) => console.log('Moved')}
>
```

## Advanced Features

### VNode Composition (Core)

Create reusable component functions without React:

```typescript
import { Box, Text, delegate, type VNode } from '@opentui/core'

function Button(props: { title: string; onClick: () => void }): VNode {
  return Box(
    {
      border: true,
      borderStyle: 'single',
      padding: 1,
      onMouseDown: props.onClick,
    },
    Text({ content: props.title }),
  )
}

function Panel(props: { id: string }, children: VNode[] = []): VNode {
  // Delegate operations to inner container
  return delegate(
    { add: `${props.id}_content`, remove: `${props.id}_content` },
    Box({ id: `${props.id}_outer`, border: true }, [
      Box({ id: `${props.id}_content`, padding: 2 }, children),
    ]),
  )
}

// Usage
const panel = Panel({ id: 'my-panel' })
renderer.root.add(panel)
panel.add(Button({ title: 'Click Me', onClick: () => console.log('Clicked') }))
```

**delegate() Function:**
The `delegate()` function redirects add/remove operations to a specific child node. This is useful for creating wrapper components where you want children added to an inner container rather than the outer wrapper.

### Timeline Animations (React)

```tsx
import { useTimeline } from '@opentui/react'

const timeline = useTimeline({
  duration: 2000,  // milliseconds
  loop: false,     // Loop animation
  autoStart: true,
})

// timeline.progress is 0.0 to 1.0
const opacity = timeline.progress
const x = timeline.progress * 100

<box style={{ position: 'absolute', left: x }}>
  Animated
</box>
```

### Console Overlay

Built-in console for debugging:

```typescript
const renderer = await createCliRenderer({
  consoleOptions: {
    position: ConsolePosition.BOTTOM,  // or TOP
    sizePercent: 30,                   // 30% of screen
    colorInfo: '#00FFFF',
    colorWarn: '#FFFF00',
    colorError: '#FF0000',
    colorDebug: '#888888',
    startInDebugMode: false,
  },
})

// Use standard console methods
console.log('Info message')
console.warn('Warning message')
console.error('Error message')
console.debug('Debug message')

// Control console
renderer.console.show()    // Show console
renderer.console.hide()    // Hide console
renderer.console.toggle()  // Toggle visibility
renderer.console.clear()   // Clear messages
```

**Console Keyboard:**
- `Up/Down` - Scroll messages
- `+/-` - Adjust console size

### Terminal Dimensions (React)

```tsx
import { useTerminalDimensions, useOnResize } from '@opentui/react'

function App() {
  const { width, height } = useTerminalDimensions()
  
  useOnResize((newWidth, newHeight) => {
    console.log(`Terminal resized to ${newWidth}x${newHeight}`)
  })
  
  return <text>Terminal is {width}x{height}</text>
}
```

## Component Extension

Create custom React components by extending base renderables:

```tsx
import { BoxRenderable, RenderContext, type BoxOptions } from '@opentui/core'
import { extend } from '@opentui/react'

interface CustomButtonOptions extends BoxOptions {
  label?: string
  onClick?: () => void
}

class CustomButton extends BoxRenderable {
  constructor(ctx: RenderContext, options: CustomButtonOptions) {
    super(ctx, {
      border: true,
      borderStyle: 'single',
      padding: 1,
      ...options,
    })
    
    if (options.onClick) {
      this.on('mousedown', options.onClick)
    }
  }
}

// Register with React
extend({ customButton: CustomButton })

// Use in JSX
<customButton label="Click me!" onClick={() => console.log('Clicked')} />
```

## Performance Tips

1. **Use renderer.start() only when needed** - For static UIs, render on-demand
2. **Optimize re-renders** - Use React.memo and useCallback
3. **Limit console output** - Console overlay has performance cost
4. **Use VNodes over Renderables** - More efficient for composition (Core)
5. **Batch updates** - Update multiple properties at once
6. **Avoid deep nesting** - Flatten component hierarchies when possible

## Color Reference

### RGBA Class

```typescript
import { RGBA } from '@opentui/core'

// Creation methods
RGBA.fromHex('#FF0000')                    // Hex string
RGBA.fromInts(255, 0, 0, 255)             // Integers 0-255
RGBA.fromValues(1.0, 0.0, 0.0, 1.0)       // Floats 0.0-1.0

// Properties
const color = RGBA.fromHex('#FF0000')
color.r  // Red component (0.0-1.0)
color.g  // Green component
color.b  // Blue component
color.a  // Alpha component

// Methods
color.toHex()     // Convert to hex string
color.clone()     // Create copy
```

### parseColor() Utility

Accepts multiple color formats:

```typescript
import { parseColor } from '@opentui/core'

parseColor('#FF0000')              // Hex string
parseColor('red')                  // CSS color name
parseColor('transparent')          // Transparent
parseColor(RGBA.fromInts(...))     // RGBA object
```

### RestMan Standard Colors

```typescript
const COLORS = {
  PRIMARY: '#CC8844',      // Focus state
  SECONDARY: '#BB7733',    // Edit mode
  BORDER: '#555555',       // Default borders
  MUTED: '#999999',        // Muted text
  BACKGROUND: '#1a1a1a',   // Background
}
```

## Layout Properties Reference

### Flexbox Properties

```typescript
{
  flexDirection: 'row' | 'column' | 'row-reverse' | 'column-reverse',
  flexWrap: 'nowrap' | 'wrap' | 'wrap-reverse',
  justifyContent: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly',
  alignItems: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline',
  alignContent: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'space-between' | 'space-around',
  alignSelf: 'auto' | 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline',
  flexGrow: number,      // Default 0
  flexShrink: number,    // Default 1
  flexBasis: number | string | 'auto',
}
```

### Sizing Properties

```typescript
{
  width: number | string | 'auto',
  height: number | string | 'auto',
  minWidth: number,
  minHeight: number,
  maxWidth: number,
  maxHeight: number,
}
```

### Spacing Properties

```typescript
{
  padding: number,        // All sides
  paddingTop: number,
  paddingRight: number,
  paddingBottom: number,
  paddingLeft: number,
  
  margin: number,         // All sides
  marginTop: number,
  marginRight: number,
  marginBottom: number,
  marginLeft: number,
}
```

### Position Properties

```typescript
{
  position: 'relative' | 'absolute',
  left: number,
  top: number,
  right: number,
  bottom: number,
  zIndex: number,
}
```

## Border Styles

Available border styles:
- `'single'` - Single line border (─│┌┐└┘├┤┬┴┼)
- `'double'` - Double line border (═║╔╗╚╝╠╣╦╩╬)
- `'rounded'` - Rounded corners (─│╭╮╰╯├┤┬┴┼)
- `'bold'` - Bold line border (━┃┏┓┗┛┣┫┳┻╋)
- `'none'` - No border

## Common Gotchas

1. **Interactive components need focus** - Always ensure input/select/tab-select are focused
2. **Key names vs sequences** - Use `key.name` for special keys, `key.sequence` for characters
3. **Yoga layout quirks** - Flexbox in terminals has edge cases
4. **Color formats** - Use hex strings or RGBA objects, not CSS rgb()
5. **Position absolute** - Requires explicit left/top values
6. **zIndex** - Higher values render on top
7. **React DevTools version** - Must use version 7
8. **Style prop casing** - Use camelCase for objects, kebab-case not supported
