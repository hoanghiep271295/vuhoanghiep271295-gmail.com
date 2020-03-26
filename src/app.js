
var Loading = BaseLayer.extend({
    customizeGUI: function () {

        this.enableFog();
        var bg = new cc.Sprite();
        bg.initWithSpriteFrameName("loadingBG.png");
        this.addNodeChild(bg);


        var proPrimary = new cc.Sprite();
        proPrimary.initWithSpriteFrameName("progressPrimary.png");
        proPrimary.setPosition(0, -250);
        this.addNodeChild(proPrimary);

        this.proSecond = new cc.Sprite();
        this.proSecond.initWithSpriteFrameName("progressSecond.png");
        this.proSecond.setPosition(2.5, proPrimary.getContentSize().height / 2);
        this.proSecond.setAnchorPoint(cc.p(0, 0.5));
        proPrimary.addChild(this.proSecond);

        this.lbPercent = new cc.LabelTTF("Đang tải: 100%", "Arial", 25);
        this.addNodeChild(this.lbPercent);
        this.lbPercent.y = -300;
        this.loadConfig();

    },
    loadConfig: function () {
        var platform = this.getPlatform();
        var version = 1;
        if (cc.sys.isNative) {
            package = NativeHelper.callNative("getPackageName");
        }
        var url = urlConfig(platform, version, "");
        sendRequest(url, null, false, this.callbackGetconfigSuccess.bind(this), this.callbackGetconfigFailed.bind(this));
    },
    getPlatform: function () {
        var platform = "web";
        if (cc.sys.os === cc.sys.OS_IOS) {
            platform = "ad";
        }
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            platform = "ad";
        }
        return platform;
    },
    callbackGetconfigSuccess: function (response) {
        var data = JSON.parse(response);
        if (data.e === 0) {
            cc.sys.localStorage.setItem("GAME_CONFIG", response);
            if (!cc.sys.isNative) {
                openGame(portal);
            } else {
                downloadGame();
            }
        } else {
            cc.log("Lỗi lấy config game " + data.e);
        }
    },
    callbackGetconfigFailed: function () {
        cc.log("Lỗi lấy config game");
    },
    updateProgress: function (percent) {
        if (percent <= 99) {
            this.lbPercent.setString("Vui lòng không ngắt kết nối mạng !\nĐang tải: " + Math.floor(percent) + "%");
        } else {
            this.lbPercent.setString("Đang tải: 100%");
        }
        var scale = percent / 100;
        this.proSecond.setScaleX(scale);
    }
});

var PopupUpdate = BaseLayer.extend({
    customizeGUI: function () {
        this.enableFog();
        var bg = new cc.Scale9Sprite("alert_bg.png");
        capInsets = bg.getCapInsets();
        bg.setContentSize(cc.size(711, 389));
        this.addNodeChild(bg);

        var insideBg = new cc.Scale9Sprite("alert_inside_bg.png");
        capInsets = insideBg.getCapInsets();
        insideBg.setContentSize(cc.size(655, 270));
        insideBg.y = -15;
        this.addNodeChild(insideBg);

        var title = new cc.LabelTTF("THÔNG BÁO", "Arial", 35, cc.size(400, 400), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        this.addNodeChild(title);
        title.y = 145;

        var content = "Xảy ra lỗi trong quá trình cập nhật tài nguyên.Kiểm tra lại kết nối mạng của bạn và tiến hành cập nhật lại.";

        var lbContent = new cc.LabelTTF(content, "Arial", 22, cc.size(450, 400), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        this.addNodeChild(lbContent);

        var button = this.makeButton("btnXacNhan.png", 1);
        button.setTitleText("Cập Nhật Lại");
        button.setTitleFontSize(25);
        button.setScale(0.8);
        button.y = -100;
        button.x = 100;
        this.addNodeChild(button);

        var button = this.makeButton("btn_huy.png", 2);
        button.setTitleText("Thoát");
        button.setTitleFontSize(25);
        button.setScale(0.8);
        button.y = -100;
        button.x = -100;
        this.addNodeChild(button);

    },
    onButtonRelease: function (button, id) {
        switch (id) {
            case 1:
                downloadGame();
                this.removeFromParent(true);
                reUpdate = null;
                break;
            case 2:
                cc.game.end();
                break;
        }
    }
});

var sharedLoading = null;
var openLoading = function () {

    if (sharedLoading == null) {
        sharedLoading = new Loading();
        sharedScene.addLoading(sharedLoading);
    }
    sharedLoading.show();
}

var updatePercentDownload = function (percent) {
    if (!sharedLoading.isVisible()) {
        sharedLoading.show();
    }
    sharedLoading.proSecond.setVisible(true);
    sharedLoading.updateProgress(percent);
}

var closeLoading = function () {
    if (sharedLoading != null) {
        sharedLoading.hide();
    }
}

var isDownloadedGame = false;

var downloadGame = function () {
    if (!isDownloadedGame) {
        var downloader = new AssetDownloader();
        downloader.initAssetManager("project.manifest", null, "update/root");
    } else {
        openGame(portal);
    }
}
var onDownloadSuccess = function (download) {
    cc.log("JS onDownloadSuccess", download)
    if (download === undefined || download == null || download) {
        cc.log("JS RESTART")
        cc.game.restart();
    } else {
        cc.log("JS NO RESTART")
        isDownloadedGame = true;
        openGame(portal);
    }
}
var onUpdateProcession = function (percent) {
    updatePercentDownload(percent);
}

var reUpdate = null;
var onDownloadFailed = function (message) {
    if (message === "UPDATE_FAILED") {
        if (reUpdate == null) {
            reUpdate = new PopupUpdate();
            sharedScene.addLoading(reUpdate);
        }
        reUpdate.show();
    }
    cc.log(message);
}

var LoadingGame = BaseLayer.extend({
    customizeGUI: function () {
        this.enableFog();
        cc.log("customizeGUI LoadingGame")
        var loading = new cc.Sprite("#loadinggame.png");
        this.addChild(loading);
        loading.runAction(cc.repeatForever(cc.rotateBy(1.5, 360)));
        loading.setScale(1.2);

        var bich = this._bich = new cc.Sprite("#bich.png");
        this.addChild(bich);
        bich.setScale(1.2);

        this._label = new cc.LabelTTF("0%", "Arial", 35, cc.size(400, 400), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        this._label.enableStroke(cc.color("#FFFFFF"), 1);
        this.addChild(this._label);
        this._label.setScale(1.2);
    },
    updateText: function (text) {
        if (text !== null) {
            this._label.setString(text);
        }
    }
});

var sharedLoadingGame = null;
var openLoadingGame = function () {
    if (sharedLoadingGame == null) {
        sharedLoadingGame = new LoadingGame();
        sharedScene.addLoading(sharedLoadingGame);
    }
    sharedLoadingGame._bich.setVisible(true);
    sharedLoadingGame._label.setVisible(false);
    sharedLoadingGame.show();
}

var closeLoadingGame = function () {
    if (sharedLoadingGame != null) {
        sharedLoadingGame._label.setString("0%");
        sharedLoadingGame.hide();
    }
}

var preload = function () {
    cc.loader.load(g_resources, function () {
        cc.spriteFrameCache.addSpriteFrames(loading_res.plist);
        sharedScene = new BaseScene();

        openLoading();
        cc.director.runScene(sharedScene);
    });
}

var preloadWithoutLoading = function () {
    cc.loader.load(g_resources, function () {
        cc.spriteFrameCache.addSpriteFrames(loading_res.plist);
        sharedScene = new BaseScene();

        openGame(sunny);
        cc.director.runScene(sharedScene);
    });
}


var checkIP = function () {
    var url = BASE_URL + "wl";
    sendRequest(url, "", "",
        function (response) {
            var json = JSON.parse(response);
            cc.log("myJson", json);
            // json.wl = false;
            if (json.wl == true) {
                preload();
                // preloadWithoutLoading();
            } else {
                // preload();
                preloadWithoutLoading();
                // preloadWithoutLoading();
            }
        },
        function () {
            return false;
        });
};

var openGame = function (game) {
    cc.loader.loadJs(game.jsList, function () {
        cc.loader.load(game.resource, function () {
            cc.loader.load(game.getSpines(), function () {
                cc.loader.load(game.plist, function () {
                    for (var i = 0; i < game.plist.length; i++) {
                        var plist = game.plist[i];
                        cc.spriteFrameCache.addSpriteFrames(plist);
                    }
                    game.open();
                    closeLoadingGame();
                    closeLoading();
                });
            });
        });
    });
}

var loadingPercentGame = function (percent) {
    if (sharedLoadingGame !== null) {
        sharedLoadingGame._label.setVisible(true);
        sharedLoadingGame._bich.setVisible(false);
        if (percent >= 100) {
            sharedLoadingGame._label.setString("Tải xong.");
        } else {
            sharedLoadingGame._label.setString(percent + "%");
        }
    }
}
