<div align="center">

# RestMan

A simple and easy to use REST API client that runs in your terminal. Open-source alternative to Postman.

![RestMan](https://img.shields.io/badge/Built%20with-Bun-orange) ![RestMan](https://img.shields.io/badge/UI-Ink%20%2B%20React-blue) ![License](https://img.shields.io/github/license/cadamsdev/restman) ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

![RestMan Preview](media/preview.png)

</div>

## Sponsors

Support RestMan development by becoming a sponsor! Your avatar or company logo will appear below.

[Become a Sponsor](https://github.com/sponsors/cadamsdev)

<!-- Sponsors will appear here -->

## Features

- Make HTTP requests (GET, POST, PUT, PATCH, DELETE)
- Add custom headers, query params, and request body
- View response status, headers, timing, and formatted body
- Save frequently-used requests and browse history
- Manage environments with variable substitution (`{{BASE_URL}}`, `{{API_KEY}}`, etc.)
- Fully keyboard-driven (no mouse required)

## Screenshots

<details>
<summary>Click to view screenshots</summary>

### Main Interface
![Main Interface](media/preview.png)

### Request History
![Request History](media/history.png)

### Save Requests
![Save Request](media/save_request.png)

### Environment Management
![Environments](media/environments.png)

### Environment Editor
![Edit Environment](media/edit_env.png)

### View Full Response
![View Response Body](media/view_response_body.png)

### Change HTTP Method
![Change Method](media/change_method.png)

### Help Menu
![Help](media/help.png)

</details>

## Installation

```bash
TODO
```

## Usage

### Running the Application

```bash
restman
```

## Project Structure

```
restman/
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
bun dev
```

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## Documentation

- [Keyboard Shortcuts](docs/KEYBOARD_SHORTCUTS.md) - Complete list of keyboard shortcuts and navigation
- [Environment Variables](docs/ENVIRONMENT_VARIABLES.md) - Guide to managing environments and variable substitution

## License

MIT
