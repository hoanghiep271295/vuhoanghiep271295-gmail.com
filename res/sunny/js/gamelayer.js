sunny.GameLayer = BaseLayer.extend({
    BTN_BACK: 1,
    BTN_PAUSE: 2,

    customizeGUI: function () {
        this.canon = new sunny.Canon();
        this.canon.setContainer(this);
        this.addNodeChild(this.canon);

        var btn = this.makeButton("Sunny/Sunny/btn_back.png", this.BTN_BACK);
        btn.setPosition(cc.p(-567, 310));
        this.addNodeChild(btn);

        var bar1 = new cc.Sprite("#Sunny/Sunny/bar1.png");
        bar1.setPosition(cc.p(-395, 310));
        this.addNodeChild(bar1);

        var sprite = new cc.Sprite("#Sunny/Sunny/heart0.png");
        sprite.setPosition(cc.p(-490, 310));
        this.addNodeChild(sprite);
        this.lstHeart = [];

        this.heart0 = new cc.Sprite("#Sunny/Sunny/heart1.png");
        this.heart0.setPosition(cc.p(sprite.width / 2, sprite.height / 2));
        sprite.addChild(this.heart0);

        this.lstHeart.push(this.heart0);

        var sprite = new cc.Sprite("#Sunny/Sunny/heart0.png");
        sprite.setPosition(cc.p(-442.5, 310));
        this.addNodeChild(sprite);

        this.heart1 = new cc.Sprite("#Sunny/Sunny/heart1.png");
        this.heart1.setPosition(cc.p(sprite.width / 2, sprite.height / 2));
        sprite.addChild(this.heart1);
        this.lstHeart.push(this.heart1);

        var sprite = new cc.Sprite("#Sunny/Sunny/heart0.png");
        sprite.setPosition(cc.p(-395, 310));
        this.addNodeChild(sprite);

        this.heart2 = new cc.Sprite("#Sunny/Sunny/heart1.png");
        this.heart2.setPosition(cc.p(sprite.width / 2, sprite.height / 2));
        sprite.addChild(this.heart2);
        this.lstHeart.push(this.heart2);

        var sprite = new cc.Sprite("#Sunny/Sunny/heart0.png");
        sprite.setPosition(cc.p(-347.5, 310));
        this.addNodeChild(sprite);

        this.heart3 = new cc.Sprite("#Sunny/Sunny/heart1.png");
        this.heart3.setPosition(cc.p(sprite.width / 2, sprite.height / 2));
        sprite.addChild(this.heart3);
        this.lstHeart.push(this.heart3);

        var sprite = new cc.Sprite("#Sunny/Sunny/heart0.png");
        sprite.setPosition(cc.p(-300, 310));
        this.addNodeChild(sprite);

        this.heart4 = new cc.Sprite("#Sunny/Sunny/heart1.png");
        this.heart4.setPosition(cc.p(sprite.width / 2, sprite.height / 2));
        sprite.addChild(this.heart4);
        this.lstHeart.push(this.heart4);

        var bar = new cc.Sprite("#Sunny/Sunny/bar2.png");
        bar.setPosition(cc.p(0, 310));
        this.addNodeChild(bar);

        var label = new cc.LabelTTF("Score :", "Arial", 40);
        label.setColor(cc.color("#ffffff"));
        label.setPosition(cc.p(-50, 305))
        this.addNodeChild(label);

        var label = this.totalScore = new cc.LabelTTF("0", "Arial", 40);
        label.setColor(cc.color("#ffffff"));
        label.setPosition(cc.p(77, 305))
        this.addNodeChild(label);

        var bar1 = new cc.Sprite("#Sunny/Sunny/bar1.png");
        bar1.setPosition(cc.p(395, 310));
        this.addNodeChild(bar1);

        var label = new cc.LabelTTF("HighScore :", "Arial", 30);
        label.setColor(cc.color("#ffffff"));
        label.setPosition(cc.p(360, 305))
        this.addNodeChild(label);

        var label = this.highScore = new cc.LabelTTF("0", "Arial", 35);
        label.setColor(cc.color("#ffffff"));
        label.setPosition(cc.p(475, 305))
        this.addNodeChild(label);

        var btn = this.makeButton("Sunny/Sunny/btn_pause.png", this.BTN_PAUSE);
        btn.setPosition(cc.p(567, 310));
        this.addNodeChild(btn);

        this.warn = new cc.Sprite("#Sunny/Sunny/warn.png");
        this.addNodeChild(this.warn);
        this.warn.setVisible(false);
    },

    setContainer: function (container) {
        this.container = container;
    },
    startGame: function () {
        sunny.sharedData.startGame();
        this.canon.startGame();
        this.restartHeart();
        this.updatePoint();
    },
    restartHeart: function () {
        for (var i = 0; i < this.lstHeart.length; i++) {
            this.lstHeart[i].setVisible(true);
        }
    },
    updateHeart: function (death) {
        for (var i = 0; i < death; i++) {
            this.lstHeart[i].setVisible(false);
        }
    },
    updatePoint: function () {
        // cc.log("sunny.sharedData.totalScore", sunny.sharedData.totalScore);
        this.totalScore.setString(sunny.sharedData.totalScore);
        this.highScore.setString(sunny.sharedData.highScore);

    },
    playWarnEffect: function () {
        // cc.log("playWarnEffect");
        this.warn.stopAllActions();
        this.warn.setVisible(true);
        this.warn.opacity = 0;
        var that = this;
        this.warn.runAction(cc.sequence(
            cc.fadeIn(0.2),
            cc.fadeOut(0.2),
            cc.callFunc(function () {
                that.warn.setVisible(false);
            })
        ));
    },
    endGame: function () {
        // cc.log("gamelayer endgame");
        sunny.sharedData.saveToLocal();
        this.container.showEndGame();
    },

    pauseGame: function () {
        this.canon.pauseGame();
        this.container.showSetting(false);
    },
    resumeGame: function () {
        this.canon.resumeGame();
    },
    onButtonRelease: function (button, id) {
        switch (id) {
            case this.BTN_BACK:
                this.onBack();
                break;
            case this.BTN_PAUSE:
                this.pauseGame();
                break;

        }
    },
    onBack: function () {
        this.canon.reset();
        this.container.onStart();
    }
});

