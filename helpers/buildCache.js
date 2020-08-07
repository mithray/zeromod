//const Songshu = require('songshu')
//const packageJson = require('../package.json')
//const songshu = new Songshu(packageJson.name)
// HARDCODED ENV VARIABLES
const path = require('path')
const fs = require('fs')
const readdirp = require('readdirp')
const changeCase = require('change-case')
const crypto = require('crypto')
const parse = require('../helpers/parse.js')

async function getResourceFileList(detectedMods,resourceTypePaths){
    const files = []
    for (let i=0; i<detectedMods.length; i++){
        for (let j=0; j<resourceTypePaths.length; j++){
            for await (const entry of readdirp(path.join(detectedMods[i],resourceTypePaths[j]))){
                let ind = detectedMods[i].lastIndexOf('/')
                let modname=detectedMods[i].substring(ind + 1)
                let obj = {}
                obj.modname = modname
                obj.fullPath = entry.fullPath
                obj.modRelativePath=path.join(modname,resourceTypePaths[j],entry.basename)
                files.push(obj)
            }
        }
    }

    return files
}
var resourceTypePaths = [
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
const mods_paths = [
    //    process.env.zero_ad_mod_path_1,
        process.env.zero_ad_mod_path_2
]

function sortCategories(data, abbreviations, categories){
    const sorted = { classes: [] }
    const wordList = data.split(' ')

    wordList.forEach((word) => {
        if (abbreviations[word]) {
          word = abbreviations[word]
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
function detectMods(mods_paths){
    const detectedMods = []
    mods_paths.forEach((p)=>{
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
    return detectedMods

}
async function buildCache(){
    console.log('initializing...')

    const detectedMods = detectMods(mods_paths)
    const files = getResourceFileList(detectedMods, resourceTypePaths)

    const abbreviations = parse('./abbreviations.yml')
    const categories = parse('./categories.yml')

    await files
    try {
      fs.accessSync(path.join(process.cwd(), '.cache'), fs.constants.R_OK | fs.constants.W_OK);
    } catch (err) {
      fs.mkdirSync(path.join(process.cwd(), '.cache'))
    }

    await files.then(files=>{
      resList = {}
      files.forEach(file=>{
        const data = fs.readFileSync(file.fullPath)
        const hash = crypto.createHash('sha256')
        hash.update(data)
        const dataHash = hash.digest('hex')
        var resObj = resList[dataHash]
        const modRelativePath = file.modRelativePath
        if (!resObj){
          categoryList = changeCase.noCase(modRelativePath)
          resObj = sortCategories(categoryList,abbreviations,categories)
          resObj.path = [modRelativePath]
          resList[dataHash] = resObj
        } else {
          resList[dataHash].path.push(modRelativePath)
        }
      })
    })

    Object.keys(resList).forEach((key)=>{
      let writePath = path.join(process.cwd(),'.cache',key)
      let data = JSON.stringify(resList[key])
      fs.writeFile(writePath,data,(err,res)=>{})
    })


}
module.exports = buildCache
