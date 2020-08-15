const fs = require('fs')
const changeCase = require('change-case')
const parse = require('../helpers/parse')
const generateCivs = require('../helpers/generateCivs.js')
const path = require('path')

function generate(arg){
// console.log(Object.keys(arg))
  console.log('generating...')
//  console.log('detected config')
//    console.log(process.argv)
 const configPath = path.join(process.cwd(),arg.parent.config)
 //  const configPath = parse(path.join(process.cwd(),program.config))
    generateCivs(configPath)
//  console.log(config)

}
module.exports = generate
