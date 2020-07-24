#!/bin/bash

picture_file=$1
picture_name=$(echo ${picture_file} | sed 's|\..*||')

rm ./art/textures/ui/pregame/backgrounds/${picture_file}
rm ./gui/pregame/backgrounds/${picture_name}.xml
rm ./gui/pregame/backgrounds/${picture_name}.js
