const safeEval = require('safe-eval')

function interpolate(template, data){

console.log('data')
console.log(data)
console.log('/data')
console.log(template)

  function interp(match, p1 ){
console.log(match)
    const context = data
    const evaled = safeEval(p1,context)
    return evaled
  }

  const tmp = JSON.stringify(template).replace(/\$\{(.*?)\}/g, interp)
  const json = JSON.parse(tmp)

console.log(json)
  return json
	
}

module.exports = interpolate
