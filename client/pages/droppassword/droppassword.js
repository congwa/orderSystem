// pages/droppassword/drappassword.js
var app = getApp();
import {Http} from '../../utils/httpClient' ;
var httpClient = new Http();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    send: false,
    alreadySend: false,
    second: 60,
    disabled: true,
    buttonType: 'default',
    phoneNum: '',
    code: '',
    otherInfo: '',
    newPassWord:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  inputPhonePass: function(e){
    let phoneNum = e.detail.value;
    this.setData({
      newPassWord:phoneNum
    })
    this.activeButton();
  },
  inputPhoneNum: function (e) {
    let phoneNum = e.detail.value
    if (phoneNum.length === 11) {
      let checkedNum = this.checkPhoneNum(phoneNum)
      if (checkedNum) {
        this.setData({
          phoneNum: phoneNum
        })
        console.log('phoneNum' + this.data.phoneNum)
        this.showSendMsg()
        this.activeButton()
      }
    } else {
      this.setData({
        phoneNum: ''
      })
      this.hideSendMsg()
    }
  },

  checkPhoneNum: function (phoneNum) {
    let str = /^1\d{10}$/
    if (str.test(phoneNum)) {
      return true
    } else {
      wx.showToast({
        title: '手机号不正确',
        image: '../../images/fail.png'
      })
      return false
    }
  },

  showSendMsg: function () {
    if (!this.data.alreadySend) {
      this.setData({
        send: true
      })
    }
  },

  hideSendMsg: function () {
    this.setData({
      send: false,
      disabled: true,
      buttonType: 'default'
    })
  },

  sendMsg: function () {
    httpClient.getPwdModifyCode({
      token:app.globalData.token,
      mobile:this.data.phoneNum
    }).then((res)=>{
      if(res.code ==200){
        this.setData({
          alreadySend: true,
          send: false
        })
        this.timer()
      }else{
        wx.showToast({
          title:res.msg
        })
      }
     
    }).catch((e)=>{
      if(e.msg){
        wx.showToast({
          title:e.msg?e.msg:'手机号错误',
          icon: 'loading'
        })
      }
    })
  },

  timer: function () {
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(
        () => {
          this.setData({
            second: this.data.second - 1
          })
          if (this.data.second <= 0) {
            this.setData({
              second: 60,
              alreadySend: false,
              send: true
            })
            resolve(setTimer)
          }
        }
        , 1000)
    })
    promise.then((setTimer) => {
      clearInterval(setTimer)
    })
  },

// 其他信息部分
  addOtherInfo: function (e) {
    this.setData({
      otherInfo: e.detail.value
    })
    this.activeButton()
    console.log('otherInfo: ' + this.data.otherInfo)
  },

// 验证码
  addCode: function (e) {
    this.setData({
      code: e.detail.value
    })
    this.activeButton()
    console.log('code' + this.data.code)
  },

 // 按钮
  activeButton: function () {
    let {phoneNum, code, newPassWord} = this.data
    console.log(code)
    if (phoneNum && code && newPassWord &&newPassWord.length == 6 ) {
      this.setData({
        disabled: false,
        buttonType: 'primary'
      })
    } else {
      this.setData({
        disabled: true,
        buttonType: 'default'
      })
    }
  },

  onSubmit: function () {
    var _this = this;
    httpClient.setUserModifyPassword({
      token:app.globalData.token,
      mobile:this.data.phoneNum,
      code:this.data.code,
      passWord:this.data.newPassWord
    }).then((res)=>{
      if(res.data.code ==200){
        _this.setData({
          control: false
        })
        wx.showToast({
          title: '修改成功',
          icon: 'succeed',
          duration: 2000
        })
        wx.switchTab({
          url: '../mycenter/mycenter'
        })
      }else{
        _this.setData({
          control: false
        })
        wx.showToast({
          title: res.data.msg,
          icon: 'filed',
          duration: 2000
        })
      }
    })
    .catch((res)=>{
      wx.showToast({
        title: res.msg,
        icon: 'filed',
        duration: 2000
      })
    })
  }
})