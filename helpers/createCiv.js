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
    function removeDuplicates(arr){
        let uniqueArr = arr.filter((obj, index, arr) => {
              return arr.map(mapObj => mapObj.name).indexOf(obj.name) === index;
        })
            //console.log(uniqueArr)
        return uniqueArr
    }

    const schema = parse(path.join(process.cwd(), schemaPath))
    const config = await getConfig()
    function getOptions(...properties){
        const civs = config
        const options = []
        for ( let i = 0; i < civs.length; i ++ ){
            const civ = civs[i]
            for (let j = 0; j < properties.length; j++){
                const property = properties[j]
                if (civ[property]){
                    options.push({name: civ[property]})
                }
            }
        }
        const uniqueOptions = removeDuplicates(options)
        return uniqueOptions
    }

    let questions = JSON.stringify(schema).replace(/\"\$\{(.*?)\}\"/g, function (match, p1){
        const evaled = safeEval(p1,{getOptions: getOptions})
        const json = JSON.stringify(evaled)
        return json
    })

    function setOptions(questions){
        function getDefault(answers){
            return answers.culture
        }
        function getChoices(answers){
            const choices = removeDuplicates(getOptions('culture'))

            for(let i = 0; i < choices.length; i++){
                if(answers.culture === choices[i].name){
                    choices[i] = {
                        name: choices[i].name,
                        checked: true
                    }
                }
            }
            return choices
        }
        for(let i = 0; i < questions.length; i++){
            const question = questions[i]
            if(question.type === "checkbox"){
                questions[i].default = getDefault
                questions[i].choices = getChoices
            }
            if(question.type === "list"){
                questions[i].default = getDefault
                questions[i].choices = getChoices
            }
        }
        return questions
    }
    function setPageSize(questions){
        for(let i = 0; i < questions.length; i++){
            const question = questions[i]
            if(question.type === "checkbox" || question.type === "list"){
                questions[i].pageSize = 40
            }
        }
        return questions
    }
    questions = JSON.parse(questions)
    questions = setOptions(questions)
    questions = setPageSize(questions)

 const answers = await createMenu(questions)
//    console.log(tmp)
    console.log(answers)

}
//    const selection = answers.property
//    const options = await getOptions(selection)
//    createMenu(options)

module.exports = createCiv

createCiv('saka')
