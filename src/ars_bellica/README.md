# Ars Bellica

* High Damage
* Experience
* Permaculture
* City Building
* Mountable Units
* Experience
* Loot
* Seasons
* Upkeep
* More Visible Garrisons
* Defensible Houses

## High Damage

- [ ] Armor Reduced
- [ ] Attack Increased
- [ ] Archers Attack Speed Reduced

## Basic Unit 

- [ ] Train civilians, then arm them with weapons and armor at Blacksmith or Barracks.
- [ ] All units can get main and/or secondary weapons from blacksmith or Barracks and switch between them
- [ ] Armor Cost dependent on hitpoints of unit to be armed
- [ ] New units types are generated based on weapons, mounts, civilization and armor. Any one new thing added to the game will add many new units. 
- [ ] Drop and pick up weapons, but don't get the ability to create those weapons.
- [ ] Civilians are randomized between male and female
- [ ] Citizen Training Time is based on your population, with a slightly higher dependence upon the female population.
- [ ] Many units are cheaper to build but also require food upkeep, 1/20sec female, 1/10sec male

<!-- 
//train time = t_{high} - (t_{high} -t_{low})*{(1-.997^{m+f^{1.3}}})}
//<img src="https://latex.codecogs.com/gif.latex?train%20time%20=%20t_{high}%20-%20t_{low}*{(1-\tfrac{99^{m+f^{1.3}}}{10^{4}})}"/>
train\\>time = t_{high} - (t_{high} -t_{low})*(1-.997^{m+f^{1.3}})
-->
<img src="https://latex.codecogs.com/gif.latex?train>time%20=%20t_{high}%20-%20(t_{high}%20-t_{low})*(1-.997^{m+f^{1.3}})"/>

## Flora & Fauna

- [ ] Manure Aura -Flora grow more efficiently(gain more food). Range of 30(nearby villagers "use" the dung)
- [ ] Graze Aura - Fauna have a negative aura of 1(they are directly over and "eat" the crops) 
- [ ] Animals will attack each other
- [ ] Animals will reproduce, maybe they will reproduce when they reach a certain level of sustainence, which they can get from the environment, and when another animals of the same type is present.
- [ ] To reduce micromanagement, add "Large Farms" which includes a corral, farmstead, farm and animals together, with a wooden fence to wall in animals
- [ ] Possibly, Corrals will automatically generate farm animals
- [ ] Possibly, animals leave dung on the ground, the dung helps farms, but the animals, if on the farmland, will reduce its productivity(because they eat the crops)


## Buildings

### Special

- [ ] Roads[ move speed aura ]
- [ ] Bridges[ can cross water ]
- [ ] Pavement[ move speed aura ]
- [ ] Fish Farms
- [ ] Plant
  - [ ] Fruit Trees
  - [ ] Wood Trees
  - [ ] Farms(Farms work like bushes, but also grow back)

### Fortifications

- [ ] No Tower and Outpost Restrictions on building close together. 
- [ ] Tall Spikes can be built in own territory. 
- [ ] Military Camps can be build in own territory
- [ ] Low Spikes are passable but do damage and slow units when they walk over top.
- [ ] Spikes can be built like walls.
- [ ] Units can hide in the terrain for sneak attacks.
- [ ] Barricades [damage and slow]

## Mountable Units

- [ ] Horses, Elephants, and Camels are mountable units
- [ ] Mountable units can be captured from the map
- [ ] All these mountable units can be mounted and dismounted with your regular units and use their original weapon
- [ ] Horse archers can fire while riding at champ level, pro level for steppe nomads
- [ ] Horses have mount "alarm"

## Experience
Unit Experience, Stats, Configuration
- [ ] Units have Agility, Strength, and Support Stats. 
- [ ] Support Stats are called FMS:Fine Motor Skills. This makes female citizens a more interesting support class. 
- [ ] Above a certain level of FMS and the unit provides a healing aura.
- [ ] Female Support aura
  - Idle regen rate, 1/20 sec, stackable
  - 1% work/build rate, stackable
- [ ] Healing is disabled while a unit is fighting.
- [ ] Champions are just Citizens with a lot of combat experience. Heroes are just Champions with a lot of combat experience. 
- [ ] Maps spawn more Gaia animals and soldiers, which also have more experience loot.
- [ ] No Hero Limit Restriction. Heroes are automatically promoted.
More promotion classes.
- Civilian
- Civilian Soldier
- Professional Soldier
- Champion
- Hero

## Loot
- [ ] Units Cost Less Wood
- [ ] Structures Cost More Wood
- [ ] More Loot
- [ ] When ships die their loot floats to shore
- [ ] Tribute can only be sent via physical units with a trade cart or merchant ship to a Civic Center, Market, or dock.

## Gameplay
- [ ] Better Garrison and Selection Commands
- [ ] Select Lowest x in group
- [ ] Select Highest x in group

## Player Controlled AI

- [ ] Players can apoint AI to control certain portions of their troops or build order.
- [ ] Perhaps set an "Officer" over these AIs and have Officers buildable.
- [ ] This can be used for build order, or micro fighting tactics. 

## Siege Units
- [ ] Must be garrisoned to move
- [ ] Can garrison up to four men and two(or four?) horse, depending on the siege weapon. A horse enables movement. Each man increase the movement rate and attack rate.

## Seasons

- Seasonal Flora. 4 minutes rotation?

- Poison Weapons

## Visible Garrisons
- [ ] Ships visible garrison
- [ ] Siege units on walls.
- [ ] Towers visible garrison

## Buildings

- [ ] Temples increase morale and loyalty. HP aura weaker.
  - +1hp / 5 sec
  - +10% work rate
  - +10% hp
  - +10% attack speed
  - +50% capture regen
  - Have a build restriction to prevent building nearby

- [ ] Houses 
  - idle regen rate 1 / 10 sec, stackable
  -  2% work/build rate
  
- [ ] Blacksmith
  - Researches
  - Produce weapons. Wood and iron upkeep.

- [ ] Storehouses
  - [ ] Increases metal, stone, wood, Storage Capacity
  - [ ] When above your storage capacity will drop outside the building(can be raided and stolen)
  - [ ] Can be built next to a mine to get a trickle of that resource
- Farmhouses
  - [ ] Increases Food storage capacity
  - [ ] When above your storage capacity will drop outside the building(can be raided and stolen)
  - [ ] Can get trickle from nearly animals if your civilization uses that animals trickle products
- Blacksmith
  - [ ] Increases Weapon and Shield storage capacity
  - [ ] When above your storage capacity will drop outside the building(can be raided and stolen)
  - [ ] Can perform research and build your best weapons
  - [ ] Can repair and equip weapons
- [ ] Barracks (Forward bases, not Trainers)
  - have idle regen rate aura
  - Repairs equipment
  - Build in Neutral territory
  - Produces basic weapons
  - [ ] When above your storage capacity will drop outside the building(can be raided and stolen)

Max resources are affected by
Food: farmsteads, civil centres.
Weapons: Blacksmiths
Wood, Stone, Metal: Storehouses, Civil centers.

- Hexagonal Aura?
This would allow you to evenly space building that have a build restriction on being close to buildings of the same type to cover an entire area without gaps or ovelap.
