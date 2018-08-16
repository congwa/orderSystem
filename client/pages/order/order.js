// pages/order/order.js

/**
 * 当前点餐状态值
 */
var ownOrderType = {
  appointment: 'appointment' //预定的
}

var app = getApp();
import {
  orderTab,
  coupon,
  couponType,
  tasteMaskData
} from "./type";

import {
  Http
} from '../../utils/httpClient.js';
import { URL } from '../../utils/urlModel.js';
import {formatTime ,accAdd,accMul} from '../../utils/util';
Page({


  /**
   * 组件的初始数据
   */
  data: {
    /**
     * 订单类型 
     * 1.预约点餐  2.
     */
    orderType: null,
    URL: URL,
    /**------------店铺信息--------------- */
    title: '',  //店铺名称
    address: '', //店铺地址
    telephone: '',  //店铺电话
    opentimes: "",  //营业时间
    affiche: '', //公告
    tel:'',//电话
    decrease: [], //满减
    send: [],     //满送
    discount: '', //折扣
    comm_info: [], //商品信息
    logo: '',   //logo

    /**------------适配信息--------------- */
    windowHeight: 1500,
    titleHeight: 125,
    couponHeight: 40,
    body_titleHeight: 35,
    bottomHeight: 75,
    conentHeight: 1000, /**
     * 规格属性弹窗是否显示
     * true:显示 false不显示
     */
    specbox: false,    // 当前选中 选中组件
    curSelect: 0,
    // 选项卡数据
    tabSelect: {},
    //点餐类别选项卡当前选中
    curOrderSelect: 0,
    couponData: coupon,
    couponType: couponType,


    /**
     * 滑动窗滑动的位置
     * value:按照数组下标进行排序列
     */
    toView: 0,
    /**
     * 商品总价格
     */
    numPrice: 298,
    /**
     * 商品数量
     */
    shopNumber: 0,
    // 总价格
    sumPrice: 0,
    /**
     * 商品规格数据(用于渲染界面)
     */
    tasteMaskData: tasteMaskData,

    /**
     * 当前选择商品数据Id + '_'+name
     */
    currentComData: '',

    /**
     * 规格属性弹窗是否显示
     * true:显示 false不显示
     */
    // maskSpecSelect: false,

    /**
     * 购物车弹窗是否显示
     * true:显示 false不显示
     */
    maskShopCar: false,

    /**
     * 口味规格弹窗  口味
     * 0默认 1微辣 2中辣  3特辣 根据后端数据来定 
     */
    curTaste: 0,

    /**--------------------------分割线:实际数据------------------------------------------------------------------------ */
    /**
     * 店铺Id
     */
    shopId: 9,
    /**
     * 当前页码
     */
    page: 1,

    /**
     * 是否有图
     * 1:无图评价 2：有图评价
     */
    type: 1,

    /**
     * 评分
     */
    score: 5,

    /**
     * 购物车商品数量
     */
    shopCarNumber: 0,

    /**
     * 购物车实际数据
     */
    shopCarData: {},

    /**
     * 订桌信息数据
     */
    appointmentData: {},

    /**
     * 评价数据
     * {
     * list:[],
     * count:1
     * }
     */
    commitData:{},

    /**
     * 桌号
     */
    number:'',
    hide_good_box:true,
    
    /**
     * 规格弹窗之前的e缓存
     */
    eventDetail:null,

  },

  /**
   * 初始化
   */

  initData(options) {
    var _this = this;
    var shopId = JSON.parse(options.shopId || this.data.shopId) || app.currentShopId;
    console.log(options);
    this.setData({
      shopId: shopId
    })
    var type = options.type;
    if (type && ownOrderType.appointment == type) {
      var appointmentData = JSON.parse(options.contacts || '{}') || '{}';
      this.setData({
        appointmentData: appointmentData,
        orderType: type
      })  
    }

   

    var httpClient = new Http();

    /**
     * 初始化屏幕高度
     *  windowHeight:1500,
        titleHeight:125,
        couponHeight:40,  购物车高度
        body_titleHeight:35, 
        bottomHeight:75,   
        conentHeight:1000,
     */
    var systemInfo = app.globalData.systemInfo;
    var windowHeight = (systemInfo.windowHeight * (750 / systemInfo.windowWidth)); //将高度乘以换算后的该设备的rpx与px的比例
    this.setData({
      windowHeight: windowHeight,
      conentHeight: windowHeight - this.data.titleHeight - this.data.couponHeight - this.data.body_titleHeight - this.data.bottomHeight-210
    })
    console.log('屏幕高度和内容高度', this.data.windowHeight, this.data.conentHeight);

    /**
     * 获取商品详情列表
     */
    var argu = {
      id: this.data.shopId
    }
    httpClient.getStoreList(argu).then((res) => {
      
      var temp = [];
      for (let i in res) {
        let data = res[i];
        let name = i.split('_')[0];
        let cid = i.split('_')[1];
        temp.push({
          name: name,
          cid: cid,
          data: data
        });
      }
      this.setData({
        tabSelect: temp,
        curOrderSelect:temp[0].cid
        
      })
      console.log('商品列表: ', temp);
    });
    /**
    * 获取店铺信息
    */
    var argu = {
      id: this.data.shopId
    }
    var _this=this;
    httpClient.getStoreDetail(argu).then((data) => {
      console.log('店铺信息为：', data);
      this.setData({
        title: data.title,
        address:data.address,
        telephone: data.iphones,
        // itemList: new Array.push(data.iphones),
        opentimes: data.open_times[0].startTime + '-' + data.open_times[0].endTime,
        affiche: data.affiche,
        decrease: data.preferential.decrease || [],
        send: data.preferential.send || [],
        discount: data.preferential.discount || '',
        logo: data.logo,
        tel:data.iphones
      })
      console.log(this.data.opentimes)
    })
   
    /**
     * 获取店铺评价信息
     */
    var arguCommit = {
      id: this.data.shopId,
      page: this.data.page,
      type: this.data.type,
      score: this.data.score
    }
    httpClient.getStoreCommit(arguCommit).then((res) => {
      console.log('店铺评价信息: ', res);
      res.list.forEach((ele, i) => {
        res.list[i].addtime = formatTime(new Date(ele.addtime * 1000));
      })
      if(res){
        this.setData({
          commitData:res
        })
      }
    });

    /**
    * 获取当前用户购物车数据
    */
    var argu = {
      lid: this.data.shopId,
      token: app.globalData.token
    }
    httpClient.getStoreShopping(argu).then((data) => {
      console.log('购物车内容', data);

      if (data) {
        for(var i in data){
          var d = data[i];
          d.price = (d.price/100).toFixed(2);
        }
        _this.setData({
          shopCarData: data,
        })
        _this.culSum(); 
      }
    })

  },
  onLoad: function (options) {
    if(options.number){
      app.number.number = options.number;
      app.number.cid = options.shopId;
    }
    this.initData(options);
    this.busPos = {};
    this.busPos['x'] = 45;//购物车的位置
    this.busPos['y'] = app.globalData.systemInfo.windowHeight - 56;
  },

  touchOnGood: function(e){
    var _this = this;
    var expand= e.target.dataset.expand;
    // var cIndex = e.target.dataset.cindex;
    // var index = e.target.dataset.index;
    //商品规格存在
    if(expand){
      let gId = e.target.dataset.comid;
      let name = e.target.dataset.name;
      let price = e.target.dataset.price;
      let img = e.target.dataset.img;
      var data = {
        id: gId,
        title: name,
        price: price,
        img: img,
        num: 0,
        spec: ''
      }
      this.setData({
        tasteMaskData:expand
      })
      this.setData({
        specbox: !this.data.specbox,
        currentComData: data,
        eventDetail:e
      });
    }else{ //不存在商品规格
      let gId = e.target.dataset.comid;
      let name = e.target.dataset.name;
      let price = e.target.dataset.price;
      let img = e.target.dataset.img;
      var data = {
        id: gId,
        title: name,
        price: price,
        img: img,
        num: 0,
        spec: ''
      }
      this.setData({
        currentComData: data
      });
      this.touchOnGoods(e);
    } 
  },

  touchOnGoods: function (e,target) {
    this.finger = {}; var topPoint = {};
    this.finger['x'] = e.touches["0"].clientX -30;//点击的位置
    this.finger['y'] = e.touches["0"].clientY -30;

    if (this.finger['y'] < this.busPos['y']) {
      topPoint['y'] = this.finger['y'];
    } else {
      topPoint['y'] = this.busPos['y'];
    }
    topPoint['x'] = Math.abs(this.finger['x'] - this.busPos['x']) / 2;

    if (this.finger['x'] > this.busPos['x']) {
      topPoint['x'] = (this.finger['x'] - this.busPos['x']) / 2 + this.busPos['x'];
    } else {//
      topPoint['x'] = (this.busPos['x'] - this.finger['x']) / 2 + this.finger['x'];
    }

    //topPoint['x'] = this.busPos['x'] + 80
    //this.linePos = app.bezier([this.finger, topPoint, this.busPos], 30);
    this.linePos = app.bezier([this.busPos, topPoint, this.finger], 30);
    this.startAnimation(e,target);
  },
  startAnimation: function (e,target) {
    var index = 0, that = this,
      bezier_points = that.linePos['bezier_points'];

    this.setData({
      hide_good_box: false,
      bus_x: that.finger['x'],
      bus_y: that.finger['y']
    })
    var len = bezier_points.length;
    index = len;
    if(this.timer){
      clearInterval(this.timer);
    }
    this.timer = setInterval(function () {
      index--;
      if(bezier_points[index]){
        that.setData({
          bus_x: bezier_points[index]['x'],
          bus_y: bezier_points[index]['y']
        })
      }
     
      if (index < 1) {
        clearInterval(that.timer);
        //是否传了这个参数 代表是否有规格弹窗
        if(!target){
          that.noSpecboxs(e);
        }else{
          //有规格弹窗
          that.showSpecboxs();
        }
       
        that.setData({
          hide_good_box: true
        })
      }
    }, 22);
  },

  bindScroll(e){
    var _this = this;
    var height;
    wx.createSelectorQuery().select('.des_type').fields({size:true},(res)=>{
      height = res.height;
    }).exec();
    wx.createSelectorQuery().selectAll('.right_tab').fields({
      dataset: true,
      size: true,
      scrollOffset: true,
      properties: ['scrollX', 'scrollY'],
      computedStyle: ['margin', 'backgroundColor']
    },function(res){
      res.reduce((value,curValue,i)=>{
        var sum = value + curValue.height;
        var curTop = height?e.detail.scrollTop+height+5:e.detail.scrollTop+25;
        if(curTop<sum  &&curTop>value){
          if(res[i]){
            _this.setData({
              curOrderSelect:res[i].dataset.cid
            })
          }
        }
        return sum;
      },0)
    }).exec()
  },
  previewImg(e){
    wx.previewImage({
      current: URL.PROJECT_ROOT + e.target.dataset.src, // 当前显示图片的http链接
      urls: [URL.PROJECT_ROOT + e.target.dataset.src] // 需要预览的图片http链接列表
    })
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

  //切换标签选项卡
  changeSelect(e) {
    var that = this;
    if (this.data.curSelect === e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        curSelect: e.currentTarget.dataset.current
      })
    }
  },

  /**
   * 点击打电话
   */
  open: function () {
    var itemList = [];
    itemList=itemList.push(this.data.tel.toString())?itemList:[];
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

  // 滑动切换
  swiperTab: function (e) {
    var that = this;
    that.setData({
      curSelect: e.detail.current
    });
  },
  /**
   * 点击标签选项卡 点击了左侧选项卡
   *
   * @param e
   */
  clickTab: function (e) {
    var self = this;
    self.setData({
      curOrderSelect: e.target.dataset.cid,
      toView: e.target.dataset.scrollid
    });
  },
  /**
   * 添加或减少购物车
   */
  submitShopCar(argus) {
    var _this = this;
    var httpClient = new Http();
    return new Promise((resolve, reject) => {
      /**
       * 更新购物车
      */
      var argu = {
        gid: argus.id, // 商品Id
        lid: this.data.shopId, //店铺Id
        number: argus.num, // 商品数量
        spec: argus.spec, //规格
        token: app.globalData.token
      }
      httpClient.postStoreShopping(argu).then((data) => {
        console.log('刷新购物车数据成功: ', data);
        resolve();
      })
    })
  },

  /**
   * 清空购物车
   */
  clearShopCar(callback) {
    var _this = this;
    var httpClient = new Http();

    /**
     * 清空购物车
     */
    var argu = {
      lid: this.data.shopId,
      token: app.globalData.token
    }
    httpClient.clearStoreShopping(argu).then((data) => {
      console.log(data);
      if (data.code == 200) {
        console.log('清空了购物车');
        _this.data.shopCarData = {};
        _this.setData({
          shopCarData: _this.data.shopCarData
        })
        if(typeof callback == 'function'){
          callback();
        }
        _this.culSum();
      }
    })
  },

  // 点击下单跳转付款页面，同时生成订单
  toPay() {
    var _this = this;
    var httpclient = new Http();

    var argu;
    // 是否是预定桌位
    if (this.data.orderType == ownOrderType.appointment) {
       argu = {
        lid: this.data.shopId,
        token: app.globalData.token,
        contacts: JSON.stringify(this.data.appointmentData),
        number:app.number.number
      }
      console.log(argu.contacts);
    } else {
      argu = {
        lid: this.data.shopId,
        token: app.globalData.token,
        number:app.number.number
      }
    }
    httpclient.getOrderFound(argu).then((data) => {
      //console.log(data, data.data.orderNumber);
      if (data.code == 200) {  
        _this.clearShopCar(()=>{
         
          wx.navigateTo({
            url: "../topay/topay?orderNumber=" + data.data.orderNumber +'&shopId='+_this.data.shopId +'&price='+_this.data.sumPrice
          })
          _this.setData({
            shopNumber: 0,
            sumPrice: 0
          })
        });   
      }else{
        wx.showToast({
          title:data.msg
        })
      }
    })
  },
  // 评论列表跳转
  reviewList() {
    wx.navigateTo({
      url: '../reviewlist/reviewlist'
    })
  },
  /**
   * 选择口味回调方法（点击特辣 微辣 等4个口味按钮） 没有选中就是空 选中了就是当前选的中文
   */
  clickSelectSpec(e) {
    var tab = e.target.dataset.tab;
    this.data.currentComData.spec = tab;
    this.setData({
      currentComData: this.data.currentComData,
      curTaste:tab
    })
    console.log(this.data.currentComData);
  
  },
  // 点击加号显示规格弹窗
  showSpecbox(e) {
    this.touchOnGoods(this.data.eventDetail,1);
    this.closeSpecBoxs();
  },

  /**
   * 关闭规格弹窗
   * @param {*} e 
   */
  closeSpecBoxs(e){
    this.setData({
      specbox: false
    });
  },
  /**
   * 没有规格(选好了)
   */
  noSpecboxs(e) {
    var _this = this;
   
    var spec = this.data.tasteMaskData[this.data.curTaste];
    var keyName = this.data.currentComData.id + '_' + this.data.currentComData.spec;
  
    if(this.data.shopCarData[keyName]){
      this.data.shopCarData[keyName].num++;
      this.data.currentComData = this.data.shopCarData[keyName];
    }else{
      this.data.currentComData.num++;
      this.data.shopCarData[keyName] = this.data.currentComData;
    }
    this.submitShopCar(this.data.shopCarData[keyName]).then((data) => {
      _this.setData({
        shopNumber: this.data.shopNumber++,
        shopCarData: this.data.shopCarData
      });
      this.culSum();
    })

  },


  /**
   * 隐藏规格弹窗（选好了）
   * @param {*} e 
   */
  showSpecboxs(e) {
    var _this = this;

    var keyName = this.data.currentComData.id + '_' + this.data.currentComData.spec;
    //判断是否存在
    if(this.data.shopCarData[keyName]){
      this.data.shopCarData[keyName].num++;
      this.data.currentComData = this.data.shopCarData[keyName];
    }else{
      this.data.currentComData.num++;
      this.data.shopCarData[keyName] = this.data.currentComData;
    }
    this.submitShopCar(this.data.shopCarData[keyName]).then((data) => {
      _this.setData({
       
        shopNumber: this.data.shopNumber++,
        shopCarData: this.data.shopCarData
      });
      this.culSum();
      this.setData({
        curTaste:''
      })
    })

  },
  /**
   * 打开购物车弹窗
   */
  showcar(e) {
    this.setData({
      maskShopCar: !this.data.maskShopCar
    })
  },
  maskCar(e){
    if(e.target.dataset.ty){
      this.setData({
        maskShopCar: !this.data.maskShopCar
      })
    }
  },

  //点击购物车底部的加号
  addNum(e) {
    var _this = this;
    //商品key
    let gkey = e.target.dataset.gkey;
    let gValue = this.data.shopCarData[gkey];
    if (gValue) {
      gValue.num++;
      this.submitShopCar(gValue).then((data) => {
        _this.setData({
          shopCarData: _this.data.shopCarData
        })
      });
      this.culSum();
    }
  },

  //计算购物车总价格和总数量
  culSum() {
    var sumCount = 0, sumMoney = 0;
    for (var key in this.data.shopCarData) {
      sumCount += parseInt(this.data.shopCarData[key].num);
      sumMoney += accMul(this.data.shopCarData[key].num , this.data.shopCarData[key].price);
    }
    console.log(sumCount, sumMoney);
    var len;
    try {
       len = sumMoney.toString().split('.')[1].length; 
    } catch (error) {
      len = 0;
    }
    sumMoney = Number(sumMoney);
    if(len != 0 ){
        sumMoney =  Number(sumMoney.toFixed(2));
        if(sumMoney.toString().split('.')[1] *100 == 0){
          sumMoney = Number(sumMoney.toFixed(0));
        }else if(sumMoney.toString().split('.')[1] *100 >=1000 ||  sumMoney.toString().split('.')[1] *100 <10000){
          sumMoney = Number(sumMoney.toFixed(1))
        }
        // var str = sumMoney.toString().split('.')[1];
        // for( var i = len; i >0; i-- ){
        //    if(str[i] == 0){
        //     sumMoney =  Number(sumMoney).toFixed[i-1];
        //    }else{
        //      break;
        //    }
        // }
    }
    this.setData({
      shopNumber: sumCount,
      sumPrice: sumMoney
    })
  },
  //点击购物车底部的减号
  decreaseNum(e) {
    var _this = this;
    let gkey = e.target.dataset.gkey;
    let gValue = this.data.shopCarData[gkey];
    if (gValue) {
      gValue.num--;
      this.submitShopCar(gValue).then((data) => {
        if (gValue.num <= 0) {
          delete _this.data.shopCarData[gkey];
        }
        _this.setData({
          shopCarData: _this.data.shopCarData
        })
        this.culSum();
      })
    }
  },
  /**
   * 滚动条滚动到下方(需要设置高度)
   * @param {*} e 
   */
  commitScrollBottom(e){
    var page = this.data.page;
    var arguCommit = {
      id: this.data.shopId,
      page: ++page,
      type: this.data.type,
      score: this.data.score
    }
    httpClient.getStoreCommit(arguCommit).then((res) => {
      console.log('店铺评价信息: ', res);
      if(res && res.list){
        res.list.forEach((ele, i) => {
          res.list[i].addtime = formatTime(new Date(ele.addtime * 1000));
        })
        this.data.commitData.list.push.apply(this.data.commitData.list,res.list)
        this.setData({
          commitData:this.data.commitData,
          page:page
        })
      }else{
        wx.showToast({
          title: '已经触底',
          icon: 'loading',
          duration: 500
        })
      }
    }).catch((res)=>{
      wx.showToast({
        title: '已经触底',
        icon: 'loading',
        duration: 500
      })
    });
  }


})