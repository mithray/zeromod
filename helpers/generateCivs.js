const path = require('path')
const changeCase = require('change-case')
const fetch = require('node-fetch')
const wiki_api_url="https://en.wikipedia.org/api/rest_v1/page/summary/"
const parse = require('./parse.js')
const readdirp = require('readdirp')
const culturalClasses = {}

async function getWiki(title){

    const info = await fetch( wiki_api_url + title )
        .then(res => res.text())
        .then( body => {
            let main = JSON.parse(body).extract
            return main
        })

    return info

}

async function createCivObject(civinfo){
    const civ = {}
    civ["Code"] = changeCase.noCase(civinfo.code)
    civ["Culture"] = changeCase.noCase(civinfo.culture.main)
    civ["Name"] = changeCase.sentenceCase(civinfo.name)
    civ["Emblem"] = civinfo.emblem
    if (civinfo.history){
      civ["History"] = civinfo.history
    } else {
      civ["History"] = await getWiki(civinfo.name)
    }

    if (typeof(civinfo.music) === "string" || typeof(civinfo.music[0]) === "string" ) {
        civ["Music"] = getData('music',civinfo.music)
    }
    civ["Factions"] = getData('factions',civinfo.factions)
    civ["CivBonuses"] = [].concat.apply([],getData('civ_bonuses',civinfo.civ_bonuses))
    civ["TeamBonuses"] = [].concat.apply([],getData('team_bonuses',civinfo.team_bonuses))
    civ["Structures"] = [].concat.apply([],getData('structures',civinfo.structures))
    civ["WallSets"] = getData('wall_sets',civinfo.wall_sets)
    civ["StartEntities"] = getData('start_entities',civinfo.start_entities)
    civ["Formations"] = [].concat.apply([],getData('formations',civinfo.formations))
    civ["AINames"] = getData('ai_names',civinfo.ai_names)
    civ["SkirmishReplacements"] = getData('skirmish_replacements', civinfo.ai_names)
    civ["SelectableInGameSetup"] = civinfo.selectable_in_game_setup
    return civ
}

const culturalClassesPath = path.join(process.cwd(),"civs/cultural_classes")
async function getCulturalClasses(){
    for await (const entry of readdirp(culturalClassesPath)){
        console.log('hi1')
        console.log(entry)
        let obj = parse(entry.fullPath)
        console.log('hi2')
        let basename = entry.basename.replace(/.yml$/,'')
        console.log(basename)
    /*
        culturalClasses[]
    let obj = {}
    obj.modname = modname
    obj.fullPath = entry.fullPath
    obj.modRelativePath=path.join(modname,resourceTypePaths[j],entry.basename)
    files.push(obj)
    */
    }
    console.log('hi')
}
//culturalCategories.
getCulturalClasses()
let civinfo = parse(path.join(process.cwd(),'civs/hellenic/athenians.yml'))
//civinfo = createCivObject(civinfo)

//console.log(civinfo)

module.exports = createCivObject
