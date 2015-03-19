##微信支付-刷卡支付SDK?
对微信官方提供的刷卡支付api进行了封装，目前暴漏了支付、撤销、查询3个接口给业务代码。极大的降低了商户接入微信扫码支付的门槛

##哪些场景适合用刷卡（被扫）支付，看如下步骤

* 步骤1：用户选择被扫支付付款并打开微信，进入“我”->“钱包”->“刷卡”条码界面（如图5.1所示）；
* 步骤2：收银员在商户系统操作生成支付订单，用户确认支付金额；
* 步骤3：商户收银员用扫码设备扫描用户的条码/二维码，商户收银系统提交支付；
* 步骤4：微信支付后台系统收到支付请求，根据验证密码规则判断是否验证用户的支付密码，不需要验证密码的交易直接发起扣款，需要验证密码的交易会弹出密码输入框（如图5.2所示）。支付成功后微信端会弹出成功页面（如图5.3所示），支付失败会弹出错误提示。

进入微信刷卡界面

![进入微信刷卡界面](http://cos.myqcloud.com/1000371/img_list/cover/1bd7d460b4b948a1e443154ee7c23efe.jpg)

输入支付密码，小额支付免输入密码

![输入支付密码](http://cos.myqcloud.com/1000371/img_list/cover/9895012eb95332d21f06aaf73fd7df78.jpg)

支付完成

![支付完成](http://cos.myqcloud.com/1000371/img_list/cover/2522a8c6b55e609f8f7e6b20f1879b77.jpg)


##SDK有哪些功能？

* 实现扫码支付，通过扫描用户手机的条码或者二维码提交被扫支付请求
* 从微信支付后台查询某单的支付状态
* 撤销某一个订单

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
##更多功能
<http://mch.weixin.qq.com/wiki/doc/api/micropay.php?chapter=5_5>

##有问题反馈
在使用中有任何问题，欢迎反馈给我，可以用以下联系方式跟我交流

* 邮件(89502611@qq.com)
* QQ: 89502611

##捐助开发者
如果你觉得SDK对你的编码有帮助并且您诚心的认可我，那么你可以随意打赏一下作者。

![微信扫描](http://cos.myqcloud.com/1000371/img_list/cover/b06af0d14708746a8795395fb5f75c87.png)

