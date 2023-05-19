// CHANGE HERE MAIN URL
const mainUrl = "http://localhost:8000";

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

function formatTimestamp(timestamp) {

var date = timestamp.toLocaleDateString();
var time = timestamp.toLocaleTimeString();

return date + " " + time;

}