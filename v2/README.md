# RestMan v2 - OpenTUI Edition

This is a recreation of RestMan using **OpenTUI** instead of Ink for the terminal user interface.

## Getting Started

### Install Dependencies

```bash
bun install
```

### Run the Test App

```bash
bun run dev
# or
bun run start
```

## Current Status

✅ **OpenTUI Setup Complete**
- OpenTUI core and react packages installed and configured
- React 19 integration working
- TypeScript configured with JSX import source
- Basic interactive test app running successfully

### Test App Features

The current test app demonstrates:
- **Keyboard Input**: UP/DOWN arrows or k/j to increment/decrement counter
- **Terminal Dimensions**: Responsive layout adapting to terminal size
- **Styled Components**: Color-coded text and box layouts
- **Event Handling**: Proper keyboard event handling with q to quit
- **Lifecycle Management**: Clean startup and shutdown with SIGINT handling

## OpenTUI Key Learnings

Based on the ralph-tui reference implementation:

### 1. Dependencies
```json
{
  "@opentui/core": "^0.1.72",
  "@opentui/react": "^0.1.72",
  "react": "^19.2.3"
}
```

### 2. TypeScript Configuration
```json
{
  "jsx": "react-jsx",
  "jsxImportSource": "@opentui/react"
}
```

### 3. Renderer Initialization
```tsx
const renderer = await createCliRenderer({
  exitOnCtrlC: false, // Handle Ctrl+C in app
});

const root = createRoot(renderer);
root.render(<App />);

// Cleanup
process.on('SIGINT', () => {
  root.unmount();
  renderer.destroy(); // Note: destroy(), not dispose()
  process.exit(0);
});
```

### 4. Available Hooks
- `useKeyboard(handler)` - Keyboard input handling
- `useTerminalDimensions()` - Get terminal width/height
- `useRenderer()` - Direct renderer access

### 5. JSX Elements
- `<box>` - Layout container with flexbox support
- `<text>` - Text with color props (fg, bg)
- `<span>` - Inline text styling
- `<scrollbox>` - Scrollable container

### 6. Color System
Use hex colors instead of ANSI codes:
```tsx
<text fg="#00FF00" bg="#000000">Green text</text>
```

For opacity, use hex with alpha:
```tsx
backgroundColor: '#000000B3' // 70% opacity
```

## Next Steps

- [ ] Port URLInput component from Ink to OpenTUI
- [ ] Port MethodSelector component
- [ ] Port HeadersEditor, ParamsEditor, BodyEditor
- [ ] Port ResponsePanel and ResponseEditor
- [ ] Port History and Saved Requests features
- [ ] Port Environment Variables system
- [ ] Implement HTTP client integration
- [ ] Add persistent storage
- [ ] Test and refine keyboard shortcuts

## File Structure

```
v2/
├── index.tsx           # CLI entry point
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript config with OpenTUI
└── src/
    └── App.tsx         # Test application
```

## Reference

See the ralph-tui implementation in `temp/ralph-tui/` for advanced OpenTUI patterns and examples.
