#!/bin/bash

picture_file=$1
picture_name=$(basename -s .png $picture_file)

cp $picture_file ./art/textures/ui/pregame/backgrounds/




echo "g_BackgroundLayerData.push(
	[
		{
			\"offset\": (time, width) => 0.0 * width * Math.cos(0.0 * time),
			\"sprite\": \"background-${picture_name}\",
			\"tiling\": false,
		},
	]);" > ./gui/pregame/backgrounds/${picture_name}.js

echo "<?xml version=\"1.0\" encoding=\"utf-8\"?>
<sprites>
	<sprite name=\"background-${picture_name}\">
		<image
			texture=\"pregame/backgrounds/${picture_file}\"
			fixed_h_aspect_ratio=\"2\"
			round_coordinates=\"false\"
		/>
	</sprite>

</sprites>" > ./gui/pregame/backgrounds/${picture_name}.xml
