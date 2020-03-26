sunny.Layer = BaseLayer.extend({
    BTN_START: 1,
    BTN_BACK: 2,
    BTN_SETTING: 3,
    customizeGUI: function () {
        var bg = new cc.Sprite("#Sunny/Sunny/bg.png");
        this.addNodeChild(bg);

        var node = this.nodeGui = new cc.Node();
        this.addNodeChild(node);

        var title = new cc.Sprite("#Sunny/Sunny/logo.png");
        title.setPosition(cc.p(0, 100));
        node.addChild(title);

        var btn = this.makeButton("Sunny/Sunny/btn_play.png", this.BTN_START);
        btn.setPosition(cc.p(0, -175));
        node.addChild(btn);

        if (cc.sys.isNative) {
            var btn = this.makeButton("Sunny/Sunny/btn_back.png", this.BTN_BACK);
            btn.setPosition(cc.p(-567, 310));
            node.addChild(btn);
        }

        var btn = this.makeButton("Sunny/Sunny/btn_setting.png", this.BTN_SETTING);
        btn.setPosition(cc.p(567, 310));
        node.addChild(btn);

        var label = new cc.LabelTTF("1.4.8", "Arial", 25);
        label.setColor(cc.color("#8D4352"));
        label.setPosition(cc.p(-600, -320))
        this.addNodeChild(label);


        this.gameLayer = new sunny.GameLayer();
        this.gameLayer.setContainer(this);
        this.addNodeChild(this.gameLayer);
        this.gameLayer.setVisible(false);

        this.control = new sunny.Control();
        this.control.setContainer(this);
        this.addNodeChild(this.control);
        this.control.setVisible(false);

        this.setting = new sunny.MenuSetting();
        this.setting.setContainer(this);
        this.addNodeChild(this.setting);
        this.setting.setVisible(false);
    },

    updatePoint: function () {
        this.gameLayer.updatePoint();
    },

    onStart: function () {
        sunny.sharedSound.stopAllEffect();
        this.nodeGui.setVisible(true);
        this.gameLayer.setVisible(false);
        this.setting.setVisible(false);
        this.control.setVisible(false);
    },

    startGame: function () {
        sunny.sharedSound.background();
        this.nodeGui.setVisible(false);
        this.gameLayer.setVisible(true);
        this.setting.setVisible(false);
        this.control.setVisible(false);

        this.gameLayer.startGame();
    },
    onReplay: function () {
        this.gameLayer.startGame();
        this.control.setVisible(false);
    },

    openGuide: function () {
        this.guide.setVisible(true);
    },
    closeGuide: function () {
        this.guide.setVisible(false);
    },

    onButtonRelease: function (button, id) {
        switch (id) {
            case this.BTN_BACK:
                this.onBack();
                break;
            case this.BTN_START:
                this.startGame();
                break;
            case this.BTN_SETTING:
                this.showSetting(true);
                break;
        }
    },
    showSetting: function (isHome) {
        this.setting.setVisible(true);
        this.setting.showButton(isHome);
        this.setting.updateSound();
    },
    continueGame: function () {
        this.setting.setVisible(false);
        this.gameLayer.resumeGame();
    },
    showEndGame: function () {
        this.control.setVisible(true);
        this.control.updateEndGame();
    },

    hideEndGame: function () {
        this.control.setVisible(false);
    },
    onBack: function () {
        cc.director.end();
    },

});

sunny.sharedLayer = null;
sunny.openGame = function () {
    if (sunny.sharedLayer == null) {
        sunny.sharedLayer = new sunny.Layer();
        sunny.root.addNodeChild(sunny.sharedLayer);
    }
    sunny.sharedData.getDataLocal();
}
sunny.closeGame = function () {
    if (sunny.sharedLayer != null) {
        sunny.sharedLayer.closeToBehind();
    }
}

sunny.showNotification = function (text) {
    sunny.sharedLayer.notification.showNotification(text);
}
