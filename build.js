'use strict'

const createQueue = require('queue')
const flickr = require('flickr-photo-url')
const commons = require('commons-photo-url')
const fs = require('fs')
const path = require('path')

const photos = require('./photos')

const getUrl = (link) => {
	if (link[0] === 'flickr') return flickr(link[1], link[2])
	if (link[0] === 'commons') return Promise.resolve(commons(link[1]))
	return Promise.reject(new Error('unknown link type:' + link[0]))
}

const urls = {}
const resolveLink = (station, line, perspective) => {
	const task = (cb) => {
		const link = photos[station][line][perspective]
		getUrl(link)
		.then((url) => {
			if (!urls[station]) urls[station] = {}
			if (!urls[station][line]) urls[station][line] = {}
			urls[station][line][perspective] = url
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
			} else queue.push(resolveLink(station, line, perspective))
		}
	}
}

queue.on('error', (err) => {
	console.error(err)
	process.exitCode = 1
})

queue.once('end', (err) => {
	if (err) return null
	process.stdout.write(JSON.stringify(urls) + '\n')
})
