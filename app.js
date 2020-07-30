const parser = require('fast-xml-parser')
const yaml = require('yaml')
const fs = require('fs')
const path = require('path')

const inquirer = require('inquirer')
const packageJson = require('./package.json')
const commands = require('./cli_command_heirarchy.js')

//program.version(packageJson.version)
var program = require('commander').program

function buildCommandHeirarchy(program, commands){

  commands.forEach( (command) => {
    program
      .command(command.command)
      .description(command.description)
      .action(command.action)

    if ( command.subcommands) {
      var subprogram = require('commander').program
      subprogram
        .command(command.command)
        .description(command.description)
        .action( (options) => {
          buildCommandHeirarchy(subprogram, command.action)
      })
    }
  })
    program.parse(process.argv)
    return program
}

buildCommandHeirarchy(program, commands)
