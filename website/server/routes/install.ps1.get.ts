import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export default defineEventHandler((event) => {
  // Read the install.ps1 file from the project root
  const scriptPath = join(process.cwd(), '..', 'install.ps1');
  const scriptContent = readFileSync(scriptPath, 'utf-8');

  // Set the content type to plain text
  setResponseHeaders(event, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'public, max-age=3600',
  });

  return scriptContent;
});
