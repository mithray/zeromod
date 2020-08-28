const fs = require('fs')
const getObjectsFromPath = require('./helpers/getObjectsFromPath.js') 
const interpolate = require('./helpers/interpolate.js')

const civs = [
	"athen",
	"brit",
	"gaul"
]

getObjectsFromPath('./config/civilizations')

for ( let i = 0; i < civs.length; i ++ ){
	civ = civs[i]

console.log(civ)
	let template = getObjectsFromPath('civil_centre.yml')
    let interpolated = interpolate(template,civ)
	console.log(interpolated)
}
