import { mkdir } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';

const restore = async () => {
  // Write your code here
  // Read snapshot.json
  // Treat snapshot.rootPath as metadata only
  // Recreate directory/file structure in workspace_restored
  try {
    const data = await fs.readFile('snapshot.json', 'utf-8');
    const snapshot = JSON.parse(data);

    const destDir = path.resolve('workspace_restored');
    await fs.mkdir(destDir, { recursive: true });

    for (const entry of snapshot.entries) {
      const entryPath = path.join(destDir, entry.path);
      console.log(entryPath);
      if (entry.type === 'directory') {
        await fs.mkdir(entryPath, { recursive: true });
      } else if (entry.type === 'file') {
        await fs.mkdir(path.dirname(entryPath), { recursive: true });
        const content = Buffer.from(entry.content, 'base64');
        await fs.writeFile(entryPath, content);
      }
    }
  } catch (err) {
    console.log(err);
  }
};

await restore();
