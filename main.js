#!/usr/bin/env node

const path = require('path')
const createProgram = require('@mithray/fcli')

var program = createProgram(path.join(__dirname,'commands.yml'))
program.parse(process.argv)
