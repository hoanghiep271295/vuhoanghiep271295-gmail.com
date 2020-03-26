var BaseLayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        initialied = false;
        this._fog = null;
        this.node = new cc.Node();
        this.addChild(this.node);
    },
    addNodeChild: function (child, localZOrder, tag) {
        if (localZOrder === undefined) {
            this.node.addChild(child);
        } else if (tag === undefined) {
            this.node.addChild(child, localZOrder);
        } else {
            this.node.addChild(child, localZOrder, tag);
        }
    },
    onEnter: function () {
        cc.Layer.prototype.onEnter.call(this);
        this.setContentSize(cc.winSize);
        this.setAnchorPoint(cc.p(.5, .5));
        if (!this.initialied) {
            this.customizeGUI();
            this.initialied = true;
        }
    },
    makeButtonWithLabel: function (texture, labelText, tag) {
        var btn = new ccui.Button(texture, "", "", ccui.Widget.PLIST_TEXTURE);
        btn.setTag(parseInt(tag) || 0);
        btn.addTouchEventListener(this.onTouchEventHandler, this);
        btn.setTitleText(labelText);
        btn.setTitleFontSize(btn.getContentSize().height / 3);
        return btn;
    },
    makeButton: function (texture, tag) {
        var btn = new ccui.Button(texture, "", "", ccui.Widget.PLIST_TEXTURE);
        btn.setAnchorPoint(cc.p(0.5, 0.5));
        btn.setTag(parseInt(tag) || 0);
        btn.addTouchEventListener(this.onTouchEventHandler, this);
        if ('mouse' in cc.sys.capabilities) {
            sharedScene.btns.push(btn);
        }
        return btn;
    },

    makeButtonLocalTexture: function (texture, tag) {
        var btn = new ccui.Button(texture, "", "", ccui.Widget.LOCAL_TEXTURE);
        btn.setTag(parseInt(tag) || 0);
        btn.addTouchEventListener(this.onTouchEventHandler, this);
        return btn;
    },

    makeButtonWith3Image: function (normalImage, selectedImage, disableImage, tag) {
        var btn = new ccui.Button(normalImage, selectedImage, disableImage, ccui.Widget.PLIST_TEXTURE);
        btn.setTag(parseInt(tag) || 0);
        btn.addTouchEventListener(this.onTouchEventHandler, this);
        if ('mouse' in cc.sys.capabilities) {
            sharedScene.btns.push(btn);
        }
        return btn;
    },

    makeButtonNormal: function (texture, tag) {
        var btn = new ccui.Button(texture);
        btn.setTag(parseInt(tag) || 0); TEXT_ALIGNMENT_CENTER
        btn.addTouchEventListener(this.onTouchEventHandler, this);
        return btn;
    },
    enableFog: function () {
        this.showFog();
        this._listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function () {
                return true;
            },
            onTouchMoved: function () {
                return true;
            },
            onTouchEnded: function () {
                return true;
            }
        });
        this._listener.retain();
    },
    showFog: function () {
        if (!this._fog) {
            this._fog = new cc.LayerColor(cc.color.BLACK, DESIGN_SCREEN.width, DESIGN_SCREEN.height);
            this._fog.setPosition(-DESIGN_SCREEN.width / 2, -DESIGN_SCREEN.height / 2);
            this._fog.setVisible(true);
            this.addChild(this._fog, -999);
        }
        this._fog.runAction(cc.fadeTo(0.2, 50));
    },
    hideFog: function () {
        if (this._fog !== null) {
            this._fog.runAction(cc.fadeTo(0.2, 0));
        }
    },
    onTouchEventHandler: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                this.onButtonTouched(sender, sender.getTag());
                break;
            case ccui.Widget.TOUCH_ENDED:
                this.onButtonRelease(sender, sender.getTag());
                break;
        }
    },
    show: function () {
        this.setVisible(true);
        if (this._fog !== null) {
            this._fog.runAction(cc.fadeTo(0.2, 150));
            cc.eventManager.addListener(this._listener, this);
        }
        this.showComplete();
    },
    hide: function () {
        this.setVisible(false);
        if (this._fog !== null) {
            this._fog.runAction(cc.fadeTo(0.2, 0));
            cc.eventManager.removeListener(this._listener);
        }
    },
    open: function (time, from, to) {
        this.node.setPosition(from);
        var moveTo = cc.moveTo(time, to);
        this.node.runAction(cc.sequence(cc.callFunc(this.show.bind(this)), moveTo));
    },
    close: function (time, from, to) {
        this.node.setPosition(from);
        var moveTo = cc.moveTo(time, to);
        this.node.runAction(cc.sequence(moveTo, cc.callFunc(this.hide.bind(this))));
    },
    closeToOutScreen: function () {
        this.node.setPosition(cc.p(0, DESIGN_SCREEN.height));
        this.hide();
    },
    openFromOutScreen: function () {
        this.node.setPosition(cc.p(0, 0));
        this.show();
    },
    openFromTop: function () {
        this.node.setPosition(cc.p(0, DESIGN_SCREEN.height));
        var moveTo = cc.moveTo(0.2, cc.p(0, 0));
        this.node.runAction(cc.sequence(cc.callFunc(this.show.bind(this)), moveTo));
    },
    closeToTop: function () {
        this.node.setPosition(cc.p(0, 0));
        var moveTo = cc.moveTo(0.2, cc.p(0, DESIGN_SCREEN.height));
        this.node.runAction(cc.sequence(moveTo, cc.callFunc(this.hide.bind(this))));
    },
    openFromDown: function () {
        this.node.setPosition(cc.p(0, -DESIGN_SCREEN.height));
        var moveTo = cc.moveTo(0.2, cc.p(0, 0));
        this.node.runAction(cc.sequence(cc.callFunc(this.show.bind(this)), moveTo));
    },
    closeToDown: function () {
        this.node.setPosition(cc.p(0, 0));
        var moveTo = cc.moveTo(0.2, cc.p(0, -DESIGN_SCREEN.height));
        this.node.runAction(cc.sequence(moveTo, cc.callFunc(this.hide.bind(this))));
    },
    openFromLeft: function () {
        this.node.setPosition(cc.p(-DESIGN_SCREEN.width, 0));
        var moveTo = cc.moveTo(0.2, cc.p(0, 0));
        this.node.runAction(cc.sequence(cc.callFunc(this.show.bind(this)), moveTo));
    },
    closeToLeft: function () {
        this.node.setPosition(cc.p(0, 0));
        var moveTo = cc.moveTo(0.2, cc.p(-DESIGN_SCREEN.width, 0));
        this.node.runAction(cc.sequence(moveTo, cc.callFunc(this.hide.bind(this))));
    },
    openFromRight: function () {
        this.node.setPosition(cc.p(DESIGN_SCREEN.width, 0));
        var moveTo = cc.moveTo(0.2, cc.p(0, 0));
        this.node.runAction(cc.sequence(cc.callFunc(this.show.bind(this)), moveTo));
    },
    closeToRight: function () {
        this.node.setPosition(cc.p(0, 0));
        var moveTo = cc.moveTo(0.2, cc.p(DESIGN_SCREEN.width, 0));
        this.node.runAction(cc.sequence(moveTo, cc.callFunc(this.hide.bind(this))));
    },
    openFromBehind: function () {
        this.setPosition(cc.p(0, 0));
        this.node.setScale(0);
        var scaleTo = cc.scaleTo(0.2, 1);
        this.node.runAction(cc.sequence(cc.callFunc(this.show.bind(this)), scaleTo));
    },
    closeToBehind: function () {
        this.node.setScale(1);
        var scaleTo = cc.scaleTo(0.2, 0);
        this.node.runAction(cc.sequence(scaleTo, cc.callFunc(this.hide.bind(this))));
    },
    showComplete: function () { },
    /******* functions need override  *******/
    customizeGUI: function () {
    },

    onButtonRelease: function (button, id) {
    },

    onButtonTouched: function (button, id) {
    },
    clearListText: function () {
        if (this.listViewText) {
            this.listViewText.removeAllChildren();
        }
    },
    createListText: function (size, array, colorCommon, fontSize) {
        var listView = this.listViewText = null;
        if (!this.listViewText) {
            listView = this.listViewText = this.createListView(size);
        }
        listView.setContentSize(size);
        for (var j = 0; j < array.length; j++) {
            var rickText = new ccui.RichText();
            if (!cc.sys.isNative) {
                rickText.setLineBreakOnSpace(true);
            }
            var content = array[j];
            if (content[0] instanceof Array) {
                for (var i = 0; i < content.length; i++) {
                    rickText.pushBackElement(createRickElement.apply(this, content[i]));
                }
            } else {
                rickText.pushBackElement(createRickElement.apply(this, content));
            }
            rickText.formatText();
            listView.pushBackCustomItem(rickText);
        }
        function createRickElement(noidung, color) {
            var lbgold = null;
            if (color && color.search("isSprite") > -1) {
                if (cc.spriteFrameCache.getSpriteFrame(noidung)) noidung = "#" + noidung;
                lbgold = new ccui.RichElementCustomNode(0, cc.color.WHITE, 255, new cc.Sprite(noidung));
            } else {
                color = color || colorCommon;
                lbgold = new ccui.RichElementText(1, cc.color(color), 255, noidung, "Arial", fontSize);
            }
            return lbgold;
        }
        return listView;
    },
    createListView: function (size) {
        var listview = new ccui.ListView();
        listview.setDirection(ccui.ScrollView.DIR_VERTICAL);
        listview.setTouchEnabled(true);
        listview.setBounceEnabled(true);
        listview.setClippingEnabled(true);
        listview.setScrollBarEnabled(true);
        listview.setContentSize(size);
        return listview;
    },
    addLayout: function (parent, name, position, image, size, isTouch) {
        this[name] = new ccui.Layout();
        this[name].setAnchorPoint(0.5, 0.5);
        this[name].setContentSize(size);
        this[name].setTouchEnabled(isTouch);
        this[name].setCascadeOpacityEnabled(true);
        if (image != null) {
            if (cc.spriteFrameCache.getSpriteFrame(image)) {
                this[name].setBackGroundImage(image, ccui.Widget.PLIST_TEXTURE);
            } else {
                this[name].setBackGroundImage(image, ccui.Widget.LOCAL_TEXTURE);
            }
        }
        this[name].setPosition(position);

        parent.addChild(this[name]);
    },
    addSprite: function (parent, pos, image) {
        var sprite = new cc.Sprite();
        if (image) {
            sprite.initWithSpriteFrameName(image);
        }
        sprite.setPosition(pos);
        parent.addChild(sprite);
        return sprite;
    },

    addText: function (parent, position, string, fontName, fontSize) {
        var text = new ccui.Text(string, fontName, fontSize);
        text.setPosition(position);
        text.setAnchorPoint(0.5, 0.5);
        parent.addChild(text);
        return text;
    },

    addImage: function (parent, name, position, image, size) {
        if (cc.spriteFrameCache.getSpriteFrame(image)) {
            this[name] = new ccui.ImageView(image, ccui.Widget.PLIST_TEXTURE);
        } else {
            this[name] = new ccui.ImageView(image, ccui.Widget.LOCAL_TEXTURE);
        }

        this[name].setScale9Enabled(true);
        this[name].setPosition(position);
        this[name].setAnchorPoint(0.5, 0.5);
        this[name].setContentSize(size);
        this[name].setCascadeOpacityEnabled(true);
        parent.addChild(this[name]);
    },

    addListView: function (parent, name, position, size) {
        this[name] = new ccui.ListView();
        this[name].setDirection(ccui.ScrollView.DIR_VERTICAL);
        this[name].setTouchEnabled(true);
        this[name].setBounceEnabled(true);
        this[name].setClippingEnabled(true);
        this[name].setContentSize(size);
        this[name].setPosition(position);
        this[name].setAnchorPoint(cc.p(0.5, 0.5));
        parent.addChild(this[name]);
    }
});

// BaseLayer.sharedLayer = null;



