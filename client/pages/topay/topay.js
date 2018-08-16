// pages/topay/topay.js
var app = getApp();
import {
  Http
} from '../../utils/httpClient.js';
import { URL } from '../../utils/urlModel.js';
// import{payment} from '../../utils/payment.js';
import { formatTime } from '../../utils/util';

var httpClient = new Http();
Page({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    code: '',
    shopId: '',
    price: '',
    chargeMoney: 0,
    rechargeConf:[],//充值满送数组
    idx:'',//控制选中状态
    iptvalue:'',//充值输入框的值
    /**
     * 订单号
     */
    orderNumber: 0,
    /**
     * 弹窗优惠券内容
     */
    couponData: [],
    /**
     * 优惠券数量
     */
    count: 1,
    /**
     * 订单备注信息
     */
    desc:'',

    /**
     * 支付选项卡
     * 1余额支付  2微信支付
     */
    tab:1,

    /**
     * 优惠券弹窗是否显示
     * false: 否
     */
    markCoupon: false,

    /**
     * 当前选择优惠券
     * -1 可查看是否可用优惠券 0没有可用优惠券 {}选择的优惠券内容
     */
    curSelectCoupon: -1,

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
     /**
     * 输入密码弹窗
     */
    maskInputPassed:false

  },
  initData(options) {
    var _this = this;
    var httpClient = new Http();

    // var price = JSON.parse(options.price);
    // var name = JSON.parse(options.name);
    console.log(options);
    // var shopId = JSON.parse(options.shopId);
    this.setData({
      shopId: options.shopId || '',
      orderNumber: options.orderNumber || '',
      price: options.price || ''
    })
    //获取充值满送配置接口，传空参
   httpClient.getChargeConf("").then((data)=>{
    this.setData({
      rechargeConf:data
    })
    console.log(this.data.rechargeConf);
   })
    
   this.getOrderInfo();
    /**
     * 获取用户信息
     */
    wx.getUserInfo({
      success: function (res) {
        console.log(res);
        _this.setData({
          userName: res.userInfo.nickName,
          userAvatarUrl: res.userInfo.avatarUrl
        })
      }
    })

  },

  // 密码输入完成验证
  valueSix(e){
    var cid = Object.prototype.toString.call(this.data.curSelectCoupon).slice(8, -1) == 'object' && this.data.curSelectCoupon ? this.data.curSelectCoupon.id : '';
        var argu = {
          token: app.globalData.token,
          orderNumber: this.data.orderNumber,
          desc:this.data.desc
        }
        httpClient.postAmountOrder(argu)
        .then((res)=>{
          console.log('支付成功');
          wx.showToast({
            title: '支付成功'
          });
          this.closeMarkPassword();
          wx.navigateTo({
            url: "../pay_success/pay_success?price="+_this.data.chargeMoney
          })
        })
        .catch((e)=>{
          console.log('支付失败');
          var str = e.msg?e.msg:'支付失败';
        
          wx.showToast({
            title: str
          });
          //重新开启弹窗
          this.closeMarkPassword();
          this.openMarkPassword();
        })
  },
  onLoad: function (options) {
    var price = options.price || 0;
    this.setData({
      price:price
    })
    this.initData(options);
  },
  /**
     * 获取订单信息
     */
  getOrderInfo(){
    var httpClient=new Http();
    var _this=this;
    var argu = {
      orderNumber: this.data.orderNumber,
      token: app.globalData.token
    };
    httpClient.getOrederSelect(argu).then((data) => {
      console.log("调取信息",data);
      _this.setData({
        title: data.title,
        price: (data.price / 100).toFixed(2),
        coupon_price: data.coupon_price
      })
    })
  },
  /**
   * 点击使用优惠券
   * @param {*} e 
   */
  selectOneCoupon(e) {
    var httpClient = new Http();
    //选择的cid
    var cid = e.target.dataset.cid;
    //优惠券数据
    var tData = this.data.couponData.filter((item, i) => {
      return item.id == cid;
    });
    var cData = tData.length > 0 ? tData[0] : -1;
    this.setData({
      curSelectCoupon: cData
    })

    /**
     * 使用优惠券
     */
    var argu = {
      token: app.globalData.token,
      orderNumber: this.data.orderNumber,
      id: this.data.curSelectCoupon.id
    }
    httpClient.setOrderSelectCoupon(argu).then((data) => {
      console.log(data);
      if (data.code==200) {
        wx.showToast({
          title:data.msg
        })
        this.closeMarkCoupon();
        this.getOrderInfo();
      }
    })

  },

  openMarkCoupon: function (e) {
    this.setData({
      markCoupon: true
    })
    console.log('开启优惠券弹窗');
    var httpClient = new Http();
    var argu = {
      token: app.globalData.token,
      orderNumber: this.data.orderNumber
    }
    /**
     * 获取订单优惠券信息
     */
    httpClient.getOrderSelectCoupon(argu).then((res) => {
      if (res) {
        res.list.forEach((ele, i) => {
          res.list[i].start_time = formatTime(new Date(ele.start_time * 1000));
          res.list[i].end_time = formatTime(new Date(ele.end_time * 1000));
          res.list[i].full_price = ele.full_price / 100;
          res.list[i].price = ele.price / 100;
        })
        this.setData({
          couponData: res.list,
          count: res.count
        })
      }
    }).catch((data) => {
      console.error('优惠券不存在', data);
      this.setData({
        curSelectCoupon: 0
      })
    })
  },
  closeMarkCoupon: function (e) {
    this.setData({
      markCoupon: false
    })
    console.log('关闭优惠券弹窗');
  },
  //输入支付金额，底部数据双向绑定
  getValue(e) {
    this.setData({
      price: e.detail.value
    })
  },
  //输入充值金额
  changeValue(e) {
    this.setData({
      chargeMoney: e.detail.value,
      idx:-1
    })
  },

  descChange(e){
    this.setData({
      desc:e.detail.value
    })
  },

  tabChange(e){
    var tab = e.currentTarget.dataset.tab;
    this.setData({
      tab:parseInt(tab)
    })
  },

    //余额支付输入密码
    payBalancePassword(){
      //判断余额是否充足
      var _this = this;
      httpClient.getUserInfo({ token: app.globalData.token }).then((data) => {
        console.log('用户信息  ', data);
        console.log(data.amount/100);
        var amount=data.amount/100;
        //余额不够
        if (amount < _this.data.price) {
          // return Promise.reject(this.showCharge());
          //展开充值弹窗
          _this.showCharge();
        } else { //余额足够
          // var cid = Object.prototype.toString.call(this.data.curSelectCoupon).slice(8, -1) == 'object' && this.data.curSelectCoupon ? this.data.curSelectCoupon.id : '';
          // var argu = {
          //   token: app.globalData.token,
          //   lid: this.data.shopId,
          //   money: this.data.price,
          //   cid: cid
          // }
          // return httpClient.payAmountPaymnet(argu)
          //打开让用户输入密码
          _this.openMarkPassword();
  
        }
      })
    },

     /**
   * 打开输入密码弹窗
   */
  openMarkPassword(){
    this.setData({
      maskInputPassed:true
    })
    console.log(this.data.maskInputPassed);
  },
  /**
   * 关闭输入密码弹窗
   */
  closeMarkPassword(){
    this.data.inputData.input_value = '';
    this.setData({
      maskInputPassed:false,
      inputData:this.data.inputData
    })
  },

  /**
   * 点击支付
   */
  pay(){
    switch (this.data.tab) {
      case 1:
        this.payBalancePassword();
        break;
      case 2:
        this.paySuccess();
        break;
      default:
        break;
    }
  },

  /**
   * 微信支付调用(需要判断是否有优惠券)
   */
  paySuccess() {
    var httpClient = new Http();
    var _this = this;
    //判断是否有优惠券
    console.log('1111', Object.prototype.toString.call(this.data.curSelectCoupon).slice(8, -1), this.data.curSelectCoupon);
    if (Object.prototype.toString.call(this.data.curSelectCoupon).slice(8, -1) == 'object' && this.data.curSelectCoupon) {
      var argu = {
        token: app.globalData.token,
        orderNumber: _this.data.orderNumber
      }
      httpClient.postWxPayOrder(argu).then((data) => {
        _this.payment(data);
      })
    } else {
      var argu = {
        token: app.globalData.token,
        orderNumber: _this.data.orderNumber
      }
      httpClient.postWxPayOrder(argu).then((data) => {
        console.log(data);
        _this.payment(data);
      })
    }

  },
  /**
   * 余额支付
   * 先去判断用户余额,如果用用户余额不够直接弹出充值,充值完成直接支付
   */
  // payBalance() {
  //   var _this = this;
  //   var httpClient = new Http();
  //   httpClient.getUserInfo({ token: app.globalData.token }).then((data) => {
  //     console.log('用户信息  ', data);
  //     //余额不够
  //     if (data.amount/100 < _this.data.price) {
  //       return Promise.reject(this.showCharge());
  //     } else {
  //       var cid = Object.prototype.toString.call(this.data.curSelectCoupon).slice(8, -1) == 'object' && this.data.curSelectCoupon ? this.data.curSelectCoupon.id : '';
  //       var argu = {
  //         token: app.globalData.token,
  //         // lid: this.data.shopId,
  //         // money: this.data.price,
  //         // cid: cid
  //         orderNumber: this.data.orderNumber,
  //         desc:this.data.desc
  //       }
  //       return httpClient.postAmountOrder(argu)
  //     }
  //   })
  //   .then((data)=>{
  //     console.log('钱够了,支付完跳转呗');
  //     console.log('完成余额支付 ', f);
  //         wx.showToast({
  //           title: '支付成功'
  //         });
  //         wx.navigateTo({
  //           url: "../pay_success/pay_success"
  //         })
  //   })
  //   .catch((v) => {
  //       console.error('余额支付失败 ', v);
  //       wx.showToast({
  //         title: v.msg
  //       });
  //   })
  //   // .finally((f) => {
  //   //     console.log('完成余额支付 ', f);
  //   //     wx.showToast({
  //   //       title: '支付成功'
  //   //     });
  //   //     wx.navigateTo({
  //   //       url: "../pay_success/pay_success"
  //   //     })
  //   //   })
  // },
  //显示充值弹窗
  showCharge: function () {
    // console.log(111);
    this.setData({
      chargeflag: !this.data.chargeflag
    })
  },
  //充值接口调取
  gocharge() {
    var httpClient = new Http();
    var _this = this;
    var argu = {
      money: _this.data.chargeMoney,
      token: app.globalData.token
    };
    if (!argu.money) {
      wx.showToast({
        title: '请输入金额'
      })
    } else {
      httpClient.getChargeMoney(argu).then((data) => {
        console.log("充值", data);
        _this.payment(data);
        _this.payBalance();
      })
    }
  },
   //点击满送直接充值
   getMoney(e){
    this.setData({
      chargeMoney: e.target.dataset.money,
      idx:e.target.dataset.index,
      iptvalue:''
    })
  },
  //调取微信自带支付方法
  payment(data) {
    var _this = this;
    var response = data;
    wx.requestPayment({
      'appId': response.appId,
      'timeStamp': response.timeStamp,
      'nonceStr': response.nonceStr,
      'package': response.package,
      'signType': 'MD5',
      'paySign': response.paySign,
      'success': function (res) {
        console.log(res);
        if (_this.data.chargeflag) {
          wx.showToast({
            title: '充值成功'
          });
          //关闭充值弹窗
          this.showCharge();
          //再次进行余额支付
          this.openMarkPassword();
        } else {
          wx.showToast({
            title: '支付成功'
          });
          wx.navigateTo({
            url: "../pay_success/pay_success?price="+_this.data.chargeMoney
          })
        }
      },
      'fail': function (res) {
        wx.showToast({
          title: '支付失败'
        });
        console.log(res)
      }
    })
  },
  /******************** 密码相关接口  ************************/
  /**
   * 密码
   * @param {*} e 
   */
  showKey(e) {
    if (this.data.isOnePassed) {
      this.showInputPassed();
    } else {
      this.showRevisePassed();
    }
  },

  // /**
  //  * 显示隐藏输入密码
  //  */
  // showInputPassed() {
  //   this.setData({
  //     maskInputPassed: !this.data.maskInputPassed
  //   })
  // },
  // /**
  //  *显示隐藏修改密码 
  //  */
  // showRevisePassed() {
  //   this.setData({
  //     maskRevisePassed: !this.data.maskRevisePassed
  //   })
  // },
})
