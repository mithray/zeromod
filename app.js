const parser = require('fast-xml-parser')
const yaml = require('yaml')
const fs = require('fs')
const path = require('path')
const { program } = require('commander')
const inquirer = require('inquirer')

program.version('0.0.1')
program
  .option('-d, --debug', 'output extra debugging')
  .option('-s, --small', 'small pizza size')
  .option('-p, --pizza-type <type>', 'flavour of pizza')

program.parse(process.argv)
