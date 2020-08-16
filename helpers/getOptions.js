const readdirp = require('readdirp')
const path = require('path')
const civsPath = path.join(process.cwd(),'./config/civs')
const parse = require('./parse.js')

async function getOptions(property){
    const options = []
    for await (const entry of readdirp(civsPath)){
        let fullPath = entry.fullPath
        let data = parse(fullPath)
        if (data[property]){
            options.push(data[property])
        }
    }
    return options

}
module.exports = getOptions
