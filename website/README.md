# RestMan Marketing Website

This is the marketing website for RestMan, built with Nuxt 4 and Bun.

## About RestMan

RestMan is a powerful Terminal User Interface (TUI) REST API client built with Bun. Think Postman for the terminal - fast, keyboard-driven, and built for developers who live in the command line.

## Tech Stack

- **Nuxt 4** - Vue framework with SSR capabilities
- **Bun** - Fast JavaScript runtime and package manager
- **@nuxt/icon** - Icon component using Iconify
- **Custom CSS** - Tailored gradient design with terminal aesthetics

## Development

```bash
# Install dependencies
bun install

# Start development server (http://localhost:3000)
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```

## Project Structure

```
website/
├── pages/           # Route pages
│   └── index.vue    # Landing page with all sections
├── components/      # Vue components
│   └── TerminalDemo.vue  # Animated terminal showcase
├── assets/          # Static assets
│   └── css/
│       └── main.css # Global styles and theme
├── public/          # Public static files (favicon, etc.)
├── app.vue          # Root app component
└── nuxt.config.ts   # Nuxt configuration
```

## Features

The marketing site includes:

### Hero Section
- Eye-catching gradient design
- Navigation bar with GitHub link
- Call-to-action buttons
- Live terminal demo component

### Features Section
- 6 key features highlighted with icons
- Grid layout responsive design
- Hover effects on feature cards

### Installation Section
- Step-by-step installation guide
- Copy-to-clipboard functionality
- Code blocks with syntax highlighting
- Pro tips for advanced setup

### Quick Start Section
- Keyboard shortcuts reference
- Environment variables guide
- Save & reuse instructions
- Interactive code examples

### Footer
- Links to GitHub, issues, and license
- Responsive layout
- Social links

## Deployment

This site can be deployed to various platforms:

### Static Hosting (Recommended)
- **Vercel** - `bun run build` (automatic detection)
- **Netlify** - Build command: `bun run build`, Publish dir: `.output/public`
- **Cloudflare Pages** - Build command: `bun run build`, Output: `.output/public`
- **GitHub Pages** - Static export via `nuxt generate`

### SSR Deployment
For server-side rendering:
- **Vercel** - Automatic SSR support
- **Netlify** - Edge functions support
- **Any Node.js/Bun compatible hosting**

## Customization

### Colors
The site uses a purple/blue gradient theme. To customize:
- Edit gradient colors in `assets/css/main.css`
- Update `.gradient-text`, `.btn-primary` classes
- Modify background gradients in `body` selector

### Content
- Update features in `pages/index.vue` - `features-grid` section
- Modify installation steps in the `install` section
- Change keyboard shortcuts in `quickstart-grid` section

### Branding
- Replace icons in navigation and features
- Update social links in footer
- Customize terminal demo in `components/TerminalDemo.vue`

## Performance

The site is optimized for performance:
- Minimal JavaScript bundle
- CSS-only animations
- Lazy-loaded components where appropriate
- Fast Bun runtime for development

## License

MIT - Same as RestMan main project


# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
