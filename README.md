# pirateflix

> Stream piratebay movies directly from CLI

<img src="http://placehold.it/980x400" />

## Usage

```sh
$ pirateflix
$ pirateflix --search="Interstellar"
$ pirateflix --help
  Follow the steps by the wizard and
  make sure you have VLC installed.

  Options:
    --search Optional value to start the query.
    --history Starts with the history of watched torrents.
    --clear Clears history of watched torrents.

  Usage:
    pirateflix [options]
```

## Overview

Make sure you have VLC installed, it might take a while until the movie starts depeding on the number
of seeders/leechers. The movie will start streaming at `http://localhost:8888` you can always
manually access and check it out.

## Related

* [peerflix](https://github.com/mafintosh/peerflix)
