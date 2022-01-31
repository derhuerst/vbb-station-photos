'use strict'

const createQueue = require('queue')
const _findFlickrUrl = require('flickr-photo-url')
const commonsUrl = require('commons-photo-url')
const retry = require('p-retry');
const throttle = require('p-throttle');
const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')

const photos = require('./photos')

const showError = (err) => {
	console.error(err + '')
	process.exitCode = 1
}

const _checkUrl = (url) => {
	// todo: HEAD request?
	return fetch(url, {redirect: 'follow'})
	.then((res) => {
		if (res.ok) return url
		const err = new Error(res.status + ': ' + url)
		err.statusCode = res.status
		throw err
	})
}
const checkUrl = throttle({
	limit: 5,
	interval: 10 * 1000, // 10s
})(_checkUrl)

const sizes = ['original', 'large', 'medium', 'small']
const urls = {
	original: Object.create(null),
	large: Object.create(null),
	medium: Object.create(null),
	small: Object.create(null)
}

const findFlickrUrl = throttle({
	limit: 5,
	interval: 10 * 1000, // 10s
})(_findFlickrUrl)
const resolveLink = (station, line, perspective, size, check = size === 'original') => {
	const link = photos[station][line][perspective]

	const run = () => {
		let p
		if (link[0] === 'flickr') {
			p = findFlickrUrl(link[1], link[2], _findFlickrUrl.sizes[size])
		} else if (link[0] === 'commons') {
			p = Promise.resolve(commonsUrl(link[1], commonsUrl.sizes[size]))
		} else return Promise.reject(new Error('unknown link type:' + link[0]))

		if (check) p = p.then(checkUrl)
		return p
		.catch((err) => {
			if (err.statusCode === 404) throw new retry.AbortError(link.join(', ') + ' not found')
			throw err
		})
	}

	return retry(run, {retries: 3, minTimeout: 10 * 10000})
}

const queue = createQueue({concurrency: 16, autostart: true})

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
