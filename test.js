#!/usr/bin/env node
'use strict'

const test   = require('tape')
const fs     = require('fs')
const photo = require('./index')

test('file exists', (t) => {
	t.plan(2)
	const path = photo(9009102, 'U9', 'platform')
	t.equal(typeof path, 'string')
	fs.stat(path, (err, stats) => {
		if (err) return t.fail(err.message)
		t.pass('file exists')
	})
})

test('returns null for invalid requests', (t) => {
	t.plan(3)
	t.equal(photo(1000000, 'U9', 'platform'), null)
	t.equal(photo(9009102, 'Z7', 'platform'), null)
	t.equal(photo(9009102, 'U9', 'fooooooo'), null)
})
