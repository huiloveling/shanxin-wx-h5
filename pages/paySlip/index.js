// pages/paySlip/index.js
const app = getApp()
import Toast from './../../dist/toast/toast';
import Axios from '../../utils/request/index';
import { BASE_IMG_PATH } from './../../utils/request/config';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navH: 0,
        showCmpanyName: false,
        columns: ['阿里巴巴', '腾讯', '格力电器', '微软科技', '谷歌'],
        list: [],
        state: false,
        vanLoading: true,
        BASE_IMG_PATH: BASE_IMG_PATH
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            navH: app.globalData.navHeight
        }, () => {
            this.querySalaryList();
        });
    },
    querySalaryList: function() {
        let user = wx.getStorageSync('user');
        let formId = wx.getStorageSync('formId');
        let params = {
            userId: user.id,
            token: user.token,
            formId: formId
        }
        Axios('user/querySalaryList', 'POST', params).then((res) => {
            if (res.code === '0') {
                this.setData({
                    list: res.data
                });
            } else {
                this.setData({
                    state: true
                });
            }
            this.setData({
                vanLoading: false
            });
        }).catch((res) => {
            this.setData({
                vanLoading: false
            });
            wx.showToast({
                title: '网络异常...',
                icon: 'none',
                duration: 2000
            });
        })
    },
    handleBackClick: function () {
        wx.navigateBack({
            delta: 1
        })
    },
    handleDel: function(e) {
        wx.navigateTo({
            url: '/pages/paySlipDel/index?month=' + e.currentTarget.dataset.month
        });
    },
    onConfirm(event) {
        const { picker, value, index } = event.detail;
    },
    handleCmpanyNameClick: function() {
        this.setData({
            showCmpanyName: true
        });
    },
    onClose: function() {
        this.setData({
            showCmpanyName: false
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