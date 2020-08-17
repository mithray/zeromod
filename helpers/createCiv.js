const parse = require('./parse.js')
const schemaPath = './config/civs/schema_civilization.yml'
const path = require('path')
const createMenu = require('./createMenu.js')
const getConfig = require('./getConfig.js')
const safeEval = require('safe-eval')
//const getConfig = require('./getConfig.js')

/*
function interpolate(match, p1 ){
  var context = {
    civ: civinfo
  }

  const evaled = safeEval(p1, {schema})

  return evaled


}
*/
async function createCiv(name){

    const schema = parse(path.join(process.cwd(), schemaPath))
    const config = await getConfig()

    const tmp = JSON.stringify(schema).replace(/\"\$\{(.*?)\}\"/g, function (match, p1){
        function getOptions(property){
            const civs = config
            const options = []
            for ( let i = 0; i < civs.length; i ++ ){
                const civ = civs[i]
                if (civ[property]){
                    options.push(civ[property])
                }
            }
            return options
        }
        const evaled = safeEval(p1,{getOptions: getOptions})
        const json = JSON.stringify(evaled)
        return json
    })
    const questions = JSON.parse(tmp)

 const answers = await createMenu(questions)
//    console.log(tmp)

}
//    console.log(answers)
//    const selection = answers.property
//    const options = await getOptions(selection)
//    createMenu(options)

module.exports = createCiv

createCiv('saka')
