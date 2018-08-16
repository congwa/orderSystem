//js

var app = getApp();
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    show:true
  },
  onLoad: function () {
    var _this = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权直接进行登录
          _this.bindGetUserInfo();
        }else{ //没有进行授权那么显示让用户进行点击授权
          _this.setData({
            show:false
          })
        }
      }
    })
  },
  bindGetUserInfo: function (event) {
    //使用
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.login({
            success: function (res) {
              var code = res.code;//登录凭证
              if (code) {
                //2、调用获取用户信息接口
                wx.getUserInfo({
                  success: function (res) {
                    console.log('userInfo:  ',res);
                    app.globalData.userInfo = res.userInfo;
                    console.log('app:  ',app);
                    console.log({ encryptedData: res.encryptedData, iv: res.iv, code: code })
                    //3.请求自己的服务器，解密用户信息 获取unionId等加密信息
                    wx.request({
                      url: 'https://www.yblcloud.com/login',//自己的服务接口地址
                      method: 'get',
                      header: {
                        'content-type': 'application/x-www-form-urlencoded'
                      },
                      data: { encryptedData: res.encryptedData, iv: res.iv, code: code },
                      success: function (data) {
                        console.log('token',data,data.data,data.data.data.token);
                        if(data && data.data && data.data.data&&  data.data.data.token){
                          app.globalData.token = data.data.data.token;
                        }
                        //4.解密成功后 获取自己服务器返回的结果
                        if (data.statusCode == 200) {
                          wx.switchTab({
                            url: '../index/index'
                          })
                        } else {
                          console.log('解密失败')
                        }

                      },
                      fail: function () {
                        console.log('系统错误')
                      }
                    })
                  },
                  fail: function () {
                    console.log('获取用户信息失败')
                  }
                })

              } else {
                console.log('获取用户登录态失败！' + r.errMsg)
              }
            },
            fail: function () {
              console.log('登陆失败')
            }
          })

        } else {
          console.log('获取用户信息失败')

        }

      }
    })

  }
})
