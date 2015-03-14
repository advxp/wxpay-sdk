var xExtend = require('define-js-class')
    , Base = require('./base')
    , extend = require('extend')
    , Err = require('../comm/error');

module.exports = xExtend(Base, {
    _contructor: function () {
    },

    getApiPath: function () {
        return '/secapi/pay/reverse';
    },

    buildReqData: function () {
        var obj = extend(true, {}, this.reqData);
        delete obj.certKeyPath;
        delete obj.certPath;
        return obj;
    },

    doReverse: function (data, callback) {
        var t = this;
        // 改接口需要双向证书

        if (!this.getCertKeyPath() || !this.getCertPath()) {
            console.error('缺少证书信息');
            callback(new Err(Err.CERT_PATH_ERROR, '缺少证书信息'));
        }
        else {
            this.request('post', data, function (err, ret) {
                if (err) {
                    console.error(err);
                    callback(err);
                }
                else {
                    callback(null, ret);
                }
            });
        }
    }
});