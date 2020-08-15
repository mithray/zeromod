const readdirp = require('readdirp')
const path = require('path')
const civsPath = path.join(process.cwd(),'./config/civs')
const parse = require('./parse.js')

async function getCivCodes(){
    const civCodes = []
    for await (const entry of readdirp(civsPath)){
        let fullPath = entry.fullPath
        let data = parse(fullPath)
        civCodes.push(data.code)
    }
    return civCodes

}
module.exports = getCivCodes
