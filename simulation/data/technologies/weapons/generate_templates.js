const weapons = {
    sword: {
        name: "Sword",
        cost: {
            food: 10,
            wood: 0,
            stone: 0,
            metal: 40
        }
    },
    spear: {
        name: "Spear"
        cost: {
            food: 0,
            wood: 45,
            stone: 0,
            metal: 5
        }
    },
    bow: {
        name: "Bow"
        cost: {
            food: 0,
            wood: 40,
            stone: 0,
            metal: 10
        }
    },
    javelin: {
        name: "Javelin"
        cost: {
            food: 0,
            wood: 40,
            stone: 0,
            metal: 10
        }
    },
    sling: {
        name: "Sling"
        cost: {
            food: 10,
            wood: 0,
            stone: 10,
            metal: 10
        }
    },
    Axe: {
        name: "Axe"
        cost: {
            food: 0,
            wood: 20,
            stone: 0,
            metal: 20
        }
    }
    club: {
        name: "Club"
        cost: {
            food: 0,
            wood: 25,
            stone: 0,
            metal: 0
        }
    }
}
var template = `---
genericName: ${weapon_name} Making 1
specificName:
  mace: ${weapon_name}
  spart: ${weapon_name}
  athen: ${weapon_name}
  sele: ${weapon_name}
  ptol: ${weapon_name}
description: ${description}
cost:
  food: ${cost.food}
  wood: ${cost.wood}
  stone: ${cost.stone}
  metal: ${cost.metal}
requirements:
  tech: phase_${phase.charAt(0).toLowerCase()}
requirementsTooltip: Unlocked in ${phase.charAt(0).toUpperCase()} Phase.
icon: ${weapon_name.toLowerCase()}.png
researchTime: ${weapon_level}
tooltip: ${description}
modifications:
- value: Attack/Ranged/Hack
  multiply: ${multiplier.damage.hack}
- value: Attack/Ranged/Pierce
  multiply: ${multiplier.damage.pierce}
- value: Attack/Ranged/Crush
  multiply: ${multiplier.damage.crush}
- value: UnitMotion/WalkSpeed
  multiply: ${multiplier.unitmotion.walk}
- value: UnitMotion/RunSpeed
  multiply: ${multiplier.unitmotion.run}
- value: Loot/wood
  mutliply: ${multiplier.loot.wood}
affects:
- Bow
soundComplete: interface/alarm/alarm_upgradearmory.xml`
