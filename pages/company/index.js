import Axios from '../../utils/request/index';
import { BASE_IMG_PATH } from './../../utils/request/config';
const app = getApp()
// pages/faceDiscern/index.js
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
    onLoad: function (options) {
        this.setData({
            navH: app.globalData.navHeight
        });
        this.companyInfo();
    },
    companyInfo: function() {
        let user = wx.getStorageSync('user');
        let params = {
            userId: user.id,
            token: user.token
        }
        Axios('user/companyInfo', 'POST', params).then((res) => {
            if (res.code === '0') {
                let data = res.data;
                this.setData({
                    companyInfo: data
                });
            } else {

            }
        }).catch((err) => {

        })
    },
    handleBackClick: function() {
        wx.navigateBack({
            delta: 1
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