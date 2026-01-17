# ShellMan - Pre-Release TODO

Features to add before sharing with users for testing.

## Critical Features (Must Have)

### 1. Request History
- [x] Store sent requests in memory (or local file)
- [x] Navigate through previous requests with keyboard shortcuts
- [x] Allow users to re-execute previous requests
- [x] Show last N requests (e.g., 10-20)

### 2. Environment Variables / Request Templates
- [ ] Support variable substitution in URLs and headers (e.g., `{{API_KEY}}`)
- [ ] Load environment variables from a config file
- [ ] Allow switching between different environments (dev, staging, prod)

### 3. Request Saving/Loading
- [ ] Save requests to disk (JSON format)
- [ ] Load saved requests
- [ ] Organize requests into collections/folders
- [ ] Quick file picker for saved requests

### 4. Response Formatting
- [ ] Auto-format JSON responses with indentation
- [ ] Syntax highlighting for JSON
- [ ] XML pretty-printing support
- [ ] HTML rendering option

### 5. Error Handling Improvements
- [ ] Better network error messages
- [ ] Timeout configuration
- [ ] Retry mechanism for failed requests
- [ ] Connection error troubleshooting hints

## Important Features (Should Have)

### 6. Authentication Support
- [ ] Basic Auth support
- [ ] Bearer Token support (with token input field)
- [ ] API Key header presets
- [ ] OAuth 2.0 flow support (future)

### 7. Response Search/Filter
- [ ] Search within response body
- [ ] Filter JSON paths
- [ ] Copy specific values from response

### 8. Request Performance
- [ ] Display detailed timing breakdown (DNS, connection, response)
- [ ] Response size display
- [ ] Performance history/comparison

### 9. Configuration
- [ ] Config file for default settings
- [ ] Custom key bindings
- [ ] Theme/color customization
- [ ] Auto-save preferences

### 10. Copy/Paste Improvements
- [ ] Copy response body to clipboard
- [ ] Copy request as cURL command
- [ ] Paste from clipboard into fields
- [ ] Import cURL commands

## Nice to Have Features

### 11. Advanced Response Features
- [ ] View response in different formats (raw, pretty, preview)
- [ ] Download response to file
- [ ] Response diff comparison
- [ ] Follow redirects toggle

### 12. Request Chaining
- [ ] Extract values from one response to use in next request
- [ ] Sequential request execution
- [ ] Basic scripting/automation

### 13. Testing Features
- [ ] Assert response status
- [ ] Assert response body contains values
- [ ] Simple test runner

### 14. UI Improvements
- [ ] Resizable panels
- [ ] Scrollable long responses
- [ ] Better visual indicators for focused/edit modes
- [ ] Progress bar for slow requests
- [ ] Request cancellation

### 15. Documentation
- [ ] In-app tutorial/walkthrough
- [ ] More comprehensive README examples
- [ ] GIF/video demo
- [ ] Keyboard shortcuts reference card

## Bugs to Fix

- [ ] Test with various URL formats (spaces, special chars)
- [ ] Handle very large response bodies
- [ ] Test multiline header values
- [ ] Validate HTTP method selection edge cases
- [ ] Ensure all keyboard shortcuts work as expected

## Before First Release

- [ ] Write comprehensive installation instructions
- [ ] Add examples directory with sample requests
- [ ] Create CONTRIBUTING.md
- [ ] Add LICENSE file
- [ ] Set up CI/CD for releases
- [ ] Create binaries for major platforms (optional)
- [ ] Test on different terminals (iTerm2, Windows Terminal, etc.)
- [ ] Performance testing with slow/large responses

---

**Priority Order:**
1. Request History (#1) - Essential for usability
2. Response Formatting (#4) - Makes output readable
3. Request Saving (#3) - Enables reusability
4. Authentication (#6) - Required for real APIs
5. Error Handling (#5) - Better user experience
