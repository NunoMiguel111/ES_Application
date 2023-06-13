
export function formatTimestamp(timestamp) {

    var date = timestamp.toLocaleDateString();
    var time = timestamp.toLocaleTimeString();
    
    return date + " " + time;
    
    }
    