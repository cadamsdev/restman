# 🚀 ShellMan - REST API Client TUI

A powerful Terminal User Interface (TUI) REST API client, similar to Postman but running entirely in your terminal. Built with Bun, TypeScript, React, and Ink.

![ShellMan](https://img.shields.io/badge/Built%20with-Bun-orange) ![ShellMan](https://img.shields.io/badge/UI-Ink%20%2B%20React-blue)

## Features

- 🎯 **Intuitive TUI Interface** - Clean, keyboard-driven interface built with Ink and React
- 🌐 **Full HTTP Support** - GET, POST, PUT, PATCH, DELETE methods
- 📝 **Custom Headers** - Add and modify request headers easily
- 📦 **Request Body** - Send JSON, XML, or plain text payloads
- ⚡ **Fast Responses** - Built on Bun's high-performance runtime
- 📊 **Response Viewer** - View status, headers, and formatted response body
- ⏱️ **Request Timing** - See how long each request takes
- 🎨 **Modern UI** - Built with React components for maintainability
- ⚛️ **Component-based** - Modular React architecture using Ink

## Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd shellman

# Install dependencies
bun install
```

## Usage

### Running the Application

```bash
bun run index.ts
```

Or make it executable:

```bash
chmod +x index.ts
./index.ts
```

### Keyboard Shortcuts

- **Ctrl+Enter** - Send the current request
- **Tab** - Move to next field
- **Shift+Tab** - Move to previous field
- **q / Esc** - Quit application
- **Arrow Keys** - Navigate within text fields

### Interface Layout

1. **Method Selector** (Top-left) - Choose HTTP method
2. **URL Input** - Enter the API endpoint
3. **Headers Panel** (Left) - Add headers in `key: value` format
4. **Body Panel** (Right) - Add request body for POST/PUT/PATCH
5. **Status Bar** - Shows request status and response time
6. **Response Panel** - Displays response status, headers, and body

## Example Requests

### GET Request

1. Select `GET` method (default)
2. Enter URL: `https://jsonplaceholder.typicode.com/posts/1`
3. Method defaults to `GET`
2. URL is pre-filled with an example
3. Press Ctrl+Enter to send

1. Tab to method selector, use arrow keys to select `POST`
2. Tab to URL and enter: `https://jsonplaceholder.typicode.com/posts`
3. Headers are pre-filled with JSON content type
4. Tab to Body and add:
   ```json
   {
     "title": "My Post",
     "body": "This is my post content",
     "userId": 1
   }
   ```
5. Press Ctrl+Enter to send

## Project Structure

```
shellman/
├── index.ts              # Main entry point
├── src/
│   ├── http-client.ts    # HTTP client implementation
│   └── ui-manager.ts     # TUI interface manager
├── package.json
├── tsconfig.json
└── READApp.tsx           # Main React component
│   ├── http-client.ts    # HTTP client implementation
│   └── components/       # React UI components
│       ├── URLInput.tsx
│       ├── MethodSelector.tsx
│       ├── HeadersEditor.tsx
│       ├── BodyEditor.tsx
│       ├── ResponsePanel.tsx
│       ├── StatusBar.tsx
│       └── Instructions.tsx

## Development

```bash
# Run in development mode
bun run index.ts

# Build (if needed)
bun build index.ts --outdir dist
```

## TReact** - Component-based UI library
- **Ink** - React for interactive CLI apps
- **ink-text-input** - Text input component for Ink

- **Bun** - Fast JavaScript runtime and package manager
- **TypeScript** - Type-safe JavaScript
- **Blessed** - Terminal UI library
- **Native Fetch API** - HTTP client (built into Bun)

## Roadmap

- [ ] Request history
- [ ] Save/load request collections
- [ ] Environment variables
- [ ] Authentication presets (Bearer, Basic, etc.)
- [ ] Request/response templating
- [ ] WebSocket support
- [ ] GraphQL support
- [ ] Export requests to cURL
- [ ] Theme customization

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

MIT

## Author

Built with ❤️ using Bun
