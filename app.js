const convert = require('xml-js')
const format = require('xml-formatter')
const yaml = require('yaml')
const fs = require('fs')
const path = require('path')
const template_path =  "/var/lib/transmission-daemon/downloads/0ad/binaries/data/mods/public/simulation/templates/"

const log = function (err, res, store){
    if (err){
        console.log(err)
        return err
    } else {
        console.log(res)
        return res
    }

}
fs.readdir(template_path,(err,res) => {
    for (var i = 0; i < res.length; i++) {
        var filename=res[i]
        if (filename.endsWith(".xml") && filename.startsWith("template_unit")){
            console.log(`reading file ${filename}`)
            readFile(`${template_path}/${filename}`)
        }
    }

})

var file_path = `${template_path}/units/athen_infantry_spearman_b.xml`

var filePath = file_path;

function readFile(filePath){
    fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
        if (!err) {
            var newLine2Array = function(val) {
                val = val.replace(/ /g,'')
                val = val.trim()
                val = val.split("\n")
                return val
            }
            var array2NewLine = function(val, elementName, currentElementObject) {
                return val
            }
            var options1 = { compact: true, textFn: newLine2Array}
            var options2 = { compact: true, spaces: 2, textFn: array2NewLine}

        var res = convert.xml2js(data,options1)
            console.log(res)
//        var res_yaml = yaml.stringify(res)
//        console.log(res_yaml)
//        console.log(res["Entity"].Builder.Entities._text)
//        var js = yaml.parse(res_yaml)
//        console.log(res_yaml)
//        var json = JSON.stringify(js).trim()
//        console.log(json)
//        var xml = convert.json2xml(json,options2)
//        console.log(xml)
//        console.log(format(xml,    {collapseContent: true, }))
        } else {
            console.log(err)
        }
    });
}
