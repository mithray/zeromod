# Muse

The first goal of this project is to unify as much of the game data as possible from other mods into a single mod. This is done by having a much smaller amount of configuration files by removing redundancy in the configuration files. With redundancy removed, it's significantly easier to make changes to the game without spending nearly as much time editing XML files. This project seeks to reduce time needed editing XML files so that more time can be spent in historical research and art design. With the game being easier to mod, improvements in one mod can more easily be carried over to other mods without needing to take the entire mod. The improvements will be treated modularly.

Once this project is finished, it should be easy to create a custom mod with different settings from other mods and civilization restrictions, such as including in the released mod only Baltic or Hellenic civilizations, or many other economic settings such as low armor, balancing adjustments etc.

```
0admod generate --input "conf.yml" --ouput "mymod"
```
