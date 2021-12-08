const fs = require('fs')
const rd = require('readline')
const firstIP = '89.123.1.41'
const secondIP = '34.48.240.111'
const inputStream = fs.createReadStream('./access.log',  'utf8')

let lineReader = rd.createInterface({
  input: inputStream
});

lineReader.on('line', function (line) {
  if (line.includes(firstIP))
    fs.appendFileSync('./' + firstIP + '_requests.log', line + '\n', 'utf8')
  else if (line.includes(secondIP))
    fs.appendFileSync('./' + secondIP + '_requests.log', line + '\n', 'utf8')
});

inputStream.on('end', () => console.log('Done'))
