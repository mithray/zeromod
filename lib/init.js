const buildCache = require('../helpers/buildCache.js')

async function init(){
    console.log('initializing...')
    buildCache()
}
module.exports = init
