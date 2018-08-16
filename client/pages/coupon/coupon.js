// pages/coupon/coupon.js

var app = getApp();
import {Http} from '../../utils/httpClient';
import {formatTime} from '../../utils/util';
Page({

    /**
     * 组件的初始数据
     */
    data: {
        /**
         * 渲染界面所用数据
         */
        couponView: {
            1:{
                src: "../images/youhui_03.png",
                text: "未使用",
                type: 1
            }, 
            2:{
                src: "../images/youhui_03.png",
                text: "已使用",
                type: 2
            },
            3:{
                src: "../images/youhui_03.png",
                text: "已过期",
                type: 3
            }},
        /**
         * 当前选择的tab
         * 0未使用 1已使用 2已过期
         */
        curTab: 1,
        cur:0,
       

        /**
         * 当前页码
         *
         */    
        page:1,
        /**
         * 实际渲染数据
         */
        couponData: {}
    },

    onLoad: function (options) {
        console.log("page ---onLoad---");
        this.initData(options);
    },
    initData: function(options){
        var _this = this;
        var httpClient = new Http();
        // var argu = {
        //     token:app.globalData.token,
        //     page:this.data.page,
        //     type:this.data.curTab

        // }
        // httpClient.getuserCouponList(argu).then((res)=>{
        //     if(res){
        //         console.log('我的优惠券信息',res);
        //         _this.updateCoupon(this.data.curTab,res)
        //     }
        // })
        this.getuserCoupon();
        console.log(_this.data.couponData);
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

   /**
    *   更新优惠券信息
    * @param {number} tab  1 2 3
    * @param {object} data 
    * @param {number} state 0 1 add  
    */
    updateCoupon(tab,data){
        var res = this.data.couponData[tab];
        if(data.list){
            data.list.forEach((ele,i) => {
                data.list[i].end_time = formatTime(new Date(ele.end_time*1000));
                data.list[i].start_time = formatTime(new Date(ele.start_time*1000));
            });
        }
        if(!res){
            res = {};
            this.data.couponData[tab] = res;
        }
        if(res.list){
            res.list.push(res.list,data.list)
            res.count = data.count;
        }else{
            res.list = data.list;
            res.count = data.count;
        }
        this.setData({
            couponData:this.data.couponData
        })
    },  
    /**
     * 点击切换选项卡
     * @param e
     */
    changeTab(e) {
        this.setData({
            curTab: e.target.dataset.current
        })
    },
    /**
     * 滑动切换选项卡
     * @param e
     */
    swiperTab(e) {
        this.setData({
            curTab: e.detail.current+1
        });
    },

    /**
     * 获取优惠券信息
     */
    getuserCoupon(){
        var _this = this;
        var httpClient = new Http();
        for(let i=1; i<4; i++){
            var argu = {
                token:app.globalData.token,
                page:this.data.page,
                type:i
            }
            httpClient.getuserCouponList(argu).then((res)=>{
                console.log(i);
                if(res){
                    console.log('我的优惠券信息',res);
                    _this.updateCoupon(i,res);
                }
            }).catch((e)=>{
                console.log('null')
            })
        }
    },
    /**
     * 选择了某个优惠券
     * @param e
     */
    selectOneCoupon(e) {
        console.log('选择了某个优惠券：', e);
    },
    clickUseCoupon(e) {
        console.log('确认使用优惠券： ', e);
    },

    /**
     * 滑动到底部懒加载
     * @param {} e 
     */
    bindDownLoad(e) {
        var _this = this;
        var tab = this.data.curTab;
        var page = this.data.page;
        console.log('當前頁面',tab);
        var argu = {
            token:app.globalData.token,
            page:page++,
            type:tab
        }
        httpClient.getuserCouponList(argu).then((res)=>{
            if(res){
                console.log('我的优惠券信息',res);
                _this.updateCoupon(tab,res);
            }
        }).catch((e)=>{
            wx.showToast({
                title: '到底了',
                icon: 'loading',
                duration: 700
              })
        })
    }
    


   
})
