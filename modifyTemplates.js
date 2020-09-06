const fs = require('fs')
//const getModData = require("./helpers/getModData.js")
//var pretty = require('pretty')
const path = require('path')
const buildObjectFromPath = require('./helpers/buildObjectFromPath.js') 
//const interpolate = require('./helpers/interpolate.js')
const changeCase = require('change-case')
const merge = require('deepmerge')
//const X2JS = require('./x2js.js')
//const x2js = new X2JS()
        

async function generateTemplates(){
  const config = await buildObjectFromPath(path.join(process.cwd(),'./config'))
  templatePath = path.join(process.env.zero_ad_mod_path_1,'public/simulation/templates')
  const modData = await buildObjectFromPath(templatePath)
  const modify = config.modify
  config.active_mod = config.ars_bellica
  for ( let i = 0; i < modify.length; i++ ){
    if(modify[i].name){
      const name = modify[i].name
      modData[name] = merge(modify[i].Entity, modData[name])
    }
  }
}

generateTemplates()
