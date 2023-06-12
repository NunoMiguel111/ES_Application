import {getCookie, setCookie} from "./cookies.js"
// CHANGE HERE MAIN URL
const mainUrl = "http://localhost:8000";

// Fetch sensor data section 


fetch(mainUrl + "/measurements?max=1")
.then(x=> x.json())
.then(res =>{

    console.log("Received Response from server");

    var sensorContainerCount = document.querySelectorAll(".sensor-container").length;
    var sensorName = document.querySelectorAll(".sensor-title")
    var sensorTimestamp = document.querySelectorAll(".timestamp")
    var sensorData = document.querySelectorAll(".data")

    for(var i = 0; i< sensorContainerCount; i++){

        sensorName[i].innerHTML = res[0].measurements[i].type
        sensorTimestamp[i].innerHTML = formatTimestamp(new Date(res[0].timestamp))
        sensorData[i].innerHTML = res[0].measurements[i].value

    }
    })
.catch(err =>{
    console.log(err);
    alert("Couldn't fetch data from the server")
})

function formatTimestamp(timestamp) {

var date = timestamp.toLocaleDateString();
var time = timestamp.toLocaleTimeString();

return date + " " + time;

}


var sensor_labels = document.querySelectorAll(".sensor-title");

for (let i = 0; i < sensor_labels.length; i++) {
    sensor_labels[i].addEventListener("click", function() {
        setCookie("sensor_type", sensor_labels[i].textContent, 1);
        window.location.href = "./measurements.html"
        
    });
}