const http = require('http')
const url = require('url')
const fs = require('fs')
const path = require('path')
const socket = require('socket.io')
const { Worker } = require('worker_threads')

function start(workerData, client) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./Worker.js', { workerData })
    worker.on('message', data => client.emit('search-string', { message: data.result}))
  })
}

const filePath = path.join(__dirname, './index.html')
const readStream = fs.createReadStream(filePath)

function getFileContent(filePath) {
  let page = `
    <input id="field" type="text" size="40">
    <input type="submit" value="Найти" onClick="sendSearchRequest()"><br>
    <script>
      function sendSearchRequest() {
          const field = document.querySelector('#field')
          const data = {
              searchString: field.value,
              filePath: '${filePath}'
          }
          socket.emit('search', data)
      }
    </script>
    `

  return page + fs.readFileSync(filePath, 'utf8')
}

function getDirContent(dirPath) {
  const list = fs.readdirSync(dirPath)
  let page = ''
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
  return page
}

function isFile(fileName) {
  return fs.lstatSync(fileName).isFile()
}

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
      const { query } = url.parse(req.url, true)
      let content = `
        <html>
          <head>
            <meta charset="utf-8">
            <script src="https://cdn.socket.io/4.2.0/socket.io.min.js" integrity="sha384-PiBR5S00EtOj2Lto9Uu81cmoyZqR57XcOna1oAuVuIEjzj0wpqDVfD0JA9eXlRsj" crossorigin="anonymous"></script>
          </head>
          <body>
          <div id="quantity">Пользователей: 0</div>
          <div id="search"></div>`
      if (query.file)
        content += getFileContent(path.join(__dirname, query.file))
      else {
        let resPath
        if (query.dir) {
          resPath = path.join(__dirname, query.dir)
        }
        else {
          resPath = __dirname
        }
        content += getDirContent(resPath)
      }
      content+= `
      <script>
            const socket = io('localhost:5555');
            const quantityBlock = document.querySelector('#quantity')
            socket.on('user-quantity', payload => {
                quantityBlock.innerHTML = payload.message
            })
            const searchBlock = document.querySelector('#search')

            socket.on('search-string', payload => {
                searchBlock.innerHTML = 'Найдено: ' + payload.message
            })
        </script>
        </body>
        </html>`

      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.write(content)
      res.end()
    } else {
        res.writeHead(405, 'Not allowed')
        res.end('Method not allowed')
    }
})

const io = socket(server)
let counter = 0

io.on('connection', (client) => {
    counter++
    client.broadcast.emit('user-quantity', { message: 'Пользователей: ' + counter })
    client.emit('user-quantity', { message: 'Пользователей: ' + counter  })

    client.on('disconnect', function(){
        counter--
        client.broadcast.emit('user-quantity', { message: 'Пользователей: ' + counter  })
        client.emit('user-quantity', { message: 'Пользователей: ' + counter  })
    })

    client.on('search', function(data){
        start(data, client)
    })

})

server.listen(5555)
