var city = require('../../utils/city.js');
var cityObjs = require('../../utils/city.js');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');

import {area} from '../../utils/area.js';
import {area2} from '../../utils/area2.js';
var cityData = {...area,...area2}; // 有层级结构的city数据
var qqmapsdk;
var app = getApp()
Page({
  data: {
    searchLetter: [],
    showLetter: "",
    winHeight: 0,
    // tHeight: 0,
    // bHeight: 0,
    cityList: [],
    isShowLetter: false,
    scrollTop: 0,//置顶高度
    scrollTopId: '',//置顶id
    city: "北京市",
    code:"110100",
    hotcityList: [{ cityCode: 110100, city: '北京市' }, { cityCode: 310100, city: '上海市' }, { cityCode: 440100, city: '广州市' }, { cityCode: 440300, city: '深圳市' }, { cityCode: 330100, city: '杭州市' }, { cityCode: 320100, city: '南京市' }, { cityCode: 420100, city: '武汉市' }, { cityCode: 410100, city: '郑州市' }, { cityCode: 120100, city: '天津市' }, { cityCode: 610100, city: '西安市' }, { cityCode: 510100, city: '成都市' }, { cityCode: 500100, city: '重庆市' }],
    inputShowed: false,
    inputVal: "",
    completeList:[]
  },
  onLoad: function () {
    // 初始化map地图sdk
    // qqmapsdk = new QQMapWX({
    //   key: 'HJWBZ-BVEKW-XFTR2-O4L4I-A7G7K-PPBE3'
    // });
    // wx.getLocation({
    //   type: 'wgs84',
    //   success: function (res) {
    //     //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
    //     console.log(res);
    //     qqmapsdk.reverseGeocoder({
    //       location: {
    //         latitude: res.latitude, 
    //         longitude: res.longitude  
    //       },
    //       success: function (addressRes) {
    //         console.log(addressRes);
    //         var address = addressRes.result.formatted_addresses.recommend;
    //         that.setData({
    //           city:address
    //         })
    //       }
    //     })
    //   }
    // })
    // 生命周期函数--监听页面加载
    var searchLetter = city.searchLetter;
    var cityList = city.cityList();
    var sysInfo = wx.getSystemInfoSync();
    var winHeight = sysInfo.windowHeight;
    var itemH = winHeight / searchLetter.length;
    var tempObj = [];
    for (var i = 0; i < searchLetter.length; i++) {
      var temp = {};
      temp.name = searchLetter[i];
      temp.tHeight = i * itemH;
      temp.bHeight = (i + 1) * itemH;
      tempObj.push(temp)
    }
    this.setData({
      winHeight: winHeight,
      itemH: itemH,
      searchLetter: tempObj,
      cityList: cityList
    })

  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  onShow: function () {
    // 生命周期函数--监听页面显示

  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作

  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数

  },
  clickLetter: function (e) {
    console.log(e.currentTarget.dataset.letter)
    var showLetter = e.currentTarget.dataset.letter;
    this.setData({
      showLetter: showLetter,
      isShowLetter: true,
      scrollTopId: showLetter,
    })
    var that = this;
    setTimeout(function () {
      that.setData({
        isShowLetter: false
      })
    }, 1000)
  },
  //选择城市
  bindCity: function (e) {
    console.log("bindCity",e)
    this.setData({ city: e.currentTarget.dataset.city })
    this.updateAppCity(e.currentTarget.dataset.citycode);
  },
  //选择热门城市
  bindHotCity: function (e) {
    console.log("bindHotCity",e)
    this.setData({
      city: e.currentTarget.dataset.city,
      code: e.currentTarget.dataset.citycode
    })
    this.updateAppCity(e.currentTarget.dataset.citycode);
  },
  //点击热门城市回到顶部
  hotCity: function () {
    this.setData({
      scrollTop: 0,
    })
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  /**
   * 输入改变的回调函数
   */
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
    this.auto();
    console.log(this.data.inputVal,e);
  },
  updateAppCity(cityId){
    app.citySelect.cityId = parseInt(cityId);
    app.citySelect.provriceId = parseInt(cityId/10000)*10000;
    wx.switchTab({
      url: '../index/index'
    })
  },

  auto: function () {
    let inputSd = this.data.inputVal.trim()
    let sd = inputSd.toLowerCase()
    let num = sd.length
    const cityList = cityObjs.cityObjs
    // console.log(cityList.length)
    let finalCityList = []

    let temp = cityList.filter(
      item => {
        let text = item.short.slice(0, num).toLowerCase()
        return (text && text == sd)
      }
    )
    //在城市数据中，添加简拼到“shorter”属性，就可以实现简拼搜索
    let tempShorter = cityList.filter(
      itemShorter => {
        if (itemShorter.shorter) {
          let textShorter = itemShorter.shorter.slice(0, num).toLowerCase()
        return (textShorter && textShorter == sd)
        }
        return
      }
    )

    let tempChinese = cityList.filter(
      itemChinese => {
        let textChinese = itemChinese.city.slice(0, num)
        return (textChinese && textChinese == sd)
      }
    )

    if (temp[0]) {
      temp.map(
        item => {
          let testObj = {};
          testObj.city = item.city
          testObj.code = item.code
          finalCityList.push(testObj)
        }
      )
      this.setData({
        completeList: finalCityList,
      })
    } else if (tempShorter[0]) {
      tempShorter.map(
        item => {
          let testObj = {};
          testObj.city = item.city
          testObj.code = item.code
          finalCityList.push(testObj)
        }
      );
      this.setData({
        completeList: finalCityList,
      })
    } else if (tempChinese[0]) {
      tempChinese.map(
        item => {
          let testObj = {};
          testObj.city = item.city
          testObj.code = item.code
          finalCityList.push(testObj)
        })
      this.setData({
        completeList: finalCityList,
      })
    } else {
      return
    }
  },

})