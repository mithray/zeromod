const safeEval = require('safe-eval')
const YAML = require('yaml')
const fs = require('fs')
const path = require('path')
const templatePath = path.join(__dirname,"simulation/templates")

var file = 'athen_infantry_hoplite.yml'
var filePath = path.join(templatePath,file)
function getData(category, subcategory){
  var data = readYamlFile(path.join(path_classes,`${category}.yml`))
    return data[subcategory]
}

function readYamlFile(filePath){
    var res = fs.readFileSync(filePath,{ encoding: 'utf-8' })
    res = YAML.parse(res)
    return res
}
function interpolate(match, p1 ){
    var civ = civinfo
    var context = {
        civ: civ
    }
    return safeEval(p1,context)

}
async function execute(filePath){
    var obj = await readYamlFile(filePath)
    console.log(JSON.stringify(obj).replace(/\$\{(.*?)\}/g, interpolate))
//    return civ
}

execute(filePath)
