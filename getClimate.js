key=""
city=""

curl --header "x-api-key: ${key}" "https://api.meteostat.net/v2/stations/search?query=london"
curl --header "x-api-key: ${key}" "https://api.meteostat.net/v2/stations/climate?station=03772"
