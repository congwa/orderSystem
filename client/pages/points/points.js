var app = getApp();
import { Http } from '../../utils/httpClient';
import { formatTime, getCountDays, getCountWeek } from '../../utils/util';
Page({
  data: {
    behavior: ['', '获取', '消费'],
    calendarflag: false,
    data: [],
    count: 1,
    score: 0,
    page: 1,
    signData: {},
    isSign: '签到领取积分',
    /**
     * 当前月的天数
     */
    days: new Array(getCountDays()),
    time: "",
    week: new Array(getCountWeek() == 7 ? 0 : getCountWeek())  // 0123456格子
  },
  onLoad(options) {
    var time = formatTime(new Date());
    this.setData({
      time: time.split(" ")[0].split('/')
    });
    console.log(this.data.days);
  },
  onShow() {
    var httpClient = new Http();
    //获取积分列表接口数据
    this.getIntegralList();
    //获取积分余额数据
    this.getUserIters();
    //获取签到列表
    this.getSignLists();

  },
  //获取积分余额数据
  getUserIters() {
    var httpClient = new Http();
    httpClient.getUserIntegral({ token: app.globalData.token }).then((data) => {
      console.log("我的积分余额", data);
      if (data.is_sign == 1) {
        this.setData({
          score: data.score,
          isSign: '已签到'
        })
      } else if (data.is_sign == 2) {
        this.setData({
          score: data.score
        })
      }
    })
  },
  //点击签到显示签到弹窗，并调取签到接口
  showcalendar() {
    //渲染完毕后将此setdata注释
    // this.setData({
    //   calendarflag:!this.data.calendarflag
    //  })    
    this.goSign();
  },
  //关闭弹窗
  showcalendarClose() {
    this.setData({
      calendarflag: !this.data.calendarflag
    })
  },
  //点击签到请求接口
  goSign() {
    var httpClient = new Http();
    //当前时间戳
    //  if(this.data.isSign == '已签到'){
    //    return;
    //  }
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    //  console.log("当前时间戳为：" + timestamp);
    httpClient.clickSign({ token: app.globalData.token, time: timestamp }).then((data) => {
      console.log("点击签到", data);
      if (data.msg == "已签到" && data.code == 20001) {
        wx.showToast({
          title: '已签到过了'
        });
      }
      //
      this.setData({
        calendarflag: true,
        isSign: '已签到'
      })
      app.issigned = false;

      //签到之后，数据改变，调取积分列表，更改弹窗里面的积分+7的值
      this.getIntegralList();
      //获取积分余额数据
      this.getUserIters();
      this.getSignLists();//调取签到列表，更改弹窗里面连续签到的值，signData.count
    })
  },
  //获取积分列表接口数据
  getIntegralList() {
    var httpClient = new Http();
    httpClient.getUserIntegralList({ token: app.globalData.token, page: this.data.page }).then((data) => {
      console.log("我的积分", data);
      if (data.list) {
        data.list.forEach((ele, i) => {
          data.list[i].addtime = formatTime(new Date(ele.addtime * 1000));
        });
      }
      this.setData({
        data: data.list,
        count: data.count
      })
    })
  },
  //获取签到列表
  getSignLists() {
    var httpClient = new Http();
    httpClient.getSignList({ token: app.globalData.token }).then((data) => {
      data.list.forEach((e, i) => {
        data.list[i].addtime = (new Date(e.addtime * 1000)).toString().split(' ')[2];
        this.data.days[data.list[i].addtime - 1] = 1;
      })
      console.log('签到列表 ', data);
      this.setData({
        signData: data,
        days: this.data.days
      })

      //微信小程序不能再模板调用方法
    })
  }
})