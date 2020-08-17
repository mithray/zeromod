'use strict';
var inquirer = require('inquirer')




function testFunc(somevar, other){
    console.log(somevar)
    console.log(other)
    return ['a', 'x']

}

inquirer
  .prompt([
    {
      type: 'input',
      message: 'Enter the name of the Civilization.',
      name: 'name'
    },
    {
      type: 'input',
      message: 'Enter a short code to be used as an abbreviation for the Civilization.',
      name: 'code'
    },
    {
      type: 'list',
      message: 'Select the closest culture from the list to use as a default for empty configuration values.',
      name: 'default_culture',
      choices: testFunc
    },
    {
      type: 'checkbox',
      message: 'Select clothing:',
      name: 'clothing',
      choices: [
        {
          name: 'athens',
        },
        {
          name: 'spartans',
        },
        {
          name: 'epirotes',
        },
      ],
    },
  ])
  .then((answers) => {
    console.log(JSON.stringify(answers, null, '  '));
  });
