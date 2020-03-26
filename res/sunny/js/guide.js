sunny.Guide = BaseLayer.extend({
    BTN_CLOSE: 3,
    customizeGUI: function () {
        this.enableFog();

        this.notification = new cc.Sprite("#sunny/guide/bg_guide.png");
        this.addNodeChild(this.notification);

        this.btnClose = this.makeButton("sunny/popup/btn_close.png", this.BTN_CLOSE);
        this.btnClose.setPosition(cc.p(this.notification.width, this.notification.height * 0.9));
        this.notification.addChild(this.btnClose);
    },
    onButtonRelease: function (button, id) {
        // cc.log("onButtonRelease", id);
        switch (id) {
            case this.BTN_CLOSE:
                this.container.closeGuide();
                break;
        }
    },
    setContainer: function (container) {
        this.container = container;
    }

});

