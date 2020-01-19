
const app = getApp()
import Axios from '../../utils/request/index.js';
import { BASE_IMG_PATH } from './../../utils/request/config';
import util from './../../utils/util';
// pages/faceDiscern/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navH: 0,
        userContacts: [],
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
    getUserContacts: function() {
        var user = wx.getStorageSync('user');
        let params = {
            userId: user.id,
            token: user.token
        }
        Axios('user/userContacts', 'POST', params).then((res) => {
            if (res.code === '0') {
                this.setData({
                    userContacts: res.data
                });
            }
        }).catch((err) => {
            
        });
    },
    handleNavigateTo: util.throttle(function () {
        wx.navigateTo({
            url: '/pages/updatePhone/index'
        });
    }, 1000),
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
        this.getUserContacts();
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