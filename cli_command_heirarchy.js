const cli_command_heirarchy = [
  {
    name: "generate",
    description: "",
    action: 'generate_mod'
  },
  {
    name: "resources",
    description: "",
    action: [
      {
        name: "list",
        description: "list resources",
        action: ""
      }
    ]
  }
]

module.exports = cli_command_heirarchy
