const colors = require("colors");
let n = process.argv[2]
let m = process.argv[3]
let k=0
let noPrimes = true

if (isNaN(n)) {
  console.log('Ошибка - параметр не является числом')
  return
}
if (isNaN(m)) {
    console.log('Ошибка - параметр не является числом')
  return
}

for (let i=n; i<=m; i++) {
  let isPrime=true
  if (i==1 || i==0)
    continue
  for (let j=2; j<i; j++) {
    if (i%j==0) {
      isPrime=false
      break
    }
  }

  if (isPrime) {
    noPrimes = false
    if (k==0) {
      console.log(colors.green(i))
      k++
    }
    else if (k==1) {
      console.log(colors.yellow(i))
      k++
    }
    else if (k==2) {
      console.log(colors.red(i))
      k=0
    }
  }
}
  if (noPrimes)
    console.log('Простых чисел нет'.red)
