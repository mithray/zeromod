const fs = require('fs')
var pretty = require('pretty')
const path = require('path')
const buildObjectFromPath = require('./helpers/buildObjectFromPath.js') 
const interpolate = require('./helpers/interpolate.js')
const changeCase = require('change-case')
const snake = changeCase.snakeCase
const pascal = changeCase.pascal
const camel = changeCase.camel
const merge = require('deepmerge')
const truePhase = true
var config = {}

function buildUnitTree(structureTree){
  const buildTree = {}
//console.log('structureTree')
//console.log(structureTree)
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
              RequiredXp: Math.round(10000 * (i+1)),
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

  //console.log(templates)
      } else {
        var template = ccTemplate
        template.Entity.Identity.GenericName = "Civil Centre"
        templates.push(template)
      }

      const X2JS = require('./x2js.js')
      var x2js = new X2JS()
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
console.log(aura)
console.log(fileName)
      json = JSON.stringify(aura, null, 2)
      fs.writeFileSync(path.join(process.cwd(), 'dist/ars_bellica/simulation/data/auras/structures/',fileName+'.json'),json)
    }
  }
}

createCivilCentres()
