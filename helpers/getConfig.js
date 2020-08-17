const readdirp = require('readdirp')
const path = require('path')
const civsPath = path.join(process.cwd(),'./config/civs')
const parse = require('./parse.js')

async function getConfig(){
    const config = []
    for await (const entry of readdirp(civsPath)){
        let fullPath = entry.fullPath
        let data = parse(fullPath)
        config.push(data)
    }
    return config

}
module.exports = getConfig
