import Axios from '../../utils/request/index';
const app = getApp()
import { BASE_IMG_PATH } from './../../utils/request/config';
// pages/salaryExamine/index.js
let timer = null;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navH: 0,
        num: 0,
        state: 0,
        loanApplyId: 0,
        BASE_IMG_PATH: BASE_IMG_PATH
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            loanApplyId: options.loanApplyId
        })
        this.setData({
            navH: app.globalData.navHeight
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
        this.handleRequestState();
        timer = setInterval(() => {
            this.handleRequestState();
        }, 2000);
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
        wx.checkSession({
            success() {
                console.log(99)
                //session_key 未过期，并且在本生命周期一直有效
            },
            fail() {
                // session_key 已经失效，需要重新执行登录流程
                wx.login() //重新登录
            }
        })
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

    },
    handleRequestState: function () {
        let user = wx.getStorageSync('user');
        let params = {
            loanApplyId: this.data.loanApplyId,
            token: user.token,
            userId: user.id
        }
        Axios('loan/refreshLoanApplyState', 'POST', params).then((res) => {
            if (res.code === '0') {
                let state = res.data.state;
                if (state === 0 || state === '0') {

                } else if (state === 1 || state === '1') {
                    clearInterval(timer);
                } else if (state === 2 || state === '2') {
                    clearInterval(timer);
                        wx.navigateTo({
                            url: '/pages/serviceCharge/index?state=1'
                        });
                } else if (state === 3 || state === '3') {
                    clearInterval(timer);
                }
                this.setData({
                    state: state
                });
            }
        }).catch((err) => {
            clearInterval(timer);
        });
    },
    handleBackClick: function () {
        clearInterval(timer);
        wx.navigateBack({
            delta: 1
        })
    }
})