import moment from 'moment';


/*-----------------------Compare Date --------------------*/
export const Token = () => {
    let token = sessionStorage.getItem('token');
    if (token === null || token === undefined || token === "") {
        // console.log(token);
        token = sessionStorage.getItem('token');
    }
    return token
}


/*-----------------------Compare Date --------------------*/
export const compareDate = (a, b) => {
    const dataMyOne = moment(a).format('YYYYMMDD');
    const dataMyTwo = moment(b).format('YYYYMMDD');


    if (dataMyOne === dataMyTwo) {
        return 0;
    }
    return (dataMyOne < dataMyTwo) ? -1 : 1;
}

/*-----------------------get older  Date --------------------*/
export const getolderDate = (months) => {
    var d = moment().subtract(months, 'months').format('YYYY-MM-DD');
    return d
}

/*-----------------------get upcoming  Date --------------------*/
export const getUpcomingDate = (months) => {
    var d = moment().add(months, 'months').format('YYYY-MM-DD');
    return d
}

// /*-----------------------get Time difference  --------------------*/
// export const getTimeDifference = (a, b) => {
//     const dataMyOne = moment(a).format('mm:ss');
//     const dataMyTwo = moment(b).format('mm:ss');
// }

/**
 * Custom function that calculates the percent of a number.
 * @param percentFor float | int num, The percent that you want to get.
 * @param percentOf float | int num, The number that you want to calculate the percent of.
 * @returns {Number}
 */
export const percentageNumber = (percentFor, percentOf) => {
    let percentage = 0;
    const firstNumber = Number(percentFor);
    const secondNumber = Number(percentOf);
    percentage = secondNumber > 0 ? ((firstNumber / secondNumber) * 100).toFixed(2) : 0
    return Number(percentage > 100 ? 100 : percentage)
}

export const roundPercentageNumber = (percentFor, percentOf) => {
    let percentage = percentageNumber(percentFor, percentOf)
    return percentage > 0 ? Math.round(percentage) : ""
}


/**
 * Custom function for Clevertap.
 * @param EventName string , The Event Name for Clevertap.
 * @param EventData json object, The Data for Clevertap.
 */
export const clevertapEvents = (EventName, EventData) => {
    //Clevertap 
    if (typeof window.Android !== 'undefined') {
        window.Android.onEventReceived(EventName, EventData, true, true)
    } else if (typeof onEventReceived !== 'undefined') {
        window.onEventReceived(EventName, EventData, true, true)
    }
    else if (typeof window.flutter_inappwebview !== 'undefined') {
        window.flutter_inappwebview.callHandler('onEventReceived', EventName, EventData, true, true);
    }
}

/**
 * Custom function for facebook Tracking.
 * @param EventName string , The Event Name for facebook Tracking.
 * @param EventProperty json object, The Data for facebook Tracking.
 */
export const facebookTracking = (EventName, EventProperty) => {
    //facebook 
    try {
        if (typeof window.Android !== 'undefined') {
            window.Android.onFacebookStandardEventReceived(EventName, EventProperty)
        } else if (typeof onEventReceived !== 'undefined') {
            window.onEventReceived(EventName, EventProperty, false, false)
        } else if (typeof window.flutter_inappwebview !== 'undefined') {
            window.flutter_inappwebview.callHandler('onEventReceived', EventName, EventProperty, false, false);
        }
    } catch (error) {
        console.log(error);
    }

}


/**
 * Custom function for Store User data.
 * @param userName string .
 * @param password string.
 * @param remember bool.
 */
export const StoreUserData = (userName, password, remember) => {
    localStorage.setItem('username', userName);
    localStorage.setItem('password', password);
    localStorage.setItem('remember', remember);
    if (typeof window.Android !== 'undefined') {
        window.Android.onRemenberMeClicked(userName, password, true);
    }
    if (typeof onRemenberMeClicked !== 'undefined') {
        window.onRemenberMeClicked(userName, password, true);
    }
    if (typeof window.flutter_inappwebview !== 'undefined') {
        window.flutter_inappwebview.callHandler('onRemenberMeClicked',userName, password, true);
    }

}

/**
 * convert seconds to hh:mm:ss or mm:ss
 * @param secs string .
 */
export const hhmmss = (secs) => {
    function pad(num) {
        return ("0"+num).slice(-2);
    }
    var minutes = Math.floor(secs / 60);
    secs = secs % 60;
    var hours = Math.floor(minutes / 60)
    minutes = minutes % 60;
    if (pad(hours) > 0)
        return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
    else
    return `${pad(minutes)}:${pad(secs)}`;
    // return pad(hours)+":"+pad(minutes)+":"+pad(secs); for old browsers
}