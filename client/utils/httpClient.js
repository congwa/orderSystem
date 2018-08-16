
import {URL} from './urlModel.js';

var bmap = require('.//bmap-wx.js'); 

function PromiseFun(argu,url,num){
  return new Promise((resove, reject)=> {
    wx.showLoading({
      title:'正在加载'
    })
    wx.request({
      url:url,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data:argu,
      success: (res) => {
        wx.hideLoading();
        if(num==1){
          resove(res.data)
        }else if(num==2){
          resove(res);
        }else{
          if(res.data.data){
            resove(res.data.data)
          }else{
            reject(res.data);
          }
        }
      },
      fail: (e) =>{
        wx.hideLoading();
        reject(e)
      }
    })
  })
}

export class Http{
  constructor(){

  }

  /**
   * 获取首页滑动分类数据
   */
  getNavIndex(){
    return new Promise((resove, reject) => {
      wx.request({
        url: URL.NAV_INDEX,
        success: function (res) {
          resove(res.data.data);
        },
        fail: function (e) {
          reject(e);
        }
      })
    })
  }

  /**
   * 获取首页banner
   */
  getBannerIndex(){
    return new Promise((resove, reject)=>{
      wx.request({
        url: URL.BANNER_INDEX,
        success: function (res) {
          resove(res.data.data);
        },
        fail: function (e) {
          reject(e);
        }
      })
    })
  }

  /**
   * 获取位置
   */
  getMap(){
    return new Promise((resove,reject) => {
      wx.getLocation({
        success: function (res) { 
          resove(res);
          console.log('地图信息',res);
        }
      })
    })
  }

  getCity(){
    return new Promise((resove,reject)=>{
      this.getMap().then((res)=>{
        var argu = {
          ak:'ByQKfr4Q77mRURrcSxhSqDks73eYENu5',
          coordtype:'wgs84ll',
          output:'json',
          location:res.latitude +','+res.longitude
        }
        wx.request({
          url:'https://api.map.baidu.com/geocoder/v2/',
          data:argu,
          success: function (res) {
            resove(res.data.result);
          },
          fail: function (e) {
            reject(e);
          }
        })
      })
    })
  }

  getWeather(){
    return new Promise((resove,reject)=>{
      var BMap = new bmap.BMapWX({ 
        ak: 'ByQKfr4Q77mRURrcSxhSqDks73eYENu5'
      });
      BMap.weather({
        success:(res) =>{
          console.log(res);
          resove(res);
        }
      })
    })
  }
  
  /**
   * 首页商铺列表
   */
  getListIndex(argu){
    return new Promise((resove,reject)=>{
      wx.request({
        url: URL.LIST_INDEX,
        data:{
          lat:argu.lat,
          lng:argu.lng,
          type:argu.type,
          city:argu.city,
          county:argu.county,
          sort:argu.sort,
          page:argu.page
        },
        success: function (res) {
          resove(res.data.data);
        },
        fail: function (e) {
          reject(e);
        }
      })
    })
  }

  /**
   * 获取商铺详情
   * Id：店铺Id
   */
  getShopDetail(argu){
    return new Promise((resove, reject)=>{
      wx.request({
        url: URL.SHOP_DETAIL,
        data:{
          id:argu.id
        },
        success: function (res) {
          resove(res.data.data);
        },
        fail: function (e) {
          reject(e);
        }
      })
    })
  }

  /**
   * 获取商铺详情中的商品列表
   */
  getShopDetailList(argu){
    return PromiseFun(argu,URL.SHOP_DETAIL_LIST);
  }

  /**
   * 获取商品列表
   * @param { } argu 商品参数Data数据格式 
   */
  getStoreList(argu){
    return PromiseFun(argu,URL.STORE_LIST);
  }

  /**
   * 获取店铺信息
   */
  getStoreDetail(argu){
    return PromiseFun(argu,URL.STORE_DETAIL);
  }

  /**
   * 获取评价
   */
  getStoreCommit(argu){
    return PromiseFun(argu,URL.STORE_COMMIT);
  }

  /**
   * 评论提交按钮
   * 
   */
  postPutEvaluate(argu){
    return PromiseFun(argu,URL.PUT_EVALUATE,1)
  }

  /**
   * 提交购物车数据
   */
  postStoreShopping(argu){
    // return PromiseFun(argu,URL.STORE_PUT_SHOPPING);
    return new Promise((resove,reject)=>{
      wx.request({
        url: URL.STORE_PUT_SHOPPING,
        data:argu,
        success: function (res) {
          resove(res.data);
        },
        fail: function (e) {
          reject(e);
        }
      })
    })
  }

  /**
   * 获取购物车数据
   */
  getStoreShopping(argu){
    return PromiseFun(argu,URL.STORE_GET_SHOPPING);
  }

  /**
   * 清空购物车数据
   */
  clearStoreShopping(argu){
    //return PromiseFun(argu,URL.STORE_CLEAR_SHOPPING);
    return new Promise((resove,reject)=>{
      wx.request({
        url: URL.STORE_CLEAR_SHOPPING,
        data:argu,
        success: function (res) {
          resove(res.data);
        },
        fail: function (e) {
          reject(e);
        }
      })
    })
  }
  //充值支付
  getChargeMoney(argu){
    return PromiseFun(argu,URL.WXPAY_RECHARGE,1)
  }
  //付款支付（输入金额）
  getPayment(argu){
    return PromiseFun(argu,URL.WXPAY_PAYMENT,1)
  }
  // 点击下单按钮，生成订单
  getOrderFound(argu){
    return PromiseFun(argu,URL.ORDER_FOUND,1);
  }
  //查看订单，渲染支付页面订单信息,判断是否跳转支付页面
  getOrederSelect(argu){
    return PromiseFun(argu,URL.ORDER_SELECT);
  }
  //订单页去支付前查看订单
  getOrederSelected(argu){
    return PromiseFun(argu,URL.ORDER_SELECT,1);
  }
  //点击签到
  clickSign(argu){
    return PromiseFun(argu,URL.SIGN,1);
  }
  /**
   * 只订桌
   * @param {*} argu 
   */
  postOrderAppointmentFound(argu){
    return PromiseFun(argu,URL.ORDER_APPOINTMENT_FOUND,1);
  }
  //充值优惠
  getChargeConf(argu){
      return PromiseFun(argu,URL.RECHARGE_CONF)
  }

  //微信支付接口
  postWxPayOrder(argu){
    return PromiseFun(argu,URL.WXPAY_ORDER,1);
  }

  getUserCommitList(argu){
    return PromiseFun(argu,URL.USER_COMMIT_LIST);
  }
  //直接付款
  postWxPayment(argu){
    return PromiseFun(argu,URL.WXPAY_PAYMENT,1);
  }
  //全部订单
  getUserOrderList(argu){
    return PromiseFun(argu,URL.USER_ORDER_LIST);
  }
  //获取个人优惠券列表
  getuserCouponList(argu){
    return PromiseFun(argu,URL.USER_COUPON_LIST);
  }
  //是否满足优惠券条件
  isOrderChooseCoupon(argu){
    return PromiseFun(argu,URL.ORDER_CHOOSE_COUPON);
  }
  //我的钱包
  getUserWalletList(argu){
    return PromiseFun(argu,URL.USER_WALLET_LIST);
  }

   //我的余额
  getUserAmount(argu){
    return PromiseFun(argu,URL.USER_AMOUNT);
  }

  
   //付款页面查看优惠券
   getPaymentSelectCoupon(argu){
    return PromiseFun(argu,URL.PAYMENT_SELECT_COUPON);
  }

  /**
   * 微信支付有使用优惠券
   */
  payWxPayPayment(argu){
    return PromiseFun(argu,URL.WXPAY_PAYMENT);
  }
  //申请退款
  refundOrder(argu){
    return PromiseFun(argu,URL.ORDER_REFUND,1);
  }

   /**
   * 余额支付使用
   */
  payAmountPaymnet(argu){
    return PromiseFun(argu,URL.AMOUNT_PAYMENT);
  }

  /**
   * 获取用户信息
   */
  getUserInfo(argu){  
    return PromiseFun(argu,URL.USER_INFO);
  }
  /**
   * 我的积分
   */
  getUserIntegralList(argu){
    return PromiseFun(argu,URL.USER_INTEGRAL_LIST);
  }

    /**
   * 我的积分余额
   */
  getUserIntegral(argu){
    return PromiseFun(argu,URL.USER_INTEGRAL);
  }

  /**
   * 获取当月签到列表
   */
  getSignList(argu){
    return PromiseFun(argu,URL.SIGN_LIST)
  }

  /**
   * 点击签到
   * @param {*} argu 
   */
  setSign(argu){
    return PromiseFun(argu,URL.SIGN);
  }
  // 取消订单
  cancelOrder(argu){
    return PromiseFun(argu,URL.CLEAR_APPOINTMENT,1);
  }
  /**
   * 检测是否设置密码
   * @param {ji} argu 
   */
  getUserCheckPassword(argu){
    return PromiseFun(argu,URL.USER_CHECK_PASSWORD)
  }

  /**
   * 设置手机密码
   * @param {*} argu 
   */
  getUserSetPassword(argu){
    return PromiseFun(argu,URL.USER_SET_PASSWORD,1);
  } 

  /**
   * 修改支付密码
   * @param {} argu 
   */
  setUserModifyPassword(argu){
    return PromiseFun(argu,URL.USER_MODIFY_PASSWORD,2);
  } 

  /**
   * 获取修改密码验证码
   * @param {*} argu 
   */
  getPwdModifyCode(argu){
    return PromiseFun(argu,URL.PWD_VERIFICATION_CODE,1);
  }
  /**
   * 获取手机验证码
   * @param {*} argu 
   */
  getBindingVerificationCode(argu){
    return PromiseFun(argu,URL.BINDING_VERIFICATION_CODE,1)
  }

  /**
   * 绑定手机号
   * @param {*} argu 
   */
  getUserBindingMobile(argu){
    return PromiseFun(argu,URL.USER_BINDING_MOBILE,2);
  }


  //获取订单可用优惠券
  getOrderSelectCoupon(argu){
    return PromiseFun(argu,URL.ORDER_SELECT_COUPON);
  }
  
  //order-choose-coupon
   //订单选择优惠券
   setOrderSelectCoupon(argu){
    return PromiseFun(argu,URL.ORDER_CHOOSE_COUPON,1);
  }

  /**
   * 主页搜寻
   */
  search(argu){
    return PromiseFun(argu,URL.SEARCH,1);
  }

  /**
   * 订单余额支付
   * @param {} argu 
   */
  postAmountOrder(argu){
    return PromiseFun(argu,URL.AMOUNT_ORDER);
  }

  /**
   * 订桌第二版本
   * 
   */
  postV2AppointmentFound(argu){
    return PromiseFun(argu,URL.V2_APPOINTMENT_FOUND);
  }
}



