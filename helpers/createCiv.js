const parse = require('./parse.js')
const templatePath = './config/civs/schema_civilization.yml'
const path = require('path')
const createMenu = require('./createMenu.js')
const getOptions = require('./getOptions.js')

async function createCiv(name){
    const template = parse(path.join(process.cwd(),templatePath))
    const answers = await createMenu(template)
//    console.log(answers)
//    const selection = answers.property
//    const options = await getOptions(selection)
//    createMenu(options)
}

module.exports = createCiv

createCiv('saka')
