
sunny.SoundManager = cc.Class.extend({
    sound_bg: "res/Sound/sunny_bg2.mp3",
    sound_click: "res/Sound/sunny_click.mp3",
    sound_hurt: "res/Sound/sunny_hurt.mp3",
    sound_demage: "res/Sound/sunny_damage.mp3",
    sound_defeat: "res/Sound/sunny_defeat.mp3",
    sound_win: "res/Sound/sunny_win.mp3",
    ctor: function () {
    },
    soundEffect: function (url, loop) {
        var audioId = cc.audioEngine.playEffect(url, loop);
        return audioId;
    },
    stopAllEffect: function () {
        cc.audioEngine.stopAllEffects();
    },
    stopEfffectByID: function (id) {
        cc.audioEngine.stopEffect(id);
    },
    background: function () {
        if (sunny.sharedData.musicOn) {
            this.soundBG = this.soundEffect(this.sound_bg, true);
        }
    },
    stopbackground: function () {
        if (this.soundBG) {
            this.stopEfffectByID(this.soundBG);
        } else {
            this.stopAllEffect();
        }
    },
    die: function () {
        if (sunny.sharedData.soundOn) {
            this.soundEffect(this.sound_win, false);
        }
    },
    hurt: function () {
        if (sunny.sharedData.soundOn) {
            this.soundEffect(this.sound_hurt, false);
        }
    },
    demage: function () {
        if (sunny.sharedData.soundOn) {
            this.soundEffect(this.sound_demage, false);
        }
    },
    defeat: function () {
        if (sunny.sharedData.soundOn) {
            this.soundEffect(this.sound_defeat, false);
        }
    }
});

sunny.sharedSound = new sunny.SoundManager();