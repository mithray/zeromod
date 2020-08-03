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
function parse(inputPath){
    const data = fs.readFileSync(inputPath,{encoding: 'utf-8'})
    const jsobj = YAML.parse(data)
    return jsobj
}
async function init(){
    console.log('initializing...')

    const detectedMods = detectMods(mods_paths)
    const files = getResourceFileList(detectedMods, resourceTypePaths)

    //console.log('files')
//    console.log(await files)
//    var res1 = fs.readFileSync(path.join(process.cwd(),'abbreviations.yml'),{ encoding: 'utf-8' })
//    var res2 = fs.readFileSync(path.join(process.cwd(),'categories.yml'),{ encoding: 'utf-8' })
    const abbreviations = parse('./abbreviations.yml')
    const categories = parse('./categories.yml')

    /*
    const resList = {}
    await detectedMods.forEach( (detectedMod) => {
        const modname = path.basename(detectedMod)
        indexPaths.forEach( async (subpath) => {
            const resourcePath = path.join(detectedMod,subpath)
            files.forEach(async(entry)=>{
                if (resList[dataHash].path.length > 1){
//                    console.log(resourceList[dataHash].mods)
//                    console.log(resourceList[dataHash])
                }
            })
//            console.log(resList)
        })
    })
    */
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
                    console.log('found duplicate')
                    resList[dataHash].path.push(modRelativePath)
  //                  console.log(resObj)
                }
        /*
                const fullResourcePath = path.join(resourcePath,file.path)
        console.log(files[file])
                const ind = fullResourcePath.search('/mods/')
                const modname = fullResourcePath.substring(ind + 6)
                const modRelativePath = path.join(modname, subpath,entry.path)
                */
    })
    })
    Object.keys(resList).forEach((key)=>{
        let writePath = path.join(process.cwd(),'.cache',key)
        let data = JSON.stringify(resList[key])
        fs.writeFile(writePath,data,(err,res)=>{
            console.log(res)
        })
    })
/*
  console.log(resList)

    Object.keys(resList).forEach((key)=>{
        const obj = resList[key]
        fs.writeSync(path.join(process.cwd(),'../.cache',key),obj)
    })
*/


}
module.exports = init
