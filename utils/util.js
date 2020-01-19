var dateObj = (function() {
    var _date = new Date();
    return {
        getDate: function() {
            return _date;
        },
        setDate: function(date) {
            _date = date;
        }
    }
})();

function returnDateStr(date) { // 日期转字符串
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    month = month <= 9 ? ('0' + month) : ('' + month);
    day = day <= 9 ? ('0' + day) : ('' + day);
    return `${year}-${month}-${day}`;
};

const formatDateTime = (time, f) => {
    let date = new Date(time);
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    let d = date.getDate();
    let h = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    m = m < 10 ? ('0' + m) : m;
    d = d < 10 ? ('0' + d) : d;
    h = h < 10 ? ('0' + h) : h;
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    if (f) {
        return y + '-' + m;
    } else {
        return y + '-' + m + '-' + d;
    }
}

function formatDate(now) {
    let day = new Date(now);
    var year = day.getFullYear();
    var month = day.getMonth() + 1;
    var date = day.getDate();
    var hour = day.getHours();
    var minute = day.getMinutes();
    var second = day.getSeconds();
    hour = hour < 10 ? ('0' + hour) : hour;
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
}

function throttle(fn, gapTime) {
    if (gapTime == null || gapTime == undefined) {
        gapTime = 1500
    }
    let _lastTime = null
    return function () {
        let _nowTime = + new Date()
        if (_nowTime - _lastTime > gapTime || !_lastTime) {
            fn.apply(this, arguments);
            _lastTime = _nowTime;
        }
    }
}

module.exports = {
    dateObj: dateObj,
    returnDateStr: returnDateStr,
    formatDateTime: formatDateTime,
    formatDate: formatDate,
    throttle: throttle
}