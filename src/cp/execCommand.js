import { spawn } from 'node:child_process';
const execCommand = () => {
  // Write your code here
  // Take command from CLI argument
  // Spawn child process
  // Pipe child stdout/stderr to parent stdout/stderr
  // Pass environment variables
  // Exit with same code as child

  const args = process.argv.slice(2);
  const [command, ...commandArgs] = args[0].split(' ');

  const child = spawn(command, commandArgs, { env: process.env });

  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);

  child.on('exit', (code) => {
    process.exit(code)
  })
};

execCommand();
