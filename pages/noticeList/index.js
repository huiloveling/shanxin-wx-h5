// pages/noticeList/index.js
import Axios from '../../utils/request/index';
import { BASE_IMG_PATH } from './../../utils/request/config';
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        BASE_IMG_PATH: BASE_IMG_PATH
    },
    onShow: function() {
        this.getwebview();
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            navH: app.globalData.navHeight
        }, () => {
            this.getwebview();
        });
    },
    handleBackClick: function () {
        wx.navigateBack({
            delta: 1
        })
    },
    handleToTpl: function(e) {
        let dataset = e.currentTarget.dataset;
        wx.setStorage({
            key: "webview",
            data: 'readState=' + dataset.readstate + '&id=' + dataset.id
        })
        wx.navigateTo({
            url: '/pages/tpl/index?url=webview/details'
        });
    },
    getwebview: function() {
        let user = wx.getStorageSync('user');
        let params = {
            userId: user.id,
            token: user.token,
        }
        Axios('webview/list', 'POST', params).then((res) => {
            if (res.code === '0') {
                let articles = res.data.articles;
                this.setData({
                    articles: articles
                });
            } else {

            }
        }).catch((err) => {

        });
    },
    /**
     * 
     */
    onReady: function () {
        console.log(123456)
    },

    /**
     * 生命周期函数--监听页面显示
     */

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