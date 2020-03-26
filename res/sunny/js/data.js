sunny.Data = cc.Class.extend({
    ctor: function () {
        this.MAX_LIVE = 5;
        this.TIME_CHUAN = 12;
        this.speed = 1;
        this.adjustSpeed = 1;
        this.timeSpawnAnt = 1;

        this.highScore = 0;
        this.totalScore = 0;

        this.musicOn = true;
        this.soundOn = true;
    },
    startGame: function () {
        this.speed = 1;
        this.adjustSpeed = 1;
        this.timeSpawnAnt = 1;
        this.totalScore = 0;
    },
    addPoint: function (points) {
        if (points && points > 0) {
            this.totalScore += points;
        }
    },
    getDataLocal: function () {
        var highScore = cc.sys.localStorage.getItem("highScore");
        if (highScore) {
            this.highScore = highScore;
        }
    },
    saveToLocal: function () {
        if (this.totalScore > this.highScore) {
            this.highScore = this.totalScore;
            cc.sys.localStorage.setItem("highScore", this.totalScore);
        }
    }
});

sunny.sharedData = new sunny.Data();

sunny.configHP = [
    1, 2, 1, 2, 2, 1, 1, 2
];

