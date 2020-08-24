# Muse


The main goal of this project is to unify content from other mods and to make modding easier and more maintainable through reducing redundancy in Mod configuration. This is done by generating any redundant information in the necessary XML files from a smaller set of more human readable YAML configuration files. With redundancy removed, it's significantly easier to make changes to the game without spending nearly as much time editing XML files. With the time saved in editing XML files, artists and developers can save time in editing and maintaining files, and use that time to improve features and art, and doing historical research. With the game being easier to mod, improvements in one mod can more easily be carried over to other mods without needing to take the entire mod. The improvements will be treated modularly.

Once this project is finished, it should be easy to create a custom mod with different settings from other mods and civilization restrictions, such as including in the released mod only Baltic or Hellenic civilizations, or many other economic settings such as low armor, balancing adjustments etc.


```shell
zeromod generate --input "conf.yml" --ouput "mymod"
```

```shell
zeromod init
zeromod resources list <shields, maps, etc>
zeromod resources add
zeromod resources delete
```

```yaml
name: Greek States
civilizations: 
- hellenic
- germanic
citizen_soldier: true
soldiers_construct_siege: true

loot:
  collect_as: resource # <treasure|resource|loot>
  trade_carts_collect: true
  equipment_ratio: 0.2

defensive_structures:
  houses_shoot: true
  houses_weaker: true
  houses_barricade_upgrade: true
  garrison_economic: true
  garrison_resource: true
  garrison_civic: true
  structures_less_capture_recovery: true
  structures_weaker: true

battle:
  armor: low
  health: medium
  damage: high
  wounded: true

experience:
  promote_across_class: true
  classes:
    - citizen soldier
    - professional
    - champion
    - hero

agriculture:
  farms_used_and_regrow: true
  bushes_regrow: true
  farms_tiny_fields: true
  fauna_manure: true
  fauna_trickle: true
  fauna_consume_farms: true

phase:
  type: phase # <phase|age> whether to make phase researchable or to apply automatically when certain conditions - such as number of buildings - are met
  territory: contiguous # <contiguous|global> whether to apply the phase to contiguous territories or globally.
```
