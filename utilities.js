export const formatTimeSeconds = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    if (seconds < 3600) {
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const isoDateStringLocaleFormat = (dateString) => {
    const dateFormatRegex = /^\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{2}:\d{2} [AP]M$/;
    return dateFormatRegex.test(dateString);
}

export const isoDateToLocale = (dateString) => {
    if (isoDateStringLocaleFormat(dateString)) {
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

    const isoDateString = `${year}-${month}-${day}T${hour}:${minute}:${second} ${meridiem}`;
    return isoDateString;
}