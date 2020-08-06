const wikijs = require('wikijs').default

const options = {
    apiUrl: 'https://en.wikipedia.org/w/api.php',
    origin: null
}

async function getWikiData(arg){
    let res = wikijs(options)
        .page(arg)
    return res
}

module.exports = getWikiData
