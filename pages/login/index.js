const app = getApp()
const util = require('../../utils/util');
import Axios from '../../utils/request/index';
import { BASE_IMG_PATH } from './../../utils/request/config';

Page({
    data: {
        navH: 0,
        checked: true,
        BASE_IMG_PATH: BASE_IMG_PATH
    },
    onLoad: function(options) {
        let isLogin = wx.getStorageSync('isLogin');
        if (isLogin) {
            wx.switchTab({
                url: '/pages/clockIn/index'
            });
        }
        this.setData({
            navH: app.globalData.navHeight
        });
    },
    handleRegeistAgreement: function () {
        wx.navigateTo({
            url: '/pages/tpl/index?url=webview/regeistAgreement'
        })
    },
    handleToNavClick: function() {
        wx.switchTab({
            url: '/pages/clockIn/index'
        });
    },
    onChange(event) {
        this.setData({
            checked: event.detail
        });
    },
    formSubmit: function (e) {
        wx.setStorageSync('formId', e.detail.formId);
    },
    bindGetUserInfo: function (data) {
        if (data.detail.errMsg === 'getUserInfo:ok') {
            wx.login({
                success: (res) => {
                    let formId = wx.getStorageSync('formId');
                    let params = {
                        encryptedData: data.detail.encryptedData,
                        iv: data.detail.iv,
                        code: res.code,
                        formId: formId
                    }
                    wx.setStorage({
                        key: "wxLoginCode",
                        data: res.code
                    });
                    Axios('user/login', 'POST', params, true).then((res) => {
                        if (res.code == '0') {
                            let wxPhone = res.data.wxPhone;
                            if (wxPhone === null || wxPhone === '' || wxPhone === undefined) {
                                wx.setStorage({
                                    key: "wxPhone",
                                    data: true
                                });
                            } else {
                                wx.setStorage({
                                    key: "wxPhone",
                                    data: false
                                });
                            }
                            wx.setStorage({
                                key: 'user',
                                data: res.data
                            });
                            wx.setStorage({
                                key: "isLogin",
                                data: true
                            });
                            wx.switchTab({
                                url: '/pages/clockIn/index'
                            });
                        } else if (res.code === '9') {
                            
                        } else {
                            wx.showToast({
                                title: res.msg,
                                icon: 'none',
                                duration: 2000
                            })
                        }
                    });
                },
            });
        } else {

        }
    },
})