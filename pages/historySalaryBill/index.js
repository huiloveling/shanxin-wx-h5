const app = getApp()
import Axios from '../../utils/request/index';
const util = require('../../utils/util');
import { BASE_IMG_PATH } from './../../utils/request/config';
let timer = null;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navH: 0,
        active: true,
        list: [],
        BASE_IMG_PATH: BASE_IMG_PATH
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            navH: app.globalData.navHeight,
            state: options.state
        }, () => {
            this.getbillList(options.state);
        });
    },
    getbillList: function(state) {
        console.log()
        let user = wx.getStorageSync('user');
        let params = {
            userId: user.id,
            token: user.token
        }
        Axios('loan/billList', 'POST', params).then((res) => {
            if (res.code === '0') {
                let data = res.data;
                for (let i = 0; i < data.notFinishList.length; i++) {
                    let item = data.notFinishList[i];
                    item.applyTime = util.formatDateTime(item.applyTime);
                    if (item.remainingTime) {
                        this.countDown(item.remainingTime);
                    }
                }
                for (let i = 0; i < data.finishList.length; i++) {
                    let item = data.finishList[i];
                    item.applyTime = util.formatDateTime(item.applyTime);
                }
                this.setData({
                    notFinishList: data.notFinishList,
                    finishList: data.finishList,
                });
                if (state === '1') {
                    this.setData({
                        list: data.finishList,
                        active: false
                    });
                } else {
                    this.setData({
                        list: data.notFinishList,
                        active: true
                    });
                }
                
            }
        }).catch((err) => {

        });
    },
    handleNotFinishList: function() {
        let list = this.data.notFinishList;
        this.setData({
            list: list,
            active: true
        });
    },
    handleFinishList: function() {
        let list = this.data.finishList;
        this.setData({
            list: list,
            active: false
        });
    },
    countDown: function (endTimer) {
        let nowTimer = 86400000;
        if (endTimer > nowTimer) {
            this.setData({
                dateTime: '已过期'
            });
        } else {
            this.setData({
                dateTime: this.formatDateTime(endTimer, nowTimer)
            });
            timer = setInterval(() => {
                if (endTimer > nowTimer) {
                    this.setData({
                        dateTime: '已过期'
                    });
                } else {
                    this.setData({
                        dateTime: this.formatDateTime(endTimer -= 1000, nowTimer)
                    }, () => {
                        if (this.data.dateTime === '00:00:00') {
                            this.setData({
                                dateTime: '已过期'
                            });
                            clearInterval(timer);
                        }
                    });
                }
            }, 1000);
        }
    },
    formatDateTime(endTimer, nowTimer) {
        let time = endTimer;
        let h = Math.floor(time / 1000 / 60 / 60 % 24);
        let m = Math.floor(time / 1000 / 60 % 60);
        let s = Math.floor(time / 1000 % 60);
        if (h <= 9) h = '0' + h;
        if (m <= 9) m = '0' + m;
        if (s <= 9) s = '0' + s;
        return `${h}:${m}:${s}`;
    },
    handleBillDetail: function(e) {
        wx.switchTab({
            url: '/pages/clockIn/index'
        });
        return
        wx.navigateTo({
            url: '/pages/salaryDel/index?loanApplyId=' + e.currentTarget.dataset.loanapplyid
        });
    },
    handleBackClick: function() {
        if (this.data.state === '5') {
            wx.switchTab({
                url: '/pages/salary/index'
            });
        } else {
            wx.navigateBack({
                delta: 1
            });
        }
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})