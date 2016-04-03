import { red, bold } from 'chalk';

export default function die(message) {
  console.log(`
    ${bold('pirateflix')}

    ${red('✘')} ${message}
  `);
  return;
}
