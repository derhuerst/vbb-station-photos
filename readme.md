# vbb-station-photos

**Photos of every subway station in Berlin.** Thanks to [*ingolfbln*](https://www.flickr.com/photos/ingolfbln) and all the other people!

[![npm version](https://img.shields.io/npm/v/vbb-station-photos.svg)](https://www.npmjs.com/package/vbb-station-photos)
[![build status](https://img.shields.io/travis/derhuerst/vbb-station-photos.svg)](https://travis-ci.org/derhuerst/vbb-station-photos)
[![dependency status](https://img.shields.io/david/derhuerst/vbb-station-photos.svg)](https://david-dm.org/derhuerst/vbb-station-photos)
[![dev dependency status](https://img.shields.io/david/dev/derhuerst/vbb-station-photos.svg)](https://david-dm.org/derhuerst/vbb-station-photos#info=devDependencies)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/vbb-station-photos.svg)
[![gitter channel](https://badges.gitter.im/derhuerst/vbb-rest.svg)](https://gitter.im/derhuerst/vbb-rest)


## Installing

```shell
npm install vbb-station-photos
```


## Usage

```
photo(stationId, line, [perspective])
```

Returns the file path as a string.

```js
const photo = require('vbb-station-photos')
console.log(photo(9007103, 'U8', 'label'))
// /Users/j/web/vbb-station-photos/data/9007103-U8-label.jpg
```


## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/vbb-station-photos/issues).
