const path = require('path')
const YAML = require('yaml')
const fs = require('fs')
const readdirp = require('readdirp')
const changeCase = require('change-case')
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
    'simulation/data/civs',
    'simulation/data/auras'
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
async function getConfigsFromMods(){
    console.log('getting configuration files from target mods...')

    const detectedMods = detectMods(mods_paths)
    const files = getResourceFileList(detectedMods, resourceTypePaths)

    const abbreviations = parse('./abbreviations.yml')
    const categories = parse('./categories.yml')

    await files
    try {
      fs.accessSync(path.join(process.cwd(), 'config/civs/test'), fs.constants.R_OK | fs.constants.W_OK);
    } catch (err) {
      fs.mkdirSync(path.join(process.cwd(), 'config/civs/test'))
    }

    await files.then(files=>{
      resList = {}
      files.forEach(file=>{
        const data = parse(file.fullPath)
         const yaml = YAML.stringify(data)
          const name = path.basename(file.fullPath,'.json') + '.yml'
          fs.writeFileSync(path.join(process.cwd(),'config/civs/test',name),yaml)
    //      console.log(file)
      })
    })

}
module.exports = getConfigsFromMods
getConfigsFromMods()
