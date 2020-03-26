sunny.Icon = cc.Sprite.extend({
    ctor: function (config) {
        this._super();
        this.initGUI(config);
        this.hp = config;
        this.hp = sunny.configHP[config];
        this.point = this.randomPoint();
        this.initListener();
    },
    initGUI: function (i) {
        this.initWithSpriteFrameName("Sunny/Sunny/icon/icon_" + i + ".png");
    },
    randomPoint: function () {
        return Math.floor(Math.random() * 3) + 1;
    },
    initListener: function () {
        var that = this;
        var touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    if (that.hp <= 0) return;
                    that.runAction(cc.sequence(
                        cc.tintTo(0.1, 0, 255, 0),
                        cc.tintTo(0.1, 255, 255, 255)
                    ));
                    that.hp--;
                    if (that.hp <= 0) {
                        sunny.sharedSound.die();
                        that.die();
                    } else {
                        sunny.sharedSound.hurt();
                    }
                    var scale = 1;
                    that.runAction(cc.sequence(
                        cc.scaleTo(0.5 / (sunny.sharedData.speed * sunny.sharedData.speed), 1.1 * scale).easing(cc.easeSineInOut()),
                        cc.scaleTo(0.5 / (sunny.sharedData.speed * sunny.sharedData.speed), scale).easing(cc.easeSineInOut())
                    ).repeatForever());
                }
                return false;
            }
        });
        cc.eventManager.addListener(touchListener, this);
    },
    die: function () {
        var that = this;
        this.scheduleOnce(function () {
            that.removeFromParent()
        }, 0.2); // 1.5 second
        sunny.sharedData.addPoint(this.point);
        sunny.sharedLayer.updatePoint();
    },
    move: function (x1, y1, x2, y2, adjustSpeed, onDone) {
        var that = this;
        this.x = x1;
        this.y = y1;
        this.runAction(cc.sequence(
            cc.moveTo(sunny.sharedData.TIME_CHUAN / (sunny.sharedData.speed * adjustSpeed), x2, y2),
            cc.callFunc(function () {
                that.removeFromParent()
                onDone();
            })
        ));
    }
});






