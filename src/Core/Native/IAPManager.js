var IAPManager = cc.Class.extend({
    purchaseCallback: null,
    _products: null,

    ctor: function () {
        cc.assert(IAPManager._instance == null, "can be instantiated once only");
    },
    getLastestProductData: function () {
        sdkbox.IAP.refresh();
    },

    getProducts: function () {
        return this._products;
    },

    purchase: function (name, cb) {
        sdkbox.IAP.purchase(name);
        this.purchaseCallback = cb;
    },

    restore: function (callback) {
        this.purchaseCallback = callback;

        cc.log("cc.sys.os: '%s'", cc.sys.os);
        if (cc.sys.os === "iOS") {
            cc.log("calling sdkbox.IAP.restore");
            sdkbox.IAP.restore();
        } else {
            var purchaseDatasJson = NativeHelper.callNative("getPurchases");
            cc.log(purchaseDatasJson);
            // Reformat Json string if has @',]' in the tail
            var jsonData;
            if (purchaseDatasJson.lastIndexOf(",]") === -1) {
                jsonData = JSON.parse(purchaseDatasJson);
            } else {
                jsonData = JSON.parse(purchaseDatasJson.substr(0, purchaseDatasJson.lastIndexOf(",]")) + "]");
            }

            var hasPurchased = false;

            for (var i = 0; i < jsonData.length; i++) {
                var receipt = jsonData[i];
                if (SUBSCRIPTION_IAP_ID_ANDROID === receipt.productId) {
                    Utils.startCountDownTimePlayed("showPayWall");
                    hasPurchased = true;
                    break;
                }
            }

            if (this.purchaseCallback && hasPurchased)
                this.purchaseCallback(true);
        }
    },

    printProduct: function (p) {
        cc.log("======The product info======");
        cc.log("name=", p.name);
        cc.log("title=", p.title);
        cc.log("description=", p.description);
        cc.log("price=", p.price);
        cc.log("currencyCode=", p.currencyCode);
        cc.log("receipt=", p.receipt);
        cc.log("receiptCipheredPayload=", p.receiptCipheredPayload);
        cc.log("transactionID=", p.transactionID);
    },

    init: function () {
        cc.log("init IAP");
        var self = this;

        sdkbox.IAP.setListener({
            onSuccess: function (product) {
                cc.log("onProductPurchaseSuccess");
                self.printProduct(product);
                if (self.purchaseCallback) {
                    self.purchaseCallback(true, product);
                }
            },
            onFailure: function (product, msg) {
                console.log("onProductPurchaseFailure");
                console.log(JSON.stringify(product));
                console.log(msg);
                if (self.purchaseCallback) {
                    self.purchaseCallback(false);
                }
            },
            onCanceled: function (product) {
                cc.log("Purchase canceled: " + product.name);
                if (self.purchaseCallback)
                    self.purchaseCallback(false);
            },
            onRestored: function (product) {
                console.log("onRestored: " + JSON.stringify(product));
                if (self.purchaseCallback) {
                    self.purchaseCallback(true, product);
                }
            },
            onRestoreComplete: function (success, msg) {
                cc.log("onRestoreComplete: " + msg);
                if (self.purchaseCallback) {
                    self.purchaseCallback(success, msg);
                }
            },
            onProductRequestSuccess: function (products) {
                cc.log("onProductRequestSuccess: ");
                cc.log(JSON.stringify(products));
                self._products = products;
            },
            onProductRequestFailure: function (msg) {
                cc.log("onProductRequestFailure");
                cc.log("msg",msg);
            },
            onShouldAddStorePayment: function (productId) {
                cc.log("onShouldAddStorePayment:" + productId);
                return true;
            },
            onFetchStorePromotionOrder: function (productIds, error) {
                cc.log("onFetchStorePromotionOrder:" + " " + " e:" + error);
            },
            onFetchStorePromotionVisibility: function (productId, visibility, error) {
                cc.log("onFetchStorePromotionVisibility:" + productId + " v:" + visibility + " e:" + error);
            },
            onUpdateStorePromotionOrder: function (error) {
                cc.log("onUpdateStorePromotionOrder:" + error);
            },
            onUpdateStorePromotionVisibility: function (error) {
                cc.log("onUpdateStorePromotionVisibility:" + error);
            },
        });


        sdkbox.IAP.init();
        sdkbox.IAP.setDebug(true);
        sdkbox.IAP.enableUserSideVerification(true);
    }

});

IAPManager._instance = null;

IAPManager.getInstance = function () {
    return IAPManager._instance || IAPManager.setupInstance();
};

IAPManager.setupInstance = function () {
    IAPManager._instance = new IAPManager();
    IAPManager._instance.init();
    return IAPManager._instance;
}