'use strict'

const createQueue = require('queue')
const flickr = require('flickr-photo-url')
const commons = require('commons-photo-url')
const fs = require('fs')
const path = require('path')

const photos = require('./photos')

const showError = (err) => {
	console.error(err)
	process.exitCode = 1
}

const sizes = ['original', 'large', 'medium', 'small']
const urls = {original: {}, large: {}, medium: {}, small: {}}

const resolveLink = (station, line, perspective, size) => {
	const task = (cb) => {
		const link = photos[station][line][perspective]

		let p
		if (link[0] === 'flickr') {
			p = flickr(link[1], link[2], flickr.sizes[size])
		} else if (link[0] === 'commons') {
			p = Promise.resolve(commons(link[1]), commons.sizes[size])
		} else return cb(null, new Error('unknown link type:' + link[0]))

		p.then((url) => {
			let o = urls[size] || (urls[size] = {})
			o = o[station] || (o[station] = {})
			o = o[line] || (o[line] = {})
			o[perspective] = url

			console.error('✔', station, line, perspective, size)
			cb(null)
		})
		.catch(cb)
	}
	return task
}

const queue = createQueue({concurrency: 8, autostart: true})

for (let station of Object.keys(photos)) {
	const lines = photos[station]
	for (let line of Object.keys(lines)) {
		const perspectives = lines[line]
		for (let perspective of Object.keys(perspectives)) {
			if (!perspectives[perspective]) {
				console.error(`Missing ${perspective} photo for ${line} at ${station}`)
				continue
			}
			for (let size of sizes) {
				queue.push(resolveLink(station, line, perspective, size))
			}
		}
	}
}

const writeJSON = (name, data, onError) => {
	fs.writeFile(path.join(__dirname, name), JSON.stringify(data), (err) => {
		if (err) onError(err)
	})
}

queue.on('error', showError)
queue.once('end', (err) => {
	if (err) return null

	writeJSON('original.json', urls.original, showError)
	writeJSON('large.json', urls.large, showError)
	writeJSON('medium.json', urls.medium, showError)
	writeJSON('small.json', urls.small, showError)
})
