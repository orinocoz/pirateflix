import { prompt } from 'inquirer';
import { isEmpty, find } from 'lodash';
import { fork } from 'child_process';
import { blue } from 'chalk';
import ora from 'ora';
import jsonfile from 'jsonfile';
import path from 'path';

import die from './helpers/die';
import get from './helpers/get';
import parse from './helpers/parse';
import format from './helpers/format';
import aditional from './helpers/aditional';
import { saveMovie } from './helpers/config';

const peerflix = path.join(__dirname, '../node_modules/peerflix/app.js');
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
        const item = find(choices, {
          value: movie
        });

        saveMovie(item);
        return fork(peerflix, [movie, '--vlc']);
    }
  });
}

export async function applySearch({ search, page = 0 }) {
  spinner.start();
  const results = parse(await get({ search, page }));
  spinner.stop();
  if (!results.length) {
    die(`Couldn\'t find any results matching ${blue.bold(search)}`)
    return;
  }

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

