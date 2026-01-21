#!/usr/bin/env bun

import { createCliRenderer } from '@opentui/core';
import { createRoot } from '@opentui/react';

async function main() {
  console.log('Starting RestMan v2...');
  
  const renderer = await createCliRenderer({
    exitOnCtrlC: false,
  });

  const root = createRoot(renderer);
  
  root.render(
    <box flexDirection="column">
      <text fg="#00FF00">Hello from RestMan v2!</text>
    </box>
  );

  process.on('SIGINT', () => {
    root.unmount();
    renderer.destroy();
    process.exit(0);
  });
}

main().catch(console.error);
