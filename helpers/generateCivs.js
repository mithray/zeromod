const path = require('path')
const changeCase = require('change-case')
const fetch = require('node-fetch')
const wiki_api_url="https://en.wikipedia.org/api/rest_v1/page/summary/"
const parse = require('./parse.js')
const readdirp = require('readdirp')
const culturalClasses = {}
const safeEval = require('safe-eval')
const config = parse('./config.yml')
const mkdirp = require('mkdirp')
const fs = require('fs')
const getWikiData = require('./getWikiData.js')
const YAML = require('yaml')

async function interpolateCivTemplate(culturalClassesPath, civPath){

    const classes = await getCulturalClasses(culturalClassesPath)
    var dates = []
    const civinfo = parse(civPath)
    const factions = classes['factions'][civinfo.factions]
    for (let i = 0; i < factions.length; i++){
        const faction = factions[i]
        for (let j = 0; j < faction["heroes"].length; j++){
            const hero = faction["heroes"][j]
            var deathDate
            await getWikiData(hero["name"]).then( async (res) => {

                deathDate = await res.info('deathDate')
                var summary = await res.summary()
                summary = summary.replace(/\n+.*/,'')
                if(!hero.history){
                    classes['factions'][civinfo.factions][i]['heroes'][j]['history'] = summary
                }
                if(deathDate){
                    let dateRegex = /.*(\b[0-9]{1,4}\s*BC).*/g
                    deathDate = deathDate.replace(dateRegex,`$1`)
                    classes['factions'][civinfo.factions][i]['heroes'][j]['deathDate'] = deathDate
                    await dates.push(deathDate)
                }
                else {
                    const dateStringRegex = /\(.*[0-9]{1,4}\s*BC.*\)/;
                    const dateString = summary.match(dateStringRegex)[0];
                    const datesRegex = /[0-9]{1,4}\s*BC/g
                    const datesTmp = dateString.match(datesRegex)
                    deathDate = datesTmp[ datesTmp.length - 1 ]
                    classes['factions'][civinfo.factions][i]['heroes'][j]['deathDate'] = deathDate
                    await dates.push(deathDate)
                }
            })

        }
    }
    function greaterThan(first,second){
        return first > second
    }
    dates.sort(greaterThan)
    civinfo.period = {
        beginning: dates[0],
        end: dates[dates.length - 1]
    }

    const options = {indentSeq: false}
    const obj = {}
    obj[civinfo.factions] = classes['factions'][civinfo.factions]
    const interpolated = YAML.stringify(obj,options)
    const writePath = classes['factions'].fullPath
    fs.writeFileSync(writePath,interpolated)
            /*
            await deathDate.then((res)=>{
                console.log(`death date found ${res}`)
            })
            */

}

async function createCivObject(civinfo, classes){
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
    civ["Period"] = civinfo.period

//    console.log(civinfo)
    if (typeof(civinfo.culture.music) === "string" || typeof(civinfo.culture.music[0]) === "string" ) {
        civ["Music"] = classes['music'][civinfo.culture.music]
    }
    civ["Factions"] = classes['factions'][civinfo.factions]

//    console.log(civ["Factions"])


    /*
    civ["Factions"].forEach(faction=>{
        faction["Heroes"].forEach( async (hero) => {
//            console.log(wikiData)
        })
    })
    */

    civ["CivBonuses"] = [].concat.apply([],classes['civ_bonuses'][civinfo.civ_bonuses])
    civ["TeamBonuses"] = [].concat.apply([],classes['team_bonuses'][civinfo.team_bonuses])
    civ["Structures"] = [].concat.apply([],classes['structures'][civinfo.structures])
    civ["WallSets"] = classes['wall_sets'][civinfo.culture.wall_sets]
    civ["StartEntities"] = classes['start_entities'][civinfo.start_entities]
    civ["Formations"] = [].concat.apply([],classes['formations'][civinfo.formations])
    civ["AINames"] = classes['ai_names'][civinfo.culture.ai_names]
    civ["SkirmishReplacements"] = classes['skirmish_replacements'][civinfo.skirmish_replacements]
    civ["SelectableInGameSetup"] = civinfo.selectable_in_game_setup

    function interpolate(match, p1 ){
        var context = {
            civ: civinfo
        }
//        console.log(civ)
        const evaled = safeEval(p1,context)
//        console.log(p1)
//        console.log(evaled)
        return evaled
    }
    const tmp = JSON.stringify(civ).replace(/\$\{(.*?)\}/g, interpolate)
//    console.log(tmp)
    const civInterpolated = JSON.parse(tmp)
    /*
    */
    return civInterpolated
}

async function getCulturalClasses(culturalClassesPath){
    const obj = {}
    for await (const entry of readdirp(culturalClassesPath)){
        let basename = entry.basename.replace(/.yml$/,'')
        const fullPath = entry.fullPath
        obj[basename] = parse(fullPath)
        obj[basename].fullPath = fullPath
   //console.log(obj)
    }
    return obj
}
//culturalCategories.
async function generateCivs(){
    const civPath = path.join(process.cwd(),'simulation/data/civs/hellenic/athenians.yml')
    const culturalClassesPath = path.join(process.cwd(),"simulation/data/civs/cultural_classes")
//    interpolateCivTemplate(culturalClassesPath, civPath)
    const civinfo = parse(civPath)
    const classes = await getCulturalClasses(culturalClassesPath)
//    console.log(classes)

    const civ = await createCivObject(civinfo, classes)
    const civWriteDir = path.join(
        process.cwd(),
        'mods',
        changeCase.snakeCase(config.name),
        'simulation/data/civs'
    )
    try {
      fs.accessSync(civWriteDir, fs.constants.R_OK | fs.constants.W_OK);
    } catch (err) {
        mkdirp.sync(civWriteDir)
    }
    const writePath = path.join(civWriteDir, civinfo.code + '.json')
    fs.writeFileSync(writePath, JSON.stringify(civ,null,'  '))
/*
    */


/*
    console.log(writeDir)
    console.log(civ)
    console.log(config)
    */
}
//civinfo = createCivObject(civinfo)

//console.log(civinfo)


module.exports = generateCivs
