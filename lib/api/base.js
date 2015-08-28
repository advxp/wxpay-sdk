var xExtend = require('define-js-class')
    , request = require('request')
    , ApiHost = 'api.mch.weixin.qq.com'
    , crypto = require("crypto")
    , fs = require('fs')
    , Err = require('../comm/error')
    , dom = require('xmldom').DOMParser;

module.exports = xExtend(function () {}, {
    /**
     * 支付积累构造函数
     * @private
     */
    _constructor: function (appid, mchId, key, opt) {
        this.appid = appid;
        this.mchId = mchId
        this.key = key;
        this.reqData = null;
        this.buildParam(opt);
    },

    buildParam: function (opt) {
        if (opt) {
            opt.certKeyPath && (this.certKeyPath = opt.certKeyPath);
            opt.certPath && (this.certPath = opt.certPath);
        }
    },

    /**
     * 字段校验，又子类实现，调用规则为·check_字段名字·组成的子类方法
     * 当且仅当方法的返回值为０的时候认为是校验通过否则校验不通过，不做后续的提交请求操作
     */
    check: function (data) {
        var ret = true;
        if (data) {
            for (var i in data) {
                if (data.hasOwnProperty(i)) {
                    if (typeof this['check_' + i] == 'function') {
                        ret = this['check_' + i](data[i], i, data);
                        if (ret != true) {
                            return ret;
                        }
                    }
                }
            }
        }
        return ret;
    },

    // 检查必须要的字段
    checkRequire: function () {
        return true;
    },

    setDataFormat: function (format) {
        this.dataFormat = format;
    },

    getApiHost: function () {
        return ApiHost;
    },

    getApiProtocol: function () {
        return 'https';
    },

    getApiPort: function () {
        return this.getApiProtocol() == 'https' ? 443: 80;
    },

    setReqData: function (data) {
        this.reqData = data;
    },

    getReqData: function () {
        var data = this.buildReqData();
        return data || this.reqData;
    },

    getApiPath: function () {},

    pack: function (data) {
        var data = this.getReqData(data);
        if (this.dataFormat == 'xml' || typeof this.dataFormat == 'undefined') {
            var ar = ['<xml>'];
            data.appid = this.appid;
            data.mch_id = this.mchId;
            data.nonce_str = this.genNonceStr();
            var sign = this.getSign(data);
            for (var i in data) {
                if (data.hasOwnProperty(i)) {
                    ar.push('<' + i + '>' + data[i] + '<\/' + i + '>');
                }
            }
            ar.push('<sign>' + sign + '<\/sign>');
            ar.push('<\/xml>');
            return ar.join('');
        }
        return '';
    },

    md5: function (str) {
        var md5 = crypto.createHash("md5");
        return md5.update(new Buffer(str).toString("binary")).digest('hex').toUpperCase();
    },

    getSign: function (data) {
        if (typeof data == 'undefined') {
            data = this.buildReqData();
        }

        var ar = [];
        for (var i in data) {
            if (data.hasOwnProperty(i)) {
                data[i] && ar.push(i);
            }
        }
        ar.sort();
        var ret = [];
        for (var i = 0; i < ar.length; i++) {
            ret.push(ar[i] + '=' + data[ar[i]]);
        }
        ret.push('key=' + this.key);
        var str = ret.join('&');
        str = this.md5(str).toUpperCase();
        return str;
    },

    buildReqData: function () {
        return this.reqData;
    },

    buildResData: function (str) {
        // xml格式的返回
        var o = {};
        if (/^\s*<xml/.test(str)) {
            var doc = new dom().parseFromString(str);
            var items = doc.firstChild.getElementsByTagName('*');
            for (var i = 0; i < items.length; i++) {
                var nd = items[i].firstChild;
                if (!nd) {
                    nd = items[i];
                }
                o[items[i].nodeName] = nd.data || nd.nodeValue;
            }
        }
        return o;
    },

    buildApiUrl: function () {
        return [this.getApiProtocol(), '//', this.getApiHost(), this.getPath()].join('');
    },

    setCertKeyPath: function (path) {
        this.certKeyPath = path;
    },

    setCertPath: function (path) {
        this.certPath = path;
    },

    getCertKeyPath: function () {
        return this.certKeyPath;
    },

    getCertPath: function () {
        return this.certPath;
    },

    request: function (method, data, cb) {
        var t = this;
        this.setReqData(data);
        data = this.getReqData();
        var required = this.checkRequire(data);
        // 如果子类定义了必填字段
        if (required == false) {
            cb (new Err(Err.PARAM_ERROR, '参数传入不足，请检查'))
            return;
        }
        // 调用父类check方法进行参数检验
        // 检验通过返回0 否则将错误信息返回给前端掉用方
        var checkRst = this.check(data);
        if (checkRst == false) {
            cb (checkRst);
            return;
        }

        // 根据协议引入支持的模块
        var protocol = this.getApiProtocol();
        var http = require(protocol);

        // 构造http(s)请求的参数
        var opt = {
            hostname: this.getApiHost(),
            port: this.getApiPort(),
            method: method,
            path: this.getApiPath()
        };
        // https请求添加证书
        if (protocol == 'https') {
            var keyPath = this.getCertKeyPath();
            var certPath = this.getCertPath();
            if (keyPath && certPath) {
                opt.key = fs.readFileSync(keyPath);
                opt.cert = fs.readFileSync(certPath);
            }
        }

        // 发起http请求
        var req = http.request(opt, function(res) {
            var bdy = [];
            res.on('data', function(d) {
                bdy.push(d);
            });
            res.on('end', function () {
                cb (null, t.buildResData(bdy.join('')));
            });
        });
        req.on('error', function(e) {
            console.error(e);
            cb (e);
        });
        req.write(this.pack());
        req.end();
    },

    genNonceStr: function () {
        var str = "",
            arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

        // 随机产生
        for(var i=0; i<32; i++){
            pos = Math.round(Math.random() * (arr.length - 1));
            str += arr[pos];
        }
        return str;
    },

    timeFormat: function (d) {
        d = d || new Date();
        return [d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()].join('-').replace(/(\D)(\d)\b/g, '$10$2').replace(/\-/g, '')
    }
});