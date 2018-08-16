 //调取微信自带支付方法
export var payment = function(data){
    var response=data;
    wx.requestPayment({
      'appId':response.appId,
      'timeStamp': response.timeStamp,
      'nonceStr': response.nonceStr,
      'package': response.package,
      'signType': 'MD5',
      'paySign': response.paySign,
      'success':function(res){
        console.log(res);
        wx.showToast({
          title: '支付成功'
        });
        wx.navigateTo({
          url: "../pay_success/pay_success"
        })
      },
      'fail':function(res){
        wx.showToast({
          title: '支付失败'
        });
        console.log(res)
      }
   })
  }