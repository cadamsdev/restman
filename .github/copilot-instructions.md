# RestMan AI Development Guide

RestMan is a Terminal User Interface (TUI) REST API client built with Bun, React, and Ink. Think "Postman for the terminal."

## Project Structure

**Main Application**: The core TUI application lives in [src/](../src/) and is built with Bun, React, and Ink.

**Marketing Website**: The [website/](../website/) folder contains a Nuxt.js-based marketing site for RestMan. This is separate from the main application and is used for documentation and promotion.

## Architecture Overview

**Single Component State Management**: All application state lives in [src/App.tsx](../src/App.tsx), with no external state management library. State flows down to presentational components via props. This is intentional for simplicity in a TUI context.

**Modal-based View Modes**: The UI operates in exclusive modes (response view, history view, saved requests view, edit mode) controlled by boolean state flags (`responseViewMode`, `historyViewMode`, `savedRequestsViewMode`, `editMode`). Only one mode is active at a time - keyboard input handlers check these flags first to determine routing.

**Persistent Storage Pattern**: User data (history, saved requests) is stored in `~/.restman/` directory as JSON files. The storage modules ([history-storage.ts](../src/history-storage.ts), [saved-requests-storage.ts](../src/saved-requests-storage.ts)) follow this pattern:
- `ensureDirectoryExists()` creates `~/.restman/` on first access
- `load*()` functions handle missing files gracefully (return empty arrays)
- `save*()` functions are called via `useEffect` hooks when state changes
- History is auto-limited to 100 entries to prevent unbounded growth

## Component Patterns

**Focus and Edit Mode System**: All input components receive `focused` (visual highlight) and `editMode` (editable state) props. Components display differently in each state:
- `focused && !editMode`: Yellow border, shows `[EDIT]` hint
- `!focused`: Dim text, cyan border  
- `editMode`: Renders `TextInput` component for actual editing

Example from [URLInput.tsx](../src/components/URLInput.tsx):
```tsx
<Box borderColor={focused ? "yellow" : "cyan"}>
  {editMode ? (
    <TextInput value={value} onChange={onChange} />
  ) : (
    <Text dimColor={!focused}>{value || "Enter URL..."}</Text>
  )}
</Box>
```

**Headers Format Convention**: Headers are stored as multi-line strings internally (`"Content-Type: application/json\nAccept: application/json"`) and parsed to objects for HTTP requests. The `parseHeaders()` function in [App.tsx](../src/App.tsx) splits on `\n` and `:`, trims whitespace, and skips invalid lines. When loading from history/saved requests, headers are reconstructed with `.map().join("\n")`.

## Development Workflow

**Running**: `bun run index.ts` (not `bun start`, which is just an alias). The shebang in [index.ts](../index.ts) allows direct execution after `chmod +x`.

**No Build Step**: Bun runs TypeScript directly. The `tsconfig.json` uses `"noEmit": true` - there's no compilation output, only type checking.

**Testing Requests**: Default URL is `https://jsonplaceholder.typicode.com/posts/1` for quick manual testing. The app auto-switches to full-screen response view after successful requests.

## Keyboard Handling Critical Details

Keyboard input is handled by a single `useInput` hook in [App.tsx](../src/App.tsx) with strict priority order:
1. Modal-specific handlers (help, save, exit modals consume all input)
2. View mode handlers (response, history, saved requests views)
3. Edit mode handlers (ESC to exit edit mode)
4. Readonly mode handlers (navigation hotkeys: `1-6` or `m/u/h/b/r/l`)

**Never add duplicate hotkeys** - the first matching condition wins. When adding new shortcuts, insert them in the appropriate priority section.

**Edit Mode Toggle**: Press `e` in readonly mode to enter edit mode for the focused field. Press ESC to exit edit mode. This is NOT the same as focused state (focus just highlights, edit mode allows input).

## TypeScript Configuration Notes

- `"moduleResolution": "bundler"` and `"allowImportingTsExtensions": true` are Bun-specific
- `"jsx": "react-jsx"` enables automatic React imports (no `import React` needed in components)
- `"strict": true` with all strict flags enabled - new code must satisfy strictNullChecks and noImplicitAny

## HTTP Client Pattern

The [http-client.ts](../src/http-client.ts) wrapper around `fetch()` auto-formats JSON responses with 2-space indentation. Content-Type detection determines parsing strategy:
- `application/json` → parse and pretty-print
- All others → return raw text
- Errors → status 0, error message in body

Response timing is calculated by diffing `Date.now()` before/after the request.

## Common Pitfalls

❌ **Don't mutate state directly** - Always use setter functions even for nested objects. When updating history/saved requests, use `.map()` or spread operators to create new arrays.

❌ **Don't add global keyboard shortcuts without checking edit mode** - Users typing in text fields should not trigger navigation shortcuts. Always wrap global shortcuts in `if (!editMode)` guards.

❌ **Don't forget to update the Instructions component** - When adding new keyboard shortcuts, document them in [src/components/Instructions.tsx](../src/components/Instructions.tsx).

❌ **Don't use process.cwd() for user data paths** - Always use `homedir()` from `os` module for persistent storage. The `.restman` directory is specifically in the user's home directory, not the project directory.

## TODO Priorities

The [TODO.md](../TODO.md) file tracks pre-release features. Currently completed:
- ✅ Request history with persistence  
- ✅ Request saving/loading

Next priorities (from TODO):
1. Environment variables / request templates (variable substitution like `{{API_KEY}}`)
2. Response formatting improvements (JSON syntax highlighting, pretty-printing)
3. Authentication support (Bearer tokens, Basic Auth)

When implementing new features, follow the existing modal-based patterns for UI and the storage module patterns for persistence.
