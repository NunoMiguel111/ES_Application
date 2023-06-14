
export function formatTimestamp(timestamp) {

    var date = timestamp.toLocaleDateString();
    var time = timestamp.toLocaleTimeString();

    return date + " " + time;

}

export function DownloadJSON2CSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;

    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';

        for (var index in array[i]) {
            line += array[i][index] + ',';
        }

        // Here is an example where you would wrap the values in double quotes
        // for (var index in array[i]) {
        //    line += '"' + array[i][index] + '",';
        // }

        line.slice(0, line.Length - 1);

        str += line + '\r\n';
    }
    window.open("data:text/csv;charset=utf-8," + escape(str))
}