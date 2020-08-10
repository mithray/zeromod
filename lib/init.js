const buildCache = require('./build-cache.js')

async function init(){
    console.log('initializing...')
    buildCache()
}
module.exports = init
