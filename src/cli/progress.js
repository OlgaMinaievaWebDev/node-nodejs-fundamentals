const progress = () => {
  // Write your code here
  // Simulate progress bar from 0% to 100% over ~5 seconds
  // Update in place using \r every 100ms
  // Format: [████████████████████          ] 67%

  let duration = 5000;
  let interval = 100;
  let length = 30;
  let color = null;

  const durationIndex = process.argv.indexOf('--duration');
  if (durationIndex !== -1) {
    duration = Number(process.argv[durationIndex + 1]);
  }

  const intervalIndex = process.argv.indexOf('--interval');
  if (intervalIndex !== -1) {
    interval = Number(process.argv[intervalIndex + 1]);
  }

  const lengthIndex = process.argv.indexOf('--length');
  if (lengthIndex !== -1) {
    length = Number(process.argv[lengthIndex + 1]);
  }

  const colorIndex = process.argv.indexOf('--color');
  if (colorIndex !== -1) {
    color = process.argv[colorIndex + 1];
  }

  let elapsedTime = 0;
  let startInt = setInterval(() => {
    elapsedTime += interval;

    let percentage = Math.min((elapsedTime / duration) * 100, 100);
    let filledCount = Math.floor((percentage / 100) * length);
    let emptyCount = length - filledCount;

    const filled = '█'.repeat(filledCount);
    const empty = ' '.repeat(emptyCount);
    let displayFilled =filled;

    if (typeof color === 'string' && color.length === 7 && color[0]==='#') {
      let r = parseInt(color.slice(1, 3), 16);
      let g = parseInt(color.slice(3, 5), 16);
      let b = parseInt(color.slice(5, 7), 16);
      displayFilled = `\x1b[38;2;${r};${g};${b}m${filled}\x1b[0m`;
    }
    process.stdout.write(`\r[${displayFilled}${empty}] ${Math.floor(percentage)}%`);

    if (elapsedTime >= duration) {
      clearInterval(startInt);
      process.stdout.write('\nDone!\n');
    }
  }, interval);
};

progress();
