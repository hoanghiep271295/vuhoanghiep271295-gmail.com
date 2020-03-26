var BaseScene = cc.Scene.extend({
    ctor: function () {
        this._super();
        this.init();
        this.btnHover();
    },
    btnHover: function () {
        if ('mouse' in cc.sys.capabilities) {
            this.btns = [];
            var that = this;
            this.mouseListener = cc.EventListener.create({
                event: cc.EventListener.MOUSE,
                onMouseDown: function (event) {
                },
                onMouseMove: function (event) {
                    var cursor = "default";
                    var location = event.getLocation();
                    for (var i = 0; i < that.btns.length; i++) {
                        var target = that.btns[i];
                        var s = target.getContentSize();
                        var p = target.convertToNodeSpace(location);
                        var rect = cc.rect(0, 0, s.width, s.height);
                        var intersect = cc.rectContainsPoint(rect, p);
                        if (intersect) {
                            if (target.canEdit) {
                                cursor = "text";
                            } else {
                                cursor = "pointer";
                            }
                            if (!cc.sys.isNative) {
                                cc._canvas.style.cursor = cursor;
                            }
                            if (target.onMouseHover) {
                                target.onMouseHover();
                            }
                            return true;
                        } else {
                            if (target.onMouseHoverEnd) {
                                target.onMouseHoverEnd();
                            }
                        }
                    }
                    if (!cc.sys.isNative) {
                        cc._canvas.style.cursor = cursor;
                    }
                    return false;
                },
                onMouseUp: function (event) {

                }
            });
            cc.eventManager.addListener(this.mouseListener, this);
        }
    },
    init: function () {
        //Background
        this.background = new cc.Layer();
        var bg = new cc.Sprite();
        bg.initWithSpriteFrameName("bg.png");
        this.background.addChild(bg);
        scaleToSize(bg, cc.winSize);
        var dx = cc.winSize.width / 2;
        var dy = cc.winSize.height / 2;
        this.background.setPosition(dx, dy);
        this.addChild(this.background);

        this.root = new cc.Layer();
        this.addChild(this.root);
        this.root.setPosition(dx, dy + (dy - DESIGN_SCREEN.height / 2));
        this.root.setContentSize(this.background.getContentSize());

        //layer cointain gui
        this.gui = new cc.Layer();
        this.root.addChild(this.gui);

        //layer contain game
        this.game = new cc.Layer();
        this.root.addChild(this.game);

        //layer contain game
        this.miniGame = new cc.Layer();
        this.root.addChild(this.miniGame);

        //layer contain popup
        this.popup = new cc.Layer();
        this.root.addChild(this.popup);

        //layer contain loading
        this.loading = new cc.Layer();
        this.root.addChild(this.loading);
    },
    addChildToComponent: function (component, child, localZOrder, tag) {
        if (localZOrder === undefined) {
            component.addChild(child);
        } else if (tag === undefined) {
            component.addChild(child, localZOrder);
        } else {
            component.addChild(child, localZOrder, tag);
        }
    },
    addBG: function (child, localZOrder, tag) {
        this.addChildToComponent(this.background, child, localZOrder, tag);
    },
    addGUI: function (child, localZOrder, tag) {
        this.addChildToComponent(this.gui, child, localZOrder, tag);
    },
    addGame: function (child, localZOrder, tag) {
        this.addChildToComponent(this.game, child, localZOrder, tag);
    },
    addMiniGame: function (child, localZOrder, tag) {
        this.addChildToComponent(this.miniGame, child, localZOrder, tag);
    },
    addPopup: function (child, localZOrder, tag) {
        this.addChildToComponent(this.popup, child, localZOrder, tag);
    },
    addLoading: function (child, localZOrder, tag) {
        this.addChildToComponent(this.loading, child, localZOrder, tag);
    },
    screenshot: function () {
        cc.log("screenshot");
        if (cc.sys.isNative) {
            var tex = new cc.RenderTexture(DESIGN_SCREEN.WIDTH, DESIGN_SCREEN.HEIGHT);
            tex.begin();
            this.visit();
            tex.end();
            return new cc.Sprite(tex);
        } else {
            var canvas = document.getElementById("gameCanvas");
            var dataUrl = canvas.toDataURL();
            return dataUrl;
        }
    }
});

var sharedScene = null;