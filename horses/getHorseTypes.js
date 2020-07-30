const getData = require('./getData.js')
const changeCase = require('change-case')
var zero_ad_path = process.env['zero_ad_path']
const path = require('path')
var horse_path = path.join(zero_ad_path,'art/variants/quadraped/horse')
var counts = {}
function getHorseTypes(){
    let horses = getData(horse_path)
    types = []
    horses.forEach((item, index)=>{
        types[index] = changeCase.sentenceCase(item["name"])

    })
    types = types.toString()
    types = types.toLowerCase()
    types = types.replace(/,/g,'')
    types = types.replace(/xml/g,'')
    types = types.replace(/[0-9]*/g,'')
    counts = getCounts(types)
}

function getCounts(types) {
    var wordlist = types.split(' ')
    function filterEmpty(element){
        return element.length > 1
    }
    var wordlist = wordlist.filter(filterEmpty)
    for (let  i = 0; i < wordlist.length; i++) {
    var regex = new RegExp(wordlist[i],'g')
        counts[wordlist[i]] = (types.match(regex) || []).length // includes duplicate lookups
    }
    console.log(counts)
    return counts
}

getHorseTypes()
