'use strict'

const test = require('tape')
const stations = require('vbb-stations')

const photos = require('.')

test('has some URLs', (t) => {
	t.plan(4)
	t.equal(typeof photos.original['900000009102'].U9.platform, 'string')
	t.equal(typeof photos.large['900000009102'].U9.platform, 'string')
	t.equal(typeof photos.medium['900000009102'].U9.platform, 'string')
	t.equal(typeof photos.small['900000009102'].U9.platform, 'string')
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
