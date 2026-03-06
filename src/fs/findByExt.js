import fs from 'node:fs/promises';
import path from 'node:path';

const findByExt = async () => {
  // Write your code here
  // Recursively find all files with specific extension
  // Parse --ext CLI argument (default: .txt)

  const workspacePath = path.resolve('workspace');

  const extIndex = process.argv.indexOf('--ext');
  const targetExt = extIndex !== -1 ? process.argv[extIndex + 1] : '.txt';

  async function scanDir(currentDir) {
    const data = await fs.readdir(currentDir, { withFileTypes: true });

    for (const entry of data) {
      const absPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        await scanDir(absPath);
      } else if (entry.isFile()) {
        const extension = path.extname(entry.name);
        if (extension === targetExt) {
          console.log(path.relative(workspacePath, absPath));
        }
      }
    }
  }
  await scanDir(workspacePath);
};

await findByExt();
