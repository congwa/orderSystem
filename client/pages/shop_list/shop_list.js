//index.js
//获取应用实例
const app = getApp()


import {URL} from '../../utils/urlModel.js';
import {Http}  from '../../utils/httpClient.js';

import {nearby,nav_data_0} from './type.js'; 

import {area} from '../../utils/area.js';
import {area2} from '../../utils/area2.js';
app.globalData.area = {...area,...area2};

var httpClient  = new Http();



Page({
  data: {
    windowHeight:app.globalData.windowHeight,
    URL:URL,

    near:app.near,
    imgUrls: [
      '../images/index_06.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,

    /**
     * 是否在搜索状态
     */
    searchBool:false,

    /**
     * 当前城市名字
     */
    cityName:'北京市',

    /**
     * 当前温度
     */
    temperature:'28',

    /**
     * 当前城市街道信息
     */
    cityData:area[app.citySelect.provriceId].children[app.citySelect.cityId],


    /**
     * 首页bnner数据
     */
    banner_indexData:[],
    /**
     * 首页店铺分类
     * 真实数据
     */
    nav_indexData:[],


    /**
     * 商铺展示信息
     */
    shop_List:[],

    /**
     * 距离假数据
     */
    dis_list:['500','800','1000','1500','2000'],

    /**
     * 距离排序
     */
    soft_list: [
      { 
        text:"距离排序"
      },{
        text:"口味排序"
      },{
        text:"环境排序"
      },{
        text:"服务排序"
      }
    ],

    /**
     * 附近遮罩层是否显示
     */
    markNearby:false,
    /**
     * 全部美食弹窗
     */
    markAllFood:false,
    /**
     * 距离排序弹窗
     */
    markSoft:false,
    /**
     * 当前选择Tab
     * 0:全部美食 1：附近 2：距离排序
     */
    curTab:1,

    /**
     * 选中结果 附近弹窗左侧选中结果 city字段
     */
    nearbyLeftTab:-1,

    // /**
    //  * 附近弹窗 左侧临时选中
    //  */
    // nearbyMockLeftTab:0,

    /**
     * 附近弹窗  是否进行了选中 
     */
    isNearbySelect:false,

    /** 
     *当前选中结果 附近弹窗中选项卡 对应county字段
     * 
     */
    nearbyTab:-1,


    /**
     * 当前选中结果 全部美食选项卡 对应字段type 
     */
    allFoodTab:0,
    /**
     * 当前选中结果 距离排序选项卡
     */
    softListTab:0,
    /**
     * 图片选择
     */
    pics:[],

    /**
     * 当前页码
     */
    page:1,

    /**
     * 总条数
     */
    count:1,
  },
  onLoad(options){
    var allFoodtype = options.foodType || 0;
    this.setData({
      allFoodTab:allFoodtype
    })
    // 查看是否授权
    var that = this;
    that.initData();
  },
  

  /**
   * 初始化数据
   */
  initData(){
    var httpClient = new Http();
    var _this = this;
    /**
     * 获取首页导航栏接口
     */
    httpClient.getNavIndex()
      .then((data)=>{
        data.splice(0,0,nav_data_0);
        _this.setData({
          nav_indexData:data
        });
        console.log('nav_indexData: ',_this.data.nav_indexData);
      })
      .catch(e =>console.log(e));
    /**
     * 获取banner接口
     */
    httpClient.getBannerIndex()
      .then((data) => {
        // _this.setData({
        //   nav_indexData: data
        // });
        console.log('banner: ',data);
        _this.setData({
          banner_indexData:data
        });
    })
    .catch(e =>console.log(e));

    if(app.oneDayOneLogin){
      httpClient.getCity().then((res)=>{
        console.log('城市信息',res);
        var code = res.addressComponent.adcode;
        var cityName = res.addressComponent.city;
        app.citySelect.provriceId = parseInt(code/10000)*10000;
        app.citySelect.cityId = parseInt(code/100)*100;
        app.citySelect.districtId = code;
        app.near.lat = res.location.lat;
        app.near.lng = res.location.lng;
        app.near.parent = app.citySelect.cityId;
        app.near.base = app.citySelect.provriceId;
        _this.setData({
          cityName:cityName,
          nearbyLeftTab:code,
          near:app.near
        })
        var provriceId = app.citySelect.provriceId;
        var cityId = app.citySelect.cityId;
        var cityData = area[provriceId].children[cityId];
        _this.setData({
          cityData:cityData
        })
        var argu = {
          lat:app.near.lat,
          lng:app.near.lng,
          type:-1, //店铺分类
          city:-1,
          county:-1,
          sort:-1,
          page:1
        }
        return httpClient.getListIndex(argu)
      }).then((data)=>{
        console.log('ListIndex: ',data);
        _this.setData({
          shop_List:data?data.list || [] : [],
          count:data.count || 1
        })
      }).catch(e => console.log(e));
      app.oneDayOneLogin = false;
    }else{
      var cityName = area[app.citySelect.provriceId].children[app.citySelect.cityId].name;
      _this.setData({
        cityName:cityName,
        nearbyLeftTab:app.citySelect.districtId
      })
      /**
       * 获取首页商铺列表
       */
      var provriceId = app.citySelect.provriceId;
      var cityId = app.citySelect.cityId;
      var cityData = area[provriceId].children[cityId];
      _this.setData({
        cityData:cityData,
        nearbyTab:-1,
        nearbyLeftTab:-1,
        softListTab:0
      })
      var argu = {
        lat:cityData.lat,
        lng:cityData.lng,
        type:(_this.data.allFoodTab == 0?-1:_this.data.allFoodTab), //店铺分类
        city:app.citySelect.cityId,
        county:app.citySelect.districtId,
        sort:(_this.data.softListTab == 0?-1:_this.data.softListTab),
        page:1
      }
      httpClient.getListIndex(argu).then((data)=>{
        console.log('ListIndex: ',data);
        if(data){
          _this.setData({
            shop_List:data?data.list || []:[],
            count:data.count || 1
          })
        }else{
          _this.setData({
            shop_List:[],
            count: 1
          })
        }
      }).catch((res)=>{

      })
    }
    
    
   
   
    /**
     * 获取天气
     */
    httpClient.getWeather().then((res)=>{
      var data = res.currentWeather[0].date;
      var weatherDesc = res.currentWeather[0].weatherDesc;
      console.log(data);
      var str = parseInt(data.split('：')[1]);
      console.log(str);
      _this.setData({
        temperature:str
      })
    }).catch(()=>{

    })

  
  
    /**
     * 获取店铺信息
     */
    httpClient.getStoreDetail().then((data)=>{
      console.log('店铺信息为：', data);
    }).then((e)=>{
      console.log('店铺信息为：', e);
    }).catch(e => console.log(e))

  },

  /**
   * 重新获取店铺数据
   */
  getListIndex() {
    var httpClient = new Http();
    var _this = this;
    var provriceId = app.citySelect.provriceId;
    var cityId = app.citySelect.cityId;
    var cityData = area[provriceId].children[cityId];
    var argu = {
      lat: this.data.nearbyLeftTab ==-1?app.near.lat:cityData.lat,
      lng: this.data.nearbyLeftTab ==-1?app.near.lng:cityData.lng,
      type: (_this.data.allFoodTab == 0 ? -1 : _this.data.allFoodTab), //店铺分类
      city: this.data.nearbyLeftTab ==-1?-1:app.citySelect.cityId,
      county:this.data.nearbyLeftTab ==-1?this.data.nearbyTab:app.citySelect.districtId,
      sort: (_this.data.softListTab == 0 ? -1 : _this.data.softListTab),
      page: 1
    }
    httpClient.getListIndex(argu).then((data) => {
      console.log('ListIndex: ', data);
      _this.setData({
        shop_List: data?data.list || []:[],
        count: 1
      })
    })
  },
  
  /**
   * 导航到shop页面
   */
  toShop(e) {
    app.currentShopId = e.currentTarget.dataset.shopid;
    console.log('全局shopId改变:', app.currentShopId );
    wx.navigateTo({
      url: "../shop/shop?shopId="+e.currentTarget.dataset.shopid
    })
  },
  toSwichtcity(){
    wx.navigateTo({
      url: '../switchcity/switchcity'
    })
  },
  toshopList() {
    wx.navigateTo({
      url: '../shop_list/shop_list'
    })
  },
  /**
   * 
   */
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  /**
   * 
   */
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  /**
   * 
   */
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },

  /**
   * 
   */
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  /**
   * 点击->附近选项卡左侧回调(没选择真实数据以假数据为准)
   */
  clickNearbyLeft: function(e){
    this.setData({
      nearbyLeftTab: e.target.dataset.type
    })
    console.log(this.data.nearbyLeftTab);
  },

  /**
   * 全部美食 选中结果回调
   */
  clickAllFoodSelect: function(e){
    console.log('选中了全部美食 选项卡选中结果: ', e);
    this.setData({
      allFoodTab: e.target.dataset.type
    })
    this.closeAllMark();
    this.getListIndex();
  },
  /**
   * 附近选项卡 选中结果回调
   */
  clickNearbySelect: function(e){
    console.log('选中了附近 选项卡选中结果: ',e);

    this.setData({
      nearbyTab: e.target.dataset.type,
      //nearbyLeftTab: this.data.nearbyMockLeftTab,
      isNearbySelect:true

    })
    this.closeAllMark();
    this.getListIndex();
  },
  /**
   * 距离排序选项卡  选中结果回调
   */
  clickSoftListSelect: function(e){
    console.log('选中了 距离排序 选项卡选中结果: ', e);
    this.setData({
      softListTab: e.target.dataset.type
    })
    this.closeAllMark();
    this.getListIndex();
  },
  /**
   * 附近弹出层
   */
  markNearbyCancle: function(e){
    this.setData({
      markNearby: false
    })
  },
  /**
   * 全部美食弹出层
   */
  markAllFoodCancle: function(e){
    this.setData({
      markAllFood: false
    })
  },

  /**
   *距离排序弹出层 
   */
  markSoftCancle: function(e){
    this.setData({
      markSoft: false
    })
  },
  /**
   * 进入全部美食弹出层
   */
  enterMarkAllFood: function(e){
    this.setData({
      markNearby:false,
      markAllFood: true,
      markSoft: false
    })
    console.log("进入全部美食弹出层");
  },
  /**
   * 关闭所有弹出层
   */
   closeAllMark: function(e){
     this.setData({
       markNearby: false,
       markAllFood: false,
       markSoft: false
     })
     console.log('关闭所有弹出层');
   },
  /**
   * 进入附近弹出层
   */
  enterMarkNearby: function(e){
    this.setData({
      markNearby: true,
      markAllFood: false,
      markSoft: false
    })
    console.log("进入附近弹出层");
  },

  /**
   * 进入距离排序弹出层
   */
  enterMarkSoftList: function(e){
    this.setData({
      markNearby: false,
      markAllFood: false,
      markSoft: true
    })
    console.log("进入距离排序弹出层");
  },
  next(){
    if(this.data.searchBool){
      this.nextSearchPage();
    }else{
      this.nextPage();
    }
  },
  /**
   * 下一頁
   */
  nextPage(){
     /**
       * 获取首页商铺列表
       */
      var _this = this;
      var provriceId = app.citySelect.provriceId;
      var cityId = app.citySelect.cityId;
      var cityData = area[provriceId].children[cityId];
      var page = _this.data.page;
      var argu = {
        lat:cityData.lat,
        lng:cityData.lng,
        type:(_this.data.allFoodTab == 0?-1:_this.data.all_food), //店铺分类
        city:app.citySelect.cityId,
        county:app.citySelect.districtId,
        sort:(_this.data.softListTab == 0?-1:_this.data.softListTab),
        page:++page
      }
      httpClient.getListIndex(argu).then((data)=>{
        console.log('ListIndex: ',data);
        if(data){
          _this.setData({
            shop_List:data?data.list || []:[],
            count:data.count || 1,
            page:page
          })
        }else{
          wx.showToast({
            title: '已经触底',
            icon: 'loading',
            duration: 500
          })
        }
      })
  },

  /**
   * 搜索下一页
   */
  nextSearchPage(){
    var _this = this;
    var page = this.data.page;
    var provriceId = app.citySelect.provriceId;
    var cityId = app.citySelect.cityId;
    var cityData = area[provriceId].children[cityId];
    httpClient.search({
      page:++page,
      keyword:e.detail.value,
      lat:cityData.lat,
      lng:cityData.lng,
      type:(_this.data.allFoodTab == 0 ? -1 : _this.data.allFoodTab),
      city:app.citySelect.cityId,
      county:app.citySelect.districtId,
      sort:(_this.data.softListTab == 0 ? -1 : _this.data.softListTab)
    }).then((data)=>{
      if(data && data.list){
        _this.setData({
          shop_List:data?data.list || []:[],
          count:data.count || 1,
          page:page
        })
      }else{
        wx.showToast({
          title: '搜索触底',
          icon: 'loading',
          duration: 500
        })
      }
    }).catch((res)=>{
      wx.showToast({
        title: '搜索触底',
        icon: 'loading',
        duration: 500
      })
    })
  },
  /**
   * 搜索
   * var provriceId = app.citySelect.provriceId;
    var cityId = app.citySelect.cityId;
    var cityData = area[provriceId].children[cityId];
    var argu = {
      lat: cityData.lat,
      lng: cityData.lng,
      type: (_this.data.allFoodTab == 0 ? -1 : _this.data.allFoodTab), //店铺分类
      city: app.citySelect.cityId,
      county:app.citySelect.districtId,
      sort: (_this.data.softListTab == 0 ? -1 : _this.data.softListTab),
      page: 1
    }
   */
  searchShop(e){
    var _this = this;
    if(e.detail.value.length <=0){
      _this.setData({
        page:1,
        searchBool:false
      })
      this.getListIndex();
      return;
    }
    var provriceId = app.citySelect.provriceId;
    var cityId = app.citySelect.cityId;
    var cityData = area[provriceId].children[cityId];
    httpClient.search({
      page:1,
      keyword:e.detail.value,
      lat:cityData.lat,
      lng:cityData.lng,
      type:(_this.data.allFoodTab == 0 ? -1 : _this.data.allFoodTab),
      city:app.citySelect.cityId,
      county:app.citySelect.districtId,
      sort:(_this.data.softListTab == 0 ? -1 : _this.data.softListTab)
    }).then((data)=>{
      _this.setData({
        shop_List:data?data.list || []:[],
        count:data.count || 1,
        searchBool:true
      })
    }).catch((res)=>{
      wx.showToast({
        title: '搜索失败',
        icon: 'loading',
        duration: 500
      })
    })
  }

})
 