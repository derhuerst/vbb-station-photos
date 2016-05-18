'use strict'

const queue  = require('queue')
const path   = require('path')
const url    = require('flickr-photo-url')
const got    = require('got')
const fs     = require('fs')

const list   = require('./photos')



const b = path.join(__dirname, '.', 'data')
const q = queue()
q.concurrency = 5

Object.keys(list).forEach((station) => {
	const lines = list[station]
	Object.keys(lines).forEach((line) => {
		const photos = lines[line]
		Object.keys(photos).forEach((perspective) => q.push((next) => {

			if (!photos[perspective]) return next(new Error(
				`Missing ${perspective} photo for ${line} at ${station}`))
			const [user, photo] = photos[perspective]
			const file = [station, line, perspective].join('-') + '.jpg'

			url(user, photo, 'z').catch(next)
			.then((url) => new Promise((yay, nay) => {

				got.stream(url).on('error', nay)
				.pipe(fs.createWriteStream(path.join(b, file)))
				.on('error', nay).on('finish', () => yay())

			})).catch(next)
			.then(() => {
				console.info(`${user}/${photo} -> ${file} ✓`)
				next()
			})
		}))
	})
})

q.start()
q.on('error', (err) => {
	console.error(err.message)
	q.start()
})
