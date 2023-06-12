// Define server url
const mainUrl = "http://localhost:8000";

// Get references to input elements
const startDateInput = document.getElementById("start-date-input");
const endDateInput = document.getElementById("end-date-input");

let startDateChange = false;
let endDateChange = false;

startDateInput.addEventListener('change', handleStartDateChange);
endDateInput.addEventListener('change', handleEndDateChange);

function handleStartDateChange() {
  startDateChange = true;
  checkDatesChanged();
}

function handleEndDateChange() {
  endDateChange = true;
  checkDatesChanged();
}

function checkDatesChanged() {
  if (startDateChange && endDateChange) {
    startDateChange = false;
    endDateChange = false;
    handleBothDatesChanged();
  }
}

function handleBothDatesChanged() {
  const startDate = new Date(startDateInput.value);
  const endDate = new Date(endDateInput.value);

  const timeDiff = endDate.getTime() - startDate.getTime();

  if (timeDiff < 0) {
    alert("Starting Date Cannot Be Bigger Than Ending Date");
    return;
  }

  // DO SOME LOGIC HERE
  console.log("We reached here");

  var trajectory = [];
  var sensor_data = [];

  fetch(mainUrl + "/measurements" + "?" + "start_date=" + startDate.toISOString() + "&" + "end_date=" + endDate.toISOString() + "&" + "type=" + "air_temperature")
    .then(response => response.json())
    .then(measurements => {
      console.log(measurements)
      for (let i = 0; i < measurements.length; i++) {
        trajectory.push([parseFloat(measurements[i].location[0]), parseFloat(measurements[i].location[1])]);
        for (let j = 0; j < measurements[i].measurements.length; j++) {
          if (measurements[i].measurements[j].type === "air_temperature") {
            sensor_data.push({
              x: new Date(measurements[i].timestamp), // Convert the timestamp to a JavaScript Date object
              y: parseFloat(measurements[i].measurements[j].value)
            });
            break;
          }
        }
      }

      console.log(sensor_data)

      // Initialize the map
      var map = L.map('map').setView(trajectory[0], 10); // Set the initial view and zoom level

      // Create and add the OpenStreetMap tile layer to the map
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
      }).addTo(map);

      var markers = L.featureGroup();

      for (var i = 0; i < trajectory.length; i++) {
        var marker = L.circleMarker(trajectory[i], {
          color: "red",
          fillColor: "red",
          fillOpacity: 1,
          radius: 8,
        });
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
          data: sensor_data,
          backgroundColor: 'rgb(255, 99, 132)',
          pointRadius: 5, // Set the radius of the data points
          pointHoverRadius: 7, // Set the radius of the data points on hover
          showLine: false // Disable the line connecting the data points
        }],
      };

      const config = {
        type: 'scatter', // Set the chart type to scatter
        data: data,
        options: {
          scales: {
            x: {
              type: 'time', // Use 'time' scale for the x-axis
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

    })
    .catch(error => {
      console.error("Error fetching measurements:", error);
    });
}



