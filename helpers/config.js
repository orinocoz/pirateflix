import jsonfile from 'jsonfile';
import { uniqBy } from 'lodash';

const file = './.pirateflixrc';

export function get() {
  try {
    return jsonfile.readFileSync(file);
  } catch(e) {
    jsonfile.writeFileSync(file, {});
    return get();
  }
}

export async function saveMovie(movie) {
  const config = await get();
  const history = config.history || [];

  history.push(movie);
  jsonfile.writeFileSync(file, {
    ...config,
    history: uniqBy(history, 'name'),
  })
}
