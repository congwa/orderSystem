// pages/appointment/appointment.js

var app = getApp();

import { Http } from '../../utils/httpClient';
var httpClient = new Http();

import { timestampToTime } from '../../utils/util.js';

const date = new Date();
const nowYear = date.getFullYear();
const nowMonth = date.getMonth() + 1;
const nowDay = date.getDate();
const nowHour = date.getHours();
const nowMinute = date.getMinutes();

var date2 = new Date(date);
date2.setDate(date.getDate() + 30);
var endDate = date2.getTime();
console.log('end', endDate);

var a = timestampToTime(date.getTime() + 1000 * 60 * 30).split(' ')
console.log('time', a);
console.log('endTime', timestampToTime(endDate).split(' '));

//let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
// 根据年月 获取当月的总天数
// let getDays = function (year, month) {
//     if (month === 2) {
//         return ((year % 4 === 0) && ((year % 100) !== 0)) || (year % 400 === 0) ? 29 : 28
//     } else {
//         return daysInMonth[month - 1]
//     }
// }
// 根据年月日设置当前月有多少天 并更新年月日数组
// let setDate = function (month, day, hour, minute, _th) {
//     // let daysNum = nowYear === nowYear && month === nowMonth ? nowDay : getDays(nowYear, month)
//     let daysNum = getDays(nowYear, month);
//     day = day > daysNum ? 1 : day
//     //let monthsNum = nowYear === nowYear ? nowMonth : 12
//     let monthsNum = 12;
//     let hourNum = 24
//     let minuteNum = 60
//     // let years = []
//     let months = []
//     let days = []
//     let hours = []
//     let minutes = []
//     // let yearIdx = 9999
//     let monthIdx = 0
//     let dayIdx = 0
//     let hourIdx = 0
//     let minuteIdx = 0

//     // 重新设置年份列表
//     // for (let i = nowYear; i <= nowYear + 20; i++) {
//     //     years.push(i)
//     // }
//     // years.map((v, idx) => {
//     //     if (v === year) {
//     //         yearIdx = idx
//     //     }
//     // })
//     // 重新设置月份列表
//     for (let i = nowMonth; i <= monthsNum; i++) {
//         months.push(i)
//     }
//     months.map((v, idx) => {
//         if (v === month) {
//             monthIdx = idx
//         }
//     })
//     // 重新设置日期列表
//     for (let i = nowDay; i <= daysNum; i++) {
//         days.push(i)
//     }
//     days.map((v, idx) => {
//         if (v === day) {
//             dayIdx = idx
//         }
//     })

//     //重新设置小时列表
//     for (let i = nowHour; i <= hourNum; i++) {
//         hours.push(i)
//     }
//     hours.map((v, idx) => {
//         if (v === hour) {
//             hourIdx = idx
//         }
//     })

//     //重新设置分钟列表
//     for (let i = nowMinute; i <= minuteNum; i++) {
//         minutes.push(i)
//     }
//     minutes.map((v, idx) => {
//         if (v === minute) {
//             minuteIdx = idx
//         }
//     })

//     _th.setData({
//         //years: years,//年份列表
//         months: months,//月份列表
//         days: days,//日期列表
//         hours: hours,
//         minutes: minutes,
//         value: [monthIdx, dayIdx, hourIdx, minuteIdx],
//         // year: year,
//         month: month,
//         day: day,
//         hour: hour,
//         minute: minute
//     })
// }


Page({
    /**
     * 组件的初始数据
     */
    data: {
        /***********时间选择器需要变量*********/
        /**
         * 时间选择器需要变量
         */
        // years: [],
        // year: date.getFullYear(),
        // canOrder: '',//可以跳转吗
        // isloop: '',//循环过吗
        // months: [],
        // month: nowMonth,
        // days: [],
        // day: nowDay,
        // hours: [],
        // hour: nowHour,
        // minutes: [],
        // minute: nowMinute,
        // value: [nowMonth, nowDay, nowHour, nowMinute],
        // dateSelectHidden: false,
        // showbak: false,

        /**
         * 旧的日期
         */
        // oldDate: {
        //     // year: nowYear,
        //     month: nowMonth,
        //     day: nowDay,
        //     hour: nowHour,
        //     minute: nowMinute
        // },


        nowYear: date.getFullYear(),
        nowMonth: date.getMonth() + 1,
        nowDay: date.getDate(),
        nowHour: date.getHours(),
        nowMinute: date.getMinutes(),

        //当前时间向后推迟半个小时的算法
        date: timestampToTime(date.getTime() + 1000 * 60 * 30).split(' ')[0],
        time: timestampToTime(date.getTime() + 1000 * 60 * 30).split(' ')[1],

        endDate: timestampToTime(endDate).split(' ')[0],
        endTime: timestampToTime(endDate).split(' ')[1],
        /**
         * 用餐时间
         */
        mealTime: '',
        /**
         * 用餐人数
         */
        mealNumber: '',

        /**
         * 用餐人姓名
         */
        mealSurname: '',
        /**
         * 性别选择
         */
        mealSex: '',

        /**
         * 电话号码
         */
        mealIphone: '',        /**
         * 备注
         */
        mealDesc: '',




    },

    /**
     * 更新时间
     * 总是获取最新的时间,总是推迟到30天后的时间
     */
    upDateDate() {
        const date = new Date();
        const nowYear = date.getFullYear();
        const nowMonth = date.getMonth() + 1;
        const nowDay = date.getDate();
        const nowHour = date.getHours();
        const nowMinute = date.getMinutes();

        var date2 = new Date(date);
        date2.setDate(date.getDate() + 30);
        var endDate = date2.getTime();
        this.setData({
            date:timestampToTime(date.getTime() + 1000 * 60 * 30).split(' ')[0],
            time: timestampToTime(date.getTime() + 1000 * 60 * 30).split(' ')[1],
            endTime:timestampToTime(endDate).split(' ')[1],
            endDate:timestampToTime(endDate).split(' ')[0]
        })
   
    },

    toOrder() {
        wx.navigateTo({
            url: "../order/order"
        })
    },
    /**
     * 时间日期改变回调
     */
    bindChange: function (e) {
        var self = this;
        const val = e.detail.value
        //setDate(this.data.months[val[0]], this.data.days[val[1]], this.data.hours[val[2]], this.data.minutes[val[3]], this)
    },
    onLoad: function () {
        //setDate(this.data.month, this.data.day, this.data.hour, this.data.minute, this)
        this.upDateDate();
    },
    /**
     * 日期选择器显示
     * @param e
     */
    // showMaskDateSelect: function (e) {

    //     this.setData({
    //         dateSelectHidden: true,
    //         showbak: true
    //     })
    //     for (var i in this.data.oldDate) {
    //         this.data.oldDate[i] = this.data[i];
    //     }
    // },
    /**
     * 日期选择器取消按钮
     * @param e
     */
    // cancleMaskDateSelect: function (e) {
    //     this.setData({
    //         dateSelectHidden: false,
    //         showbak: false
    //     })
    //     for (let i in this.data.oldDate) {
    //         this.data[i] = this.data.oldDate[i];
    //     }
    // },
    /**
     * 日期选择器确定按钮
     */
    // enterMaskDateSelect: function (e) {
    //     var time = nowYear + '-' + this.data.month + '-' + this.data.day + ' ' + this.data.hour + ':' + this.data.minute + ':00';
    //     console.log('选择当前预定时间', time)
    //     //var tTime = new Date(time).getTime() / 1000;
    //     this.setData({
    //         dateSelectHidden: false,
    //         mealTime: time,
    //         showbak: false
    //     })
    // },

    bindDateChange(e){
        console.log(e);
        this.setData({
            date:e.detail.value
        })
    },  

    bindTimeChange(e){
        console.log(e);
        this.setData({
            date:e.detail.value
        })
    },

    /**
     * 用餐人数改变选择回调
     */
    mealNumberChange(e) {
        var value = e.detail.value;
        this.data.mealNumber = value;
    },
    /**
     * 键盘输入时候改变
     */
    bindinputnumber(e) {
        this.data.mealNumber = e.detail.value;
        console.log('用餐人数改变: ', e.detail.value);
    },

    /**
     * 用餐人姓名改变回调
     * @param {} e 
     */
    mealSurnameChange(e) {
        var value = e.detail.value;
        this.data.mealSurname = value;
        console.log('姓名改变', value);
    },
    /**
     * 性别选择
     */
    radioChange(e) {
        this.data.mealSex = e.detail.value;
        console.log('性别改变回调', e.detail.value);
    },

    /**
     * 电话号码改变
     * @param {} e d
     */
    mealIphoneChange(e) {
        this.data.mealIphone = e.detail.value;
        console.log('电话号码改变', e.detail.value);
    },
    //手机号码验证
    pattern(e) {
        var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
        if (e.detail.value.length == 0) {
            wx.showToast({
                title: '输入的手机号为空',
                icon: 'success',
                duration: 1500
            })
            return false;
        } else if (e.detail.value.length < 11) {
            wx.showToast({
                title: '手机号长度有误！',
                icon: 'success',
                duration: 1500
            })
            return false;
        } else if (!myreg.test(e.detail.value)) {
            wx.showToast({
                title: '手机号有误！',
                icon: 'success',
                duration: 1500
            })
            return false;
        }
        // else {
        //     wx.showToast({
        //         title: '填写正确',
        //         icon: 'success',
        //         duration: 1500
        //     })
        // }
        this.data.mealIphone = e.detail.value;
        console.log('电话号码改变', e.detail.value);
    },
    /**
     * 备注
     * @param {*} e 
     */
    mealDescChange(e) {
        this.data.mealDesc = e.detail.value;
        console.log('备注改变回调', e.detail.value);
    },



    /**
     * 预定桌位
     */
    setTable(e) {
        
        // var contacts = {
        //     number: this.data.mealNumber,
        //     uname: this.data.mealSurname,
        //     addtime: this.data.mealTime,
        //     sex: this.data.mealSex,
        //     iphone: this.data.mealIphone,
        //     desc: this.data.mealDesc
        // }
        // console.log(obj)
        // var obj=contacts;
        // delete(obj.desc);

        // for (var key in contacts) {
        //     if (!contacts[key] && key != "desc") {
        //         wx.showToast({
        //             title: '输入不能有空'
        //         })
        //         this.setData({
        //             canOrder: false
        //         })
        //         break;
        //     } else if (key == "desc") {
        //         continue;
        //     }
        //     this.setData({
        //         isloop: true,
        //         canOrder: true
        //     })
        // }
        // console.log(this.data.canOrder, this.data.isloop, contacts);
        // console.log(contacts);
        // var argu = {
        //     lid: app.currentShopId,
        //     token: app.globalData.token,
        //     contacts: JSON.stringify(contacts)
        // }    
        var argu =  {
            token: app.globalData.token,		
            lid	: this.data.shopId,
            time: this.data.date + ' ' + this.data.time,
            name: this.data.mealSurname,
            number: this.data.mealNumber,
            tel:this.date.mealIphone,
            remark:this.data.mealDesc
        }
        var type = 'onlyTable';

        if (this.data.canOrder != false && this.data.isloop) {
            httpClient.postV2AppointmentFound(argu).then((res) => {
                console.log('预定下单', res);
                if (res.code == 200) {
                    wx.navigateTo({
                        url: '../pay_success/pay_success?type=' + type
                    })
                }
                wx.showToast({
                    title: res.meg
                })
            }).catch((e) => {
                wx.showToast({
                    title: '订桌失败'
                });
            })
        }

    },

    /**
     * 预定点餐
     */
    appointmentOrderFood(e) {
        //预约 点餐 字段名
        var contacts = {
            number: this.data.mealNumber,
            uname: this.data.mealSurname,
            addtime: this.data.mealTime,
            sex: this.data.mealSex,
            iphone: this.data.mealIphone,
            desc: this.data.mealDesc
        }
        for (var key in contacts) {
            if (!contacts[key] && key != "desc") {
                wx.showToast({
                    title: '输入不能有空'
                })
                // if(key=="iphone"){             
                // }
                this.setData({
                    canOrder: false
                })
                break;
            }
            this.setData({
                isloop: true,
                canOrder: true
            })
        }
        console.log(this.data.canOrder, this.data.isloop, contacts);
        console.log('contacts', contacts);
        var type = 'appointment';
        if (this.data.canOrder != false && this.data.isloop) {
            wx.navigateTo({
                url: '../order/order?type=' + type + '&contacts=' + JSON.stringify(contacts)
            })
        }
    }





})
