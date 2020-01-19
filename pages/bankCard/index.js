const app = getApp()

import Axios from '../../utils/request/index';
import { BASE_IMG_PATH } from './../../utils/request/config';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navH: 0,
        checked: true,
        sendStatus: false,
        sendTime: 60,
        user_phone: '',
        smscode: '',
        bankData: {},
        confirmBindCard: {},
        BASE_IMG_PATH: BASE_IMG_PATH
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            navH: app.globalData.navHeight
        });
        this.getUserBank();
    },
    handleToBankcardAgreement: function() {
        wx.navigateTo({
            url: '/pages/tpl/index?url=webview/bankcardAgreement'
        })
    },
    onChange(event) {
        this.setData({
            checked: event.detail
        });
    },
    handleBackClick: function () {
        wx.navigateBack({
            delta: 1
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

    },
    formSubmit: function (e) {
        wx.setStorageSync('formId', e.detail.formId);
    },
    getUserBank: function() {
        let user = wx.getStorageSync('user');
        let params = {
            userId: user.id,
            token: user.token
        }
        Axios('user/companyInfo', 'POST', params).then((res) => {
            if (res.code === '0') {
                let data = res.data;
                this.setData({
                    bankData: data
                });
                wx.setStorage({
                    key: "bankData",
                    data: data
                })
            } else {

            }
        }).catch((err) => {

        })
    },
    handleInpueChange: function(e) {
        this.setData({
            user_phone: e.detail.value
        });
    },
    handleInpueChangemm: function(e) {
        console.log(e.detail.value)
        this.setData({
            smsCode: e.detail.value
        });
    },
    preBindCard: function() {
        let user = wx.getStorageSync('user');
        let bankData = this.data.bankData;
        let smsCode = this.data.smscode;
        let params = {
            accountName: bankData.name,
            bankCard: bankData.bankCard,
            idCard: bankData.idcard,
            mobile: this.data.user_phone,
            userId: user.id,
            token: user.token,
            transChannel: '01'   
        }
        Axios('user/bindCard/jdAgreementSign', 'POST', params).then((res) => {
            if (res.code === '0') {
                let data = res.data
                this.setData({
                    txt: JSON.stringify(data)
                })
                this.setData({
                    sendStatus: true,
                    sendTime: 60,
                    confirmBindCard: data
                }, () => {
                    this.computeSendTime();
                });
            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 2000
                });
            }
        }).catch((err) => {

        });
    },
    handleConfirmBindCard: function() {
        let checked = this.data.checked;
        if (!checked) {
            wx.showToast({
                title: '请确认绑卡协议',
                icon: 'none',
                duration: 2000
            });
            return;
        }
        let user = wx.getStorageSync('user');
        let formId = wx.getStorageSync('formId');
        let bankData = this.data.bankData;
        let confirmBindCard = this.data.confirmBindCard;
        let mobile = this.data.user_phone;
        let smsCode = this.data.smsCode
        let params = {
            bankCard: bankData.bankCard,
            contractNum: confirmBindCard.contractNum,
            mobile: mobile,
            transChannel: '01',
            userBankId: confirmBindCard.userBankId,
            userId: user.id,
            token: user.token,
            smsCode: smsCode,
            formId: formId,
            outTradeNo: confirmBindCard.outTradeNo
        }
        Axios('user/bindCard/jdAgreementSignConfirm', 'POST', params).then((res) => {
            if (res.code === '0') {
                wx.switchTab({
                    url: '/pages/salary/index'
                });
            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 2000
                });
            }
        }).catch((err) => {
            wx.showToast({
                title: '网络错误',
                icon: 'none',
                duration: 2000
            });
        });
    },
    computeSendTime: function() {
        if (this.data.sendStatus) {
            if (this.data.sendTime === 0) {
                console.log(9999)
                this.setData({
                    sendStatus: false
                })
            } else {
                let sendTime = this.data.sendTime;
                this.setData({
                    sendTime: sendTime - 1
                });
                console.log(this.data.sendTime)
                setTimeout(() => {
                    this.computeSendTime();
                }, 1000);
            }
        }
    }
})