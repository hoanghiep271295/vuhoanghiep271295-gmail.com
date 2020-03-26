var NativeHelper = NativeHelper || {};

var NativeHelperConfig = {
    fbLogin: {
        iOS: [
            "MSWrapper",
            "login"
        ],
        Android: [
            "org.cocos2dx.javascript/Wrapper",
            "fbLogin",
            "()V"
        ],
        Web: "fbLogin"
    },
    fbLogout: {
        iOS: [
            "MSWrapper",
            "logout"
        ],
        Android: [
            "org/cocos2dx/javascript/Wrapper",
            "fbLogout",
            "()V"
        ],
        Web: "fbLogout"
    },
    getDeviceId: {
        iOS: [
            "MSWrapper",
            "getDeviceId"
        ],
        Android: [
            "org/cocos2dx/javascript/Wrapper",
            "getDeviceId",
            "()Ljava/lang/String;"
        ],
        Web: "getDeviceId"
    },
    getVersionName: {
        iOS: [
            "MSWrapper",
            "getDeviceId"
        ],
        Android: [
            "org/cocos2dx/javascript/Wrapper",
            "getVersionName",
            "()Ljava/lang/String;"
        ],
    },
    getPackageName: {
        iOS: [
            "MSWrapper",
            "getPackageName"
        ],
        Android: [
            "org/cocos2dx/javascript/Wrapper",
            "getPackageName",
            "()Ljava/lang/String;"
        ],
        Web: "getPackageName"
    },
    callPhoneNumber: {
        iOS: [
            "MSWrapper",
            "callPhoneNumber:"
        ],
        Android: [
            "org/cocos2dx/javascript/Wrapper",
            "callPhoneNumber",
            "(Ljava/lang/String;)V"
        ]
    },
    getCarrierName: {
        iOS: [
            "MSWrapper",
            "getCarrierName"
        ],
        Android: [
            "org/cocos2dx/javascript/Wrapper",
            "getCarrierName"
        ]
    }
}

var NativeHelperListener = {};

// Args must be an array
NativeHelper.callNative = function (method, args) {
    if (cc.sys.isNative) {
        if (!NativeHelperConfig[method] || !NativeHelperConfig[method][cc.sys.os]) {
            cc.log("WARNING: No config for os: " + cc.sys.os + " with method: " + method)
            return;
        }
    } else {
        if (!NativeHelperConfig[method] || !NativeHelperConfig[method]["Web"]) {
            cc.log("WARNING: No config for Web with method: " + method)
            return;
        }
    }
    args = args || [];
    cc.log("NativeHelper.callNative: " + method + ", args: " + JSON.stringify(args));
    if (cc.sys.isNative) {
        args = NativeHelperConfig[method][cc.sys.os].concat(args);
        cc.log("NativeHelper.isNative: " + method + ", args: " + JSON.stringify(args));
        return jsb.reflection.callStaticMethod.apply(this, args);
    }
    return window[NativeHelperConfig[method]["Web"]].apply(this, args);
}

NativeHelper.setListener = function (name, listener) {
    NativeHelperListener[name] = listener;
}

NativeHelper.removeListener = function (name) {
    delete NativeHelperListener[name];
}

NativeHelper.onReceive = function (name, fnName, args) {
    if (NativeHelperListener[name]) {
        args = args || [];
        NativeHelperListener[name][fnName].apply(NativeHelperListener[name], args);
    }
    else {
        cc.error("WARNING: listener " + name + " not found");
    }
}
