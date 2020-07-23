import httpClient
import json

var query="Scythians"
var url="https://en.wikipedia.org/api/rest_v1/page/summary/" & $query
var client = newHttpClient()
var res = client.getContent(url)

var jsonNode = parseJson(res)

echo jsonNode["extract"]
