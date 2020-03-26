sunny.Canon = BaseLayer.extend({
    customizeGUI: function () {
    },
    setContainer: function (container) {
        this.container = container;
    },
    startGame: function () {
        this.death = 0;
        this.removeAllChildren();
        this.doSchedule();
    },
    reset: function () {
        cc.log("canon reset");
        this.removeAllChildren();
        this.unDoSchedule();
    },
    pauseGame: function () {
        cc.log("canon PauseGame");
        this.unDoSchedule();
        for (var i = 0; i < this._children.length; i++) {
            this._children[i].pause();
        }
    },
    resumeGame: function () {
        cc.log("canon resumeGame");
        this.doSchedule();
        for (var i = 0; i < this._children.length; i++) {
            this._children[i].resume();
        }
    },
    endGame: function () {
        this.pauseGame();
        this.container.endGame();
        this.unDoSchedule();
        for (var i = 0; i < this._children.length; i++) {
            this._children[i].stopAllActions();
        }
    },
    scheduleAnt: function () {
        // cc.log("scheduleAnt");
        let rand = Math.random();
        if (rand < 0.02) {
            this.spawnFast5();
        } else if (rand < 0.1) {
            this.spawnFast3();
        } else {
            this.spawnVirus((Math.random() - 0.5) * (DESIGN_SCREEN.width - 175) + 50);
        }
    },
    increaseSpeed: function () {
        // cc.log("increaseSpeed");
        sunny.sharedData.adjustSpeed = sunny.sharedData.adjustSpeed * 1.1;
        if (sunny.sharedData.timeSpawnAnt < 0.1) {
            sunny.sharedData.timeSpawnAnt = 0.1;
        }
    },
    doSchedule: function () {
        cc.log("doSchedule");
        this.schedule(this.scheduleAnt, sunny.sharedData.timeSpawnAnt);
        this.schedule(this.increaseSpeed, 10);
    },
    unDoSchedule: function () {
        cc.log("unDoSchedule");
        this.unschedule(this.scheduleAnt);
        this.unschedule(this.increaseSpeed);
    },
    random: function () {
        return Math.floor(Math.random() * 8);
    },
    spawnVirus(position) {
        var ran = this.random();
        var fakeIcon = new sunny.Icon(ran);
        this.addChild(fakeIcon);
        var startY = DESIGN_SCREEN.width / 2 + 50;
        var endY = -DESIGN_SCREEN.height / 2 - 50;
        fakeIcon.move(position, startY, position, endY, sunny.sharedData.adjustSpeed, this.hitWall.bind(this));
    },
    spawnFast3: function () {
        this.spawnVirus(0);
        this.spawnVirus(350);
        this.spawnVirus(-350);
    },
    spawnFast5: function () {
        this.spawnVirus(0);
        this.spawnVirus(250);
        this.spawnVirus(-240);
        this.spawnVirus(500);
        this.spawnVirus(-480);
    },
    hitWall() {
        this.playWarnEffect();
        this.death++;
        if (this.death >= 5) {
            this.death = 5;
        }
        this.updateHeart();
        if (this.death >= sunny.sharedData.MAX_LIVE) {
            sunny.sharedSound.defeat();
            this.endGame();
        } else {
            sunny.sharedSound.demage();
        }
    },
    updateHeart: function () {
        this.container.updateHeart(this.death);
    },
    playWarnEffect: function () {
        this.container.playWarnEffect();
    }
});

