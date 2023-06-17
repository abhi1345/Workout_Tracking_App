export const formatTimeSeconds = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    if (seconds < 3600) {
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const isDateStringInLocaleFormat = (dateString) => {
    const dateFormatRegex = /^\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{2}:\d{2} [AP]M$/;
    return dateFormatRegex.test(dateString);
}

export const isoDateToLocale = (dateString) => {
    if (isDateStringInLocaleFormat(dateString)) {
        return dateString;
    }
    let dateObj = new Date(dateString);
    return dateObj.toLocaleString();
}

export const localeDateStringToISO = (dateString) => {
    const [datePart, timePart] = dateString.split(", ");
    const [month, day, year] = datePart.split("/");
    const [time, meridiem] = timePart.split(" ");
    const [hour, minute, second] = time.split(":");
    const milliseconds = "000";
  
    const isoDateString = `${year}-${padZero(month)}-${padZero(day)}T${padZero(hour)}:${padZero(minute)}:${padZero(second)}.${milliseconds}Z`;
    return isoDateString;
  };
  
  const padZero = (value) => {
    return value.toString().padStart(2, "0");
  };
  