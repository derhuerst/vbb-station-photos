#!/usr/bin/env node
'use strict'

const test   = require('tape')
const fs     = require('fs')
const stations = require('vbb-stations')

const photo = require('./index')

test('file exists', (t) => {
	t.plan(2)
	const path = photo('900000009102', 'U9', 'platform')
	t.equal(typeof path, 'string')
	fs.stat(path, (err, stats) => {
		if (err) return t.fail(err.message)
		t.pass('file exists')
	})
})

test('returns null for invalid requests', (t) => {
	t.plan(3)
	t.equal(photo('100000000000', 'U9', 'platform'), null)
	t.equal(photo('900000009102', 'Z7', 'platform'), null)
	t.equal(photo('900000009102', 'U9', 'fooooooo'), null)
})

test('every station id is valid', (t) => {
	t.plan(Object.keys(photo.list).length)

	for (let id in photo.list)
		t.ok(stations(id), `${id} doesn't exist`)
})
