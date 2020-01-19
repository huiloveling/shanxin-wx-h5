const app = getApp()
import Axios from '../../utils/request/index';
const util = require('../../utils/util');
import { BASE_IMG_PATH } from './../../utils/request/config';
// pages/serviceCharge/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navH: 0,
        radio: '1',
        showSalary: false,
        showPopup: false,
        payWayList: [],
        feeAmount: {},
        transNo: '',
        BASE_IMG_PATH: BASE_IMG_PATH
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            navH: app.globalData.navHeight,
            state: options.state
        });
        this.getFeeAmount();
    },
    handleUpSalaryClick: function () {
        let showSalary = this.data.showSalary;
        if (showSalary) {
            this.setData({
                showSalary: false
            })
        } else {
            this.setData({
                showSalary: true
            })
        }
    },
    onClick(event) {
        const { code } = event.currentTarget.dataset;
        this.setData({
            radio: code
        });
    },
    // 获取支付方式列表
    getPayWayList: function () {
        let user = wx.getStorageSync('user');
        let params = {
            userId: user.id,
            token: user.token,
            type: 1,
        }
        Axios('basic/payWay', 'POST', params).then((res) => {
            if (res.code === '0') {
                let payWayList = res.data;
                this.setData({
                    payWayList: payWayList
                });
            } else {

            }
        }).catch((err) => {

        });
    },
    getFeeAmount: function() {
        let user = wx.getStorageSync('user');
        let loanApplyId = wx.getStorageSync('loanApplyId');
        let params = {
            userId: user.id,
            token: user.token,
            loanApplyId: loanApplyId,
        }
        Axios('fee/getFeeAmount', 'POST', params).then((res) => {
            if (res.code === '0') {
                let data = res.data;
                data.planDate = util.formatDateTime(data.planDate);
                this.setData({
                    feeAmount: data
                });
            } else {

            }
        }).catch((err) => {

        })
    },
    handlePayFee: function() {
        let transNo = this.data.transNo;
        let user = wx.getStorageSync('user');
        let loanApplyId = wx.getStorageSync('loanApplyId');
        let params = {
            userId: user.id,
            token: user.token,
            loanApplyId: loanApplyId,
        }
        Axios('fee/queryPayState', 'post', params).then((res) => {
            if (res.code === '0') {
                let state = res.data.state;
                if (state === '0' || state === 0) {
                    this._payFee();
                } else if (state === '1' || state === 1) {
                    wx.navigateTo({
                        url: '/pages/serviceChargeSucc/index'
                    });
                } else if (state === '2' || state === 2) {
                    wx.showToast({
                        title: '支付处理中...',
                        icon: 'none',
                        duration: 2000
                    })
                }
            } else {
                this._payFee();
            }
        }).catch((err) => {

        })

        // let user = wx.getStorageSync('user');
        // let loanApplyId = wx.getStorageSync('loanApplyId');
        // let params = {
        //     userId: user.id,
        //     token: user.token,
        //     loanApplyId: loanApplyId,
        //     code: this.data.radio
        // }
        // Axios('fee/payFee', 'POST', params).then((res) => {
        //     if (res.code === '0') {
        //         wx.navigateTo({
        //             url: '/pages/serviceChargeSucc/index'
        //         });
        //     } else {
        //         wx.showToast({
        //             title: res.msg,
        //             icon: 'none',
        //             duration: 2000
        //         })
        //     }
        // }).catch((err) => {

        // })
    },
    _payFee: function() {
        let user = wx.getStorageSync('user');
        let loanApplyId = wx.getStorageSync('loanApplyId');
        let params = {
            userId: user.id,
            token: user.token,
            loanApplyId: loanApplyId,
            code: this.data.radio
        }
        Axios('fee/payFee', 'POST', params).then((res) => {
            if (res.code === '0') {
                wx.navigateTo({
                    url: '/pages/serviceChargeSucc/index'
                });
            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 2000
                })
            }
        }).catch((err) => {

        })
    },
    handleBackClick: function() {
        let user = wx.getStorageSync('user');
        let loanApplyId = wx.getStorageSync('loanApplyId');
        let params = {
            userId: user.id,
            token: user.token,
            loanApplyId: loanApplyId
        }
        Axios('fee/queryFeeState', 'POST', params).then((res) => {
            if (res.code === '0') {
                if (res.data.state === '1' || res.data.state === 1) {
                    wx.switchTab({
                        url: '/pages/salary/index'
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
        }).catch((err) => {
 
        });
    },
    handleBack: function() {
        if (this.data.state === '1' || this.data.state === 1) {
            wx.switchTab({
                url: '/pages/salary/index'
            })
        } else {
            wx.navigateBack({
                delta: 1
            });
        }
    },
    handleClosePoput: function() {
        this.setData({
            showPopup: false
        });
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
        this.getPayWayList();
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