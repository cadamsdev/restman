#!/usr/bin/env bun
/**
 * Platform-agnostic build script for restman CLI
 * Usage: bun run scripts/build-target.ts <target> <outdir>
 */

import { rmSync, mkdirSync, cpSync, createWriteStream } from 'fs';
import { existsSync } from 'fs';
import { join, resolve } from 'path';
import archiver from 'archiver';

const baseOutputDir = 'dist';

async function build() {
  const args = process.argv.slice(2);
  const target = args[0];

  if (!target) {
    console.error('Usage: bun run scripts/build-target.ts <target>');
    console.error('Example: bun run scripts/build-target.ts linux-arm64');
    process.exit(1);
  }

  const outputDir = join(baseOutputDir, `restman-${target}`);

  // Ensure output directory exists (clean if it exists)
  if (existsSync(outputDir)) {
    console.log(`Cleaning ${outputDir}...`);
    rmSync(outputDir, { recursive: true, force: true });
  }

  console.log(`Creating ${outputDir}...`);
  mkdirSync(outputDir, { recursive: true });
  // Copy stdlib directory into output directory
  const stdlibSrc = resolve('../../stdlib');
  const stdlibDest = join(outputDir, 'stdlib');

  if (existsSync(stdlibSrc)) {
    console.log(`Copying stdlib to ${stdlibDest}...`);
    cpSync(stdlibSrc, stdlibDest, { recursive: true });
  } else {
    console.warn(`Warning: stdlib directory not found at ${stdlibSrc}`);
  }

  // Build the binary
  const outfile = join(outputDir, 'restman');
  console.log(`Building ${target} -> ${outfile}...`);

  const buildProcess = Bun.spawn([
    'bun',
    'build',
    'src/cli.ts',
    '--compile',
    `--target=bun-${target}`,
    `--outfile=${outfile}`,
  ]);

  const exitCode = await buildProcess.exited;

  if (exitCode !== 0) {
    console.error('Build failed!');
    process.exit(exitCode);
  }

  // Create archive based on target platform
  const archiveName = `restman-${target}`;
  const isLinux = target.includes('linux');

  if (isLinux) {
    // Create .tar.gz for Linux
    const tarFile = `${baseOutputDir}/${archiveName}.tar.gz`;
    console.log(`Creating ${tarFile}...`);

    await createArchive(tarFile, 'tar', outputDir);
    console.log(`✓ Created ${tarFile}`);
  } else {
    // Create .zip for Windows and macOS
    const zipFile = `${baseOutputDir}/${archiveName}.zip`;
    console.log(`Creating ${zipFile}...`);

    await createArchive(zipFile, 'zip', outputDir);
    console.log(`✓ Created ${zipFile}`);
  }

  // delete the target directory after archiving
  console.log(`Cleaning up ${outputDir}...`);
  rmSync(outputDir, { recursive: true, force: true });

  process.exit(0);
}

/**
 * Create an archive (tar.gz or zip) of a directory
 */
async function createArchive(
  outputPath: string,
  format: 'tar' | 'zip',
  sourceDir: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const output = createWriteStream(outputPath);
    const archive = archiver(format, {
      gzip: format === 'tar',
      gzipOptions: { level: 9 },
    });

    output.on('close', () => resolve());
    output.on('error', reject);
    archive.on('error', reject);

    archive.pipe(output);

    // Add directory contents
    archive.directory(sourceDir, '');

    void archive.finalize();
  });
}

await build();
