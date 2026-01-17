#!/usr/bin/env bun

import blessed from "blessed";
import { HTTPClient } from "./src/http-client";
import { UIManager } from "./src/ui-manager";

// Create a screen object
const screen = blessed.screen({
  smartCSR: true,
  title: "ShellMan - REST API Client",
  fullUnicode: true,
});

// Initialize HTTP client and UI manager
const httpClient = new HTTPClient();
const uiManager = new UIManager(screen, httpClient);

// Quit on Escape, q, or Control-C
screen.key(["escape", "q", "C-c"], () => {
  return process.exit(0);
});

// Render the screen
screen.render();
