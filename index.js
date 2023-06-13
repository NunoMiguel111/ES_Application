import {getCookie, setCookie} from "./cookies.js"
import { formatTimestamp } from "./utils.js";
// CHANGE HERE MAIN URL
const mainUrl = "http://localhost:8000";

// Keep track of sensor type names to add to cookies
var array_sensor_names = []

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

        array_sensor_names.push(res[0].measurements[i].type)

        const processedSensorName = res[0].measurements[i].type.split("_").map(name => name.charAt(0).toUpperCase()+ name.slice(1)).join(" ");

        sensorName[i].innerHTML = processedSensorName;

        sensorTimestamp[i].innerHTML = formatTimestamp(new Date(res[0].timestamp))
        sensorData[i].innerHTML = res[0].measurements[i].value

    }
    })
.catch(err =>{
    console.log(err);
    alert("Couldn't fetch data from the server")
})



var sensor_labels = document.querySelectorAll(".sensor-title");

for (let i = 0; i < sensor_labels.length; i++) {
    sensor_labels[i].addEventListener("click", function() {
        setCookie("sensor_type", array_sensor_names[i], 1);
        window.location.href = "./measurements.html"
        
    });
}