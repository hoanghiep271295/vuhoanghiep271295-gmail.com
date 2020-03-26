var RectMask = cc.Node.extend({
    ctor: function (width, height) {
        this._super();
        var stencil = new cc.DrawNode();
        stencil.drawRect(cc.p(-width, -height), cc.p(width, height), cc.color.BLACK, 0, cc.color.BLACK);
        stencil.setOpacity(0);
        this.clipper = new cc.ClippingNode(stencil);
        this.addChild(this.clipper);
    },
    addMaskChild: function (child) {
        this.clipper.addChild(child);
    }
});