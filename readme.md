# vbb-station-photos

**Photos of every subway station in Berlin.** Thanks to [*ingolfbln*](https://www.flickr.com/photos/ingolfbln) and all the other people!

[![npm version](https://img.shields.io/npm/v/vbb-station-photos.svg)](https://www.npmjs.com/package/vbb-station-photos)
![CC0-licensed](https://img.shields.io/github/license/derhuerst/vbb-station-photos.svg)
[![support me via GitHub Sponsors](https://img.shields.io/badge/support%20me-donate-fa7664.svg)](https://github.com/sponsors/derhuerst)
[![chat with me on Twitter](https://img.shields.io/badge/chat%20with%20me-on%20Twitter-1da1f2.svg)](https://twitter.com/derhuerst)


## Installing

```shell
npm install vbb-station-photos
```


## Usage

```
const photos = require('vbb-station-photos')

const station = 'de:11000:900017103' // U Gleisdreieck
const line = 'U1'

console.log(photos.original[station][line])
```

```js
{
	label: 'https://c1.staticflickr.com/9/8315/7931788740_400098a074_o.jpg',
	platform: 'https://c1.staticflickr.com/9/8042/7931841660_923be9cfc6_o.jpg'
}
```

Available sizes are `original`, `large`, `medium` and `small`. You can also `require` only the urls of a particular image size:

```
const photos = require('vbb-station-photos/medium.json')
```


## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/vbb-station-photos/issues).
