
export function formatTimestamp(timestamp) {

    var date = timestamp.toLocaleDateString();
    var time = timestamp.toLocaleTimeString();

    return date + " " + time;

}

export function downloadCSV(data, filename) {
    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
    if (navigator.msSaveBlob) {
      // For IE 10 and above
      navigator.msSaveBlob(blob, filename);
    } else {
      // For modern browsers
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }
  
  function convertToCSV(data) {
    const rows = [];
    const header = ["timestamp", "latitude", "longitude", "measurement_type", "measurement_value"];
    rows.push(header.join(','));
  
    for (const item of data) {
      for (const measurement of item.measurements) {
        const values = [
          item.timestamp,
          item.location[0],
          item.location[1],
          measurement.type,
          measurement.value,
        ];
        const row = values.map(formatValue).join(',');
        rows.push(row);
      }
    }
  
    return rows.join('\n');
  }
  
  function formatValue(value) {
    if (typeof value === 'string' && value.includes(',')) {
      // Escape double quotes and wrap the value in double quotes
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }
  
  