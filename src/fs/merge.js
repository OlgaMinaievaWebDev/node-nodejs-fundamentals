import fs from 'node:fs/promises';
import path from 'node:path';
const merge = async () => {
  // Write your code here
  // Default: read all .txt files from workspace/parts in alphabetical order
  // Optional: support --files filename1,filename2,... to merge specific files in provided order
  // Concatenate content and write to workspace/merged.txt

  const partsPath = path.resolve('workspace/parts');
  const outputPath = path.resolve('workspace/merged.txt');
  try {
    const fileIndex = process.argv.indexOf('--files');
    let filesToMerge;

    if (fileIndex !== -1) {
      const argValue = process.argv[fileIndex + 1];
      if (!argValue) throw new Error(); // Handle edge case of flag with no value
      filesToMerge = argValue.split(',');
    } else {
      filesToMerge = null;
      const allFiles = await fs.readdir(partsPath);
      filesToMerge = allFiles.filter((file) => file.endsWith('.txt')).sort();

      if (filesToMerge.length === 0) throw new Error();
    }
    let mergedContent = '';
    for (const fileName of filesToMerge) {
      const filePath = path.join(partsPath, fileName);
      const content = await fs.readFile(filePath, 'utf-8');
      mergedContent += content;
    }
    // Write final result
    await fs.writeFile(outputPath, mergedContent);
  } catch (err) {
    // error message for FS failures
    throw new Error('FS operation failed');
  }
};

await merge();
