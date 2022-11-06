const {stdout} = process
const fs = require('fs')
const path = require('path')
const { pipeline } = require('stream')

const input = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8')

pipeline(
  input,
  stdout,
  error => {
    if(error) console.error(err.message)
  }
)