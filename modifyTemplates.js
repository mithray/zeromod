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
    classes = classes.concat(
      obj.path
        .replace(/\//,'_')
        .replace(/Structures/,'structure')
        .replace(/structures/,'structure')
        .replace(/Units/,'unit')
        .replace(/units/,'unit')
        .split('_'))     //.Entity.Identity.VisibleClasses['#text'].split(' ')
  } catch {}
  try{
    classes = classes.concat(
      obj.Entity.Identity.VisibleClasses.__text
      .replace(/-\w*/g,'')
//      .replace(/\s*/g,' ')
//      .replace(/,,/g,',')
      .split(' '))     //.Entity.Identity.VisibleClasses['#text'].split(' ')
//console.log(classes)
  } catch {}
  try{
    classes = classes.concat(obj.Entity.Identity.Classes.__text.split(' '))     //.Entity.Identity.VisibleClasses['#text'].split(' ')
  } catch {}

  classes = classes.map((el)=>{
    return changeCase.pascalCase(el)
  })
  try{
    if(obj.Entity.Identity.Classes){
//      console.log(obj.Entity)
    }
  } 
  catch {}
  if (classes.length > 0 && classes.includes('Farmstead')){
//    console.log(classes)
  }
//console.log(classes)
  classes =  classes.filter(e =>  e)

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
        modData[j].classes = entityClasses


        if(includes){
          modData[j].modified = true
//          modData[j] = merge(modify[i],modData[j])
          modData[j] = merge(modData[j],modify[i])
          if (entityClasses.includes('Farmstead')){
  console.log(c.green(requiredClasses))
console.log(modify[i])
console.log(modify[i].Entity.BuildRestrictions)
  console.log(c.red(entityClasses))
console.log(modData[j])

          }
/*
*/
        }
      }
    }
    else if(modify[i].name){
      const name = modify[i].name
      var matched = false
      for(let j = 0 ; j < modData.length; j++){
//console.log(c.red(modify[i].name))
        if(modData[j].path === modify[i].name){
          if(modify[i].name === 'aeou template_structure_civic_civil_centre'){
console.log(c.green(modData[j].path))
console.log(c.blue(JSON.stringify(modify[i].Entity.ProductionQueue,null,2)))
console.log(c.red(JSON.stringify(modData[j].Entity.ProductionQueue,null,2)))

          }
          modData[j].Entity = merge(modData[j].Entity,modify[i].Entity)
//          modData[j].Entity = merge(modify[i].Entity,modData[j].Entity)
//            console.log(modData[j].Entity)
          modData[j].modified = true
//        console.log('modified Entity:\n')
//        console.log(YAML.parse(modData[j].Entity))
//        console.log(modData[j].Entity)
          matched = true
        } 
      } 
//const mergeOptions = { arrayMerge: overwriteMerge }
      if (!matched) {
//console.log(c.bold.red('----------not matched-------------'))
        const newEntity = {}
        newEntity.Entity = modify[i].Entity
        newEntity.path = modify[i].name
        newEntity.modified = true
        newEntity.classes = getClasses(newEntity.Entity)
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
    const writePath=path.join(process.cwd(),'dist/ars_bellica/simulation/templates/', modData[i].path + '.xml')
      delete modData[i].classes
      delete modData[i].path
      delete modData[i].modified
      var xml = pretty(x2js.json2xml_str( modData[i] ))
      xml = '<?xml version="1.0" encoding="utf-8"?>\n'+xml
/*
      xmlTemplates.push(xml)
      console.log(c.bold.green(message))
      console.log(xml)
*/
    console.log(writePath)
    fs.writeFileSync(writePath,xml)
    }
  //  var xml = pretty(x2js.json2xml_str( modData[0] ))
//    xml = '<?xml version="1.0" encoding="utf-8"?>\n'+xml
//console.log('--------'+xml)

  }
//console.log(xmlTemplates.length)
}

generateTemplates()
