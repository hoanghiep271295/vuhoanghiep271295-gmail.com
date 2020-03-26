var BASE_URL = "https://public.queengame88.com/";
// var BASE_URL = "http://public.borogame.tk/";
if (cc.sys.isNative) {
    BASE_URL = "http://public.queengame88.com/";
    // BASE_URL = "http://public.borogame.tk/";
}

var urlConfig = function (platform, version, package) {
    cc.log("base config", BASE_URL + "config?pl=" + platform + "&v=" + version + "&pk=" + package);
    return BASE_URL + "config?pl=" + platform + "&v=" + version + "&pk=" + package;
}

var sendRequest = function (url, params, isPost, callback, errorcallback, callbackHead) {
    cc.log("sendRequest :", url);
    if (url == null || url === '')
        return;
    var xhr = cc.loader.getXMLHttpRequest();
    // cc.log("xhr",xhr);
    if (isPost) {
        xhr.open("POST", url);
    } else {
        xhr.open("GET", url);
    }
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    if (cc.sys.platform === cc.sys.WIN32) {
        xhr.setRequestHeader("user-agent", "win32");
    }
    xhr.onreadystatechange = function () {
        var response = xhr.responseText;
        if (xhr.readyState === 4 && xhr.status === 200) {

            var responseHeader = xhr.getAllResponseHeaders();
            if (callback)
                callback(response);
            if (callbackHead)
                callbackHead(responseHeader);
        } else if (xhr.readyState === 4 && xhr.status !== 200) {
            // var response = xhr.responseText;
            if (errorcallback)
                errorcallback(response);
        }
    };

    if (params == null || params === "") {
        xhr.send();
    } else {
        xhr.send(params);
    }
};

function serialize(obj) {
    var str = [];
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    }
    return str.join("&");
}

