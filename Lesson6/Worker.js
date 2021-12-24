const { workerData, parentPort } = require('worker_threads')
const fs = require('fs')
const rd = require('readline')

const inputStream = fs.createReadStream(workerData.filePath, 'utf8')
let lineReader = rd.createInterface({
  input: inputStream
})
let res = ''
lineReader.on('line', function (line) {
    if (line.includes(workerData.searchString))
       res += line + '<br>'
})

inputStream.on('end', () => {
    parentPort.postMessage({ result: res })
})
