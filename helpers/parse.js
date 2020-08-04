const fs = require('fs')
const YAML = require('yaml')

function parse(inputPath){
    const data = fs.readFileSync(inputPath,{encoding: 'utf-8'})
    const jsobj = YAML.parse(data)
    return jsobj
}

module.exports = parse
