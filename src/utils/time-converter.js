export const monthAsString = (num) => {
    switch (num) {
        case 1: return 'January'
        case 2: return 'February'
        case 3: return 'March'
        case 4: return 'April'
        case 5: return 'May'
        case 6: return 'June'
        case 7: return 'July'
        case 8: return 'August'
        case 9: return 'September'
        case 10: return 'October'
        case 11: return 'November'
        case 12: return 'December'
    }
    return '';
}

export const numAsDate = (num) => {
    num = num.toString();
    let year = num.substring(0, 4);
    let month = num.substring(4, 6);
    let day = num.substring(6);
    month = monthAsString(parseInt(month));
    return `${month} ${day}, ${year}`;
}

export const addDayAsInt = (num, numOfDays) => {
    var date = new Date(numAsDate(num));
    date.setDate(date.getDate() + numOfDays);
    return dateToInt(date);
}

export const compareIntDate = (date1, date2) => {
    let oneDay = 24 * 60 * 60 * 1000;
    date1 = new Date(numAsDate(date1));
    date2 = new Date(numAsDate(date2));
    return Math.round((date2 - date1) / oneDay);
}

export const dateToInt = (date) => {
    let year = date.getFullYear();
    let month = (date.getMonth() + 1);
    let day = date.getDate();
    let rs = '' + year + (month < 10 ? '0' + month : month) + (day < 10 ? '0' + day : day);
    return parseInt(rs);
}

export const numAsTime = (num) => {
    let hour;
    let minute;
    if (num < 1000) {
        num = num.toString();
        hour = num.substring(0, 1);
        minute = num.substring(1);
    } else {
        num = num.toString();
        hour = num.substring(0, 2);
        minute = num.substring(2);
    }
    return `${hour}:${minute}`
}