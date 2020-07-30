#!/usr/bin/env node

// const commander = require('commander'); // (normal include)
const commander = require('commander'); // include commander in git clone of commander repo
const program = new commander.Command();
const commands = require('./cli_command_heirarchy.js')

// Commander supports nested subcommands.
// .command() can add a subcommand with an action handler or an executable.
// .addCommand() adds a prepared command with an action handler.

// Example output:
//
// $ node nestedCommands.js brew tea
// brew tea
// $ node nestedCommands.js heat jug
// heat jug

// Add nested commands using `.command()`.
commands.forEach( command => {
    program
        .command(command.command)
        .description(command.description)
        .action(command.action)
    if (command.subcommands){
        var subcommands = command.subcommands
        subcommands.forEach( subcommand =>{
            program.addCommand(createCommand(subcommand))
        } )
    }
})
/*
    newCommand
        .command(command.command)

const resources =
program.command('resources');

resources
  .command('list', { isDefault: true })
  .description('list res')
  .action(() => {
    console.log('list res');
  });
resources
  .command('add')
  .description('add res')
  .action(() => {
    console.log('add res');
  });
*/
// Add nested commands using `.addCommand().
// The command could be created separately in another module.
function createCommand(command_data){
    const newCommand = new commander.Command(command_data.command)

    console.log(command_data)

//    command_data.forEach( (subcommand) =>{
      newCommand
        .command(command_data.command)
        .description(command_data.description)
        .action(command_data.action)
  //  })
    return newCommand
}
/*
function makeHeatCommand() {
  const heat = new commander.Command('heat');

  heat
    .command('')
    .action(() => {
      console.log('default');
    });
  heat
    .command('jug')
    .action(() => {
      console.log('heat jug');
    });
  heat
    .command('pot')
    .action(() => {
      console.log('heat pot');
    });
  return heat;
}
program.addCommand(makeHeatCommand());
*/

program.parse(process.argv);
