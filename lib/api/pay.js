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
            //这个是扫码终端设备从用户手机上扫取到的支付授权号，有效期是1分钟
            auth_code: '',
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
            goods_tag: ''
        }, this.reqData);
    },

    /**
     * 检验auth_code合法性
     * @param code
     * @param key
     * @param data
     * @returns {*}
     */
    check_auth_code: function (code, key, data) {
        if (!code) {
            return new Err(Err.PARAM_ERROR, '缺少auth_code参数');
        }
        return 0;
    },

    /**
     * 获取支付api的路径
     * @returns {string}
     */
    getApiPath: function () {
        return '/pay/micropay';
    },

    /**
     * 发起支付接口
     * @param data 支付需要提交的参数
     * @param callback 将处理结果通过callback带回给调用者
     */
    doPay: function (data, callback) {
        var t = this;
        this.request('post', data, function (err, ret) {
            if (err) {
                console.log(err);
                callback(err);
            }
            else {

                callback(null, ret);
            }
        });
    }
});