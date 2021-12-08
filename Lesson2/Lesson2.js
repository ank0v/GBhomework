const EventEmitter = require('events')
class MyEmitter extends EventEmitter {}
const emitterObject = new MyEmitter()
emitterObject.on('tick', (time, timerNumber) => console.log('Timer ' + timerNumber + ':' + Math.floor(time / 1000)))
emitterObject.on('finish', timerNumber => console.log('Timer ' + timerNumber + ' done'))

process.argv.slice(2).forEach(function (arg, index, array) {
  let parts = arg.split('-')
  let date = new Date(parts[3], parts[2] - 1, parts[1], parts[0])
  run(date, index)
});

function run(date, timerNumber) {
  let currentDate = new Date()
  let time = date.getTime() - currentDate.getTime()
  if (time >= 1000) {
    emitterObject.emit('tick', time, timerNumber)
    setTimeout(() => run(date, timerNumber), 1000)
  }
  else
    setTimeout(() => emitterObject.emit('finish'), time, timerNumber)
};
