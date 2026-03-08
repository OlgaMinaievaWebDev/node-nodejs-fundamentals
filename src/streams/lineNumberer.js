import { Transform } from 'node:stream';

const lineNumberer = () => {
  let counter = 1;

  const flow = new Transform({
    transform(chunk, encoding, callback) {
      const lines = chunk.toString().split('\n');

      lines.forEach((line, index) => {
        // Check if this is the very last element of the split array
        const isLastEmpty = index === lines.length - 1 && line === '';

        // If it's not a trailing empty string, process it
        if (!isLastEmpty) {
          this.push(`${counter} | ${line}\n`);
          counter++;
        }
      });

      callback();
    },
  });

  process.stdin.pipe(flow).pipe(process.stdout);
};

lineNumberer();
