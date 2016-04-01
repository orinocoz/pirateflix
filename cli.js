#!/usr/bin/env node

require('babel-core/register');
require('babel-polyfill');
'use strict';

const meow = require('meow');
const chalk = require('chalk');
const app = require('./');
const die = require('./helpers/die').default;
const cli = meow(`
  Follow the steps by the wizard and
  make sure you have VLC installed.

  ${chalk.red.bold('Options:')}
    ${chalk.bold('--search')} Optional value to start the query.
    ${chalk.bold('--history')} Starts with the history of watched torrents.
    ${chalk.bold('--clear')} Clears history of watched torrents.

  ${chalk.red.bold('Usage:')}
    ${chalk.bold('pirate-foo [options]')}
  `
);

const flags = Object.keys(cli.flags);
const type = flags[0] || '';

if (flags.length > 1) {
  die('Can\'t use more than one option at once.');
  return;
}

switch(type) {
  case 'history':
    console.log('start with history');
    // app.show({ ...history goes here })
    return;

  case 'clear':
    console.log('start with clear');
    // clear history here
    return;

  default:
    return app.query();
}
