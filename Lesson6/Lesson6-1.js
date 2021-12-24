const socket = require('socket.io')
const http = require('http')
const path = require('path')
const fs = require('fs')

const server = http.createServer((req, res) => {
    const indexPath = path.join(__dirname, 'index.html')
    const readStream = fs.createReadStream(indexPath)

    readStream.pipe(res)
});

const io = socket(server)
let i=0

io.on('connection', (client) => {
    let userNum = ++i
    client.broadcast.emit('new-conn-event', { message: 'Новый пользователь' + userNum + ' подключен' })
    client.emit('new-conn-event', { message: 'Вы подключены' })

    client.on('client-reconn', function() {
        client.broadcast.emit('reconn-event', { message: 'Пользователь' + userNum + ' переподключился' })
        client.emit('reconn-event', { message: 'Вы подключены' })
    })

    client.on('disconnect', function(){
        client.broadcast.emit('disconn-event', { message: 'Пользователь' + userNum + ' отключен' })
    })
    client.on('client-msg', data => {
        //console.log(data);
        const payload = {
            message: 'Пользователь' + userNum + ': ' + data.message.split('').join(''),
        };

        client.broadcast.emit('server-msg', payload)
        client.emit('server-msg', payload)
    })
})

server.listen(5555)
