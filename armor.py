#!/usr/bin/python

def blockPercent( armor ):
  percent = round( 100* (1-.90**armor))
  return percent

for armor in range(0,28):
  percent = blockPercent(armor)
  name = ''

  if armor == 0:
    name = 'No Armor'

  #  Speed =* (1 - Coverage * .01)
  # Coverage 1; Food + 20%; Resource: Food; Crush Armor = Coverage
  if armor == 1:
    name = 'Leather (Basic)'
  if armor == 2:
    name = 'Leather (Intermediate)'
  if armor == 3:
    name = 'Leather (Advanced)'
  # Coverage 2; Food + 40%; Resource: Food
  if armor == 3:
    name = 'Linothorax (Basic)'
  if armor == 4:
    name = 'Linothorax (Intermediate)'
  if armor == 5:
    name = 'Linothorax (Advanced)'
  # Coverage 3; Food + 60%
  if armor == 2:
    name = 'Gambeson (Basic)'
  if armor == 3:
    name = 'Gambeson (Intermediate)'
  if armor == 4:
    name = 'Gambeson (Advanced)'



  #  Speed =* (1 - Coverage * .04)
  # Coverage 1; Iron + 60%; Food + 10%; Crush Armor = Coverage * 3
  if armor == 7:
    name = 'Chain Mail - Haubergeon (Basic) '
  if armor == 8:
    name = 'Chain Mail - Haubergeon (Intermediate)'
  if armor == 9:
    name = 'Chain Mail - Haubergeon (Advanced)'
  # Coverage 2; Iron + 80%; Food + 20%
  if armor == 8:
    name = 'Chain Mail - Hauberk (Basic) '
  if armor == 9:
    name = 'Chain Mail - Hauberk (Intermediate)'
  if armor == 10:
    name = 'Chain Mail - Hauberk (Advanced)'
  # Coverage 3; Iron + 100%; Food + 30%
  if armor == 9:
    name = 'Chain Mail - Hauberk and Coif (Basic) '
  if armor == 10:
    name = 'Chain Mail - Hauberk and Coif (Intermediate)'
  if armor == 11:
    name = 'Chain Mail - Hauberk and Coif (Advanced)'

  #  Speed =* (1 - Coverage * .8)
  # Iron + 120%; Food + 10%; Crush Armor = Coverage * 5
  if armor == 12:
    name = 'Plate Mail - Cuirass(Basic)'
  if armor == 13:
    name = 'Plate Mail - Cuirass(Intermediate)'
  if armor == 14:
    name = 'Plate Mail - Cuirass(Advanced)'
  # Iron + 140%; Food + 20%
  if armor == 15:
    name = 'Plate Mail - Cuirass and Vambrace(Basic)'
  if armor == 16:
    name = 'Plate Mail - Cuirass and Vambrace(Intermediate)'
  if armor == 17:
    name = 'Plate Mail - Cuirass and Vambrace(Advanced)'
  # Iron + 160%; Food + 30%
  if armor == 18:
    name = 'Plate Mail - Suit(Basic)'
  if armor == 19:
    name = 'Plate Mail - Suit(Intermediate)'
  if armor == 20:
    name = 'Plate Mail - Suit(Advanced)'

  print armor, ':', name, '\t', percent, '%'


  # Armor
  # Leather Armor 1 (Village Phase - Free)
  # Leather Armor 2 (Town Phase)
  # Leather Armor 3 (Town Phase)
  #
  # Chain Mail 1 (Town Phase)
  # Chain Mail 2 (Town Phase)
  # Chain Mail 3 (City Phase)
  #
  # Plate Mail 1 (City Phase)
  # Plate Mail 2 (City Phase)
  # Plate Mail 3 (City Phase)

  # Main Arms
  # SwordWorking 1,2,3
  # Spearworking 1,2,3

  # Melee Sidearms
  # Shortsword 1
  # Axe 1
  # Mace 1

  # Ranged Sidearms
  # Shortbow 1
  # Throwing Axe 1
  # Javelins 1
  # Poison Darts 1
  # Slingers


<Technologies datatype="tokens">
      attack_infantry_melee_01
      attack_infantry_melee_02
      attack_infantry_ranged_01
      attack_infantry_ranged_02
      attack_cavalry_melee_01
      attack_cavalry_melee_02
      attack_cavalry_ranged_01
      attack_cavalry_ranged_02
      armor_infantry_01
      armor_infantry_02
      armor_cav_01
      armor_cav_02
      armor_hero_01
</Technologies>
<Technologies datatype="tokens">
      attack_sword_01
      attack_sword_02

      attack_spear_01
      attack_spear_02

      attack_axe_01
      attack_axe_02

      attack_bow_01
      attack_bow_02

      attack_javelins_01
      attack_javelins_02

      armor_leather_01
      armor_leather_02
      armor_leather_03

      armor_chain_01
      armor_chain_02
      armor_chain_03

      armor_plate_01
      armor_plate_02
      armor_plate_03
</Technologies>


Archers:
      attack_arrows_wood 0:5:0 Food: 50; Wood: 50
      attack_arrows_bone 0:5:0 Food: 60; Wood: 40
      attack_arrows_stone 0:5:1 Food: 50; Wood: 40; Stone: 10
      attack_arrows_iron 0:6:0 Food: 50; Wood: 40; Iron: 10

Small Wood Shield + 3
Small Bronze Shield + 6
Large Wood Shield + 6
Large Bronze Shield + 9
