var xExtend = require('define-js-class')
    , Base = require('./base')
    , extend = require('extend')
    , Err = require('../comm/error');

module.exports = xExtend(Base, {
    _contructor: function () {
    },

    /**
     * 支付参数构造器，通过传入参数构造支付api的入参
     * @returns {*}
     */
    buildReqData: function () {
        return this.reqData = extend(true, {
            //要支付的商品的描述信息，用户会在支付成功页面里看到这个信息x
            body: '微信支付nodejs sdk',
            //支付订单里面可以填的附加数据，API会将提交的这个附加数据原样返回
            attach: '',
            //商户系统内部的订单号,32个字符内可包含字母, 确保在商户系统唯一
            out_trade_no: '',
            //订单总金额，单位为“分”，只能整数
            total_fee: 0,
            //商户自己定义的扫码支付终端设备号，方便追溯这笔交易发生在哪台终端设备上
            device_info: '',
            //订单生成的机器IP
            spbill_create_ip: '127.0.0.1',
            //订单生成时间，格式为yyyyMMddHHmmss，如2009年12月25日9点10分10秒表示为20091225091010
            time_start: this.timeFormat(new Date),
            //订单失效时间，格式同上
            time_expire: this.timeFormat(new Date(new Date().getTime() + 1000 * 60 * 100)),
            //商品标记，微信平台配置的商品标记，用于优惠券或者满减使用
            goods_tag: '',
            // 支付成功后的回调url
            notify_url: '',
            // 交易类型
            trade_type: 'JSAPI',
            // 商品id，调用方自行生成
            product_id: '',
            // 制定支付方式
            limit_pay: '',
            // 用户openid
            openid: ''
        }, this.reqData);
    },

    checkRequire: function (data) {
        return data && data.openid && data.body && data.total_fee && data.notify_url && true;
    },

    check_openid: function (openid) {
        if (!openid) {
            return new Err(Err.REQUIRE_OPENID, 'openid 不能为空');
        }
        return true;
    },

    check_trade_type: function (trade_type) {
        if (['JSAPI', 'NATIVE', 'APP', 'WAP'].indexOf(trade_type) == -1) {
            return new Err(Err.REQUIRE_TRADE_TYPE, '需要支付类型');
        }
        return true;
    },

    check_notify_url: function (notify_url) {
        if (!notify_url) {
            return new Err(Err.REQUIRE_NOTIFY_URL, '需要回调地址');
        }
        return true;
    },

    check_device_info: function (device_info) {
        return device_info == 'WEB' || new Err(Err.REQUIRE_DEVICE_INFO, '')
    },

    /**
     * 获取支付api的路径
     * @returns {string}
     */
    getApiPath: function () {
        return '/pay/unifiedorder';
    },

    /**
     * 发起支付接口
     * @param data 支付需要提交的参数
     * @param callback 将处理结果通过callback带回给调用者
     */
    doOrder: function (data, callback) {
        var t = this;
        this.request('post', data, function (err, ret) {
            if (err) {
                callback(err);
            }
            else {
                // 微信返回错误
                if (ret.return_code == 'FAIL') {
                    callback ({msg: ret.return_msg});
                }
                else {
                    callback(null, ret);   
                }
            }
        });
    }
});