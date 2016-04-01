#!/usr/bin/env node

require('babel-core/register');
require('babel-polyfill');
'use strict';

const meow = require('meow');
const chalk = require('chalk');
const app = require('./').default;
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

app();
