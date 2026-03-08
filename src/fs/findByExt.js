import fs from 'node:fs/promises';
import path from 'node:path';

const findByExt = async () => {
  const workspacePath = path.resolve('workspace');

  // Parse CLI argument and ensure it starts with a dot
  const extIndex = process.argv.indexOf('--ext');
  let targetExt = extIndex !== -1 ? process.argv[extIndex + 1] : '.txt';
  if (targetExt && !targetExt.startsWith('.')) {
    targetExt = `.${targetExt}`;
  }

  const foundFiles = [];

  try {
    // Check if workspace exists
    await fs.access(workspacePath);

    async function scanDir(currentDir) {
      const dirents = await fs.readdir(currentDir, { withFileTypes: true });

      for (const dirent of dirents) {
        const absPath = path.join(currentDir, dirent.name);

        if (dirent.isDirectory()) {
          await scanDir(absPath);
        } else if (dirent.isFile()) {
          if (path.extname(dirent.name) === targetExt) {
            // Store relative path for later sorting
            foundFiles.push(path.relative(workspacePath, absPath));
          }
        }
      }
    }

    await scanDir(workspacePath);

    // Sort alphabetically and print
    foundFiles.sort().forEach((filePath) => {
      // Ensure we use forward slashes for consistent output
      console.log(filePath.split(path.sep).join('/'));
    });
  } catch (err) {
    throw new Error('FS operation failed');
  }
};

await findByExt();
