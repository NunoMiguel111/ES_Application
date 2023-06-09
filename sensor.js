import { getCookie, setCookie } from "./cookies.js"
import { formatTimestamp, downloadCSV } from "./utils.js";

// Define server url
const mainUrl = "http://localhost:8000";

// Read cookies
const measurement_type = getCookie("sensor_type")
console.log(measurement_type)

// csv_icon
var csv_icon = document.querySelector(".download-csv-button");

// chart and table buttons
var chart_button = document.querySelector(".chart-button")
var table_button = document.querySelector(".table-button")

// get canvas and table
var canvas = document.getElementById("myChart");
var table_container = document.querySelector(".table-container")

// map initialization flag
var mapInitialized = false;
var map;

// variable to store the scatter plot
var scatterPlot;


// Get latest measurement
fetch(mainUrl + "/measurements" + "?" + "max=" + 1 + "&" + "type=" + measurement_type)
  .then(x => x.json())
  .then(measurement => {


    
    csv_icon.addEventListener("click", function () {
      downloadCSV(measurement, 'data.csv');
    })

    console.log(measurement)
    var sensor_name = document.querySelector(".sensor-title a")
    var data = document.querySelector(".circle-container .data")
    var timestamp = document.querySelector("#timestamp-time")

    sensor_name.textContent = measurement_type.split("_").map(name => name.charAt(0).toUpperCase() + name.slice(1)).join(" ");
    timestamp.textContent = formatTimestamp(new Date(measurement[0].timestamp));
    for (let i = 0; i < measurement[0].measurements.length; i++) {
      if (measurement[0].measurements[i].type === measurement_type) {
        data.textContent = measurement[0].measurements[i].value;
      }
    }
  })

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
          if (measurements[i].measurements[j].type === measurement_type) {
            sensor_data.push({
              x: new Date(measurements[i].timestamp), // Convert the timestamp to a JavaScript Date object
              y: parseFloat(measurements[i].measurements[j].value)
            });
            break;
          }
        }
      }

      // Create table dinamically
      const tableHTML = `<table class="table">
      <thead>
        <tr>
          <th>Timestamp</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        ${measurements.map(measurement => `
          <tr>
            <td>${new Date(measurement.timestamp).toLocaleString()}</td>
            <td>${measurement.measurements.find(m => m.type === measurement_type)?.value || '-'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>`;

    table_container.innerHTML = tableHTML;

      if(!mapInitialized){
        // Initialize the map
        map = L.map('map').setView(trajectory[0], 10); // Set the initial view and zoom level

        mapInitialized = true;

      }


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

      // destroy the scatter plot if already exists
      if(scatterPlot){
        scatterPlot.destroy();
      }

      const data = {
        datasets: [{
          label: measurement_type,
          data: sensor_data,
          backgroundColor: 'rgb(0,100,0)',
          pointRadius: 5, // Set the radius of the data points
          pointHoverRadius: 7, // Set the radius of the data points on hover
          showLine: false // Disable the line connecting the data points
        }],
      };
      const config = {
        type: 'scatter',
        data: data,
        options: {
          scales: {
            x: {
              type: 'time',
              position: 'bottom',
              ticks: {
                color: 'black' // Set the x-axis tick color to black
              }
            },
            y: {
              display: true,
              position: 'left',
              title: {
                display: true,
                text: 'Value',
                color: 'black' // Set the y-axis title color to black
              },
              ticks: {
                color: 'black' // Set the y-axis tick color to black
              }
            }
          },
          plugins: {
            legend: {
              labels: {
                color: 'black' // Set the legend label color to black
              }
            }
          }
        }
      };
      
      
      

      scatterPlot = new Chart(canvas, config);

      // Display download csv button
      csv_icon.style.display = "block";

      // Add click events to both buttons only when data is available 
      chart_button.addEventListener("click", function(){
        canvas.style.display = "block";
        table_container.style.display = "none";
      })

      table_button.addEventListener("click", function(){
        canvas.style.display = "none";
        table_container.style.display = "block";
      })

    })
    .catch(error => {
      console.error("Error fetching measurements:", error);
    });
}



