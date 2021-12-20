const fs = require('fs')
const rd = require('readline')
const path = require("path")
const inquirer = require("inquirer")

let rl = rd.createInterface({
    input: process.stdin,
    output: process.stdout
})

function isFile(fileName) {
  return fs.lstatSync(fileName).isFile()
}

function isPattern(string) {
  try {
      new RegExp(string);
      return true
  } catch(e) {
      return false
  }
}

function parseFile(filePath) {
  rl.close()
  rl = rd.createInterface({
      input: process.stdin,
      output: process.stdout
  })

  rl.question("Укажите название строки для поиска: ", function(inputedString) {
    const inputStream = fs.createReadStream(filePath, 'utf8')
    let lineReader = rd.createInterface({
      input: inputStream
    })

    const dirPath = path.dirname(filePath)

    lineReader.on('line', function (line) {
      let match = false
      if (isPattern(inputedString))
        match = new RegExp(inputedString).test(line)
      else
        match = line.includes(inputedString)

      if (match)
        fs.appendFileSync(path.join(dirPath, 'output.log'), line + '\n', 'utf8')
    })

    inputStream.on('end', () => {
      console.log('Done')
      rl.close()
    })
  })
}

function showDirStructure(inputedPath) {
  const list = fs.readdirSync(inputedPath)
  inquirer
    .prompt([{
            name: "fileName",
            type: "list",
            message: "Укажите название файла или папки:",
            choices: list,
        }])
    .then((answer) => {
        console.log(answer.fileName)
        const filePath = path.join(inputedPath, answer.fileName)

        if (isFile(filePath))
          parseFile(filePath)
        else
          showDirStructure(filePath)
    });
}

rl.question("Укажите путь к папке: ", function(inputedPath) {
    showDirStructure(inputedPath)
});
