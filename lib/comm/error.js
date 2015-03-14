var xExtend = require('define-js-class');

module.exports = xExtend(function () {}, {
    _constructor: function (code, info) {
        this.code = code;
        this.info = info;
    },

    getSDKError: function () {
        return {
            code: this.code,
            info: this.info
        };
    },

    'static': {
        // 参数错误
        PARAM_ERROR: -1,
        // 证书为空
        CERT_PATH_ERROR: -2
    }
})