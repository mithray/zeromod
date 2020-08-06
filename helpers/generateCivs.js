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

async function interpolateCivTemplates(){

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

//    console.log(civinfo)
    if (typeof(civinfo.culture.music) === "string" || typeof(civinfo.culture.music[0]) === "string" ) {
        civ["Music"] = classes['music'][civinfo.culture.music]
    }
    civ["Factions"] = classes['factions'][civinfo.factions]

    console.log(civ["Factions"])


    for (let i = 0; i < civ["Factions"].length; i++){
        const faction = civ["Factions"][i]
        for (let j = 0; j < faction["Heroes"].length; j++){
            const hero = faction["Heroes"][j]
            getWikiData(hero["Name"]).then( async (res) => {
                var deathDate = await res.info('deathDate')
                var summary = await res.summary()

                console.log(summary)
                if(deathDate){
                    let dateRegex = /.*(\b[0-9]{1,4}\s*BC).*/g
                    deathDate = deathDate.replace(dateRegex,`$1`)
                    console.log(`death date is ${deathDate} (found in infobox)`)
                }
                else {
                    const dateStringRegex = /\(.*[0-9]{1,4}\s*BC.*\)/;
                    const dateString = summary.match(dateStringRegex)[0];
                    const datesRegex = /[0-9]{1,4}\s*BC/g
                    const dates = dateString.match(datesRegex)
                    deathDate = dates[ dates.length - 1 ]


                    console.log(`death date is ${deathDate} (found in summary)`)
                }
            })

        }
    }
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
        obj[basename] = parse(entry.fullPath)
    }
    return obj
}
//culturalCategories.
async function generateCivs(){
    const culturalClassesPath = path.join(process.cwd(),"simulation/data/civs/cultural_classes")
    const civinfo = parse(path.join(process.cwd(),'simulation/data/civs/hellenic/athenians.yml'))
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
    console.log(writeDir)

    console.log(civ)
    console.log(config)
    */
}
//civinfo = createCivObject(civinfo)

//console.log(civinfo)


module.exports = generateCivs
