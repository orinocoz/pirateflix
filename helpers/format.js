import { green, red, blue } from 'chalk';

export default function format(results) {
  return results.map(({ title, seeders, leechers, magnet }) => ({
      name: `${blue.bold(title)} ⬆ ${green(seeders)} ⬇ ${red(leechers)}`,
      value: magnet,
    }));
}
