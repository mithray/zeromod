const safeEval = require('safe-eval')
const YAML = require('yaml')
const fs = require('fs')
const path = require('path')
const parser = require('fast-xml-parser')

function getData(filesPath){
  var data = []
  var fileList = getFileList(filesPath)
    fileList.forEach( (item, index) => {
        let obj = {}
        obj["name"] = item
        obj["data"] = readFile(path.join(filesPath,item))
        data[index] = obj
    })
  return data
}
function getFileList(filesPath){
    let fileList = fs.readdirSync(filesPath)
    fileList = fileList.filter((name)=>name.endsWith(".xml"))
    return fileList
}

function readFile(filePath){

    var res
    var newLine2Array = function(val, parent) {
        val = val.trim()
        if(val.includes('\n')){
            val = val.split("\n")
            val = val.map(s => s.trim());
        }
        return val
    }
    var data = fs.readFileSync(filePath,{ encoding: 'utf-8' })
    if (filePath.endsWith('.xml')){
        let options = { tagValueProcessor:  newLine2Array}
        let tObj = parser.getTraversalObj(data,options)
        let json = parser.convertToJson(tObj,{})
        res = json
    }
    if (filePath.endsWith('.yml')){
        res = YAML.parse(res)
    }
    /*
    */
    return res
}


module.exports = getData
