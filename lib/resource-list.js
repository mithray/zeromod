const loadCache = require('../helpers/loadCache.js')

async function resourceList(searchTerm){

    console.log('listing resources...')

    searchTerm = 'rocks'

    const cache = await loadCache()
//    console.log(cache)
    const found = cache.filter(obj=>obj.classes.includes(searchTerm))
    console.log(found)
/*
*/
    return found

}
module.exports = resourceList
