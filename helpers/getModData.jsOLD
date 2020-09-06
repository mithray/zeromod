const path = require('path')
const YAML = require('yaml')
const fs = require('fs')
const readdirp = require('readdirp')
const changeCase = require('change-case')
//const parse = require('../helpers/parse.js')
const buildObjectFromPath = require('../helpers/buildObjectFromPath.js')

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
                let modRelativePath = obj.fullPath.substring(detectedMods[i].length + 1)
                obj.modRelativePath=modRelativePath//path.join(modname,resourceTypePaths[j],entry.basename)
                obj.classes = changeCase.snakeCase(modRelativePath).split('_')
                files.push(obj)
            }
        }
    }

    return files
}
var resourceTypePaths = [
//    'simulation/data/civs',
//    'simulation/data/auras',
    'simulation/templates'
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
        process.env.zero_ad_mod_path_1
]

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
async function getModData(){
    console.log('getting configuration files from target mods...')

    const detectedMods = detectMods(mods_paths)
    const files = getResourceFileList(detectedMods, resourceTypePaths)

 //   const abbreviations = parse('./abbreviations.yml')
   // const categories = parse('./categories.yml')

/*
    try {
      fs.accessSync(path.join(process.cwd(), 'config/civs/test'), fs.constants.R_OK | fs.constants.W_OK);
    } catch (err) {
      fs.mkdirSync(path.join(process.cwd(), 'config/civs/test'))
    }
*/
    resList = []
    await files.then(files=>{
      files.forEach( async (file) => {
        const data = await buildObjectFromPath(file.fullPath)
        const obj = file 
        const key = Object.keys(data)[0]
        obj.data = data[key]
        
        resList.push(obj)
      })
    })
  return resList
}
module.exports = getModData
