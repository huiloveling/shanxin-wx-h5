const app = getApp()
import Axios from '../../utils/request/index';
const util = require('../../utils/util');
import { BASE_IMG_PATH } from './../../utils/request/config';
let timer = null;
// pages/salaryDel/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        loanApplyId: 0,
        billDetail: {},
        BASE_IMG_PATH: BASE_IMG_PATH
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            navH: app.globalData.navHeight,
            loanApplyId: options.loanApplyId
        }, () => {
            this.billDetail();
        });
    },
    handleBackClick: function() {
        wx.navigateBack({
            delta: 1
        });
    },
    handlePayClick: function() {
        // wx.navigateTo({
        //     url: '/pages/repayment/index'
        // })
        wx.navigateTo({
            url: '/pages/salaryBill/index'
        })
    },
    handlePayFee: function() {
        let user = wx.getStorageSync('user');
        let params = {
            userId: user.id,
            token: user.token,
        }
        Axios('fee/getWaitFeeLoanApply', 'POST', params).then((res) => {
            if (res.code === '0') {
                wx.setStorage({
                    key: "loanApplyId",
                    data: res.data.loanApplyId
                });
                wx.navigateTo({
                    url: '/pages/serviceCharge/index'
                });
            } else {

            }
        }).catch((err) => {
            wx.showToast({
                title: '网络异常...',
                icon: 'none',
                duration: 2000
            });
        });
    },
    billDetail: function() {
        let user = wx.getStorageSync('user');
        let params = {
            loanApplyId: this.data.loanApplyId,
            userId: user.id,
            token: user.token
        }
        Axios('loan/billDetail', 'POST', params).then((res) => {
            if (res.code === '0') {
                let data = res.data;
                data.repayTotal = data.amount;
                let repayList = {
                    repayList: [data],
                    totalAmount: data.amount,
                    totalFee: data.overdueFine,
                    overdue: data.overdue
                };
                wx.setStorage({
                    key: "repayList",
                    data: repayList
                })
                data.applyTime = util.formatDate(data.applyTime);
                data.refundTime = util.formatDate(data.refundTime);
                data.loanSuccessTime = util.formatDate(data.loanSuccessTime);
                data.repayDate = util.formatDate(data.repayDate);
                this.setData({
                    billDetail: data,
                }, () => {
                    if (data.remainingTime) {
                        this.countDown(data.remainingTime);
                    }
                });
            } else {

            }
        }).catch((res) => {
            wx.showToast({
                title: '网络异常...',
                icon: 'none',
                duration: 2000
            });
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
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})