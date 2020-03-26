sunny.MenuSetting = BaseLayer.extend({
    BTN_SOUND_ON: 1,
    BTN_SOUND_OFF: 2,
    BTN_MUSIC_ON: 3,
    BTN_MUSIC_OFF: 4,
    BTN_RESUME: 5,
    BTN_HOME: 6,
    customizeGUI: function () {

        var bg = new ccui.ImageView("Sunny/Sunny/fog.png", ccui.Widget.PLIST_TEXTURE);
        bg.setTouchEnabled(true);
        this.addChild(bg);

        var bg = new ccui.ImageView("Sunny/Sunny/popup.png", ccui.Widget.PLIST_TEXTURE);
        bg.setTouchEnabled(true);
        this.addChild(bg);

        var sprite = new cc.Sprite("#Sunny/Sunny/txt_setting.png");
        sprite.setPosition(cc.p(0, 170));
        this.addChild(sprite);

        var label = new cc.LabelTTF("MUSIC:", "Arial", 40);
        label.setColor(cc.color("#ffffff"));
        label.setPosition(cc.p(-100, 70));
        this.addChild(label);

        var btn = this.btnMusicOn = this.makeButton("Sunny/Sunny/btn_on.png", this.BTN_MUSIC_ON);
        btn.setPosition(cc.p(92, 75));
        this.addChild(btn);

        var btn = this.btnMusicOff = this.makeButton("Sunny/Sunny/btn_off.png", this.BTN_MUSIC_OFF);
        btn.setPosition(cc.p(92, 75));
        btn.setVisible(false);
        this.addChild(btn);


        var label = new cc.LabelTTF("SOUND:", "Arial", 40);
        label.setColor(cc.color("#ffffff"));
        label.setPosition(cc.p(-100, -10));
        this.addChild(label);

        var btn = this.btnSoundOn = this.makeButton("Sunny/Sunny/btn_on.png", this.BTN_SOUND_ON);
        btn.setPosition(cc.p(92, -5));
        this.addChild(btn);

        var btn = this.btnSoundOff = this.makeButton("Sunny/Sunny/btn_off.png", this.BTN_SOUND_OFF);
        btn.setPosition(cc.p(92, -5));
        btn.setVisible(false);
        this.addChild(btn);


        var btn = this.btnResume = this.makeButton("Sunny/Sunny/btn_resume.png", this.BTN_RESUME);
        btn.setPosition(cc.p(0, -130));
        this.addChild(btn);



        var btn = this.btnHome = this.makeButton("Sunny/Sunny/btn_ok.png", this.BTN_HOME);
        btn.setPosition(cc.p(0, -130));
        this.addChild(btn);

        this.isHome = false;
    },
    showButton(isHome) {
        this.isHome = isHome;
        if (isHome) {
            this.btnResume.setVisible(false);
            this.btnHome.setVisible(true);
        }
        else {
            this.btnResume.setVisible(true);
            this.btnHome.setVisible(false);
        }
    },
    updateSound: function () {
        if (sunny.sharedData.soundOn) {
            this.btnSoundOff.setVisible(true);
            this.btnSoundOn.setVisible(false);
        }
        else {
            this.btnSoundOff.setVisible(false);
            this.btnSoundOn.setVisible(true);
        }
        if (sunny.sharedData.musicOn) {
            this.btnMusicOff.setVisible(true);
            this.btnMusicOn.setVisible(false);
        }
        else {
            this.btnMusicOff.setVisible(false);
            this.btnMusicOn.setVisible(true);
        }
    },
    musicEffect: function () {
        if (!sunny.sharedData.musicOn) {
            sunny.sharedSound.stopbackground();
        } else {
            sunny.sharedSound.background();
        }
    },
    setContainer: function (container) {
        this.container = container;
    },
    onButtonRelease: function (button, id) {
        switch (id) {
            case this.BTN_MUSIC_ON:
            case this.BTN_MUSIC_OFF:
                sunny.sharedData.musicOn = !sunny.sharedData.musicOn;
                this.updateSound();
                if (!this.isHome) {
                    this.musicEffect();
                }
                break;
            case this.BTN_SOUND_ON:
            case this.BTN_SOUND_OFF:
                sunny.sharedData.soundOn = !sunny.sharedData.soundOn;
                this.updateSound();
                break;
            case this.BTN_RESUME:
                this.container.continueGame();
                break;
            case this.BTN_HOME:
                this.container.onStart();
                break;
        }
    }
});
