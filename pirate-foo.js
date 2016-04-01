import { load } from 'cheerio';
import { prompt } from 'inquirer';
import { isEmpty, find } from 'lodash';
import { green, red, blue } from 'chalk';
import ora from 'ora';
import fetch from 'isomorphic-fetch';
import { spawn } from 'child_process';

const peerflix = './node_modules/peerflix/app.js';
const spinner = ora('Looking for pirate data... 💀');
const config = {
  url: 'http://thepiratebay.se',
  search: 'Interstellar',
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

async function get(q) {
  const request = await fetch(`${config.url}/s/?q=${q}`);
  return request.text();
}

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
}, async ({ search }) => {
  spinner.start();
  const body = await get(search);
  const results = parse(body);
  spinner.stop();

  const choices = results
    .map(({ title, seeders, leechers }) => `${blue.bold(title)} ⬆ ${green(seeders)} ⬇ ${red(leechers)}`)

  prompt({
    type: 'list',
    name: 'title',
    message: 'Choose one of the items:',
    choices,
  }, ({ title }) => {
    const { magnet } = find(results, {});
    spawn(peerflix, [magnet, '--vlc', '--full-screen']);
  });

});
