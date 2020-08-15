const parse = require('./parse.js')
const templatePath = './config/civs/template.yml'
const path = require('path')
const createMenu = require('./createMenu.js')
const getCivCodes = require('./getCivCodes.js')

async function createCiv(name){
    const template = parse(path.join(process.cwd(),templatePath))
    const answers = await createMenu(template)
    const selection = answers.property
    switch (selection){
        case 'code':
          const civCodes = await getCivCodes()
          createMenu(civCodes)
          break
        default:
    }

}

module.exports = createCiv

createCiv('saka')
