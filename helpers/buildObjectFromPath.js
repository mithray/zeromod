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
    var jsobj
    var data
    try {
        data = fs.readFileSync(inputPath,{encoding: 'utf-8'}).trim()
    } catch (e){
        console.log(e)
    }

    if (inputPath.endsWith('.json')){
           jsobj = JSON.parse(data)
       try{
        } catch(e) {
            console.log(e)
        }
    }
    if (inputPath.endsWith('.xml')){
        let options = { tagValueProcessor:  newLine2Array}
        let tObj = parser.getTraversalObj(data,options)
        jsobj = parser.convertToJson(tObj,{})
    }
    if (inputPath.endsWith('.yml')){
        jsobj = YAML.parse(data)
    }

  return jsObj
}

function createNestedObject( base, names ) {
    for( var i = 0; i < names.length; i++ ) {
        base = base[ names[i] ] = base[ names[i] ] || {};
    }
};

async function buildObjectFromPath(inputPath){


  console.log(inputPath)
  const data = {}
  const toRead = []
  var commonPrefix

  for await (const entry of readdirp(inputPath)){
    toRead.push(entry)
  }

  readdirp(inputPath)

    .on('data', (entry) => {
      const fullPath = entry.fullPath
      if (!commonPrefix) commonPrefix = fullPath
      else if(fullPath.length < commonPrefix.length){
        commonPrefix = fullPath
      }
      toRead.push(entry)
    })

    .on('end', () => {
      const jsobj = {}
      commonPrefix = commonPrefix.replace(/(.*)\/.*/,'$1')
      for (let i = 1; i < toRead.length; i++ ){
        const fileObj = toRead[i]
        const relPath = fileObj.fullPath
          .replace(commonPrefix,'')
          .replace(/^\//,'') 
          .replace(/.yml$/,'')
        var heirarchy = relPath.split('/')
        createNestedObject( jsobj, heirarchy );
      }
      console.log(jsobj)
    })

/*
  var commonPrefix = toRead[0].fullPath//initialize
    const entry = toRead[i]
    if ( entry.fullPath.length < commonPrefix.length ){
      commonPrefix = entry.fullPath
console.log(commonPrefix)  
    }
  }

    let basename = entry.basename.replace(/.yml$/,'')
    const fullPath = entry.fullPath
    data[basename] = readFile(fullPath)
    console.log(data[basename])
    data[basename].fullPath = fullPath
  */

//  return data
}
buildObjectFromPath(path.join(process.cwd(),'config'))

module.exports = buildObjectFromPath
