'use strict'

const createQueue = require('queue')
const flickr = require('flickr-photo-url')
const commons = require('commons-photo-url')
const throttle = require('p-throttle');
const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')

const photos = require('./photos')

const showError = (err) => {
	console.error(err)
	process.exitCode = 1
}

const checkUrl = (url) => {
	return fetch(url, {redirect: 'follow'})
	.then((res) => {
		if (res.ok) return url
		throw new Error(res.status + ': ' + url)
	})
}

const sizes = ['original', 'large', 'medium', 'small']
const urls = {original: {}, large: {}, medium: {}, small: {}}

const resolveLink = throttle((station, line, perspective, size) => {
	const link = photos[station][line][perspective]

	let p
	if (link[0] === 'flickr') {
		p = flickr(link[1], link[2], flickr.sizes[size])
	} else if (link[0] === 'commons') {
		p = Promise.resolve(commons(link[1]), commons.sizes[size])
	} else return cb(null, new Error('unknown link type:' + link[0]))

	return p.then(checkUrl)
}, 3, 1000)

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
				queue.push((cb) => {
					resolveLink(station, line, perspective, size)
					.then((url) => {
						let o = urls[size] || (urls[size] = {})
						o = o[station] || (o[station] = {})
						o = o[line] || (o[line] = {})
						o[perspective] = url

						console.error('✔', station, line, perspective, size)
						cb(null)
					})
					.catch(cb)
				})
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
