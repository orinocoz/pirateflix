import { load } from 'cheerio';
import { prompt } from 'inquirer';
import { isEmpty, find } from 'lodash';
import { green, red, blue, yellow } from 'chalk';
import { fork } from 'child_process';
import ora from 'ora';
import fetch from 'isomorphic-fetch';

const peerflix = './node_modules/peerflix/app.js';
const spinner = ora('Looking for pirate data... 💀');
const config = {
  url: 'http://thepiratebay.se',
};



function parse(data) {
  const $ = load(data);
  const $items = $('table#searchResult tr:has(a.detLink)');
  return $items.map((i, x) => {
    let $row = $(x);
    return {
      seeders: $row.find('td[align="right"]').first().text(),
      leechers: $row.find('td[align="right"]').next().text(),
      category: $row.find('[title="More from this category"]').text(),
      title: $row.find('a.detLink').text(),
      magnet: $row.find('[title="Download this torrent using magnet"]').attr('href'),
      category: {
        id: $row.find('center a').first().attr('href').match(/\/browse\/(\d+)/)[1],
        name: $row.find('center a').first().text(),
      },
      subcategory: {
        id: $row.find('center a').last().attr('href').match(/\/browse\/(\d+)/)[1],
        name: $row.find('center a').last().text(),
      },
    }
  }).get();
}

async function get({ search, page }) {
  const request = await fetch(`${config.url}/search/${search}/${page}/99`);
  return request.text();
}

async function select(page, { search }) {
  spinner.start();
  const body = await get({
    search,
    page,
  });

  const results = parse(body);
  spinner.stop();

  const choices = results
    .map(({ title, seeders, leechers, magnet }) => ({
      name: `${blue.bold(title)} ⬆ ${green(seeders)} ⬇ ${red(leechers)}`,
      value: magnet,
    }));

  const aditional = [
    {
      name: yellow.bold('================ Show More ================'),
      value: '@@MORE',
    },
    {
      name: red.bold('================ Search it again ================'),
      value: '@@SEARCH',
    },
  ];

  prompt({
    type: 'list',
    name: 'movie',
    message: 'Choose one of the items:',
    choices: [
      ...choices,
      ...aditional,
    ]
  },({ movie }) => {
    switch (movie) {
      case '@@MORE':
        return start(
          search,
          page + 1,
        );

      case '@@SEARCH':
        return start();

      default:
        return fork(peerflix, [movie, '--vlc']);
    }
  });
}


function start(search, page = 0) {
  if (!isEmpty(search)) {
    select(page, {
      search,
    });

    return;
  };

  prompt({
    type: 'input',
    name: 'search',
    message: 'What are you looking for?',
    validate: (x) => {
      if (!isEmpty(x)) {
        return true;
      }

      return 'Please enter a valid search';
    }
  }, select.bind(this, page));
}

start();
