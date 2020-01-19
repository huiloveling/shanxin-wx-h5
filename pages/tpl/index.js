// pages/tpl/index.js
import {
    URL
} from './../../utils/request/config.js'
import { BASE_IMG_PATH } from './../../utils/request/config';
const app = getApp()
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
        let user = wx.getStorageSync('user');
        let viewUrl = '';
        if (options.url === 'webview/userAgreement') {
            viewUrl = URL + options.url + '?token=' + user.token + '&userId=' + user.id + '&systemType=2'
        } else if (options.url === 'webview/regeistAgreement') {
            viewUrl = URL + options.url;
        } else if (options.url === 'webview/loanContract') {
            let week = wx.getStorageSync('week');
            viewUrl = URL + options.url + '?token=' + user.token + '&userId=' + user.id + '&contractNum=' + week.contractNum + '&weenSalary=' + week.weenSalary + '&systemType=2'
        } else if (options.url === 'webview/bankcardAgreement') {
            let bankData = wx.getStorageSync('bankData');
            viewUrl = URL + options.url + '?token=' + user.token + '&userId=' + user.id + '&accountName=' + bankData.name + '&bankCard=' + bankData.bankCard + '&idCard=' + bankData.idcard + '&mobile=' + bankData.phone + + '&systemType=2'
        } else if (options.url === 'webview/details') {
            let webview = wx.getStorageSync('webview');
            viewUrl = URL + options.url + '?' + webview + '&token=' + user.token + '&userId=' + user.id + + '&systemType=2'
        } else if (options.url === 'webview/bankcardAgreement') {
            let bankData = wx.getStorageSync('bankData');
            viewUrl = URL + options.url + '?token=' + user.token + '&userId=' + user.id + '&accountName=' + bankData.name + '&bankCard=' + bankData.bankCard + '&idCard=' + bankData.idcard + '&mobile=' + bankData.phone + '&systemType=1'
        } else if (options.url === 'webview/details') {
            let webview = wx.getStorageSync('webview');
            viewUrl = URL + options.url + '?' + webview + '&token=' + user.token + '&userId=' + user.id + '&systemType=1'
        }
        this.setData({
            navH: app.globalData.navHeight,
            viewUrl: viewUrl
        });
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