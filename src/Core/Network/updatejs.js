function checkUpdateManifest(a, b) {
    if (a.getLocalManifest().isLoaded()) {
        var c = new jsb.EventListenerAssetsManager(a, function (a) {
            cc.log("event.getEventCode() Check Update " + a.getEventCode());
            switch (a.getEventCode()) {
                case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                    b && b.getChildByTag(999).setVisible(!0)
            }
        });
        cc.eventManager.addListener(c, b);
        a.checkUpdate()
    } else b.getChildByTag(999).setVisible(!1), a.release()
}
//
// function updateManifest(a, b, c) {
//     if (cc.sys.isNative) if (a.getLocalManifest().isLoaded()) {
//         var d = 0, e = 0, f = new jsb.EventListenerAssetsManager(a, function (g) {
//             cc.log("event.getEventCode() Update " + g.getEventCode());
//             switch (g.getEventCode()) {
//                 case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
//                     cc.log("No local manifest file found, skip assets update.");
//                     b(!0, 0, !1, "No local manifest file found, skip assets update.", c);
//                     cc.eventManager.removeListener(f);
//                     break;
//                 case jsb.EventAssetsManager.UPDATE_PROGRESSION:
//                     cc.log("getPercent " +
//                         g.getPercent());
//                     cc.log("getPercentByFile " + g.getPercentByFile());
//                     var h = g.getMessage();
//                     h && cc.log(h);
//                     e++;
//                     cc.log("fileCount " + e);
//                     b(!1, g.getPercentByFile(), !1, "", c);
//                     break;
//                 case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
//                 case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
//                     cc.log("Fail to download manifest file, update skipped.");
//                     b(!0, 0, !1, "Fail to download manifest file, update skipped.", c);
//                     cc.eventManager.removeListener(f);
//                     break;
//                 case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
//                 case jsb.EventAssetsManager.UPDATE_FINISHED:
//                     cc.log("Update finished. " +
//                         g.getMessage());
//                     b(!1, 100, !0, "", c);
//                     cc.eventManager.removeListener(f);
//                     a.release();
//                     break;
//                 case jsb.EventAssetsManager.UPDATE_FAILED:
//                     cc.log("Update failed. " + g.getMessage());
//                     d++;
//                     5 > d ? a.downloadFailedAssets() : (cc.log("Reach maximum fail count, exit update process"), d = 0, b(!0, 0, !1, "Reach maximum fail count, exit update process", c), cc.eventManager.removeListener(f));
//                     break;
//                 case jsb.EventAssetsManager.ERROR_UPDATING:
//                     cc.log("Asset update error: " + g.getAssetId() + ", " + g.getMessage());
//                     break;
//                 case jsb.EventAssetsManager.ERROR_DECOMPRESS:
//                     cc.log(g.getMessage())
//             }
//         });
//         cc.eventManager.addEventListenerWithFixedPriority(f, 1);
//         a.update()
//     } else cc.log("Fail to update assets, step skipped."), b(!0, 0, !1, "Fail to update assets, step skipped.", c)
// }
//
// VPItemSlots = ccui.Button.extend({
//     _spComingSoon: null,
//     _size: null,
//     _spStatus: null,
//     _lbPrize: null,
//     _lbPotRoom1: null,
//     _lbPotRoom2: null,
//     _lbPotRoom3: null,
//     _spX2PotRoom1: null,
//     _spX2PotRoom2: null,
//     _spX2PotRoom3: null,
//     _LayerThangLon: null,
//     _layerNoHu: null,
//     _spGrowThangLon: null,
//     _spGrowNoHu: null,
//     _spBgTextThangLon: null,
//     _spBgTextNoHu: null,
//     _lbPrizeThangLon: null,
//     _lbPrizeNoHu: null,
//     _isX2Pot1: !1,
//     _isX2Pot2: !1,
//     _isX2Pot3: !1,
//     _isPlay: !1,
//     _valuePot1: 5E5,
//     _valuePot2: 5E6,
//     _valuePot3: 5E7,
//     _totalValuePot1: 0,
//     _totalValuePot2: 0,
//     _totalValuePot3: 0,
//     _gameName: "",
//     _nameSocket: "",
//     _openGame: null,
//     _result: {result: 0, prize: 0, currentMoney: 0},
//     _btnDungQuay: null,
//     _audio: null,
//     _sumPot: 3,
//     _isComingSoon: !1,
//     _isWaitingDownLoad: !1,
//     _am: null,
//     _manifestPath: null,
//     _toragePath: null,
//     _ShowDownload: null,
//     _content: {
//         gameKey: GAME_KEY_VQV,
//         name: "vuongquocvin",
//         isComingSoon: !1,
//         icon: "res/MenuSlots/icon/vuong_quoc_vin.png",
//         nameSocket: "vqv",
//         openGame: null,
//         manifestPath: "res/VuongQuocVin/project.manifest",
//         toragePath: "update/res/VuongQuocVin",
//         resource: g_resources_slot_vqv
//     },
//     _pots: {
//         gameKey: 1,
//         potRoom100: 5E5, potRoom1000: 5E6, potRoom10000: 5E7, x2Room100: 0, x2Room1000: 0, x2Room10000: 0
//     },
//     isF: {potRoom100: !0, potRoom1000: !0, potRoom10000: !0},
//     _potRun: {potRoom100: 5E5, potRoom1000: 5E6, potRoom10000: 5E7},
//     _spaceRun: {potRoom100: 1, potRoom1000: 1, potRoom10000: 1},
//     countPotCurrent: 0,
//     testCountRun: 0,
//     ctor: function (a, b) {
//         cc.spriteFrameCache.addSpriteFrames("res/MenuSlots/PlistMenuSlots.plist");
//         cc.spriteFrameCache.addSpriteFrames("res/MenuSlots/hieu_ung/PlistHieuUng.plist");
//         this._content = a;
//         this._size = b;
//         this._isComingSoon =
//             this._content.isComingSoon;
//         var c = fontRobotoMedium.fontName;
//         this._capInsetsNormal = cc.rect(0, 0, 0, 0);
//         this._normalTextureSize = cc.size(0, 0);
//         ccui.Button.prototype.ctor.call(this);
//         this.setTouchEnabled(!0);
//         if (this._content.icon) {
//             var d = ccui.Widget.LOCAL_TEXTURE;
//             cc.spriteFrameCache.getSpriteFrame(this._content.icon) && (d = ccui.Widget.PLIST_TEXTURE);
//             this.loadTextures(this._content.icon, this._content.icon, this._content.icon, d)
//         }
//         this._content.isComingSoon ? (this._spStatus = GuiUtil.createSprite("res/MenuSlots/coming_soon.png"),
//             this._spStatus.setPosition(cc.p(b.width / 2, b.height - 10)), this.addChild(this._spStatus)) : (this._spStatus = GuiUtil.createSprite("res/MenuSlots/dung_quay.png"), this._spStatus.setPosition(cc.p(b.width / 2, b.height - 10)), this.addChild(this._spStatus), this._lbPrize = new ccui.Text("", c, 36), this._lbPrize.setPosition(cc.p(b.width / 2, b.height / 2)), this._lbPrize.setColor(colorMoneyVin), this.addChild(this._lbPrize), this._lbPrize.enableShadow(cc.color(110, 110, 110), cc.size(2, 2), 1), this._spX2PotRoom1 = GuiUtil.createSprite("res/MenuSlots/X2.png"),
//             this._spX2PotRoom1.setPosition(cc.p(b.width / 2 - 92, b.height / 2 - 95)), this.addChild(this._spX2PotRoom1), this._spX2PotRoom2 = GuiUtil.createSprite("res/MenuSlots/X2.png"), this._spX2PotRoom2.setPosition(cc.p(b.width / 2 - 92, b.height / 2 - 128)), this.addChild(this._spX2PotRoom2), this._spX2PotRoom3 = GuiUtil.createSprite("res/MenuSlots/X2.png"), this._spX2PotRoom3.setPosition(cc.p(b.width / 2 - 92, b.height / 2 - 161)), this.addChild(this._spX2PotRoom3), this._btnDungQuay = new ccui.Button, d = ccui.Widget.LOCAL_TEXTURE, cc.spriteFrameCache.getSpriteFrame("res/MenuSlots/dung_nor.png") &&
//         (d = ccui.Widget.PLIST_TEXTURE), this._btnDungQuay.loadTextures("res/MenuSlots/dung_nor.png", "res/MenuSlots/dung_click.png", "res/MenuSlots/dung_click.png", d), this._btnDungQuay.setPosition(cc.p(b.width / 2, b.height - 50)), this._btnDungQuay.addTouchEventListener(this.onTouchDungQuay, this), this._btnDungQuay.setVisible(!1), this.addChild(this._btnDungQuay), this._spX2PotRoom1.setVisible(!1), this._spX2PotRoom2.setVisible(!1), this._spX2PotRoom3.setVisible(!1), this.initThangLon(), this.initNoHu(),
//         cc.sys.isNative && "" !== this._content.manifestPath && (c = jsb.fileUtils.getWritablePath() + this._content.searchPath, jsb.fileUtils.addSearchPath(c), this.initLayerDownload(), this.checkDownLoad(this._content.manifestPath, this._content.toragePath)))
//     },
//
//
//     getGameKey: function () {
//         return this._content.gameKey
//     }
//     ,
//     checkOpenGame: function () {
//         return cc.sys.isNative && this.getChildByTag(999).isVisible() ? (this.downloadGamne(), !1) : !0
//     }
//     ,
//     initLayerDownload: function () {
//         this.addLayout(this, "ShowDownload", cc.p(this._size.width / 2, this._size.height / 2), "res/Minigame/ImageChung/bg_download.png",
//             cc.size(213, 62), !1);
//         this.ShowDownload.setName("ShowDownload");
//         this.ShowDownload.setTag(999);
//         this.ShowDownload.setVisible(!1);
//         this.addText(this.ShowDownload, "lb_download", cc.p(106, 31), "DOWNLOAD", fontRobotoBold.fontName, 28);
//         this.lb_download.setName("lb_ShowDownload");
//         var a = GuiUtil.createSprite("res/Minigame/ImageChung/loading.png"), a = new cc.ProgressTimer(a);
//         a.setType(cc.ProgressTimer.TYPE_BAR);
//         a.setMidpoint(cc.p(0, 0));
//         a.setBarChangeRate(cc.p(1, 0));
//         a.setPosition(106, 17);
//         a.setPercentage(0);
//         this.ShowDownload.addChild(a);
//         a.setTag(1E3);
//         a.setVisible(!1)
//     }
//     ,
//     checkDownLoad: function (a, b) {
//         this._am = new jsb.AssetsManager(a, jsb.fileUtils.getWritablePath() + b);
//         this._am.setVersionCompareHandle(function (a, b) {
//             return a == b ? 0 : -1
//         });
//         this._am.retain();
//         checkUpdateManifest(this._am, this)
//     }
//     ,
//     downloadGamne: function () {
//         this._isWaitingDownLoad || (this._isWaitingDownLoad = !0, this.getChildByTag(999).getChildByTag(1E3).setVisible(!0), this.getChildByTag(999).getChildByName("lb_ShowDownload").setString("DOWNLOADING"), this.getChildByTag(999).getChildByName("lb_ShowDownload").setPosition(cc.p(106,
//             41)), this.getChildByTag(999).getChildByName("lb_ShowDownload").setColor(cc.color.YELLOW), this.getChildByTag(999).getChildByName("lb_ShowDownload").setFontSize(24), updateManifest(this._am, this.callBackUpdate.bind(this), 0))
//     }
//     ,
//     callBackUpdate: function (a, b, c, d, e) {
//         a ? (this.getChildByTag(1E3).setVisible(!1), gI.popUp.openPanel_Alert_Lobby("L\u1ed7i : " + d), this._isWaitingDownLoad = !1, this.getChildByTag(999).getChildByTag(1E3).setVisible(!1), this.getChildByTag(999).getChildByName("lb_ShowDownload").setString("DOWNLOAD"),
//             this.getChildByTag(999).getChildByName("lb_ShowDownload").setPosition(cc.p(106, 31)), this.getChildByTag(999).getChildByName("lb_ShowDownload").setColor(cc.color.WHITE), this.getChildByTag(999).getChildByName("lb_ShowDownload").setFontSize(28)) : c ? (this.getChildByTag(999).setVisible(!1), this._isWaitingDownLoad = !1) : this.getChildByTag(999).getChildByTag(1E3).setPercentage(b)
//     }
//     ,
//     getComingSoon: function () {
//         return this._content.isComingSoon
//     }
// };
