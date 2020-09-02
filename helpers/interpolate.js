const safeEval = require('safe-eval')

function interpolate(template, data){

/*
*/
  function interp(match, p1 ){
//console.log(match)
    var evaled = safeEval(p1,data)
//console.log(data)
    const evalString = JSON.stringify(evaled)
//console.log(evalString)
    if(evalString.match(/\$\{.*\}/)){
      evaled = JSON.parse(interpolate(evalString,data))
    }
    return evaled
  }

  const tmp = JSON.stringify(template).replace(/\$\{(.*?)\}/g, interp)
  const json = JSON.parse(tmp)

//console.log(json)
  return json
	
}

module.exports = interpolate
