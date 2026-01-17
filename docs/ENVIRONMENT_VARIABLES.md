# Environment Variables Guide

ShellMan now supports environment variables and request templates, allowing you to easily switch between different API environments and reuse configuration across requests.

## Quick Start

### Using Variables

1. Press `v` or `7` to open the Environments panel
2. Three default environments are created automatically:
   - Development (localhost)
   - Staging
   - Production

3. Use variables in your requests with the `{{VARIABLE_NAME}}` syntax

### Example Usage

#### In URL:
```
{{BASE_URL}}/api/users
```

#### In Headers:
```
Authorization: Bearer {{API_KEY}}
Content-Type: application/json
```

#### In Body:
```json
{
  "api_key": "{{API_KEY}}",
  "environment": "{{ENV_NAME}}"
}
```

## Managing Environments

### View All Environments
- Press `v` or `7` to open the environments panel
- Use ↑↓ to navigate between environments
- Press `Enter` to activate an environment

### Quick Switch (without opening panel)
- Press `0` to focus the environment selector
- Press `e` to enter edit mode
- Use ↑↓ arrows to cycle through environments
- Press `ESC` to exit edit mode

### Add New Environment
1. Press `v` to open the environments panel
2. Press `n` to create a new environment
3. Enter a name (e.g., "UAT", "QA", "Local")
4. Add variables in `KEY=value` format, one per line:
   ```
   BASE_URL=https://uat.example.com
   API_KEY=uat-api-key-12345
   AUTH_TOKEN=uat-token-67890
   ```
5. Press `Ctrl+S` to save

### Edit Environment
1. Press `v` to open the environments panel
2. Navigate to the environment you want to edit
3. Press `e` to edit
4. Modify the name or variables
5. Press `Ctrl+S` to save

### Delete Environment
1. Press `v` to open the environments panel
2. Navigate to the environment you want to delete
3. Press `Shift+D` to delete (requires Shift for safety)

## Variable Substitution

When you send a request:
1. ShellMan looks at the active environment (shown in green in the selector)
2. Finds all `{{VARIABLE_NAME}}` placeholders in:
   - URL
   - Headers
   - Request Body
3. Replaces them with the actual values from the environment
4. Sends the request with the substituted values

### Example Workflow

**URL:** `{{BASE_URL}}/users/{{USER_ID}}`  
**Header:** `Authorization: Bearer {{API_KEY}}`

**With Development environment active:**
- BASE_URL = `http://localhost:3000`
- USER_ID = `123`
- API_KEY = `dev-key-xyz`

**Actual request sent:**
- URL: `http://localhost:3000/users/123`
- Header: `Authorization: Bearer dev-key-xyz`

## Storage Location

Environments are stored in:
```
~/.shellman/environments.json
```

You can:
- Edit this file directly with your favorite text editor
- Share it with your team (be careful with sensitive API keys!)
- Back it up or version control it (excluding sensitive values)

## Tips

1. **Use descriptive variable names:** `API_KEY` is better than `KEY1`
2. **Keep sensitive data secure:** Don't commit production API keys to version control
3. **Create environment-specific variables:** Different values for dev/staging/prod
4. **Test with dev first:** Always test with development environment before switching to production
5. **No spaces in variable names:** Use `API_KEY` not `API KEY`
6. **Unused variables are preserved:** If a variable isn't found, the placeholder remains (e.g., `{{MISSING_VAR}}` stays as-is)

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Open environments panel | `v` or `7` |
| Focus environment selector | `0` |
| Edit active environment | Focus selector, press `e`, use ↑↓ |
| Add environment | In panel, press `n` |
| Edit environment | In panel, select and press `e` |
| Delete environment | In panel, select and press `Shift+D` |
| Activate environment | In panel, select and press `Enter` |
| Close panel | `ESC` |

## Example Environments

### Development
```
BASE_URL=http://localhost:3000
API_KEY=dev-api-key
DB_HOST=localhost
DEBUG=true
```

### Staging
```
BASE_URL=https://staging.api.example.com
API_KEY=staging-key-abc123
DB_HOST=staging-db.example.com
DEBUG=true
```

### Production
```
BASE_URL=https://api.example.com
API_KEY=prod-key-xyz789
DB_HOST=prod-db.example.com
DEBUG=false
```

### Testing
```
BASE_URL=http://localhost:8080
API_KEY=test-key
MOCK_DATA=true
TIMEOUT=1000
```

## Common Use Cases

### 1. Different API Endpoints
Switch between local dev, staging, and production APIs without retyping URLs.

### 2. Authentication Tokens
Store different API keys/tokens for each environment.

### 3. Feature Flags
Use environment variables to enable/disable features in your requests.

### 4. Database Connections
Switch between different database hosts or credentials.

### 5. Team Collaboration
Share common environment configurations with your team.
