// pages/reviewlist/reviewlist.js
var app = getApp();
import {Http} from '../../utils/httpClient';
Page({


  /**
   * 组件的初始数据
   */
  data: {
      /**
     * 我的评价的页码
     */
    page:1,
    /**
     * 我的评价的数量
     */
    count:0,
    /**
     * 我的评价的数据
     */
    commitList:[],

    scoreList:['全部','好评','差评','服务好','口味好','环境好'],
    score:0,
    type:1
  },
    /**
   * 组件的属性列表
   */
  reviewDetails() {
    wx.navigateTo({
      url: '../reviewfdetails/reviewfdetails',
    })
  },

  onLoad(options){
    this.initData(options);
  },
  /**
   * 懒加载
   */
  onReachBottom(){
    this.data.page++;
    this.upDateData();
  },
  initData(options){
    var _this = this;
    var httpClient = new Http();

    /**
     * 获取用户评价列表
     */
    var argu = {
      token:app.globalData.token,
      page:this.data.page,
      type:this.data.type,
      score:this.data.score==0?-1:this.data.score
    }
    httpClient.getStoreCommit(argu).then((res)=>{
      console.log('评论列表',res);
      if(res){
        _this.setData({
          commitList:res.list,
          count:res.count,
        })
      }
    }).catch((res)=>{

    })
  },
  /**
   * 评价选择
   * @param {*} e 
   */
  scoreChange(e){
    this.setData({
      score: e.target.dataset.current
    })
    this.upDateData();
  },
  /**
   * 有图无图选择
   * @param {*} e 
   */
  typeChange(e){
    this.setData({
      type: e.target.dataset.current
    })
    this.upDateData();
  },
  upDateData(){
    var _this = this;
    var httpClient = new Http();

    /**
     * 获取用户评价列表
     */
    var argu = {
      token:app.globalData.token,
      page:this.data.page,
      type:this.data.type,
      score:this.data.score==0?-1:this.data.score
    }
    httpClient.getStoreCommit(argu).then((res)=>{
      console.log('评论列表',res);
      if(res){
        _this.setData({
          commitList:res.list,
          count:res.count,
        })
      }
    }).catch(()=>{
      
    })
  }
})
