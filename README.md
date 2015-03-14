##微信支付-刷卡支付SDK?
对微信官方提供的刷卡支付api进行了封装，目前暴漏了支付、撤销、查询3个接口给业务代码。极大的降低了商户接入微信扫码支付的门槛



##SDK有哪些功能？

* 实现扫码支付，通过扫描用户手机的条码或者二维码提交被扫支付请求
* 从微信支付后台查询某单的支付状态
* 撤销某一个订单


##有问题反馈
在使用中有任何问题，欢迎反馈给我，可以用以下联系方式跟我交流

* 邮件(89502611@qq.com)
* QQ: 89502611

##捐助开发者
如果你觉得SDK对你的编码有帮助并且您诚心的认可我，那么你可以捐助一些金额，当然不捐也不影响我继续完善该SDK。

![微信扫描](http://cos.myqcloud.com/1000371/img_list/cover/9c3d24322d9f76f2b39d87e73a5f235b.png)

##将SDK引入到你的项目中

```javascript
npm install wxpay-sdk --save
```

##调用示例
```javascript
var wxPaySDKInstance = new WXPaySDK(wxAppId, mchId, mchKey);

// 发起一笔被扫支付 ，参数请参考微信支付被扫支付api文档
wxPaySDKInstance.pay(data, callback);

// 查询被扫支付订单信息,
// {transaction_id: 111, out_trade_no: 111}
wxPaySDKInstance.query(query, callback);

// 发起一笔撤销,对某个订单进行撤销
wxPaySDKInstance.reverse(data, callback);
```