import { red, bold } from 'chalk';

export default function die(message) {
  console.log(`
    ${bold('pirate-foo')}

    ${red('✘')} ${message}
  `);
  return;
}
