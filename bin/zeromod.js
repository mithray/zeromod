#!/usr/bin/env node

const path = require('path')
const createProgram = require('@mithray/fcli')

var commands = path.join(process.cwd(),'commands.yml')

var program = createProgram(commands)
program.parse(process.argv)
