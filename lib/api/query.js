var xExtend = require('define-js-class')
    , Base = require('./base')
    , extend = require('extend');

module.exports = xExtend(Base, {
    _contructor: function () {
    },

    getApiPath: function () {
        return '/pay/orderquery';
    },

    doQuery: function (query, callback) {
        var t = this;
        this.request('post', query, function (err, ret) {
            if (err) {
                callback(err);
            }
            else {
                callback(null, ret);
            }
        });
    }
});