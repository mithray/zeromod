const fs = require('fs')
const YAML = require('yaml')

function parse(inputPath){
    var jsobj
    var data = fs.readFileSync(inputPath,{encoding: 'utf-8'})

    var newLine2Array = function(val, parent) {
        val = val.trim()
        if(val.includes('\n')){
            val = val.split("\n")
            val = val.map(s => s.trim());
        }
        return val
    }

    if (inputPath.endsWith('.json')){
        jsobj = JSON.parse(data)
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
