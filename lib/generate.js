const fs = require('fs')
const changeCase = require('change-case')
const parse = require('../helpers/parse')
const generateCivs = require('../helpers/generateCivs.js')
const path = require('path')

function generate(){
  console.log('generating...')
  console.log('detected config')
  const config = parse(path.join(process.cwd(),'config.yml'))
    generateCivs()
//  console.log(config)

}
module.exports = generate
