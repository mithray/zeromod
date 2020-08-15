var inquirer = require('inquirer')

async function createMenu(obj){
    var keys
    if (Array.isArray(obj)){
      keys = obj
    } else {
      keys = Object.keys(obj)
    }
    const questions=[]
    question = {
        type: 'list',
        name: 'property',
        message: 'select property',
        choices: keys,
        pageSize: 50
    }
    questions.push(question)

  const answers = inquirer
    .prompt(
    /* Pass your questions in here */
        questions

    )
  .then(answers => {
    // Use user feedback for... whatever!!
//       console.log(answers)
      return answers
    })
    .catch(error => {
      if(error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
      } else {
      // Something else when wrong
      }
  })
    return answers
}


module.exports = createMenu
