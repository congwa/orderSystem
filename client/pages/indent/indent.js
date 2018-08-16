var app = getApp();
import { URL } from '../../utils/urlModel.js';
import { Http } from '../../utils/httpClient.js';
import { formatTime, getCountDays, formatTimeTwo } from '../../utils/util';
Page({
  data: {
    URL: URL,
    page: 1,
    cancelflag: false,
    refundflag: false,
    emptyflag: false,
    indentData: [],
    // itemList: [],
    tel:'',
    toPayFailed:1,
    refundTitle: '',//退款店铺名称
    refundPrice: 0,//
    cancleOrdernum: '',//取消订桌的订单号
    reasion: '', //取消订桌原因
    canRefund: '',//是否可以取消
    currentTime: '',//当前时间
    refundOrdernum: '',//申请退款的订单号,
    conHeight:''
  },

  //去支付
  toPay(e) {
     /**
     * 获取订单信息
     */
    var httpClient=new Http();
    var _this=this;
    var argu = {
      orderNumber: e.target.dataset.ordernum,
      token: app.globalData.token
    };
    httpClient.getOrederSelected(argu).then((data) => {
      console.log(data);
      if(data.code!=200){
        wx.showToast({
          title:data.msg
        })
        this.data.indentData.forEach((ele,i)=>{
          if(ele.order_number ==  e.target.dataset.ordernum){
            this.data.indentData[i].topay = 1;
            return;
          }
        })
        this.setData({
          indentData:this.data.indentData
        })
       
      }else{
        wx.navigateTo({
          url: "../topay/topay?orderNumber=" + e.target.dataset.ordernum
        })
      }
     
    })
  },
  //去评论
  goReview(e) {
    wx.navigateTo({
      url: "../review/review?ordernum=" + e.target.dataset.ordernum + "&shopid=" + e.target.dataset.shopid
    })
  },
  //显示取消订桌的弹窗
  showcancelTable(e) {
    this.setData({
      cancelflag: !this.data.cancelflag,
      cancleOrdernum: e.target.dataset.ordernum
    })
  },
  //取消订桌,请求取消订单接口
  cancelTable: function (e) {
    var httpClient = new Http();
    var argu = {
      token: app.globalData.token,
      orderNumber: e.target.dataset.ordernum,
      content: this.data.reasion
    };
    httpClient.cancelOrder(argu).then((data) => {
      console.log(data)
      if (data.code == 200) {
        wx.showToast({
          title: '取消成功'
        });
        //  刷新页面
        this.update();
      }
      this.setData({
        cancelflag: !this.data.cancelflag
      })
    })

  },
  //放弃取消订桌,即关闭取消订桌的弹窗
  giveupTable: function () {

    this.setData({
      cancelflag: !this.data.cancelflag
    })

  },
  //申请原因输入事件
  changeText(e) {
    this.setData({
      reasion: e.detail.value
    })
    console.log(this.data.reasion);
  },
  //申请退款接口调取
  getRefun() {
    var httpClient = new Http();
    var argu = {
      token: app.globalData.token,
      orderNumber: this.data.refundOrdernum,
      content: this.data.reasion
    };
    httpClient.refundOrder(argu).then((data) => {
      console.log(data);
      if (data.code == 200) {
        wx.showToast({
          title: "退款申请成功"
        })
        this.setData({
          refundflag: false
        });
        //  刷新页面
        this.update();
      } else {
        wx.showToast({
          title: "退款申请失败"
        })
      }
    })
  },
  //申请退款弹窗出现，获取订单号，调取接口
  refundMoney: function (e) {

    this.setData({
      refundflag: !this.data.refundflag,
      refundOrdernum: e.target.dataset.ordernum,
      refundTitle: e.target.dataset.tit,
      refundPrice: e.target.dataset.price,
      reasion: ''
    })
    // this.getRefun();
  },
  //关闭退款申请弹窗
  closerefundMoney() {
    this.setData({
      refundflag: !this.data.refundflag
    })
  },
  onLoad() {
    //加载就获取所有订单
    //this.getOrder();
    var _this=this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        // 可使用窗口宽度、高度
        console.log('height=' + res.windowHeight);
        // 计算主体部分高度,单位为px
        _this.setData({
          // second部分高度 = 利用窗口可使用高度 - first部分高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
          conHeight: res.windowHeight*2
        })
      }
    })
  },
  //电话弹窗
  open(e) {
    // var itemList = ['13526784596', '010-8353123'];
    // this.setData({
    //   itemList: this.data.itemList.push(e.target.dataset.tel.toString()) ? this.data.itemList : []
    // })
    this.setData({
      tel: e.target.dataset.tel.toString()
    })
    var itemList=[];
    itemList = itemList.push(this.data.tel.toString()) ? itemList : [];
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
    this.setData({
      tel:''
    })
  },
  // wx.startPullDownRefresh();
  //获取全部订单
  getOrder() {
    var time = Date.parse(new Date()) / 1000;
    // console.log('当前时间戳 ',time);
    var httpClient = new Http();
    var argu = {
      token: app.globalData.token,
      page: this.data.page
    };
    httpClient.getUserOrderList(argu).then((data) => {
      console.log(data);
      if (data.list.length == 0) {
        this.setData({
          emptyflag: true
        })
      } else {
        for (var key in data.list) {

          if (data.list[key].expand) {
            data.list[key].expand = JSON.parse(data.list[key].expand);
            if (data.list[key].expand.addtime) {
              var timegaps = Number(data.list[key].expand.addtime) - Number(time);
              // console.log(timegaps)
              if (timegaps >= 10800) { //距离预约时间超过3小时以外
                data.list[key].isRefund = true;
                // console.log("data.list[key]",data.list[key]);
              } else if (timegaps > 0 && timegaps < 10800 && data.list[key].type == 4) { //距离预约时间3小时以内，并且type4预约点餐，可以退款
                data.list[key].isRefund = true;
              } else {
                data.list[key].isRefund = false;
              }
              data.list[key].expand.addtime = formatTimeTwo(data.list[key].expand.addtime, 'Y-M-D h:m');
            }
          } else {
            data.list[key].isRefund = false;
            data.list[key].create_time=data.list[key].create_time.substring(0,16);
          }
         
        }
        this.setData({
          indentData: this.data.indentData.concat(data.list)
        })
        console.log('全部订单', this.data.indentData)
      }
    })
  },

  onShow: function () {
    //如果懒加载了多页了,我下了订单,新订单出现,但是之前加载过的老订单重新加载。  功能没问题。 多请求。
    this.update();
  },
  //刷新页面
  update() {
    this.data.page = 1;
    this.data.indentData = [];
    this.getOrder();
  },
  //分页加载更多
  loadMore() {
    var _this = this;
    this.data.page++;
    _this.setData({
      page: this.data.page
    });
    _this.getOrder();
  },
  //将时间戳转换成时间
  timestampToTime(timestamp) {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y, M, D, h, m, s;
    Y = date.getFullYear() + '-';
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    D = date.getDate() + ' ';
    h = date.getHours() + ':';
    m = date.getMinutes() + ':';
    s = date.getSeconds();
    return Y + M + D + h + m + s;

  }

})