'use strict'

const queue  = require('queue')
const path   = require('path')
const flickr = require('flickr-photo-url')
const commons = require('commons-photo-url')
const got    = require('got')
const fs     = require('fs')

const list   = require('./photos')



const urls = {
	flickr: (data) => flickr(data[0], data[1], 'm'),
	commons: (data) => Promise.resolve(commons(data[0], 500))
}
const url = (data) => {
	data = Array.from(data)
	const method = data.shift()
	if (method in urls) return urls[method](data)
	else throw new Error('unknown method ' + method)
}

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
			const file = [station, line, perspective].join('-') + '.jpg'

			url(photos[perspective]).catch(next)
			.then((url) => new Promise((yay, nay) => {

				got.stream(url).on('error', nay)
				.pipe(fs.createWriteStream(path.join(b, file)))
				.on('error', nay).on('finish', () => yay())

			})).catch(next)
			.then(() => {
				console.info(`${photos[perspective].join('/')} -> ${file}`)
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
