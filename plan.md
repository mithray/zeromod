## Init
- create heirarchy
- get mod list
- save mod list
- generate folder Heirarchy 
- generate source
 
## Hierarchy

- .config
- .gitignore
- dist
- src
  - .cache
  - public:
    - components
    - technologies
    - auras
    - cheats
    - civilizations
    - resources
    - settings
    - equipment
      - armour
      - shields
      - weapons
    - mounts
      - horses
      - elephants
      - camels
    - damage_types
    - maps
    - config.yml
  - ars_bellica/config.yml
  - delenda_est/config.yml

getListUnits:

getListStructures:

generateCiv:
- units = getListUnits()
- structures = getListStructures()
- generate(units)
- generate(structures)
