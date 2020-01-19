const app = getApp()
const util = require('../../utils/util');
import Axios from '../../utils/request/index';
import { BASE_IMG_PATH } from './../../utils/request/config';
// pages/serviceCharge/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navH: 0,
        radio: '',
        showSalary: false,
        showPopup: false,
        payWayList: [],
        repayList: [],
        overdue: 0,
        repayIds: [],
        BASE_IMG_PATH: BASE_IMG_PATH
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            navH: app.globalData.navHeight
        }, () => {
            if (options.repayList) {
                this._init(JSON.parse(options.repayList));
            } else {
                this._init(wx.getStorageSync('repayList'));
            }
        });
    },
    _init: function(list) {
        this.getPayWayList();
        this.getRepayList(list);
        this.repayAmount();
    },
    handleUpSalaryClick: function() {
        let showSalary = this.data.showSalary;
        if (showSalary) {
            this.setData({
                showSalary: false
            });
        } else {
            this.setData({
                showSalary: true
            });
        }
    },
    onClick(event) {
        const {
            name
        } = event.currentTarget.dataset;
        this.setData({
            radio: name
        });
    },
    // 获取支付方式列表
    getPayWayList: function() {
        let user = wx.getStorageSync('user');
        let params = {
            userId: user.id,
            token: user.token,
            type: 1
        }
        Axios('basic/payWay', 'POST', params).then((res) => {
            if (res.code === '0') {
                let payWayList = res.data;
                this.setData({
                    payWayList: payWayList,
                    radio: payWayList[0].code
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
    getRepayList: function(list) {
        let data = list;
        let overdue = 0;
        let repayIds = [];
        for (let i = 0; i < data.repayList.length; i++) {
            overdue += data.repayList[i].overdue;
            data.repayList[i].applyTime = util.formatDate(data.repayList[i].applyTime);
            repayIds.push(data.repayList[i].repayId)
        }
        this.setData({
            repayList: data.repayList,
            totalFee: data.totalFee,
            overdue: data.overdue,
            repayIds: repayIds,
        });
    },
    repayAmount: function() {
        let user = wx.getStorageSync('user');
        let repayIds = this.data.repayIds;
        let params = {
            userId: user.id,
            token: user.token,
            type: 1,
            repayIds: repayIds.join(',')
        }
        Axios('repay/repayAmount', 'POST', params).then((res) => {
            if (res.code === '0') {
                this.setData({
                    totalAmount: res.data
                })
            }
        }).catch((err) => {
            wx.showToast({
                title: '网络异常...',
                icon: 'none',
                duration: 2000
            });
        });
    },
    handleBackClick: function() {
        let user = wx.getStorageSync('user');
        let repayIds = this.data.repayIds;
        let params = {
            userId: user.id,
            token: user.token,
            repayIds: repayIds.join(',')
        }
        Axios('repay/queryRepayState', 'POST', params).then((res) => {
            if (res.code === '0') {
                if (res.data.state === 1 || res.data.state === '1') {
                    wx.navigateBack({
                        delta: 1
                    })
                } else {
                    this.setData({
                        showPopup: true
                    });
                }
            } else {
                this.setData({
                    showPopup: true
                });
            }
        }).catch((res) => {
            this.setData({
                showPopup: true
            });
        });
    },
    handleToBack: function() {
        wx.navigateBack({
            delta: 1
        })
    },
    handlePayOk: function() {
        this.setData({
            showPopup: false
        });
    },
    queryPayState: function() {
        let user = wx.getStorageSync('user');
        let repayIds = this.data.repayIds;
        let params = {
            repayIds: repayIds.join(','),
            userId: user.id,
            token: user.token,
        }
        Axios('repay/queryPayState', 'POST', params).then((res) => {
            if (res.code === '0') {
                let state = res.data.state;
                if (state === '0' || state === 0) {
                    this.handleRepayMoney();
                } else if (state === '1' || state === 1) {
                    wx.navigateTo({
                        url: '/pages/repaymentSucc/index'
                    })
                } else if (state === '2' || state === 2) {
                    wx.showToast({
                        title: '还款处理中...',
                        icon: 'none',
                        duration: 4000
                    });
                }
            }
        }).catch((err) => {

        })
    },
    handleRepayMoney: function() {
        let user = wx.getStorageSync('user');
        let repayIds = this.data.repayIds;
        let code = this.data.radio;
        let params = {
            repayIds: repayIds.join(','),
            userId: user.id,
            token: user.token,
            code: code
        }
        wx.showLoading({
            title: '支付中...',
            mask: true
        })
        Axios('repay/repayment', 'POST', params).then((res) => {
            if (res.code === '0') {
                wx.navigateTo({
                    url: '/pages/repaymentSucc/index'
                })
            } else {
                wx.hideLoading();
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 4000
                });
            }
        }).catch((err) => {
            wx.showToast({
                title: '支付失败',
                icon: 'none',
                duration: 2000
            })
            wx.hideLoading()
        })
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