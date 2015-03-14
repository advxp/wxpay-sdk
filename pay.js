var xExtend = require('define-js-class')
    , Pay = require('./lib/api/pay')
    , Reserve = require('./lib/api/reverse')
    , Query = require('./lib/api/query')
    , Err = require('./lib/comm/error')
    ,crypto = require("crypto");
var WxPay = xExtend(function () {}, {
    _constructor: function (appid, mchId, key) {
        this.appid = appid;
        this.mchId = mchId;
        this.key = key;
    },

    /**
     * 发起微信支付接口
     */
    pay: function (data, callback) {
        var t = this;
        var mpay = new Pay(this.appid, this.mchId, this.key);
        mpay.doPay(data, function (err, ret) {
            if (err) {
                console.log(err);
            }
            else {

                if (ret.return_code == 'SUCCESS') {
                    // 支付成功
                    if (ret.result_code == 'SUCCESS') {
                        callback (null, ret);
                    }
                    else {
                        // 需要用户输入密码
                        // 等待10s后调用查询接口
                        if ((ret.err_code || ret.trade_state).indexOf('USERPAYING') > -1) {
                            setTimeout(function () {
                                console.log('start query order state');
                                t.query({
                                    out_trade_no: data.out_trade_no
                                }, function (err, ret) {
                                    if (err) {
                                        callback(err);
                                    }
                                    else {
                                        ret.trade_state == 'SUCCESS' && (ret.next_out_trade_no = t.createOutTradeNo());
                                        console.log('query result', ret);
                                        callback(null, ret);
                                    }
                                });
                            }, 10000);
                        }
                        else {
                            callback(null, ret);
                        }
                    }
                }
                else {
                    callback(null, ret);
                }
            }
        });
    },

    md5: function (str) {
        var md5 = crypto.createHash("md5");
        return md5.update(new Buffer(str).toString("binary")).digest('hex').toUpperCase();
    },

    createOutTradeNo: function () {
        var str = ['wx-node-sdk',  this.appid, this.mchId, this.key, Math.random(), Math.random(), new Date().getTime()].join('');
        return this.md5(str);
    },

    /**
     * 查询接口
     */
    query: function (query, callback) {
        var mpay = new Query(this.appid, this.mchId, this.key);
        mpay.doQuery(query, function (err, ret) {
            if (err) {
                console.log(err);
                callback (err);
            }
            else {
                // 这里收归查询的错误码
                var newret = {};
                callback(null, ret, newret);
            }
        });
    },

    /**
     * 撤销接口
     */
    reverse: function (data, callback) {
        var mpay = new Reserve(this.appid, this.mchId, this.key);
        if (!data.certKeyPath || !data.certPath) {
            callback(new Err(Err.CERT_PATH_ERROR, '缺少证书'));
        }
        else {
            mpay.setCertKeyPath(data.certKeyPath);
            mpay.setCertPath(data.certPath);
            mpay.doReverse(data, function (err, ret) {
                if (err) {
                    callback (err);
                }
                else {
                    callback (null, ret);
                }
            });
        }

    }
});
module.exports = WxPay;