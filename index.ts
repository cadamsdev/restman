#!/usr/bin/env bun

import React from "react";
import { render } from "ink";
import { App } from "./src/App";

// Enable alternate screen buffer (fullscreen mode)
process.stdout.write("\x1b[?1049h");

// Render the app
const app = render(React.createElement(App));

// Cleanup: Restore normal screen buffer on exit
const cleanup = () => {
  process.stdout.write("\x1b[?1049l");
};

app.waitUntilExit().then(cleanup);

// Handle unexpected exits
process.on("exit", cleanup);
process.on("SIGINT", () => {
  cleanup();
  process.exit(0);
});
process.on("SIGTERM", () => {
  cleanup();
  process.exit(0);
});
