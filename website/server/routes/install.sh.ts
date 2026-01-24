import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export default defineEventHandler((event) => {
  // Read the install.sh file from the project root
  const scriptPath = join(process.cwd(), '..', 'install.sh');
  const scriptContent = readFileSync(scriptPath, 'utf-8');

  // Set the content type to shell script
  event.node.res.setHeader('Content-Type', 'text/x-shellscript; charset=utf-8');
  event.node.res.setHeader('Content-Disposition', 'inline; filename="install.sh"');

  return scriptContent;
});
