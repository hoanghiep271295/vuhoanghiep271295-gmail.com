var sunny = {};


sunny.jsList = [
    "res/sunny/js/control.js",
    "res/sunny/js/icon.js",
    "res/sunny/js/canon.js",
    "res/sunny/js/data.js",
    "res/sunny/js/gui.js",
    "res/sunny/js/root.js",
    "res/sunny/js/gamelayer.js",
    "res/sunny/js/setting.js",
    "res/sunny/js/guide.js",
    "res/sunny/js/soundmanager.js",
];

sunny.resource = [
    "res/sunny/res/sunny.png",
    "res/fonts/fontMinigame.fnt",
    "res/fonts/fontMinigame.png",
    "res/Sound/nhacnen_cut.mp3",
    "res/Sound/sound_click.mp3"
];

sunny.Fonts =
{
    fontMinigame: "res/fonts/fontMinigame.fnt",
};

sunny.plist = [
    "res/sunny/res/sunny.plist"
];


sunny.getSpines = function () {
    var spines = [];
    for (var i in sunny.spines) {
        var data = sunny.spines[i];
        spines.push(data.png);
        spines.push(data.json);
        spines.push(data.atlas);
    }
    return spines;
}
