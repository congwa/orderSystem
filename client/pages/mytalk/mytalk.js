// pages/mytalk/mytalk.js 我的点评页面

var app = getApp();
import { Http } from '../../utils/httpClient';
var httpClient = new Http();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showflag:false,//显示空页面
      /**
    * 我的评价的页码
    * 
    */
    page: 1,
    /**
     * 我的评价的数量
     */
    count: 0,
    /**
     * 我的评价的数据
     */
    commitList: [],
  },

  onLoad(options) {
    this.initData(options);
  },
  initData(options) {
    var _this = this;
    var httpClient = new Http();

    /**
     * 获取用户评价列表
     */
    var argu = {
      token: app.globalData.token,
      page: this.data.page
    }
    httpClient.getUserCommitList(argu).then((res) => {
      console.log('我的评论列表', res);
      if (res) {
        _this.setData({
          commitList: res.list, 
          count: res.count
        })
      }
      if(!res.data){
        _this.setData({
          showflag:true
        })
      }

    }).catch((e) =>{
      console.log(e);
    }    
    )
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
    this.nextPage();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  /**
   * 下一页
   */
  nextPage(){
    var _this = this;
    var page = this.data.page;
    var argu = {
      token: app.globalData.token,
      page: ++page
    }
    httpClient.getUserCommitList(argu).then((res) => {
      console.log('我的评论列表', res);
      if (res) {
        _this.setData({
          commitList: _this.data.commitList.push.apply(_this.data.commitList,res.list), 
          count: res.count,
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
    })
  }
})