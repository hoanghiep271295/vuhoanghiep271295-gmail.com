var WebSocket = WebSocket || window.WebSocket || window.MozWebSocket;

var WebsocketClient = cc.Class.extend({
    ctor: function () {
        this.listener = null;
        this.ws = null;
    },
    connect: function (host, port, isSsl, listenner) {
        cc.log("connect ...", host)
        cc.log("isSsl ...", isSsl);
        if (!cc.sys.isNative && location.protocol == 'https:') {
            isSsl = true;
        }
        this.ws = new WebSocket("ws" + (isSsl ? "s" : "") + "://" + host + "/websocket");
        this.listener = listenner;
        this.ws.binaryType = "arraybuffer";
        this.ws.onopen = this.onSocketConnect.bind(this);
        this.ws.onclose = this.onSocketClose.bind(this);
        this.ws.onmessage = this.onSocketData.bind(this);
        this.ws.onerror = this.onSocketError.bind(this);
    },
    closeSocket: function () {
        cc.log("closeSocket")
        if (this.ws != null) {
            cc.log("closeSocket1111")
            this.ws.close();
        }
    },

    onSocketConnect: function () {
        if (this.listener && this.listener.onFinishConnect) {
            this.listener.target = this;
            this.listener.onFinishConnect.call(this.listener, true);
        }
    },

    onSocketClose: function () {
        if (this.listener && this.listener.onDisconnected) {
            this.listener.target = this;
            this.listener.onDisconnected.call(this.listener);
        }
    },
    onSocketData: function (a) {
        var data = new Uint8Array(a.data);
        if (this.listener && this.listener.onReceived) {
            this.listener.onReceived.call(this.listener, 0, data);
        }
    },
    onSocketError: function () {
        if (this.listener && this.listener.onFinishConnect) {
            this.listener.target = this;
            this.listener.onFinishConnect.call(this.listener, false);
        }
    },
    send: function (packet) {
        var data = new Int8Array(packet._length);
        for (var i = 0; i < packet._length; i++) {
            data[i] = packet._data[i];
        }
        if (this.ws.readyState === 0) {
            cc.log("Still strying to connect");
        }
        if (this.ws.readyState === 1) {
            this.ws.send(data.buffer);
        }
        if (this.ws.readyState === 2) {
            cc.log("websocket is closing");
        }
        if (this.ws.readyState === 3) {
            cc.log("websocket's closed");
        }
    }
});

// start Inpacket

var INDEX_SIZE_PACKET = 1;

var InPacket = cc.Class.extend({
    ctor: function () {

    },
    init: function (pkg) {
        this._pos = 0;
        this._data = pkg;
        this._length = pkg.length;
        this._controllerId = this.parseByte();
        this._cmdId = this.getShort();
        this._error = this.parseByte();
    },
    getCmdId: function () {
        return this._cmdId;
    },
    getControllerId: function () {
        return this._controllerId;
    },
    getError: function () {
        return this._error;
    },
    parseByte: function () {
        var b = this._data[this._pos++];
        return b;
    },
    getByte: function () {
        return this.parseByte();
    },
    getBool: function () {
        var b = this._data[this._pos++];
        return b > 0;
    },
    getBytes: function (size) {
        var bytes = [];
        for (var i = 0; i < size; i++) {
            bytes.push(this.parseByte());
        }
        return bytes;
    },
    getShort: function () {
        if (this._pos + 2 > this._length) {
            return 0;
        }
        var v = ((this.parseByte() << 8) + (this.parseByte() & 255));
        if (v > 32767) {
            return (v - 65536);
        }
        return v;
    },
    getUnsignedShort: function () {
        var a = (this.parseByte() & 255) << 8;
        var b = (this.parseByte() & 255) << 0;
        return a + b;
    },
    getInt: function () {
        return ((this.parseByte() & 255) << 24) +
            ((this.parseByte() & 255) << 16) +
            ((this.parseByte() & 255) << 8) +
            ((this.parseByte() & 255) << 0);
    },
    byteArrayToLong: function (array) {
        var positive = true;
        var value = 0;
        if (array[0] == (255 & 0xff)) {
            positive = false;
        }
        if (positive) {
            for (var i = 0; i < 8; i++) {
                value = (value * 256) + array[i];
            }
        } else {
            value = 1;
            for (var i = 1; i <= 7; i++) {
                value = value * 256 - array[i];
            }
            value = -value;
        }
        return value;
    },

    getLong: function () {
        var data = [];
        for (var i = 0; i < 8; i++) {
            data[i] = this.parseByte();
        }
        return this.byteArrayToLong(data);
    },


    getDouble: function () {
        var buffer = new ArrayBuffer(8);
        var int8array = new Uint8Array(buffer);

        for (var i = 7; i >= 0; i--) {
            int8array[7 - i] = this.parseByte();
        }
        var dataview = new DataView(buffer);

        return dataview.getFloat64(0);

    },

    getCharArray: function () {
        var size = this.getUnsignedShort();
        return this.getBytes(size);
    },

    getString: function () {
        var out = this.getCharArray();
        var uintarray = new Uint8Array(out.length);
        for (var i = 0; i < out.length; i++) {
            uintarray[i] = parseInt(out[i], 10);
        }
        var encode = String.fromCharCode.apply(null, uintarray);
        var decode = decodeURIComponent(escape(encode));

        return decode;
    },
    clean: function () {

    }
});

var CmdReceivedCommon = InPacket.extend({
    _jData: "{}",
    ctor: function (pkg) {
        this._super();
        this.init(pkg);
    },
    readData: function () {

    }
}
)

// out packet

var OutPacket = cc.Class.extend(
    {
        ctor: function () {
            this._controllerId = 1;
            this._cmdId = 0;
            this.reset();
        },
        setCmdId: function (cmdId) {
            this._cmdId = cmdId;
        },
        setControllerId: function (controllerId) {
            this._controllerId = controllerId;
        },
        initData: function (capacity) {
            this._data = [capacity];
            this._capacity = capacity;
        },
        reset: function () {
            this._pos = 0;
            this._length = 0;
            this._isPackedHeader = false;
        },
        packHeader: function () {
            if (this._isPackedHeader) {
                return;
            }
            this._isPackedHeader = true;

            var header = PacketHeaderAnalyze.genHeader(false, false);
            this.putByte(header);
            this.putUnsignedShort(this._length);
            this.putByte(this._controllerId);
            this.putShort(this._cmdId);
        },
        putByte: function (b) {
            this._data[this._pos++] = b;
            this._length = this._pos;
            return this;
        },
        putByteArray: function (bytes) {
            this.putShort(bytes.length);
            this.putBytes(bytes);
            return this;
        },

        putBytes: function (bytes) {
            for (var i = 0; i < bytes.length; i++) {
                this.putByte(bytes[i]);
            }
            return this;
        },

        putShort: function (v) {
            this.putByte((v >> 8) & 0xFF);
            this.putByte((v >> 0) & 0xFF);
            return this;
        },
        putUnsignedShort: function (v) {
            this.putByte(v >> 8);
            this.putByte(v >> 0);
            return this;
        },
        putInt: function (v) {
            this.putByte((v >> 24) & 0xff);
            this.putByte((v >> 16) & 0xff);
            this.putByte((v >> 8) & 0xff);
            this.putByte((v >> 0) & 0xff);
            return this;
        },

        putLong: function (v) {
            var data = [];
            for (var k = 0; k < 8; k++) {
                data[k] = (v & (0xff));
                v = Math.floor(v / 256);
            }
            for (var i = 7; i >= 0; i--) {
                this.putByte(data[i]);
            }
        },


        putDouble: function (v) {
            this.putByte((v >> 24) & 0xff);
            this.putByte((v >> 16) & 0xff);
            this.putByte((v >> 8) & 0xff);
            this.putByte((v >> 0) & 0xff);
            this.putByte((v >> 24) & 0xff);
            this.putByte((v >> 16) & 0xff);
            this.putByte((v >> 8) & 0xff);
            this.putByte((v >> 0) & 0xff);
            return this;
        },

        putString: function (str) {
            //TODO: add this
            this.putByteArray(this._stringConvertToByteArray(str));
            return this;
        },
        updateUnsignedShortAtPos: function (v, pos) {
            this._data[pos] = v >> 8;
            this._data[pos + 1] = v >> 0;
        },
        updateSize: function () {
            this.updateUnsignedShortAtPos(this._length - 3, INDEX_SIZE_PACKET);
        },
        getData: function () {
            return this._data.slice(0, this._length);
        },
        _stringConvertToByteArray: function (strData) {
            if (strData == null)
                return null;
            var arrData = new Uint8Array(strData.length);
            for (var i = 0; i < strData.length; i++) {
                arrData[i] = strData.charCodeAt(i);
            }
            return arrData;
        },
        clean: function () {

        }
    }
);

var BIT_IS_BINARY_INDEX = 7;
var BIT_IS_ENCRYPT_INDEX = 6;
var BIT_IS_COMPRESS_INDEX = 5;
var BIT_IS_BLUE_BOXED_INDEX = 4;
var BIT_IS_BIG_SIZE_INDEX = 3;
var BYTE_PACKET_SIZE_INDEX = 1;
var BIG_HEADER_SIZE = 5;
var NORMAL_HEADER_SIZE = 3;

var PacketHeaderAnalyze = {
    getDataSize: function (data) {
        var bigSize = this.isBigSize(data);
        if (bigSize)
            return this.getIntAt(data, BYTE_PACKET_SIZE_INDEX);
        else
            return this.getUnsignedShortAt(data, BYTE_PACKET_SIZE_INDEX);
    },
    getCmdIdFromData: function (data) {
        return this.getShortAt(data, 1);
    },
    isBigSize: function (data) {
        return this.getBit(data[0], BIT_IS_BIG_SIZE_INDEX);
    },
    isCompress: function (data) {
        return this.getBit(data[0], BIT_IS_COMPRESS_INDEX);
    },
    getValidSize: function (data) {
        var bigSize = this.isBigSize(data);
        var dataSize = 0;
        var addSize = 0;
        if (bigSize) {
            if (length < BIG_HEADER_SIZE)
                return -1;
            dataSize = this.getIntAt(data, BYTE_PACKET_SIZE_INDEX);
            addSize = BIG_HEADER_SIZE;
        }
        else {
            if (length < NORMAL_HEADER_SIZE)
                return -1;
            dataSize = this.getUnsignedShortAt(data, BYTE_PACKET_SIZE_INDEX);
            addSize = NORMAL_HEADER_SIZE;
        }
        return dataSize + addSize;
    },
    getBit: function (input, index) {
        var result = input & (1 << index);
        return (result != 0);
    },
    genHeader: function (bigSize, compress) {
        var header = 0;
        //set bit dau la binary hay ko
        header = this.setBit(header, 7, true);
        //bit 2: ko ma hoa
        header = this.setBit(header, 6, false);
        //bit 3: ko nen
        header = this.setBit(header, 5, compress);
        //bit 4: isBlueBoxed?
        header = this.setBit(header, 4, true);
        //bit 5: isBigSize?
        header = this.setBit(header, 3, bigSize);
        return header;
    },
    setBit: function (input, index, hasBit) {
        if (hasBit) {
            input |= 1 << index;
        } else {
            input &= ~(1 << index);
        }
        return input;
    },
    getIntAt: function (data, index) {
        return ((data[index] & 255) << 24) +
            ((data[index + 1] & 255) << 16) +
            ((data[index + 2] & 255) << 8) +
            ((data[index + 3] & 255) << 0);
    },
    getUnsignedShortAt: function (data, index) {
        var a = (data[index] & 255) << 8;
        var b = (data[index + 1] & 255) << 0;
        return a + b;
    },
    getShortAt: function (data, index) {
        return (data[index] << 8) + (data[index + 1] & 255);
    }
};

CmdSendCommon = OutPacket.extend({
    _jData: "{}",
    ctor: function () {
        this._super();
    }
}
)