
var scaleToSize = function (sprite, newSize) {
    var oldSize = sprite.getContentSize();
    var scaleX = newSize.width / oldSize.width;
    var scaleY = newSize.height / oldSize.height;
    cc.log("scaleX", scaleX);
    cc.log("scaleY", scaleY);
    sprite.setScaleX(scaleX);
    sprite.setScaleY(scaleY);
};
var resizeToSize = function (sprite, newSize) {
    var oldSize = sprite.getContentSize();
    var scaleX = newSize.width / oldSize.width;
    var scaleY = newSize.height / oldSize.height;
    var scale = scaleX > scaleY ? scaleX : scaleY;
    sprite.setScale(scale);
};

var findYMarginTop = function (value) {
    return value;
};

var makeSpineWithJson = function (jsonFile, atlasFile, scale) {
    return sp.SkeletonAnimation.createWithJsonFile(jsonFile, atlasFile, scale);
};

var squaredistance = function (p1, p2) {
    return (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y);
};

var formatMoneyWithDot = function (money) {
    if (money && money >= 1000) {
        var unit = money % 1000;
        if (unit < 10) {
            unit = "00" + unit;
        } else if (unit < 100) {
            unit = "0" + unit;
        }
        money = Math.floor(money / 1000);
        return formatMoneyWithDot(money) + "." + unit;
    } else {
        return money + "";
    }
};

var randomFromTo = function (a, b) {
    var rand = Math.random() * (b + 1 - a) + a;
    if (rand > b)
        rand = b;
    return Math.floor(rand);
};

var randomBetween = function (min, max) {
    var tmp = Math.floor((Math.random() * (max - min)) + min);
    return tmp;
};
var isMiss = function (obj) {
    if (obj === null || typeof obj === 'undefined' || obj === 'undefined' || obj === "") {
        return true;
    }
    return false;
};
var randomFloatBetween = function (min, max) {
    var tmp = Math.random() * (max - min) + min;
    return tmp;
};

var getSign = function (number) {
    return number > 0 ? 1 : -1;
};

var prettyTime = function (timestamp) {
    return moment(timestamp).format("HH:mm:ss DD-MM-YYYY");
};

function formatUTCDate(UTCTime) {
    cc.log("formtat", UTCTime);
    var date = new Date(UTCTime);

    var timeStr = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    return timeStr;
}

function getRandomInt(min, max) {
    var vRandom = Math.floor(Math.random() * (max - min + 1)) + min;
    return vRandom;
};
function getRandomFloat(min, max, number) {
    var random = (Math.random() * (max - min) + min).toFixed(number);
    return random;
}
//type : dd/mm/yyyy
function getTimeStamp(date) {
    // var lst = date.split("/");
    var datum = new Date(Date.UTC(date.year(), date.month(), date.date()));
    return Math.round(datum.getTime() / 1000) * 1000;
}

function formatUTCTime(UTCTime) {
    var date = new Date(UTCTime);
    var hourStr = (date.getHours() < 10) ? ("0" + date.getHours()) : date.getHours();
    var minuteStr = (date.getMinutes() < 10) ? ("0" + date.getMinutes()) : date.getMinutes();

    var timeStr = hourStr + ":" + minuteStr + " " + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    return timeStr;
}

function getCurrentDate() {
    var time = new Date();
    var date = time.getDate();
    var month = time.getMonth() + 1;
    var year = time.getFullYear();
    if (date < 10)
        date = '0' + date;
    if (month < 10) {
        month = month;
    }
    var today = date + '/' + month + '/' + year;
    return today;
}

function getCurrentDateForLoDe() {
    var time = new Date();
    var today = "";
    if (time.getHours() >= 0 && time.getHours() <= 18) {
        today = moment(new Date()).subtract(1, "d");
    } else {
        today = moment(new Date());
    }
    return today;
}

function isNumber(number) {
    var pattern = /^[0-9]+$/;
    return pattern.test(String(number));
}

function isNumberAndComma(arr) {
    var pattern = /^[0-9,]*$/;
    return pattern.test(String(arr))
}