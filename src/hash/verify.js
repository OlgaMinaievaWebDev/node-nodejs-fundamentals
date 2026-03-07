import fs from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const verify = async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const jsonPath = path.resolve(__dirname, 'checksums.json');

  let checksums;

  // Read and parse checksums.json
  try {
    const data = await fs.readFile(jsonPath, 'utf8');
    checksums = JSON.parse(data);
  } catch (error) {
    //Throw error with specific message
    throw new Error('FS operation failed');
  }

  //  Loop through filenames and expected hashes
  for (const [filename, expectedHash] of Object.entries(checksums)) {
    const fullPath = path.resolve(__dirname, filename);

    //  Calculate hash using Streams API
    const actualHash = await new Promise((resolve) => {
      const hash = crypto.createHash('sha256');
      const stream = createReadStream(fullPath);

      // Pipe the data directly from file to hasher
      stream.pipe(hash);

      hash.on('finish', () => {
        resolve(hash.digest('hex'));
      });

      // Handle case where a file listed in JSON is missing
      stream.on('error', () => resolve(null));
    });

    //  Compare and Print (Strict formatting)
    const status = actualHash === expectedHash ? 'OK' : 'FAIL';
    console.log(`${filename} — ${status}`);
  }
};

await verify();
