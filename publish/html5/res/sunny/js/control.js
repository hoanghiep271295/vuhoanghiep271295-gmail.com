sunny.Control = BaseLayer.extend({
    BTN_BACK: 1,
    BTN_REPLAY: 2,
    BTN_HOME: 3,
    customizeGUI: function () {
        var bg = new ccui.ImageView("Sunny/Sunny/fog.png", ccui.Widget.PLIST_TEXTURE);
        bg.setTouchEnabled(true);
        this.addChild(bg);

        var bg = new ccui.ImageView("Sunny/Sunny/popup.png", ccui.Widget.PLIST_TEXTURE);
        bg.setTouchEnabled(true);
        this.addChild(bg);

        var sprite = new cc.Sprite("#Sunny/Sunny/txt_gameover.png");
        sprite.setPosition(cc.p(0, 170));
        this.addChild(sprite);

        var label = new cc.LabelTTF("YOUR SCORE :", "Arial", 40);
        label.setColor(cc.color("#ffffff"));
        label.setPosition(cc.p(-60, 70));
        this.addChild(label);

        var label = this.totalScore = new cc.LabelTTF("0", "Arial", 40);
        label.setColor(cc.color("#ffffff"));
        label.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        label.setPosition(cc.p(110, 70));
        this.addChild(label);


        var label = new cc.LabelTTF("HIGH SCORE :", "Arial", 40);
        label.setColor(cc.color("#ffffff"));
        label.setPosition(cc.p(-60, -10));
        this.addChild(label);

        var label = this.highScore = new cc.LabelTTF("0", "Arial", 40);
        label.setColor(cc.color("#ffffff"));

        label.setPosition(cc.p(110, -10));
        this.addChild(label);

        var btn = this.makeButton("Sunny/Sunny/btn_home.png", this.BTN_HOME);
        btn.setPosition(cc.p(-93, -130));
        this.addChild(btn);

        var btn = this.makeButton("Sunny/Sunny/btn_replay.png", this.BTN_REPLAY);
        btn.setPosition(cc.p(93, -130));
        this.addChild(btn);

    },
    setContainer: function (container) {
        this.container = container;
    },
    updateEndGame: function () {
        this.totalScore.setString(sunny.sharedData.totalScore);
        this.highScore.setString(sunny.sharedData.highScore);
    },
    onButtonRelease: function (button, id) {
        switch (id) {
            case this.BTN_HOME:
                this.container.onStart();
                break;
            case this.BTN_REPLAY:
                this.container.onReplay();
                break;
        }
    }
});
