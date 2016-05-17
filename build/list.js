'use strict'

const path = require('path')
const got  = require('got')
const fs   = require('fs')

const url = 'https://gist.githubusercontent.com/derhuerst/c2d9970bdbaff204e52017d8974b714c/raw/16848a998a7c1e651c5da7749eef9f3d2e5dbbd2/stations.js'

got.stream(url).on('error', console.error)
.pipe(fs.createWriteStream(path.join(__dirname, '../data/list.js')))
.on('error', console.error).on('finish', () => console.log('success'))
