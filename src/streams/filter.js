import { Transform } from 'node:stream';
const filter = () => {
  // Write your code here
  // Read from process.stdin
  // Filter lines by --pattern CLI argument
  // Use Transform Stream
  // Write to process.stdout

  const args = process.argv;
  const patternIndex = args.indexOf('--pattern');
  const pattern = args[patternIndex + 1];

  const flow = new Transform({
    transform(chunk, encoding, callback) {
      const lines = chunk.toString().split('\n');
      lines.forEach((line, index) => {
        if (line.includes(pattern)) {
          this.push(`${line}\n`);
        }
      });
      callback();
    },
  });
  process.stdin.pipe(flow).pipe(process.stdout)
};

filter();
