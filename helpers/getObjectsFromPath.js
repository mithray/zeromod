const fs = require('fs')
const YAML = require('yaml')

function newLine2Array (val, parent) {
    val = val.trim()
    if(val.includes('\n')){
        val = val.split("\n")
        val = val.map(s => s.trim());
    }

    return val
}

function readFile(inputPath){
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


}

function getObjectsFromPath(inputPath){

    const data = {}
    for await (const entry of readdirp(readPath)){
        let basename = entry.basename.replace(/.yml$/,'')
        const fullPath = entry.fullPath
        data[basename] = readFile(fullPath)
        console.log(data[basename])
        data[basename].fullPath = fullPath
   //console.log(obj)
    }
    return data


    return jsobj
}

module.exports = getObjectsFromPath
