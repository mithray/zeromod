var inquirer = require('inquirer')

async function createMenu(questions){
    /*
    var keys
    if (Array.isArray(obj)){
      keys = obj
    } else {
      keys = Object.keys(obj)
    }
//    const questions=[]
    question = {
        type: 'list',
        name: 'property',
        message: 'select property',
        choices: keys,
        pageSize: 50
    }
  //  questions.push(question)
    const questions = obj
    console.log(questions)
    */

  const answers = inquirer
    .prompt(
        questions

    )
  .then(answers => {
      return answers
    })
    .catch(error => {
      if(error.isTtyError) {
      } else {
      }
  })
    return answers
}


module.exports = createMenu
