'use strict'

const photos = require('.')

const station = 'de:11000:900017103' // U Gleisdreieck
const line = 'U1'

console.log(photos.original[station][line])
