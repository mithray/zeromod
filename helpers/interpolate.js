const safeEval = require('safe-eval')

function interpolate(template, data){

  function interp(match, p1 ){
/*
    var context = {
      data: data
    }
*/
    const context = data
    const evaled = safeEval(p1,context)
    return evaled
  }

  const tmp = JSON.stringify(template).replace(/\{(.*?)\}/g, interp)
  const json = JSON.parse(tmp)

  return json
	
}

module.exports = interpolate
