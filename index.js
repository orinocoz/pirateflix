import { prompt } from 'inquirer';
import { isEmpty, compose } from 'lodash';
import { fork } from 'child_process';
import ora from 'ora';

import get from './helpers/get';
import parse from './helpers/parse';
import format from './helpers/format';
import aditional from './helpers/aditional';

const peerflix = './node_modules/peerflix/app.js';
const spinner = ora('Hang on, pirate doing pirate suff... 💀');

export function show({ search, choices, page = 0 }) {
  prompt({
    type: 'list',
    name: 'movie',
    message: 'Choose one of the items:',
    choices,
  }, ({ movie }) => {
    switch(movie) {
      case '@@MORE':
        return applySearch({
          search,
          page: page === 0 ? 1 : page + 1,
        });

      case '@@SEARCH':
        return query();

      default:
        return fork(peerflix, [movie, '--vlc']);
    }
  });
}

export async function applySearch({ search, page = 0 }) {
  spinner.start();
  const results = parse(await get({ search, page }));
  spinner.stop();
  show({
    search,
    choices: aditional(format(results)),
    page,
  });
}

export function query() {
  prompt({
    type: 'input',
    name: 'search',
    message: 'What movie are you looking for?',
    validate: (x) => {
      if (!isEmpty(x)) {
        return true;
      }

      return 'Please enter a valid search.';
    }
  }, applySearch);
}

