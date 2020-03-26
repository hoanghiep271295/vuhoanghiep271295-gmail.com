sunny.Root = BaseLayer.extend({
    customizeGUI: function () {
        this.enableFog();
        sunny.openGame();
    }
});

sunny.root = null;

sunny.open = function () {
    if (sunny.root == null) {
        sunny.root = new sunny.Root();
        sharedScene.addMiniGame(sunny.root);

    }
    sunny.root.openFromBehind();
}

sunny.close = function () {
    if (sunny.root != null) {
        sunny.root.closeToBehind();
    }
}

sunny.onDisconnected = function () {
    // cc.log("sunny Disconnected");
    sunny.close();
}