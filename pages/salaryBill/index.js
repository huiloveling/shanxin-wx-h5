const app = getApp()
// pages/salaryBill/index.js
import Axios from '../../utils/request/index';
import { BASE_IMG_PATH } from './../../utils/request/config';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navH: 0,
        BASE_IMG_PATH: BASE_IMG_PATH
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            navH: app.globalData.navHeight,
            state: options.state
        });
        this.totalRepay();
    },
    totalRepay: function() {
        let user = wx.getStorageSync('user');
        let params = {
            userId: user.id,
            token: user.token
        }
        Axios('repay/totalRepay', 'POST', params).then((res) => {
            if (res.code === '0') {
                let data = res.data;
                wx.setStorage({
                    key: "repayList",
                    data: data
                });
                this.setData({
                    repayList: data.repayList,
                    data: data
                });
            }
        }).catch((err) => {
            wx.showToast({
                title: '网络异常...',
                icon: 'none',
                duration: 2000
            });
        });
    },
    handleNavigateTo: function() {
        let _this = this;
        wx.navigateTo({
            url: '/pages/repayment/index'
        })
    },
    handleSalaryDel: function() {
        wx.navigateTo({
            url: '/pages/hstoryBill/index'
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

    },
    handleBackClick: function() {
        console.log(this.state)
        if (this.data.state === '1') {
            wx.switchTab({
                url: '/pages/salary/index'
            })
        } else {
            wx.navigateBack({
                delta: 1
            })
        }
    }
})