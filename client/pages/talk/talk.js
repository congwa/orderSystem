// pages/talk/talk.js
import {URL} from '../../utils/urlModel';
var talkType = {
  'myTalk': 0, //我的点评    多个人均价格   最多三个图片
  'orderTalk': 1, //点餐评论查看     (和listTalk一样) 最多三个图片
  'desTalk': 2,   //评论详情     多一个口味   多个图片平铺
  'listTalk': 3   //评论列表 name 星星 date desc image (简单样式) 最多三个图片

};
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * 当前引用此组件的类型
     */
    tType: {
      type: Number,
      value: 0
    },
    tList: {
      type: {},
      value: {},
      observer: '_propertyChange'
    }
  },

 
  /**
   * 组件的初始数据
   */
  data: {
    URL:URL,
    /**
     * 当前
     */
    // list:[{
    //   src:'../images/comment_14.png',
    //   name:'口味不错',
    // },{
    //     src: '../images/comment_17.png',
    //   name: '环境不错',
    // },{
    //     src: '../images/comment_19.png',
    //   name: '服务一般',
    // }],
    list: {
      taste_score: [{
        src: '../images/comment_14.png',
        name: '口味很差',
      }, {
        src: '../images/comment_17.png',
        name: '口味一般',
      }, {
        src: '../images/comment_19.png',
        name: '口味不错',
      }, {
        src: '../images/comment_17.png',
        name: '口味好',
      }, {
        src: '../images/comment_17.png',
        name: '口味极好',
      }],
      environment_score: [{
        src: '../images/comment_14.png',
        name: '环境很差',
      }, {
        src: '../images/comment_17.png',
        name: '环境一般',
      }, {
        src: '../images/comment_19.png',
        name: '环境不错',
      }, {
        src: '../images/comment_17.png',
        name: '环境好',
      }, {
        src: '../images/comment_17.png',
        name: '环境极好',
      }],
      service_score: [{
        src: '../images/comment_14.png',
        name: '服务很差',
      }, {
        src: '../images/comment_17.png',
        name: '服务一般',
      }, {
        src: '../images/comment_19.png',
        name: '服务不错',
      }, {
        src: '../images/comment_17.png',
        name: '服务极好',
      }, {
        src: '../images/comment_17.png',
        name: '服务爆炸',
      }]
    },
    talkType: {
      'myTalk': 0, //我的点评    多个人均价格 
      'orderTalk': 1, //点餐评论查看     (和listTalk一样)
      'desTalk': 2,   //评论详情     多一个口味 
      'listTalk': 3   //评论列表 name 星星 date desc image (简单样式)

    },
    gradeDes: {
      yes: '../images/6shop_21.png',
      no: '../images/6shop_21.png',
      yesOrNo: '../images/6shop_21.png'
    },

    /**
     * 点亮星星的数量构成数组
     */
    gradeArr: [],
    gradeNoArr: []

  },

  created(){
    // this.setData({
    //   gradeArr: new Array(this.properties.tList.score),
    //   gradeNoArr: new Array(5 - this.properties.tList.score)
    // })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    _propertyChange: function(newValue,oldValue){
      if(Array.isArray(newValue) && newValue.length == 0){
        return;
      }
      this.setData({
        tList:newValue
      })
      this.setData({
        gradeArr: new Array(Math.floor(newValue.score)),
        gradeNoArr: new Array(Math.floor(5 - newValue.score))
      })
    },
    onLoad: function() {
      this.data.gradeArr =  
      this.data.paramB // 页面参数 paramB 的值
    },
    onReachBottom(){
      console.log('子组件下拉触底');
    },
    /** 
    * 预览图片
    */
    previewImage: function (e) {
      var current = e.target.dataset.src;
      var arr = [];
      this.data.tList.thumb.forEach((e)=>{
        arr.push(URL.PROJECT_ROOT + e);
      })
      wx.previewImage({
        current: URL.PROJECT_ROOT+current, // 当前显示图片的http链接
        urls: arr // 需要预览的图片http链接列表
      })
    },
    /**
     * 点击查看更多
     * @param {*} e 
     */
    clickLookMore(e){
      var tlist = e.target.dataset.tdata;
      var strTlist = JSON.stringify(tlist);
      wx.navigateTo({
        url: "../reviewfdetails/reviewfdetails?tlist="+strTlist
      })
    }
  }

})
