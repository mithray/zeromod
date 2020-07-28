
const parser = require('fast-xml-parser');
const yaml = require('yaml')
const fs = require('fs')
const path = require('path')
const template_path =  "simulation/templates"

        /*
fs.readdir(template_path,(err,res) => {
    for (var i = 0; i < res.length; i++) {
        var filename=res[i]
        if
        if (filename.endsWith(".xml") && filename.startsWith("template_unit")){
            console.log(`reading file ${filename}`)
            readFile(`${template_path}/${filename}`)
        }
    }

})
        */

var file_path = `${template_path}/units/infantry/melee_spearman.yml`

var filePath = file_path;

function readFile(filePath){
    fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
        if (!err) {
            var newLine2Array = function(val, parent) {
    //            val = val.replace(/ /g,'')
                val = val.trim()
                if(val.includes('\n')){
                    val = val.split("\n")
                    val = val.map(s => s.trim());
//                    val = val.trim()
                }
                return val
            }
            var array2NewLine = function(val, elementName, currentElementObject) {
                return val
            }
            var options1 = { compact: true, textFn: newLine2Array, nativeType: true, ignoreDeclaration: true, ignoreText: false}
