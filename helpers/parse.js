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

function parse(inputPath){
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

    return jsobj
}

module.exports = parse
