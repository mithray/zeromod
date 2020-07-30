const parser = require('fast-xml-parser')
const yaml = require('yaml')
const fs = require('fs')
const path = require('path')

const inquirer = require('inquirer')
const packageJson = require('./package.json')
const commands = require('./cli_command_heirarchy.js')

//program.version(packageJson.version)
const program = require('commander').program

console.log(commands)

function buildCommandHeirarchy(){
  commands.forEach( (command) => {
    program
      .command(command.command)
    program
      .description(command.description)

    if ( typeof command.action === 'string'){
      program
      .action(command.action)
    } elseif ( typeof command.action === 'object'){

    }
  })
}
program.parse(process.argv)
