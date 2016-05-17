'use strict'

const path = require('path')
const list = require('./photos')

const dir = path.join(__dirname, 'data')

const file = (station, line, perspective) => {
	if (station in list
	&& line in list[station]
	&& perspective in list[station][line])
		return path.join(dir, [station, line, perspective].join('-') + '.jpg')
	return null
}

module.exports = Object.assign(file, {list, dir})
