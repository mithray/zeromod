//const Songshu = require('songshu')
//const packageJson = require('../package.json')
//const songshu = new Songshu(packageJson.name)
// HARDCODED ENV VARIABLES
const path = require('path')
const fs = require('fs')
const readdirp = require('readdirp')
const changeCase = require('change-case')
const YAML = require('yaml')
const crypto = require('crypto')
const hash = crypto.createHash('sha256')




var indexPaths = [
    'art/actors/props/units/',
    /*
    'art/animation',
    'art/icons',
    'art/materials',
    'art/meshes',
    'art/particles',
    'art/skeletons',
    'art/terrains',
    'art/textures',
    'art/variants'
    */
]

function sortCategories(data, abbreviations, categories){
    const sorted = { classes: [] }
    const wordList = data.split(' ')

//    console.log(wordList)
    wordList.forEach((word) => {
        if (abbreviations[word]) {
//console.log(word)

            word = abbreviations[word]
            //console.log(word)

        }
        var category_match = false
        Object.keys(categories).forEach((key)=>{
            if (categories[key].includes(word)){
                sorted[key]=word
                category_match = true
            }

        })
        if ( !category_match ){
            sorted.classes.push(word)
        }
    })

    return sorted
}

async function init(){
    console.log('initializing...')

    var mod_paths = [
        process.env.zero_ad_mod_path_1,
        process.env.zero_ad_mod_path_2
    ]

    const detectedMods = []

    mod_paths.forEach((p)=>{
        let modList = fs.readdirSync(p, {withFileTypes: true})
        modList.forEach((entry)=>{
            if (entry.isDirectory()){
                var files = fs.readdirSync(path.join(p,entry.name))
                if(files.includes('mod.json')){
                    detectedMods.push(path.join(p,entry.name))
                }
            }
        })
    })
    console.log('detected the following mods:')
    console.log(detectedMods)


    var res1 = fs.readFileSync(path.join(process.cwd(),'abbreviations.yml'),{ encoding: 'utf-8' })
    var res2 = fs.readFileSync(path.join(process.cwd(),'categories.yml'),{ encoding: 'utf-8' })
    const abbreviations = YAML.parse(res1)
    const categories = YAML.parse(res2)

    detectedMods.forEach( (detectedMod) => {
        indexPaths.forEach( async (subpath) => {
            const resourcePath = path.join(detectedMod,subpath)
            for await (const entry of readdirp(resourcePath)) {
//                const {path} = entry
        //        console.log(entry.path)
                categoryList = changeCase.noCase(entry.path)
      //          console.log(categoryList)
                const resObj = sortCategories(categoryList,abbreviations,categories)

                hash.update('some data to hash')
//                const hash_digest = hash.copy().digest('hex')
                resObj.hash = hash.copy().digest('hex')
                //              resObj.hash = hash_digest

                console.log(resObj)

//                console.log(`${JSON.stringify(entry)}`)
            }

        })
    })

    try {
      fs.accessSync(path.join(process.cwd(), '.cache'), fs.constants.R_OK | fs.constants.W_OK);
    } catch (err) {
      fs.mkdirSync(path.join(process.cwd(), '.cache'))
    }



}
module.exports = init
