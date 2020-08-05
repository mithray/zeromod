const safeEval = require('safe-eval')
const YAML = require('yaml')
const fetch = require('node-fetch')
const fs = require('fs')
const path = require('path')
const changeCase = require('change-case')
const filePath= path.join(__dirname ,"civs/hellenic/athenians.yml")
const path_classes = path.join(__dirname,"civs/cultural_classes/")
const wiki_api_url="https://en.wikipedia.org/api/rest_v1/page/summary/"
const parse = require('./parse.js')

async function getWiki(title){

    const info = await fetch(wiki_api_url+title)
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
    civ["Culture"] = changeCase.noCase(civinfo.culture)
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

function readYamlFile(filePath){
//    console.log(filePath)
    var res = fs.readFileSync(filePath,{ encoding: 'utf-8' })
    res = YAML.parse(res)
    /*
    var res = await fs.readFile(filePath, {encoding: 'utf-8'}, async function(err,data){
        if (!err) {
            console.log('here2')

            return await YAML.parse(data)
        } else {
            console.log(err)
        }
    });
    */
    return res
}
function interpolate(match, p1 ){
    var civ = civinfo
    var context = {
        civ: civ
    }
    return safeEval(p1,context)

}
var civinfo
async function execute(){
    var obj = await readYamlFile(filePath)
    var civ = await createCivObject(obj)
    civinfo = obj
    console.log(JSON.stringify(civ).replace(/\$\{(.*?)\}/g, interpolate))
    return civ
}

execute()
