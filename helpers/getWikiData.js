const wikijs = require('wikijs').default

const options = {
    apiUrl: 'https://en.wikipedia.org/w/api.php',
    origin: null
}

async function getWikiData(arg){
    if(arg.name){
        arg = arg.name
    }
    let res = await wikijs(options)
        .page(arg)

    let summary = await res.summary()
    return summary//await res.summary
}
/*
getWikiData('Nigeria').then( async (res) => {
    console.log(res)
})
*/

module.exports = getWikiData
