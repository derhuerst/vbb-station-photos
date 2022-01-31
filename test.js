'use strict'

const test = require('tape')
const stations = require('vbb-stations')

const photos = require('.')

const leopoldplatz = 'de:11000:900009102'

test('has some URLs', (t) => {
	t.plan(4)
	t.equal(typeof photos.original[leopoldplatz].U9.platform, 'string')
	t.equal(typeof photos.large[leopoldplatz].U9.platform, 'string')
	t.equal(typeof photos.medium[leopoldplatz].U9.platform, 'string')
	t.equal(typeof photos.small[leopoldplatz].U9.platform, 'string')
	// todo: check if urls exist
})

test('every station id is valid', (t) => {
	const ids = Object.keys(photos.original)

	t.plan(ids.length)
	for (let id of ids) {
		const [station] = stations(id)
		t.ok(station, `${id} doesn't exist`)
	}
})
