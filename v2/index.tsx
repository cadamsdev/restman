#!/usr/bin/env bun

import { createCliRenderer } from '@opentui/core';
import { createRoot } from '@opentui/react';
import { App } from './src/App';

// Create the CLI renderer (async)
const renderer = await createCliRenderer({
  exitOnCtrlC: false, // We handle Ctrl+C in the app
});

// Create and mount the React root
const root = createRoot(renderer);
root.render(<App />);

// Handle cleanup on exit
process.on('SIGINT', () => {
  root.unmount();
  renderer.destroy();
  process.exit(0);
});
