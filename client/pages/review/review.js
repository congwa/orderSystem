// pages/review/review.js
import {Http}  from '../../utils/httpClient.js';
var app = getApp();
import {
  URL
} from '../../utils/urlModel';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    /**
     * 项目根路径
     */
    PROJECT_ROOT: URL.PROJECT_ROOT,
    /**
     * 文件上传暂存数组
     */
    pics: [],
    /**
     * 上传完成预览暂存数组
     */
    previewSrcs: [],

    /**
     * 当前选择店铺Id
     */
    shopId:'',

    /**
     * 当前页码
     */
    page:1,

    /**
     * 是否有图
     * 1:无图评价 2：有图评价
     */
    type:1,

    /**
     * 评分
     */
    score:5,

    /**
     * 评价内容
     */
    content:'评价内容',

    /**
     * 服务打分
     */
    service:5,
    /**
     * 口味打分
     */
    taste:5,
    /**
     * 环境打分
     */
    environment:5,

    /**
     * 根据评分显示字体
     */
    font_score:['超级差','很差','差','一般','好','非常好'],
    /**
     * 订单号
     */
    number:'',

    /**
     * 此时是否可以提交
     * 用于验证提交规则
     */
    isSubmit:false,






  },

  initData(options){
    var httpClient = new Http();

    console.log(options);
    var shopId = options.shopid || this.data.shopid
    var ordernum = options.ordernum;
    console.log(shopId,ordernum);
    this.setData({
      number:ordernum,
      shopId:shopId
    })
  
    // var argu ={
    //   id: this.data.shopId,
    //   page: this.data.page,
    //   type: this.data.type,
    //   score: this.data.score
    // }
    // httpClient.getShopDetailList(argu);

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initData(options);
  },
  //评价文本框改变
  changeText(e){
    this.setData({
      content:e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 口味评分选中改变
   */
  tasteHandleChange: function(e){
    this.setData({
      taste: e.detail.value
    })
  },
   /**
   * 口味评分选中改变
   */
  environmentHandleChange: function(e){
    this.setData({
      environment: e.detail.value
    })
  },
   /**
   * 口味评分选中改变
   */
  serviceHandleChange: function(e){
    this.setData({
      service: e.detail.value
    })
  },

  /**
   * 选择图片
   */
  selectImage: function() {
    var that = this,
      pics = this.data.pics;
    wx.chooseImage({
      count: 9 - pics.length, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res) {
        var imgsrc = res.tempFilePaths;
        pics = pics.concat(imgsrc);
        that.setData({
          pics: pics
        });
        console.log(that.data.pics);
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
        that.uploadimgs();
      }
    })
  },
  /**
   * 多张图片图片上传调用
   */
  uploadimgs: function() { //这里触发图片上传的方法
    var pics = this.data.pics;
    this.uploadimg({
      url: URL.UPLOAD_IMAG, //上传的接口
      path: pics //这里是选取的图片的地址数组
    });
  },
  /**
   * 图片上传专用方法
   * @param data
   */
  uploadimg: function(data) {
    var that = this,
      i = data.i ? data.i : 0, //当前上传的哪张图片
      success = data.success ? data.success : 0, //上传成功的个数
      fail = data.fail ? data.fail : 0; //上传失败的个数
      wx.uploadFile({
        url: data.url,
        filePath: data.path[i],
        name: 'image', //这里根据自己的实际情况改
        formData: {
          token:app.globalData.token
        }, //这里是上传图片时一起上传的数据
        success: (resp) => {
          success++; //图片上传成功，图片上传成功的变量+1
          console.log(JSON.parse(resp.data))
          console.log(i);
          if(JSON.parse(resp.data).code!=200){
            wx.showToast({
              title: '上传失败'
              });
          }else{
            var srcArray= JSON.parse(resp.data);
            that.data.previewSrcs.push(srcArray.data.uploadedPathArr);
            that.setData({
              previewSrcs: that.data.previewSrcs
            })
            //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
          }
         
        },
        fail: (res) => {
          fail++; //图片上传失败，图片上传失败的变量+1
          console.log('fail:' + i + "fail:" + fail);
        },
        complete: () => {
          console.log(i);
          i++; //这个图片执行完上传后，开始上传下一张
          if (i == data.path.length) { //当图片传完时，停止调用
            that.data.pics.length =0; //图片上传完成清空队列
            console.log('执行完毕');
            console.log('成功：' + success + " 失败：" + fail);
          } else { //若图片还没有传完，则继续调用函数
            console.log(i);
            data.i = i;
            data.success = success;
            data.fail = fail;
            that.uploadimg(data);
          }
        }
      });
  },
  /**
   * 点击发布按钮
   */
  clickIssue(e){
    // wx.navigateTo({
    //   url: "../mytalk/mytalk"
    // })
    var httpClient = new Http();

    var argu = {
      token:app.globalData.token,
      id: this.data.shopId,
      content: this.data.content,
      fileUrl:this.data.previewSrcs.join(","), //需要把参数转化为字符串
      service: this.data.service,
      taste: this.data.taste,
      environment: this.data.environment,
      number: this.data.number    //订单号
    }
    // console.log(argu);
    httpClient.postPutEvaluate(argu).then((data)=>{
      console.log('评论提交: ',data);
      wx.showToast({
        title:data.msg
      })
      if(data.code==200){
        wx.navigateTo({
          url: "../mytalk/mytalk"
        })
      }
    });
  }


  
})