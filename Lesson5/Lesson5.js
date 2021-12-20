const http = require('http')
const url = require('url')
const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, './index.html')
const readStream = fs.createReadStream(filePath)

function getFileContent(filePath) {
  return fs.readFileSync(filePath, 'utf8')
}

function getDirContent(dirPath) {
  const list = fs.readdirSync(dirPath)
  let page = '<html><head><meta charset="utf-8"></head><body>'
  list.forEach((item, i) => {
    let filePath = path.join(dirPath, item)
    if (isFile(filePath)) {
      page = page + '<a href=".?file=' + path.relative(__dirname, filePath) + '">' + item + '</a><br>'
    }
    else
    {
      page = page + '<a href=".?dir=' + path.relative(__dirname, filePath) + '">' + item + '</a><br>'
    }
  })
  page = page + '</body></html>'
  return page
}

function isFile(fileName) {
  return fs.lstatSync(fileName).isFile()
}

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
      const { query } = url.parse(req.url, true)
      let content
      if (query.file)
        content = getFileContent(path.join(__dirname, query.file))
      else {
        let resPath
        if (query.dir) {
          resPath = path.join(__dirname, query.dir)
        }
        else {
          resPath = __dirname
        }
        content = getDirContent(resPath)
      }

      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.write(content)
      res.end()
    } else {
        res.writeHead(405, 'Not allowed')
        res.end('Method not allowed')
    }
})

server.listen(5555)
