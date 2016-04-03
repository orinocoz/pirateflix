'use strict';

require('babel-core/register');
require('babel-polyfill');

exports.run = function() {
  const meow = require('meow');
  const chalk = require('chalk');
  const jsonfile = require('jsonfile');
  const app = require('./');
  const die = require('./helpers/die').default;
  const config = require('./helpers/config');
  const cli = meow(`
      Follow the steps by the wizard and
      make sure you have VLC installed.

      ${chalk.red.bold('Options:')}
      ${chalk.bold('--search')} Optional value to start the query.
      ${chalk.bold('--history')} Starts with the history of watched torrents.
      ${chalk.bold('--clear')} Clears history of watched torrents.

      ${chalk.red.bold('Usage:')}
      ${chalk.bold('pirateflix [options]')}
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
      const data = config.get();

      if (!data.history.length) {
        die('You don\'t have any data in your history yet.');
        return;
      }

      return app.show({
        choices: data.history,
      });

    case 'clear':
      config.deleteMovies();
      return;

    case 'search':
      app.applySearch({
        search: cli.flags.search,
      });
      return;

    default:
      return app.query();
  }
}

