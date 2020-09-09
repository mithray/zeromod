const fs = require('fs')
var pretty = require('pretty')
//const getModData = require("./helpers/getModData.js")
//var pretty = require('pretty')
const path = require('path')
const buildObjectFromPath = require('./helpers/buildObjectFromPath.js') 
const interpolate = require('./helpers/interpolate.js')
const changeCase = require('change-case')
const merge = require('deepmerge')
const YAML = require('yaml')
const X2JS = require('./x2js.js')
const x2js = new X2JS()
const c = require('ansi-colors')

function getClasses(obj){

  var classes = []

  try{
    classes = classes.concat(obj.path.split('_'))     //.Entity.Identity.VisibleClasses['#text'].split(' ')
  } catch {}
  try{
    classes = classes.concat(obj.Entity.Identity.VisibleClasses.split(' '))     //.Entity.Identity.VisibleClasses['#text'].split(' ')
  } catch {}
  try{
    classes = classes.concat(obj.Entity.Identity.Classes.split(' '))     //.Entity.Identity.VisibleClasses['#text'].split(' ')
  } catch {}

  classes = classes.map((el)=>{
    return changeCase.pascalCase(el)
  })

  if (classes.length > 0){
  //  console.log(classes)
  }
  return classes
}

function xArrIncludesYArr(x, y){
/*
console.log('includes test called')
console.log('x')
console.log(x)
console.log('y')
console.log(y)
console.log('/includes test called')
*/
  if(x.length > 0){
//console.log(x)
  }
  var includes = true
  for (let i = 0; i < y.length; i++){
    includes = x.includes(y[i])
    if (!includes) return false
  }
  return includes
}
 
function lowercaseKeys(obj){
  var key, keys = Object.keys(obj);
  var n = keys.length;
  var newObj={}
  while (n--) {
    key = keys[n];
    newObj[key.toLowerCase()] = obj[key];
  }
  return newObj
}

async function generateTemplates(){
  const config = await buildObjectFromPath(path.join(process.cwd(),'./config'))
//console.log(config)
  var templatePath = path.join(process.env.zero_ad_mod_path_1,'public/simulation/templates')
  var civsPath = path.join(process.env.zero_ad_mod_path_1,'public/simulation/data/civs')
  const modData = await buildObjectFromPath(templatePath,{array: true})
  const civsData = await buildObjectFromPath(civsPath)
  const modify = config.modify
  config.activeMod = config.ars_bellica

/*
 * Expand Interpolated Values
 */
  const activeCivs = config.activeMod.civilizations
  for ( let j = 0; j < modify.length; j++ ){
    var obj = modify[j]
    var json = JSON.stringify(obj,null, 2)
    if(json.match(/\$\{.*\}/)){
      for(let k = 0; k < activeCivs.length; k++){
        const lowercaseCiv=lowercaseKeys(civsData[activeCivs[k]])
        config.civ=lowercaseCiv
        const interped = interpolate(obj, config)
        modify.push(interped)
      }
      modify.splice(j,1)
      j--
    }
  }
//console.log(modData)
  for ( let i = 0; i < modify.length; i++ ){
    if(modify[i].classes){
  //    console.log('classes')
    //  console.log(modify[i])
      var requiredClasses = modify[i].classes.split(' ')
      for(let j = 0 ; j < modData.length; j++){
        var entityClasses = getClasses(modData[j])
        var includes = xArrIncludesYArr(entityClasses, requiredClasses)

        if(includes){
console.log('includes')
          modData[j].modified = true
          modData[j] = merge(modify[i].Entity,modData[j])
        }
      }
    }
    else if(modify[i].name){
      const name = modify[i].name
      var matched = false
      for(let j = 0 ; j < modData.length; j++){
        if(modData[j].path === modify[i].name){
          modData[j].Entity = merge(modify[i].Entity, modData[j].Entity)
          modData[j].modified = true
//        console.log('modified Entity:\n')
//        console.log(YAML.parse(modData[j].Entity))
//        console.log(modData[j].Entity)
          matched = true
        }
      } 
//const mergeOptions = { arrayMerge: overwriteMerge }
      if (!matched) {
        const newEntity = modify[i].Entity
        modData.push(newEntity)
      //  console.log('newEntity:\n'+JSON.stringify(newEntity,null,2))

      }
    }
  }
var xmlTemplates = []
  for ( let i = 0 ; i< modData.length; i++ ){
    if (modData[i].modified){
      message=`_____________________________________________________________________________
${modData[i].path}
${modData[i].classes}
_____________________________________________________________________________`
      delete modData[i].classes
      delete modData[i].path
      delete modData[i].modified
      var xml = pretty(x2js.json2xml_str( modData[i] ))
      xml = '<?xml version="1.0" encoding="utf-8"?>\n'+xml
      xmlTemplates.push(xml)
/*
      console.log(c.bold.green(message))
      console.log(xml)
*/
    }
  //  var xml = pretty(x2js.json2xml_str( modData[0] ))
//    xml = '<?xml version="1.0" encoding="utf-8"?>\n'+xml
//console.log('--------'+xml)
   // fs.writeFileSync(path.join(process.cwd(),'dist/ars_bellica/simulation/templates/structures/',fileName +'.xml'),xml)

  }
//console.log(xmlTemplates.length)
}

generateTemplates()
