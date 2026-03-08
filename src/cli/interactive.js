import readline from 'node:readline';

const interactive = () => {
  // Write your code here
  // Use readline module for interactive CLI
  // Support commands: uptime, cwd, date, exit
  // Handle Ctrl+C and unknown commands

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.setPrompt('> ');
  rl.prompt();
  rl.on('line', (userInput) => {
    let input = userInput.trim().toLowerCase();
    switch (input) {
      case 'uptime':
        console.log(`Uptime: ${process.uptime().toFixed(2)}s`);
        break;

      case 'cwd':
        console.log(process.cwd());
        break;

      case 'date':
        console.log(new Date().toISOString());
        break;

      case 'exit':
        rl.close();
        return;

      default:
        console.log(`Unknown command`);
        break;
    }
    rl.prompt();
  });

  rl.on('close', () => {
    console.log('Goodbye!');
  });
};

interactive();
