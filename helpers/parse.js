import { load } from 'cheerio';

export default function parse(data) {
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
    }
  }).filter((i, { category }) => /video|movie/gi.test(category)).get();
}
