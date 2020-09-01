const fs = require('fs')
const path = require('path')
const buildObjectFromPath = require('./helpers/buildObjectFromPath.js') 
const interpolate = require('./helpers/interpolate.js')
const changeCase = require('change-case')
const merge = require('deepmerge')
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
  const target_civs = [
    "athen",
    "brit",
    "gaul",
"han"
  ]
  const template = ''
  const civs = config.civilizations
  const keys = Object.keys(civs)
  for ( let i = 0; i < keys.length; i ++ ){
      
    const civ = civs[keys[i]]
    if( target_civs.includes(civ.code) ){
      const structureTree = buildStructureTree(civ.build_tree)
      const buildTree = buildUnitTree(structureTree)
      civ.buildTree = buildTree
      const tmp = await buildObjectFromPath(path.join(process.cwd(),'./civil_centre.yml'))
      const ccTemplate = interpolate(tmp.civil_centre, civ)
  //    console.log(buildTree)
//xmlData = convert.json2xml(JSON.stringify(ccTemplate), options);


const X2JS = require('./x2js.js')

var x2js = new X2JS()
var xml = x2js.json2xml_str( ccTemplate )

console.log('<?xml version="1.0" encoding="utf-8"?>\n'+xml)



    }

  }

}

createCivilCentres()
