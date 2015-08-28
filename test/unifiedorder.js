var should = require('should');
var PaySDK = require('../pay');
var UnifiedOrder = require('../lib/api/unifiedorder');
var Base = require ('../lib/api/base');
var mpappid = 'wx973fe72caf17d919';
var mchid = '1265316501';
var key = 'atMGhIDPI1gRm77MaOuk8h2ns3qUlxca';

describe('jsapi支付', function () {
	var ins = new UnifiedOrder(mpappid, mchid, key)
	it ('统一下单正确从基类继承', function () {
		ins.should.instanceof(Base)
	});
	it ('获取请求的协议', function () {
		ins.getApiProtocol().should.equal('https','协议必须是https')
	})
	it ('获取请求的路径', function () {
		var url = ins.getApiProtocol() + '://' + ins.getApiHost() + ins.getApiPath();
		url.should.equal('https://api.mch.weixin.qq.com/pay/unifiedorder1', '微信支付统一下单要求的url');
	});
	it ('进行下单', function (done) {
		ins.doOrder.should.type('function', '统一下单方法存在');
		ins.doOrder({
			'total_fee': 1,
			'body': '单元测试用例',
			'openid': 'xxxxxx',
			'notify_url': 'xxxx',
			'out_trade_no': 'a' + Date.now()
		}, function (err, ret) {
			if (err) {
				should.fail(err, null, '统一下单发生错误');
			}
			else {
				console.log(ret);
			}
			done();
		})
	});
})