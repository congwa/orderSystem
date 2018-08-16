// pages/pocket/pocket.js 我的钱包
var app = getApp();
import { Http } from '../../utils/httpClient.js';
import { URL } from '../../utils/urlModel.js';
import { formatTime } from '../../utils/util';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    chargeMoney:0,//充值金额的初始值
    rechargeConf: [],//充值满送配置
    chargeflag: false,//充值弹窗显示
    idx:'',//控制选中状态
    iptvalue:'',//充值输入框的值
    /**
     * 数量
     */
    count: 1,
    //我的余额
    amount: 0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  initData: function () {
    var httpClient = new Http();
    var argu = {
      token: app.globalData.token
    }
    //钱包信息
    httpClient.getUserWalletList(argu).then((res) => {
      console.log('钱包信息', res);
      res.list.forEach((ele, i) => {
        res.list[i].create_time = formatTime(new Date(ele.create_time * 1000));
        res.list[i].pay_price = (Math.abs(ele.pay_price) / 100).toFixed(2);
      })
      this.setData({
        list: res.list,
        count: res.count
      })
    })
    //我的余额
    httpClient.getUserAmount(argu).then((res) => {
      console.log('我的余额', res);
      this.setData({
        amount: (res.amount / 100).toFixed(2)
      })
    })
    //获取充值满送配置接口，传空参
    httpClient.getChargeConf("").then((data) => {
      this.setData({
        rechargeConf: data
      })
      console.log(this.data.rechargeConf);
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.initData();
  },
  //显示充值弹窗
  showCharge: function () {
    // console.log(111);
    this.setData({
      chargeflag: !this.data.chargeflag
    })
  },

  //输入充值金额
  changeValue(e) {
    this.setData({
      chargeMoney: e.detail.value,
      idx:-1
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
    if(!argu.money){
      wx.showToast({
          title:'请输入金额'
      })
    }else{
      httpClient.getChargeMoney(argu).then((data) => {
        console.log("充值", data);
        _this.payment(data);
        // _this.payBalance();
      })
    }
    
  },
  //点击满送
  getMoney(e) {
    this.setData({
      chargeMoney: e.target.dataset.money,
      idx:e.target.dataset.index,
      iptvalue:''
    })
    // this.gocharge()
  },
  //调取微信自带支付方法
  payment(data) {
    var response = data;
    var _this=this;
    wx.requestPayment({
      'appId': response.appId,
      'timeStamp': response.timeStamp,
      'nonceStr': response.nonceStr,
      'package': response.package,
      'signType': 'MD5',
      'paySign': response.paySign,
      'success': function (res) {
        console.log(res);
        wx.showToast({
          title: '充值成功'
        });
        //关闭充值弹窗
        _this.setData({
          chargeflag:false
        })
        _this.initData();
      },
      'fail': function (res) {
        wx.showToast({
          title: '支付失败'
        });      
      }
    })
  }



})
