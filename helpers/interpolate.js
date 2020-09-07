const safeEval = require('safe-eval')

function interpolate(template, data){

  function interp(match, p1 ){
    var evaled = safeEval(p1,data)
    const evalString = JSON.stringify(evaled)
    if(evalString.match(/\$\{.*\}/)){
      evaled = JSON.parse(interpolate(evalString,data))
    }
    return evaled
  }

  const tmp = JSON.stringify(template).replace(/\$\{(.*?)\}/g, interp)
  const json = JSON.parse(tmp)

  return json
}

module.exports = interpolate
