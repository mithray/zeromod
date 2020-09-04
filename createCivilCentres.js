const fs = require('fs')
const getModData = require("./helpers/getModData.js")
var pretty = require('pretty')
const path = require('path')
const buildObjectFromPath = require('./helpers/buildObjectFromPath.js') 
const interpolate = require('./helpers/interpolate.js')
const changeCase = require('change-case')
const merge = require('deepmerge')
const X2JS = require('./x2js.js')
const x2js = new X2JS()

const truePhase = true
var config = {}

function buildUnitTree(structureTree){
  const buildTree = {}
  delete structureTree.classes
  const keys = Object.keys(structureTree)
  for (let i = 0 ; i < keys.length; i++){
    let phase = keys[i]
    let availableStructures = structureTree[phase]
    for (let j = 0; j < availableStructures.length; j++){
      const structureName = availableStructures[j]
      const structure = config.build_trees.structures[structureName]
      buildTree[structureName]=structure
    }

  }
  return buildTree
}

function buildStructureTree(tree){
  const trees = []

  if (typeof tree === 'string'){
    tree = config.build_trees[tree]
  } 
  if (typeof tree === 'object'){
    if (tree.classes){
      for (let i = 0 ; i < tree.classes.length; i++ ){
        basetree = buildStructureTree(tree.classes[i])
        tree = merge(tree, basetree)
      }
    }    
  }

  return tree

}

async function createCivilCentres(){
  config = await buildObjectFromPath(path.join(process.cwd(),'./config'))
  
  var templates = []
  var modify = await buildObjectFromPath(path.join(__dirname,'./modify.yml')) 
  config.active_mod = config.ars_bellica
  
  const target_civs = [
    "athen",
    "brit",
    "gaul",
"han"
  ]
  const civs = config.civilizations
  const keys = Object.keys(civs)
  for ( let i = 0; i < keys.length; i ++ ){
      
    const civ = civs[keys[i]]
    if( target_civs.includes(civ.code) ){
      const structureTree = buildStructureTree(civ.build_tree)
      civ.build_tree = buildUnitTree(structureTree)
      const tmp = await buildObjectFromPath(path.join(process.cwd(),'./civil_centre.yml'))
      config.civ = civ
      ccTemplate = interpolate(tmp.civil_centre, config)
      ccTemplate.Entity.Identity.Classes = '\n\t\t'+ccTemplate.Entity.Identity.Classes.join('\n\t\t')+'\n'
      ccTemplate.Entity.ProductionQueue.Technologies.__text = '\n\t\t'+ccTemplate.Entity.ProductionQueue.Technologies.__text.replace(/,/g,'\n\t\t')+'\n'
      ccTemplate.Entity.ProductionQueue.Entities.__text = '\n\t\t'+ccTemplate.Entity.ProductionQueue.Entities.__text.toLowerCase().replace(/,/g,'\n\t\t')+'\n'
        const phase_names = config.active_mod.phases.names
      if( config.active_mod.phases.type === 'phase' ){
        for ( let i = 0; i < phase_names.length; i++ ){
          var template = ccTemplate
          if( i+1 < phase_names.length){
            promotion = {
              RequiredXp: Math.round(12000 * (i*2+1)),
              Entity: `structures/${civ.code}_civil_centre_${phase_names[i+1]}`
            } 
          } else {
            promotion = { "_disable": "" }
          }
          if( i > 0 ){
            template = {
              Entity: {
                Identity: {
                  Classes: {
                    _datatype: "tokens",
                    __text: phase_names[i] + "Centre"
                  },
                  VisibleClasses: {
                    _datatype: "tokens",
                    __text: phase_names[i] + "Centre"
                  }
                },
                TerritoryInfluence: {
                  Radius: {
                    _op: "add",
                    __text: 30
                  }, 
                  Weight: {
                    _op: "add",
                    __text: 30
                  }
                }
              }
            }
            template.fileName = civ.code + '_civil_centre_' + phase_names[i]
          } else {
            template.fileName = civ.code + '_civil_centre'
          }
          if(i===1){
            template.Entity._parent = `structures/${civ.code}_civil_centre`
          }
          if(i>1){
            template.Entity._parent = `structures/${civ.code}_civil_centre_${phase_names[i-1]}`
          }
          template.Entity.Auras = {
            _datatype: "tokens",
            __text: "\n\t\tstructures/civil_centre_" + phase_names[i] + "_cs\n\t\tstructures/civil_centre_" + phase_names[i] + "_structure\n\t\t"
          } 
          template.Entity.Identity.GenericName = changeCase.capitalCase(phase_names[i]) + " Centre",
          template.Entity.Promotion = promotion

          templates.push(template)
        }

      } else {
        var template = ccTemplate
        template.Entity.Identity.GenericName = "Civil Centre"
        templates.push(template)
      }

      for( let j = 0 ; j < templates.length; j++ ){
        var fileName = templates[j].fileName
        delete templates[j].fileName
        var xml = pretty(x2js.json2xml_str( templates[j] ))
        xml = '<?xml version="1.0" encoding="utf-8"?>\n'+xml
       fs.writeFileSync(path.join(process.cwd(),'dist/ars_bellica/simulation/templates/structures/',fileName +'.xml'),xml)
      }
    }

  }

  //Write Auras
  const auras = config.auras
  const auraKeys = Object.keys(auras)
  for(let i = 0; i < auraKeys.length; i++){
    const key = auraKeys[i]
    const aura = auras[key]  
    const fileName = key

    if(typeof aura === 'object'){
      json = JSON.stringify(aura, null, 2)
      fs.writeFileSync(path.join(process.cwd(), 'dist/ars_bellica/simulation/data/auras/structures/',fileName+'.json'),json)
    }
  }
  const baseMods = await getModData()

  var filtered = []
  modify = modify.modify
  for ( let i = 0; i < modify.length; i++ ){
    if(modify[i].name){
      const tmp = baseMods.filter(nameMatcher)
      filtered = filtered.concat(tmp)
    }

    if(modify[i].class){
      const tmp = baseMods.filter(classMatcher)
      filtered = filtered.concat(tmp)
    }
    if(modify[i].merge){
      for (let j = 0; j< tmp.length; j++){
        const entity = filtered[j].data.Entity
        const merge_data = modify[i].merge
        filtered[j].data.Entity = merge(entity, merge_data)
      }
    }
  }
  for( let m = 0 ; m < filtered.length; m++ ){
    const data = filtered[m].data
    var xml = pretty(x2js.json2xml_str( data ))
    xml = '<?xml version="1.0" encoding="utf-8"?>\n'+xml
//    console.log(xml)

    const writePath = path.join(__dirname, 'dist/ars_bellica/', filtered[m].modRelativePath)
    fs.writeFileSync(writePath,xml)
  }

}

createCivilCentres()




function nameFilter(el){
        return el.modRelativePath.match(modify[i].name)
}






function filterEntities(el){
        var classes = el.classes
        var visibleClasses 
        try{
          visibleClasses = el.data.Entity.Identity.VisibleClasses['#text'].split(' ')
        } catch {}
        if (visibleClasses) {
          classes = classes.concat(visibleClasses)
        }
        const requiredClasses = modify[i].class.split(' ')
        for (let k=0; k<requiredClasses.length; k++){
          classes = classes.map((el)=>{
            return changeCase.pascalCase(el)
          })
          requiredClases= requiredClasses.map((el)=>{
            return changeCase.pascalCase(el)
          })
          const hasClass = classes.includes(requiredClasses[k])
          if(!hasClass){
            return false
          }
        }
        return true
}
