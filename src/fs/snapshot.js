import fs from 'node:fs/promises';
import path from 'node:path';

const snapshot = async () => {
  const workspacePath = path.resolve('workspace');

  try {
    await fs.access(workspacePath);
  } catch (error) {
    throw new Error('FS operation failed');
  }

  const entries = [];

  async function scanDir(currentDir) {
    // Read the current directory level
    const dirents = await fs.readdir(currentDir, { withFileTypes: true });

    for (const dirent of dirents) {
      const absPath = path.join(currentDir, dirent.name);
      const relPath = path
        .relative(workspacePath, absPath)
        .split(path.sep)
        .join('/');

      if (dirent.isDirectory()) {
        entries.push({ path: relPath, type: 'directory' });
        // Recurse into the sub-directory
        await scanDir(absPath);
      } else if (dirent.isFile()) {
        // Get metadata and content
        const stats = await fs.stat(absPath);
        const buffer = await fs.readFile(absPath); // This returns the Buffer

        entries.push({
          path: relPath,
          type: 'file',
          size: stats.size,
          content: buffer.toString('base64'), // Convert Buffer to Base64 string
        });
      }
    }
  }

  await scanDir(workspacePath);

  const snapshotData = {
    rootPath: workspacePath,
    entries,
  };

  await fs.writeFile('snapshot.json', JSON.stringify(snapshotData, null, 2));
  console.log('Snapshot created successfully.');
};

// Top-level execution
snapshot().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
