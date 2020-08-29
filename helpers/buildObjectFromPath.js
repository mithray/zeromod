const path = require('path')
const readdirp = require('readdirp')
const fs = require('fs')
const YAML = require('yaml')
const changeCase = require('change-case')

function newLine2Array (val, parent) {
    val = val.trim()
    if(val.includes('\n')){
        val = val.split("\n")
        val = val.map(s => s.trim());
    }

    return val
}

async function readFile(inputPath){
    var obj
    var data
    try {
        data = fs.readFileSync(inputPath,{encoding: 'utf-8'}).trim()
    } catch (e){
        console.log(e)
    }

    if (inputPath.endsWith('.json')){
           obj = JSON.parse(data)
       try{
        } catch(e) {
            console.log(e)
        }
    }
    if (inputPath.endsWith('.xml')){
        let options = { tagValueProcessor:  newLine2Array}
        let tObj = parser.getTraversalObj(data,options)
        obj = parser.convertToJson(tObj,{})
    }
    if (inputPath.endsWith('.yml')){
        obj = YAML.parse(data)
    }

  return obj
}

function setNestedProperty( obj, names, data ) {
    for( var i = 0; i < names.length; i++ ) {
        obj= obj[ names[i] ] = obj[ names[i] ] || data;
    }
};

async function buildObjectFromPath(inputPath){

  const toRead = []
  var commonPrefix

  for await (const entry of readdirp(inputPath)){
    toRead.push(entry)
  }

  const files = await readdirp.promise(inputPath)

  for (let i = 0; i < files.length; i++){
    const entry = files[i]
    //toRead.push(entry)
    const fullPath = entry.fullPath
    if (!commonPrefix) commonPrefix = fullPath
    else if(fullPath.length < commonPrefix.length){
      commonPrefix = fullPath
    }
  }

  const obj = {}
  commonPrefix = commonPrefix.replace(/(.*)\/.*/,'$1')
  for (let i = 1; i < files.length; i++ ){
    const entry = files[i]
    const fullPath = entry.fullPath
    const relPath = fullPath
      .replace(commonPrefix,'')
      .replace(/^\//,'') 
      .replace(/.yml$/,'')
    var heirarchy = relPath.split('/')
  
    const data = await readFile(fullPath)
    setNestedProperty( obj, heirarchy, data );
  }

  return obj
}

module.exports = buildObjectFromPath
