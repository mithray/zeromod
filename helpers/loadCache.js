const readdirp = require('readdirp')
const path = require('path')
const parse = require('../helpers/parse.js')
//const fs = require('fs')

async function loadCache(){

    console.log('loading cache...')
    const cache = []
    const cachePath = path.join(process.cwd(),'.cache')
    for await (const entry of readdirp(cachePath)){
        let obj = {}
        let basename = path.basename(entry.basename,'.json')
        const fullPath = entry.fullPath
//        console.log(fullPath)
        obj = parse(fullPath)
        obj.hash = basename
        cache.push(obj)
    }
//    console.log(cache)
    return cache
}
module.exports = loadCache
