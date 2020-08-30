const fs = require('fs')
const path = require('path')
const buildObjectFromPath = require('./helpers/buildObjectFromPath.js') 
const interpolate = require('./helpers/interpolate.js')
const changeCase = require('change-case')

/*
*/

async function createCivilCentres(){
const target_civs = [
	"athen",
	"brit",
	"gaul"
]
//console.log(target_civs)
  const config = await buildObjectFromPath(path.join(process.cwd(),'./config'))
  const template = ''
  const civs = config.civilizations
  const keys = Object.keys(civs)
//    console.log(keys)
//    console.log(civs)
  for ( let i = 0; i < keys.length; i ++ ){
      
    const civ = civs[keys[i]]
//console.log(civ.code)
//console.log(target_civs)
    if( target_civs.includes(civ.code) ){
console.log(civ)
    }
//  console.log(keys[i])
//	civ = civs[i]
//    let interpolated = interpolate(template,civ)
//	console.log(interpolated)
  }
}
createCivilCentres()
/*
var cache = [];
JSON.stringify(circ, (key, value) => {
  if (typeof value === 'object' && value !== null) {
    // Duplicate reference found, discard key
    if (cache.includes(value)) return;

    // Store value in our collection
    cache.push(value);
  }
  return value;
});
cache = null
*/
