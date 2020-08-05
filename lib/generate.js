const fs = require('fs')
const changeCase = require('change-case')
const parse = require('../helpers/parse')

function generate(){
  console.log('generating...')
  console.log('detected config')
  const config = parse(path.join(process.cwd(),'config.yml'))
  console.log(config)

}
module.exports = generate
