var AssetDownloader = cc.Class.extend({
    ctor: function (game) {
        cc.loader.resPath = "";
        this.percent = 0;
        this.failedCount = 0;
        this._callback = null;
        this._am = null;
        this.game = game;
    },
    initAssetManager: function (manifestPath, searchPath, storagePath) {
        // cc.log("manifestPath", manifestPath);
        if (jsb !== undefined) {
            cc.log("cc.sys.os", cc.sys.os);
            // if (cc.sys.os === "iOS") {
            //     cc.log("storagePath1", storagePath);
            //     storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "./") + "temp/");
            //     cc.log("storagePath2", storagePath);
            // }
            // else {
            storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "./") + storagePath);
            // }
        } else {
            storagePath = "/" + storagePath;
        }
        cc.log("storagePath", storagePath);
        this._am = jsb.AssetsManager.create(manifestPath, storagePath);
        cc.log("searchPath", searchPath);
        if (searchPath != null) {
            jsb.fileUtils.addSearchPath(jsb.fileUtils.getWritablePath() + searchPath, true);
        }
        cc.log("JSD search:" + JSON.stringify(jsb.fileUtils.getSearchPaths()));
        cc.log("storagePath", storagePath);
        cc.log("searchPath", searchPath);
        this._am.retain();
        if (!this._am.getLocalManifest().isLoaded()) {
            cc.log("JSD getLocalManifest: false");
            if (this._am != null) {
                this._am.release();
            }
        } else {
            cc.log("JSD getLocalManifest: true");
            this._callback = this.cb.bind(this);
            this._listener = jsb.EventListenerAssetsManager.create(this._am, this._callback);
            cc.eventManager.addListener(this._listener, 1);
            this._am.update();
        }
    },
    cb: function (event) {
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                cc.log("ERROR_NO_LOCAL_MANIFEST");
                if (this.game !== null && this.game !== undefined) {
                    if (this.game !== portal) {
                        this.handleDownloadEnd(this.game, false);
                    }
                    this.game.onDownloadFailed("ERROR_NO_LOCAL_MANIFEST");
                } else {
                    onDownloadFailed("ERROR_NO_LOCAL_MANIFEST");
                }
                cc.eventManager.removeListener(this._listener);
                this._am.release();
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                cc.log("UPDATE_PROGRESSION");
                this.percent = event.getPercent();
                //  cc.log("event.getPercent()",event.getPercent());
                if (this.game !== null && this.game !== undefined) {
                    cc.log("this.game -getPercent", this.game + "-" + this.percent);
                    cc.log("this.game -getPercentByFile", this.game + "-" + this.percent);
                    this.handleDownloadProcession(this.game, Math.floor(this.percent));
                } else {
                    var pc = 0;
                    if (this.percent < 100) {
                        pc = Math.floor(event.getPercentByFile());
                    }
                    else {
                        pc = Math.floor(this.percent * 100) / 100;
                    }
                    if (pc > 100) {
                        pc = 100;
                    }
                    // cc.log("pc", pc);
                    onUpdateProcession(pc);
                }
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                cc.log("ERROR_DOWNLOAD_MANIFEST");
                if (this.game !== null && this.game !== undefined) {

                    if (this.game !== portal) {
                        this.handleDownloadEnd(this.game, false);
                    }
                    this.game.onDownloadFailed("ERROR_DOWNLOAD_MANIFEST");
                } else {
                    onDownloadFailed("ERROR_DOWNLOAD_MANIFEST");
                }
                cc.eventManager.removeListener(this._listener);
                this._am.release();
                break;
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                cc.log("ERROR_PARSE_MANIFEST");
                if (this.game !== null && this.game !== undefined) {
                    if (this.game !== portal) {
                        this.handleDownloadEnd(this.game, false);
                    }
                    this.game.onDownloadFailed("ERROR_PARSE_MANIFEST");
                } else {
                    onDownloadFailed("ERROR_PARSE_MANIFEST");
                }
                cc.eventManager.removeListener(this._listener);
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                cc.log("ALREADY_UP_TO_DATE");
                if (this.game !== null && this.game !== undefined) {
                    if (this.game !== portal) {
                        this.handleDownloadEnd(this.game, true);
                        this.game.isDownloaded = true;
                    } else {
                        this.game.onDownloadSuccess();
                    }
                } else {
                    onDownloadSuccess(false);
                }
                cc.eventManager.removeListener(this._listener);
                this._am.release();
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                cc.log("UPDATE_FINISHED");
                if (this.game !== null && this.game !== undefined) {
                    this.handleDownloadEnd(this.game, true);
                    this.game.isDownloaded = true;
                } else {
                    onDownloadSuccess(true);
                }
                cc.eventManager.removeListener(this._listener);
                this._am.release();
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                cc.log("JSD UPDATE_FAILED ---");
                // if (this.game !== null && this.game !== undefined) {
                //     if (this.game !== portal) {
                //         this.handleDownloadEnd(this.game, false);
                //     }
                //     this.game.onDownloadFailed("UPDATE_FAILED");
                // } else {
                //     onDownloadFailed("UPDATE_FAILED");
                // }
                this.failedCount++;
                if (this.failedCount < 3 && this.game !== null && this.game !== undefined) {
                    this._am.downloadFailedAssets();
                } else {
                    if (this.game !== null && this.game !== undefined) {
                        if (this.game !== portal) {
                            this.handleDownloadEnd(this.game, false);
                        }
                        this.game.onDownloadFailed("UPDATE_FAILED");
                    } else {
                        onDownloadFailed("UPDATE_FAILED");
                    }
                }
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                cc.log("ERROR_UPDATING");
                if (this.game !== null && this.game !== undefined) {
                    if (this.game !== portal) {
                        this.handleDownloadEnd(this.game, false);
                    }
                    this.game.onDownloadFailed("ERROR_UPDATING");
                } else {
                    onDownloadFailed("ERROR_UPDATING");
                }
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                cc.log("ERROR_DECOMPRESS");
                if (this.game !== null && this.game !== undefined) {
                    if (this.game !== portal) {
                        this.handleDownloadEnd(this.game, false);
                    }
                    this.game.onDownloadFailed("ERROR_UPDATING");
                } else {
                    onDownloadFailed("ERROR_UPDATING");
                }
                break;
            default:
                //                cc.log("event.getEventCode()", event.getEventCode());
                //                cc.log("Default callback");
                break;
        }

    },
    handleDownloadProcession: function (game, percent) {
        cc.log("percent", percent);
        switch (game) {
            case portal:
                this.game.onUpdateProcession(percent);
                break;
            case taixiu:
                cc.eventManager.dispatchCustomEvent("EVENT_DOWNLOAD_PROGRESSION", { game: Icon.GAMENAME.TAIXIU, pc: percent });
                break;
            case minislot:
                cc.eventManager.dispatchCustomEvent("EVENT_DOWNLOAD_PROGRESSION", { game: Icon.GAMENAME.MINISLOT, pc: percent });
                break;
            case baucua:
                cc.eventManager.dispatchCustomEvent("EVENT_DOWNLOAD_PROGRESSION", { game: Icon.GAMENAME.BAUCUA, pc: percent });
                break;
            case minipoker:
                cc.eventManager.dispatchCustomEvent("EVENT_DOWNLOAD_PROGRESSION", { game: Icon.GAMENAME.MINIPOKER, pc: percent });
                break;
            case caothap:
                cc.eventManager.dispatchCustomEvent("EVENT_DOWNLOAD_PROGRESSION", { game: Icon.GAMENAME.CAOTHAP, pc: percent });
                break;
            case vongquay:
                cc.log("handleDownloadProcession vongquay");
                cc.eventManager.dispatchCustomEvent("EVENT_DOWNLOAD_PROGRESSION", { game: Icon.GAMENAME.VQMM, pc: percent });
                break;
            case banca:
                cc.eventManager.dispatchCustomEvent("EVENT_DOWNLOAD_PROGRESSION", { game: Icon.GAMENAME.BANCA, pc: percent });
                break;
            case caoboi:
                cc.eventManager.dispatchCustomEvent("EVENT_DOWNLOAD_PROGRESSION", { game: Icon.GAMENAME.CAOBOI, pc: percent });
                break;
            case como:
                cc.eventManager.dispatchCustomEvent("EVENT_DOWNLOAD_PROGRESSION", { game: Icon.GAMENAME.COMO, pc: percent });
                break;
            case luongsonbac:
                cc.eventManager.dispatchCustomEvent("EVENT_DOWNLOAD_PROGRESSION", { game: Icon.GAMENAME.LUONGSON, pc: percent });
                break;
            case Tienlen:
                cc.eventManager.dispatchCustomEvent("EVENT_DOWNLOAD_PROGRESSION", { game: Icon.GAMENAME.TIENLEN, pc: percent });
                break;
            case Sam:
                cc.eventManager.dispatchCustomEvent("EVENT_DOWNLOAD_PROGRESSION", { game: Icon.GAMENAME.SAM, pc: percent });
                break;
            case Bacay:
                cc.eventManager.dispatchCustomEvent("EVENT_DOWNLOAD_PROGRESSION", { game: Icon.GAMENAME.BACAY, pc: percent });
                break;
            case BaiCao:
                cc.eventManager.dispatchCustomEvent("EVENT_DOWNLOAD_PROGRESSION", { game: Icon.GAMENAME.BAICAO, pc: percent });
                break;
            case XocDia:
                cc.eventManager.dispatchCustomEvent("EVENT_DOWNLOAD_PROGRESSION", { game: Icon.GAMENAME.XOCDIA, pc: percent });
                break;
            case Tala:
                cc.eventManager.dispatchCustomEvent("EVENT_DOWNLOAD_PROGRESSION", { game: Icon.GAMENAME.TALA, pc: percent });
                break;
            case Binh:
                cc.eventManager.dispatchCustomEvent("EVENT_DOWNLOAD_PROGRESSION", { game: Icon.GAMENAME.MAUBINH, pc: percent });
                break;
            case Poker:
                cc.eventManager.dispatchCustomEvent("EVENT_DOWNLOAD_PROGRESSION", { game: Icon.GAMENAME.POKER, pc: percent });
                break;
            case Lieng:
                cc.eventManager.dispatchCustomEvent("EVENT_DOWNLOAD_PROGRESSION", { game: Icon.GAMENAME.LIENG, pc: percent });
                break;
            case CoTuong:
                cc.eventManager.dispatchCustomEvent("EVENT_DOWNLOAD_PROGRESSION", { game: Icon.GAMENAME.COTUONG, pc: percent });
                break;
            case CoUp:
                cc.eventManager.dispatchCustomEvent("EVENT_DOWNLOAD_PROGRESSION", { game: Icon.GAMENAME.COUP, pc: percent });
                break;
        }
    },
    handleDownloadEnd: function (game, isSuccess) {
        switch (game) {
            case portal:
                // this.game.onDownloadSuccess();
                break;
            case taixiu:
                cc.eventManager.dispatchCustomEvent("EVENT_DOWNLOAD_SUCCESS", Icon.GAMENAME.TAIXIU);
                break;
            case minislot:
                cc.eventManager.dispatchCustomEvent("EVENT_DOWNLOAD_SUCCESS", Icon.GAMENAME.MINISLOT);
                break;
            case baucua:
                cc.eventManager.dispatchCustomEvent("EVENT_DOWNLOAD_SUCCESS", Icon.GAMENAME.BAUCUA);
                break;
            case minipoker:
                cc.eventManager.dispatchCustomEvent("EVENT_DOWNLOAD_SUCCESS", Icon.GAMENAME.MINIPOKER);
                break;
            case caothap:
                cc.eventManager.dispatchCustomEvent("EVENT_DOWNLOAD_SUCCESS", Icon.GAMENAME.CAOTHAP);
                break;
            case vongquay:
                cc.eventManager.dispatchCustomEvent("EVENT_DOWNLOAD_SUCCESS", Icon.GAMENAME.VQMM);
                break;
            case banca:
                cc.eventManager.dispatchCustomEvent("EVENT_DOWNLOAD_SUCCESS", Icon.GAMENAME.BANCA);
                break;
            case caoboi:
                cc.eventManager.dispatchCustomEvent("EVENT_DOWNLOAD_SUCCESS", Icon.GAMENAME.CAOBOI);
                break;
            case como:
                cc.eventManager.dispatchCustomEvent("EVENT_DOWNLOAD_SUCCESS", Icon.GAMENAME.COMO);
                break;
            case luongsonbac:
                cc.eventManager.dispatchCustomEvent("EVENT_DOWNLOAD_SUCCESS", Icon.GAMENAME.LUONGSON);
                break;
            case Tienlen:
                cc.eventManager.dispatchCustomEvent("EVENT_DOWNLOAD_SUCCESS", Icon.GAMENAME.TIENLEN);
                break;
            case Sam:
                cc.eventManager.dispatchCustomEvent("EVENT_DOWNLOAD_SUCCESS", Icon.GAMENAME.SAM);
                break;
            case XocDia:
                cc.eventManager.dispatchCustomEvent("EVENT_DOWNLOAD_SUCCESS", Icon.GAMENAME.XOCDIA);
                break;
            case Tala:
                cc.eventManager.dispatchCustomEvent("EVENT_DOWNLOAD_SUCCESS", Icon.GAMENAME.TALA);
                break;
            case Bacay:
                cc.eventManager.dispatchCustomEvent("EVENT_DOWNLOAD_SUCCESS", Icon.GAMENAME.BACAY);
                break;
            case BaiCao:
                cc.eventManager.dispatchCustomEvent("EVENT_DOWNLOAD_SUCCESS", Icon.GAMENAME.BAICAO);
                break;
            case Binh:
                cc.eventManager.dispatchCustomEvent("EVENT_DOWNLOAD_SUCCESS", Icon.GAMENAME.MAUBINH);
                break;
            case Poker:
                cc.eventManager.dispatchCustomEvent("EVENT_DOWNLOAD_SUCCESS", Icon.GAMENAME.POKER);
                break;
            case Lieng:
                cc.eventManager.dispatchCustomEvent("EVENT_DOWNLOAD_SUCCESS", Icon.GAMENAME.LIENG);
                break;
            case CoTuong:
                cc.eventManager.dispatchCustomEvent("EVENT_DOWNLOAD_SUCCESS", Icon.GAMENAME.COTUONG);
                break;
            case CoUp:
                cc.eventManager.dispatchCustomEvent("EVENT_DOWNLOAD_SUCCESS", Icon.GAMENAME.COUP);
                break;
        }
        if (isSuccess) {
            this.game.onDownloadSuccess();
        }
    }
});
