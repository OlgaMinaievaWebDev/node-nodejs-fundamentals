import fs from 'node:fs/promises';
import path from 'node:path';

const snapshot = async () => {
  const workspacePath = path.resolve('workspace');
  const entries = [];

  try {
    // Check if workspace exists. If not, this throws an error caught by the catch block.
    await fs.access(workspacePath);

    // Recursive function to scan directories
    async function scanDir(currentDir) {
      const dirents = await fs.readdir(currentDir, { withFileTypes: true });

      for (const dirent of dirents) {
        const absPath = path.join(currentDir, dirent.name);
        // Ensure relative path uses forward slashes regardless of OS
        const relPath = path
          .relative(workspacePath, absPath)
          .split(path.sep)
          .join('/');

        if (dirent.isDirectory()) {
          entries.push({ path: relPath, type: 'directory' });
          await scanDir(absPath);
        } else if (dirent.isFile()) {
          const stats = await fs.stat(absPath);
          const buffer = await fs.readFile(absPath);

          entries.push({
            path: relPath,
            type: 'file',
            size: stats.size,
            content: buffer.toString('base64'),
          });
        }
      }
    }

    await scanDir(workspacePath);

    // Construct the final object and write to disk
    const snapshotData = {
      rootPath: workspacePath,
      entries,
    };

    await fs.writeFile('snapshot.json', JSON.stringify(snapshotData, null, 2));
  } catch (err) {
    // Error message for any FS failure 
    throw new Error('FS operation failed');
  }
};

await snapshot();

