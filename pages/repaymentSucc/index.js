const app = getApp()
// pages/salaryDel/index.js
import Axios from '../../utils/request/index';
import { BASE_IMG_PATH } from './../../utils/request/config';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        BASE_IMG_PATH: BASE_IMG_PATH
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            navH: app.globalData.navHeight
        });
    },
    handleBackClick: function () {
        // wx.navigateBack({
        //     delta: 1
        // })
        let user = wx.getStorageSync('user');
        let params = {
            userId: user.id,
            token: user.token,
        }
        Axios('repay/queryUnRepay', 'POST', params).then((res) => {
            if (res.code === '0') {
                let state = res.data.state;
                if (state === '0' || state === 0) {
                    wx.switchTab({
                        url: '/pages/salary/index'
                    })
                } else if (state === '1' || state === 1) {
                    wx.navigateTo({
                        url: '/pages/salaryBill/index?state=1'
                    })
                }
            }
        }).catch((res) => {

        })
    },
    handleToNanClick: function() {
        wx.navigateTo({
            url: '/pages/historySalaryBill/index?state=1'
        })
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