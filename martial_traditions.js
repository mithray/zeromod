const changeCase = require("change-case")
var weapon = {}
weapon.name = "sword"
weapon.type = "melee"
weapon.genericName = changeCase.capitalCase(weapon.name) + ' ' + "Tradition"

var damage_multiplier
if (weapon.type.toLowerCase() === "ranged"){
    damage_multiplier = 1.05
} else {
    damage_multiplier = 1.1
}
var repeattime_multiplier = .95
var cost_multiplier = 0.90
var range_multiplier = 1.1
var spread_multiplier = 0.9

var template = `---
genericName: ${weapon.genericName}
autoResearch: true
description: ${weapon.genericName}
icon: ${weapon.name}.png
tooltip: ${weapon.genericName}
affects: ${weapon.name}
modifications:
- value: Attack/${changeCase.capitalCase(weapon.type)}/Damage/Hack
  multiply: ${damage_multiplier}
- value: Attack/${changeCase.capitalCase(weapon.type)}/Damage/Pierce
  multiply: ${damage_multiplier}
- value: Attack/${changeCase.capitalCase(weapon.type)}/Damage/Crush
  multiply: ${damage_multiplier}
- value: Attack/${changeCase.capitalCase(weapon.type)}/RepeatTime
  multiply: ${repeattime_multiplier}
- value: Cost/Resources/food
  multiply: ${cost_multiplier}
- value: Cost/Resources/wood
  multiply: ${cost_multiplier}
- value: Cost/Resources/stone
  multiply: ${cost_multiplier}
- value: Cost/Resources/metal
  multiply: ${cost_multiplier}`

if ( changeCase.noCase(weapon.type) === "ranged") {
  template +=`
- value: Attack/${changeCase.capitalCase(weapon.type)}/Spread
  multiply: ${spread_multiplier}
- value: Attack/${changeCase.capitalCase(weapon.type)}/MaxRange
  multiply: ${range_multiplier}`
}

console.log(template)
