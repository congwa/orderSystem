import {Http}  from '../../utils/httpClient.js';
import { URL } from '../../utils/urlModel.js';

Page({
  data: {
    URL:URL,
    /**
     * 店铺Id
     */
    showNum:4,
    shopId:9,
    title:'',  //店铺名称
    address:'', //店铺地址
    telephone:'',  //店铺电话
    opentimes:"",  //营业时间
    affiche:'', //公告
    decrease:[], //满减
    send:[],     //满送
    discount:'', //折扣
    comm_info:[], //商品信息
    banner:[],   //banner
    // itemList:[]
    star:[]   //星级
   
  },
  /**
   * 第一次进入界面请求数据
   */
  initData(options){
    var httpClient = new Http();
    /**
     * 获取传递过来的参数
     */
    var shopId = JSON.parse(options.shopId || this.data.shopId) || app.currentShopId;
    this.setData({
      shopId:shopId
    });
    var argu = {
      id:shopId
    }
    /**
     * 获取商铺详情
     */
    httpClient.getShopDetail(argu).then((data)=>{
      console.log('商铺详情:',data);
      data?data:{};
      this.setData({
        title:data.title || '',
        address:data.address || '',
        telephone: data.iphones ||'',
        // itemList: this.data.itemList.push(data.iphones||[])?this.data.itemList:[],
        opentimes: data.open_times?(data.open_times[0].startTime + '-' + data.open_times[0].endTime):'',
        affiche: data.affiche ||'',
        decrease: data.preferential?(data.preferential.decrease||[]):[],
        send: data.preferential?(data.preferential.send || []):[],
        discount:data.preferential?(data.preferential.discount || ''):'',
        banner: data.banner?(data.banner.split(',')):'',
        star: new Array(Math.ceil(data.score?data.score:0))
      })
    })

    /**
     * 获取商铺详情中的商品列表
     */
    httpClient.getShopDetailList(argu).then((data)=>{
      console.log('商铺详情的商品列表:',data);
      this.setData({
        comm_info: data
      })
      if(data.length<4){
        this.setData({
          showNum: data.length
        })
      }
    })
    // var spwer=wx.createSelectorQuery().selectAll('.swiper_items');
    // console.log(spwer);

  },
  onLoad: function (options) {

    this.initData(options);
  
    
  },
  onReady: function () {
    console.log("page ---onReady---");
  },
  onShow: function () {
    console.log("page ---onShow---");
  },
  onHide: function () {
    console.log("page ---onHide---");
  },
  onUnload: function () {
    console.log("page ---onUnload---");
  },
  //跳转点餐页面
  toOrder() {
    wx.navigateTo({
      url: "../order/order?shopId="+this.data.shopId
    })
  },
  //跳转预定页面
  appoint(){
    wx.navigateTo({
      url: "../appointment/appointment?lid="+this.data.shopId
    })
  },
  //跳转支付页面
  toPay() {
    wx.navigateTo({
      url: "../pay_input/pay_input?lid="+this.data.shopId+'&shopname='+this.data.title
    })
  },
  //预览大图 
  preivewImag(e){
    var arr =[];
   this.data.banner.forEach((ele)=> {
      arr.push(URL.PROJECT_ROOT+ ele);
    });
    wx.previewImage({
      current: URL.PROJECT_ROOT+e.target.dataset.src, // 当前显示图片的http链接
      urls:arr // 需要预览的图片http链接列表
    })
  },

  previewSDetail(e){
    var arr = [];
    this.data.comm_info.forEach((e)=>{
      arr.push(URL.PROJECT_ROOT+e.img);
    })
    wx.previewImage({
      current: URL.PROJECT_ROOT+e.target.dataset.src, // 当前显示图片的http链接
      urls:arr // 需要预览的图片http链接列表
    })
  },
  //电话弹窗
  open: function () {
    // var itemList = ['13526784596', '010-8353123'];
    var itemList = [];
    itemList = itemList.push(this.data.telephone.toString()) ? itemList : [];
    wx.showActionSheet({
      itemList: itemList,
      success: function (res) {
        if (!res.cancel) {
          console.log(res)
          wx.makePhoneCall({
            phoneNumber: itemList[res.tapIndex]
          })
        }
      }
    });
  },
  //调取手机相机扫码
  scanCode(){
    wx.scanCode({
      success: (res) => {
        console.log(res)
      }
    })
  }
})