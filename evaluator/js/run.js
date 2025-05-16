const fs = require('fs');

// Read input and user code from files created at runtime
const input = fs.readFileSync('./input.txt', 'utf-8').trim();
const code = fs.readFileSync('./code.js', 'utf-8');

// Capture console.log output
let output = '';
const originalLog = console.log;
console.log = (...args) => {
  output += args.join(' ') + '\n';
};

const wrappedCode = `
  (function(input) {
    try {
      ${code}
    } catch (err) {
      console.error('Error in user code:', err);
    }
  })(\`${input.replace(/`/g, '\\`')}\`);
`;

try {
  eval(wrappedCode);
} catch (err) {
  console.error('Error evaluating code:', err);
  process.exit(1);
}

// Write captured output
console.log = originalLog;
process.stdout.write(output);
