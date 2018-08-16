// pages/mycenter/mycenter.js
var app = getApp();
import {Http} from '../../utils/httpClient' ;
var httpClient = new Http();
Page({

  /**
   * 页面的初始数据
   */
  data: {
 
      userName:' ',
      userAvatarUrl:'',
      issign:1,
      /**
       * 当前金钱
       */
      remaind:'98.00',
      /**
       * 当前积分
       */
      points:'98',
      maskInputPassed:false,
      maskRevisePassed:false,
      /**
       * 是否已经设置密码
       */
      isOnePassed:false,
   

      /**
       * 输入框数据
       */
      inputData: {
        input_value: "",//输入框的初始内容
        value_length: 0,//输入框密码位数
        isNext: false,//是否有下一步的按钮
        get_focus: true,//输入框的聚焦状态
        focus_class: true,//输入框聚焦样式
        value_num: [1, 2, 3, 4, 5, 6],//输入框格子数
        height: "98rpx",//输入框高度
        width: "604rpx",//输入框宽度
        see: false,//是否明文展示
        interval: true,//是否显示间隔格子
      },
      inputData2:{
        input_value: "",//输入框的初始内容
        value_length: 0,//输入框密码位数
        isNext: true,//是否有下一步的按钮
        get_focus: false,//输入框的聚焦状态
        focus_class: false,//输入框聚焦样式
        value_num: [1, 2, 3, 4, 5, 6],//输入框格子数
        height: "98rpx",//输入框高度
        width: "604rpx",//输入框宽度
        see: false,//是否明文展示
        interval: true,//是否显示间隔格子
      },
      inputData3:{
        input_value: "",//输入框的初始内容
        value_length: 0,//输入框密码位数
        isNext: true,//是否有下一步的按钮
        get_focus: false,//输入框的聚焦状态
        focus_class: false,//输入框聚焦样式
        value_num: [1, 2, 3, 4, 5, 6],//输入框格子数
        height: "98rpx",//输入框高度
        width: "604rpx",//输入框宽度
        see: false,//是否明文展示
        interval: true,//是否显示间隔格子
      },
      /**
       * 绑定手机号
       */
      // bindIphoneNumber:0,
      // bindIphoneCodeNumber:0,
      // codeBool:false,
      // codetime:60,

      send: false,
      alreadySend: false,
      second: 60,
      disabled: true,
      buttonType: 'default',
      phoneNum: '',
      code: '',
      otherInfo: '',
      /**
       * 是否绑定了手机
       * 2是没有绑定 1是已经绑定
       */
      is_mobile:2
  },
  //获取积分余额数据
  getUserIters(){
    var httpClient = new Http();
    httpClient.getUserIntegral({token:app.globalData.token}).then((data)=>{
      console.log("我的积分余额",data);
      if(data.is_sign==1){
        this.setData({
          issign:2
        })        
      }else if(data.is_sign==2){
        this.setData({
          issign:1
        })
      }
    })
   },
   //去签到
   goSign(){
    var httpClient=new Http();
    //当前时间戳
   //  if(this.data.isSign == '已签到'){
   //    return;
   //  }
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
   //  console.log("当前时间戳为：" + timestamp);
    httpClient.clickSign({token:app.globalData.token,time:timestamp}).then((data)=>{
       console.log("点击签到",data);
       if(data.msg=="已签到"&&data.code==20001){
         wx.showToast({
           title: '已签到过了'        
         });                         
       } 
        this.setData({
          issign:2
        })
       
         
       
       //签到之后，数据改变，调取积分列表，更改弹窗里面的积分+7的值
      //  this.getIntegralList();
       //获取积分余额数据
      //  this.getUserIters();
      //  this.getSignLists();//调取签到列表，更改弹窗里面连续签到的值，signData.count
    })
  },

  showKey(e){
    if (!this.data.isOnePassed){
      this.showInputPassed();
    }else{
      // this.showRevisePassed();
      wx.showToast({
        title:'已设置支付密码'
      })
    }
  },
  
  closeKey(){
    if (!this.data.isOnePassed){
      this.showInputPassed();
    }else{
      this.showRevisePassed();
    }
  },
  // 当组件输入数字6位数时的自定义函数
  valueSix(e) {
    var httpClient = new Http();
    httpClient.getUserSetPassword({
      token:app.globalData.token,
      passWord:e.detail
    }).then((res)=>{
      if(res.code==200){
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 2000
        })
        this.closeKey();
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'filed',
          duration: 2000
        })
       
      }
    })
    console.log("1");
    // 模态交互效果

   
    console.log(this.data.inputData);
  },
  valueSixRe(e){
    //输入完成第一个了
    this.data.inputData2.input_value = e.detail;
  },
  valueSixRe2(e){
    var httpClient = new Http();
    //第二个输入完成
      httpClient.setUserModifyPassword({
        token:app.globalData.token,
        passWord:this.data.inputData2.input_value,
        newPassWord:e.detail
      }).then((res)=>{
        if(res.code==200){
          wx.showToast({
            title: res.msg,
            icon: 'success',
            duration: 2000
          })
          this.closeKey();
        }else{
          wx.showToast({
            title: res.msg,
            icon: 'filed',
            duration: 2000
          })
          
        }
      })
      .catch((e)=>{
        wx.showToast({
          title: e.msg,
          icon: 'filed',
          duration: 2000
        })
        this.data.inputData2.input_value = '';
          this.data.inputData3.input_value = '';
          this.setData({
            inputData2:this.data.inputData2,
            inputData3:this.data.inputData3
          })
      })
  },
  /**
   * 初始化数据函数 
   * 调用接口
   */
  initData(){
    var _this = this;
    var httpClient = new Http();
    wx.getUserInfo({
      success: function (res) {
        console.log(res);
        _this.setData({
          userName: res.userInfo.nickName,
          userAvatarUrl: res.userInfo.avatarUrl
        })
      }
    })

    httpClient.getUserInfo({token:app.globalData.token}).then((res)=>{
      if(res){
        this.setData({
          remaind:(res.amount/100).toFixed(2),
          points:res.score,
          is_mobile:res.is_mobile
        })
      }
    })

    /**
     * 检测是否已经设置密码
     */
    httpClient.getUserCheckPassword({
      token:app.globalData.token
    }).then((res)=>{
      if(res.status == 1){
        this.setData({
          isOnePassed:true
        })
      }else if(res.status == 2){
        this.setData({
          isOnePassed:false
        })
      }
    })
    this.getUserIters();

  },

  /**
   * 显示隐藏输入密码
   */
  showInputPassed(){
    this.setData({
      maskInputPassed:!this.data.maskInputPassed
    })
  },

  /**
   *显示隐藏修改密码 
   */
  showRevisePassed(){
    this.setData({
      maskRevisePassed: !this.data.maskRevisePassed
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData();
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
    this.initData();
  },
  showTel:function(){
    if(this.data.is_mobile == 1){
      wx.showToast({
        title:'已经绑定手机'
      })
    }else{
      this.setData({
        control: !this.data.control
      })
    }
     
  },

  toPassWord(){
    if(this.data.is_mobile == 1){
      wx.navigateTo({
        url:'../droppassword/droppassword'
      })
    }else{
      wx.showToast({
        title:'您还没有绑定手机'
      })
    }
   
  },
  checkOrder() {
    wx.switchTab({
      url: '../indent/indent'
    })
  },
  droppassword(){
    wx.navigateTo({
      url: '../droppassword/droppassword'
    })
  },
  // bindIphoneChange(e) {
  //   this.setData({
  //     bindIphoneNumber:e.detail.value
  //   })
  // },
  // bindIphoneCodeChange(e) {
  //   this.setData({
  //     bindIphoneCodeNumber:e.detail.value
  //   })
  // },
  /**
   * 获取验证码
   */
  // getCode(){
  //   var httpClient = new Http();
  //   var _this = this;
  //   if(this.data.codeBool && this.data.codetime>0){

  //   }else if(this.data.codeBool && this.data.codetime<=0){
  //     _this.setData({
  //       codetime:60,
  //     })
  //     clearInterval(_this.data.codeBool);
  //     _this.setData({
  //       codeBool:false
  //     })
  //   }else if(!this.data.codeBool && this.data.codetime==60){
      
  //     httpClient.getBindingVerificationCode({
  //       token:app.globalData.token,
  //       mobile:this.data.bindIphoneNumber
  //     }).then((res)=>{
  //       if(res.code == 200){
  //         this.data.codeBool = setInterval("CountDown()", 1000);
  //         function CountDown(){
  //           _this.data.codetime--;
  //           _this.setData({
  //             codetime:this.data.codetime
  //           })
  //         }
  //         wx.showToast({
  //           title: res.msg,
  //           icon: 'succeed',
  //           duration: 2000
  //         })
  //       }else{
  //         wx.showToast({
  //           title: res.msg,
  //           icon: 'filed',
  //           duration: 2000
  //         })
  //       }
  //     })
  //     .catch((res)=>{
  //       wx.showToast({
  //         title: res.msg,
  //         icon: 'filed',
  //         duration: 2000
  //       })
        
  //     })
  //   }
  // },

  // bindIphone(){
  //   var _this = this;
  //   var httpClient = new Http();
  //   httpClient.getUserBindingMobile({
  //     token:app.globalData.token,
  //     mobile:this.data.bindIphoneNumber,
  //     code:this.data.bindIphoneCodeNumber
  //   }).then((res)=>{
  //     if(res.code ==200){
  //       _this.setData({
  //         control: false
  //       })
  //       wx.showToast({
  //         title: res.msg,
  //         icon: 'succeed',
  //         duration: 2000
  //       })
  //     }else{
  //       _this.setData({
  //         control: false
  //       })
  //       wx.showToast({
  //         title: res.msg,
  //         icon: 'filed',
  //         duration: 2000
  //       })
  //     }
  //   })
  //   .catch((res)=>{
  //     wx.showToast({
  //       title: res.msg,
  //       icon: 'filed',
  //       duration: 2000
  //     })
  //   })
  // },
 toamount(){
    wx.navigateTo({
      url: "../pocket/pocket"
    })
  },
  points(){
    wx.navigateTo({
      url: "../points/points"
    })
  },  
  closetelephoneMask(){
    this.setData({
      control:false
    })
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
    httpClient.getBindingVerificationCode({
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
      wx.showToast({
        title:e.msg?e.msg:'手机号错误',
        icon: 'loading'
      })
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
    let {phoneNum, code, otherInfo} = this.data
    console.log(code)
    if (phoneNum && code ) {
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
    httpClient.getUserBindingMobile({
      token:app.globalData.token,
      mobile:this.data.phoneNum,
      code:this.data.code
    }).then((res)=>{
      if(res.data.code ==200){
        _this.setData({
          control: false,
          is_mobile:1
        })
        wx.showToast({
          title: '绑定成功',
          icon: 'succeed',
          duration: 2000
        })
      }else{
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