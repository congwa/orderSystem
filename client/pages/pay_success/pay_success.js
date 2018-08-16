// pages/pay_success/pay_success.js

var ownType= {
  onlyTable:'onlyTable',//仅仅订桌
}

var app = getApp();

Page({

  /**
   * 组件的初始数据
   */
  data: {
    ownType:ownType,
    /**
     * 当前页面是哪里过来的。。(接地气。。)
     */
    type:'',
    price:''
  },

  onLoad(options){
    var type = options.type|| '';
    this.setData({
      type:type
    })
    var price = options.price || 0;
    this.setData({
      price:price
    })
    this.propell();
    
  },
  checkOrder(){
    wx.switchTab({
      url: '../indent/indent'
    })
  },

  /**
   * 推送
   */
  propell(){
    // wx.request({
    //   url:'https://www.yblcloud.com/gettoken',
    //   data:{
    //     token:app.globalData.token
    //   },
      
    //   success: (res) => {
    //     var access_token = res.access_token;
    //     wx.request({
    //       url:'https://api.weixin.qq.com/cgi-bin/wxopen/template/list',
    //       method:"POST",
    //       data:{
    //         access_token:access_token,
    //         offset:0,
    //         count:1
    //       },
    //       success:(res) =>{
    //         console.log(res);
    //       }
    //     })
    //   },
    //   fail: (e) =>{
    //   }
    // })

  } 


})
