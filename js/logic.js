var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
    });
    
    var baseMaps = {
      "Light Map": streetmap
    };
    
 
    var myMap=L.map("map-id", {
      center: [
        37.09, -95.71
      ],
      zoom: 4,
      layers:[streetmap]
    })



function onEachFeature(feature, layer) {
  layer.bindPopup("<h3>" + feature.properties.place +
    "</h3><hr><h4> Magnitude: "+feature.properties.mag+"</h4>"+"<p>" + new Date(feature.properties.time) + "</p>");
}
function eqcolors(mag) {
 
  if (mag >= 6) {
    return "#7E32EF"
  }
  else if (mag >=5) {
    return "#E931A6"
  }
  else if (mag >=4) {
    return "#E98731"
  }
  else if (mag >=3) {
    return "#E9E931"
  }
  else if (mag >=2) {
    return "#7FFFD4"
  }
  else if (mag >= 1) {
    return "#B1F565"
  }
  else {
    return "#DCDCDC"
  }
}
function radius(mag) {
  if (mag >6){
    return 34
  }
  
  else if (mag > 5) {
    return 21
  }
  else if (mag >4) {
    return 13
  }
  else if (mag >3) {
    return 8
  }
  else if (mag >2) {
    return 5
  }
  else if (mag >1) {
    return 3
  }
  else {
    return 2
  }
}
function eqstyle(feature){
  return {
    radius: radius(feature.properties.mag),
    fillColor: eqcolors(feature.properties.mag),
    color: eqcolors(feature.properties.mag),
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  }
}
var legend = L.control({positon: "bottomright"})
legend.onAdd = function (myMap){
  var div = L.DomUtil.create('div',"info legend")
  var limits = ['0-1','1-2','2-3','3-4','4-5','5-6', '6+']
  // var colors = ["#7E32EF", "#E931A6", "#E98731", "#E9E931", "#CBE931", "#A3EBA3"]
  var labels = []
  var colors =[]

  var legendInfo = "<h1>Earthquake Magnitude</h1>" +
  "<div class=\"labels\">" +
  "</div>";

  div.innerHTML = legendInfo

  limits.forEach(function(limit, index) {
    labels.push("<li>"+limit+"</li>");
  }); 
  div.innerHTML += "<ul>" + labels.join("") + "</ul>";
  limits.forEach(function(limit, index) {
    colors.push("<li style=\"background-color: " + eqcolors(index) + "\">"+"</li>");
  }); 
  div.innerHTML += "<ul>" + colors.join("") + "</ul>";
  return div;
}
legend.addTo(myMap)
queryURL="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
d3.json(queryURL,function(response){
  console.log(response)
  L.geoJSON(response, {
    onEachFeature:onEachFeature,
    pointToLayer: function (feature, latlng) {
      return L.circleMarker (latlng, eqstyle(feature))
    }
  }).addTo(myMap)

})
