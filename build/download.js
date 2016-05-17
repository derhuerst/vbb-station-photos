'use strict'

const queue  = require('queue')
const path   = require('path')
const url    = require('flickr-photo-url')
const got    = require('got')
const fs     = require('fs')

const list   = require('../data/list')



const b = path.join(__dirname, '..', 'data')
const q = queue()
q.concurrency = 3

Object.keys(list).forEach((station) => {
	const lines = list[station]
	Object.keys(lines).forEach((line) => {
		const photos = lines[line]
		if (!Array.isArray(photos)) return
		photos.forEach((photo, i) => q.push((next) => {

			url('ingolfbln', photo, 'z').catch(next)
			.then((url) => new Promise((yay, nay) => {

				const file = [station, line, i].join('-') + '.jpg'
				got.stream(url).on('error', nay)
				.pipe(fs.createWriteStream(path.join(b, file)))
				.on('error', nay).on('finish', () => yay(file))

			})).catch(next)
			.then((file) => {
				console.info(photo, '->', file, '✓')
				next()
			})
		}))
	})
})

q.start((err) => {
	if (err) return console.error(err.stack)
	console.log('success')
})
