import httpClient
import json
import xmlparser
import xmltree

var query="Scythians"
var url="https://en.wikipedia.org/api/rest_v1/page/summary/" & $query
var client = newHttpClient()
#var res = client.getContent(url)
#var jsonNode = parseJson(res)
#echo jsonNode["extract"]

var xmlt = loadXml("simulation/templates/template_unit_fauna.xml")
#var tree = newXmlTree("test", [xmlt])
#var tree = newXmlTree(xmlt)

echo xmlt.findAll("Minimap")
#echo tree
