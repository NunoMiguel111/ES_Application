// Define the array of latitudes and longitudes
var trajectory = [

    [41.178463256862216, -8.595062196985669],
    [41.178447369725745, -8.593731843991833],
    [41.177288548542016, -8.593549177761107]
  
  ];
  
  // Initialize the map
  var map = L.map('map').setView(trajectory[0], 10); // Set the initial view and zoom level
  
  // Create and add the OpenStreetMap tile layer to the map
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
  }).addTo(map);
  
  var markers = L.featureGroup();
  
  for(var i = 0; i< trajectory.length; i++){
    var marker = L.circleMarker(trajectory[i], {
      color : "red",
      fillColor: "red",
      fillOppacity: 1,
      radius: 8,
  
    })
    markers.addLayer(marker);
  }
  
  // Add markers to map
  markers.addTo(map);
  
  // Create a Polyline to represent the trajectory
  var polyline = L.polyline(trajectory, {
    color: 'blue', // Adjust the color of the line as needed
    weight: 2 // Adjust the thickness of the line as needed
  }).addTo(map);
  
  // Fit the map bounds to the polyline
  map.fitBounds(polyline.getBounds());

  const data = {
    datasets: [{
      label: 'Air Temperature',
      data: [{
        x: -10,
        y: 0
      }, {
        x: 0,
        y: 10
      }, {
        x: 10,
        y: 5
      }, {
        x: 0.5,
        y: 5.5
      }],
      backgroundColor: 'rgb(255, 99, 132)'
    }],
  };

  const config = {
    type: 'scatter',
    data: data,
    options: {
      scales: {
        x: {
          type: 'linear',
          position: 'bottom'
        },
        y: {
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Value'
          }
        }
      }
    }
  };

  var canvas = document.getElementById("myChart");

  const scatterPlot = new Chart(canvas, config);
  