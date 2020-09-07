const path = require('path')
const nestedProperty = require('nested-property')
const readdirp = require('readdirp')
const fs = require('fs')
const YAML = require('yaml')
const changeCase = require('change-case')
      const X2JS = require('../x2js.js')
      const x2js = new X2JS()
var parser = require('fast-xml-parser');
var options = {
    attributeNamePrefix : "_",
    attrNodeName: false, //default is 'false'
    textNodeName : "__text",
    ignoreAttributes : false,
    ignoreNameSpace : false,
    allowBooleanAttributes : false,
    parseNodeValue : true,
    parseAttributeValue : false,
    trimValues: true,
    cdataTagName: "__cdata", //default is 'false'
    cdataPositionChar: "\\c",
    parseTrueNumberOnly: false,
    arrayMode: false, //"strict"
};
/*
function newLine2Array (val, parent) {
    val = val.trim()
    if(val.includes('\n')){
      val = val.split("\n")
      val = val.map(s => s.trim());
    }

    return val
}
*/

async function readFile(inputPath){
  var obj
  var data

  try {
    data = fs.readFileSync(inputPath,{encoding: 'utf-8'}).trim()
  } catch (e) {
    console.log(e)
  }
  if (inputPath.endsWith('.json')){
    obj = JSON.parse(data)
  }
  if (inputPath.endsWith('.xml')){
    //obj = x2js.xml2json(data)
//    options = {}
    var tObj = parser.getTraversalObj(data,options);
    var obj = parser.convertToJson(tObj,options);
  }
  if (inputPath.endsWith('.yml')){
    obj = YAML.parse(data)
  } 
  return obj
}

function setNestedProperty( obj, names, data ) {
    for( var i = 0; i < names.length; i++ ) {
        obj= obj[ names[i] ] = obj[ names[i] ] || {};
    }
};

async function buildObjectFromPath(inputPath, options={}){

  const toRead = []
  var commonPrefix

  var files
  if (fs.statSync(inputPath).isFile()){
    files = [{
      fullPath: path.resolve(inputPath)
    }]
  } else {
    for await (const entry of readdirp(inputPath)){
      toRead.push(entry)
    }
    files = await readdirp.promise(inputPath)
  }
//console.log(files)

  for (let i = 0; i < files.length; i++){
    const entry = files[i]
    //toRead.push(entry)
    const fullPath = entry.fullPath
    const basename = entry.basename
    const index = fullPath.indexOf(basename)
    const dir = fullPath.substring(0,index)
    if (!commonPrefix) commonPrefix = dir
    else if(dir.length < commonPrefix.length){
      commonPrefix = dir
    }
  }

  const obj = {}
  const arr = []
  commonPrefix = commonPrefix.replace(/(.*)\/.*/,'$1')
  for (let i = 0; i < files.length; i++ ){
    const entry = files[i]
    const fullPath = entry.fullPath
    const relPath = fullPath
      .replace(commonPrefix,'')
      .replace(/^\//,'') 
      .replace(/.yml$/,'')
      .replace(/.xml$/,'')
      .replace(/.json$/,'')
    var heirarchy = relPath.split('/') 
    heirarchy = heirarchy.map((el) => {
      return changeCase.snakeCase(el)
    })
//console.log(heirarchy)
    heirarchy = heirarchy.join('.')
    const data = await readFile(fullPath)
    try{
      data.classes = changeCase.snakeCase(heirarchy).split('_').filter((el)=>{return el != 'template'})
    } catch{}

    if (options.array){
       data.path=heirarchy
       arr.push(data) 
    } else {
      nestedProperty.set(obj,heirarchy, data)
    }
  }
//  console.log(obj.var.lib.transmission_daemon.downloads['0ad'].binaries.data.mods.public.simulation.templates)
//console.log(obj.template_structure_economic)
    if (options.array){
      
      return arr
    }

  return obj
}

//buildObjectFromPath(path.join(process.cwd(),'config/'))

module.exports = buildObjectFromPath
