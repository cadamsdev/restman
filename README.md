# 🚀 ShellMan - REST API Client TUI

A powerful Terminal User Interface (TUI) REST API client, similar to Postman but running entirely in your terminal. Built with Bun and TypeScript.

![ShellMan](https://img.shields.io/badge/Built%20with-Bun-orange)

## Features

- 🎯 **Intuitive TUI Interface** - Clean, keyboard-driven interface built with blessed
- 🌐 **Full HTTP Support** - GET, POST, PUT, PATCH, DELETE methods
- 📝 **Custom Headers** - Add and modify request headers easily
- 📦 **Request Body** - Send JSON, XML, or plain text payloads
- ⚡ **Fast Responses** - Built on Bun's high-performance runtime
- 📊 **Response Viewer** - View status, headers, and formatted response body
- ⏱️ **Request Timing** - See how long each request takes
- 🎨 **Syntax Highlighting** - Colored output for better readability

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

- **F5 / Enter** - Send the current request
- **Tab** - Move to next field
- **Shift+Tab** - Move to previous field
- **F2** - Focus method selector (GET, POST, etc.)
- **q / Esc / Ctrl+C** - Quit application
- **Arrow Keys** - Navigate within text fields
- **Mouse** - Click to focus fields (if supported)

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
3. Press F5 or Enter

### POST Request

1. Select `POST` method (F2 → arrow keys → Enter)
2. Enter URL: `https://jsonplaceholder.typicode.com/posts`
3. Add headers:
   ```
   Content-Type: application/json
   Accept: application/json
   ```
4. Add body:
   ```json
   {
     "title": "My Post",
     "body": "This is my post content",
     "userId": 1
   }
   ```
5. Press F5 or Enter

## Project Structure

```
shellman/
├── index.ts              # Main entry point
├── src/
│   ├── http-client.ts    # HTTP client implementation
│   └── ui-manager.ts     # TUI interface manager
├── package.json
├── tsconfig.json
└── README.md
```

## Development

```bash
# Run in development mode
bun run index.ts

# Build (if needed)
bun build index.ts --outdir dist
```

## Technologies Used

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
