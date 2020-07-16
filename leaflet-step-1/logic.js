// QueryURL
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Get Data as Json
d3.json(queryUrl, function(data) {
  // create features function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  function styleInfo(feature){
    return{
      opacity: 0.3,
      fillOpacity: .8,
      fillColor:getColor(feature.properties.mag),
      radius: feature.properties.mag * 8
    };
  }
  function getColor(magnitude){
    switch(true) {
      case magnitude>5:
        return "#FF0000";
      case magnitude>4:
        return "#ff6600";
      case magnitude>3:
        return "#FFCC00";
      case magnitude>2:
        return "#ccff00";
      case magnitude>1:
        return "#66ff00";
      default:
        return "#00FF00";
    }
  }

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(feature,latlng){
      return L.circleMarker(latlng)
    },
    style : styleInfo,
    onEachFeature: onEachFeature
  });


//having an issue with the legend
// var legend = L.control({position: "bottomright"});

// legend.onAdd = function(){
//   var div = L.DomUtil.create("div", "info legend");
//   var grades = [1,2,3,4,5];
//   var colors = ["#00FF00", "#66ff00", "#ccff00", "#FFCC00", "#ff6600", "#FF0000"]
//   for (var i=0;i< grades.length;i++){
//     div.innerHTML +=
//       "<i style='background: " +colors[i] + "'></i>" +
//       grades[i] +(grades[i+1] ? "&ndash;" + grades[i+1] +"<br>":"+");
//   }
// return div;
// };
// legend.addTo(myMap);


  // Sending our earthquakes layer to the createMap function


  
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: API_KEY
  });

  var darkmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/dark-v10',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
