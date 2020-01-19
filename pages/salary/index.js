const app = getApp()
import Axios from '../../utils/request/index';
import {
    BASE_IMG_PATH
} from './../../utils/request/config';

Page({
    data: {
        navH: app.globalData.navHeight,
        salaryViewShow: false,
        msg: '',
        resultCode: 0,
        state: false,
        data: '',
        BASE_IMG_PATH: BASE_IMG_PATH
    },
    onHide: function() {
        this.setData({
            salaryViewShow: false,
            msg: '',
            resultCode: 0,
            state: false,
            data: ''
        });
    },
    onShow: function() {
        let wxPhone = wx.getStorageSync('wxPhone');
        let isLogin = wx.getStorageSync('isLogin');
        if (isLogin) {
            if (wxPhone) {
                wx.switchTab({
                    url: '/pages/clockIn/index'
                });
            } else {
                this.initWeek();
            }
        } else {
            wx.navigateTo({
                url: '/pages/noAuthentication/index?state=3'
            });
        }
    },
    initWeek: function() {
        let user = wx.getStorageSync('user');
        let params = {
            token: user.token,
            userId: user.id
        }
        Axios('loan/week', 'POST', params).then((res) => {
            if (res.code === '0') {
                let data = res.data;
                if (data) {
                    wx.setStorage({
                        key: "week",
                        data: data
                    });
                    let resultCode = data.resultCode;
                    let repayState = data.repayState;
                    if (resultCode === 3 || resultCode === '3') {
                        resultCode = 6
                        this.setData({
                            msg: ' 您好，很抱歉，您已经领过周薪，请下个周期再来领取',
                            resultCode: resultCode,
                            state: true
                        });
                        return
                    }
                    if (resultCode === 0 || resultCode === '0') {
                        wx.getWeRunData({
                            success(res) {}
                        });
                        this.setData({
                            salaryViewShow: true,
                            data: res.data,
                            state: true
                        });
                    } else if (resultCode === 3 || resultCode === '3') {
                        wx.navigateTo({
                            url: '/pages/salaryBill/index'
                        });
                    } else if (resultCode === 2 || resultCode === '2') {
                        if (repayState === 1 || repayState === '1') {
                            this.setData({ feeState: 1 });
                        } else {
                            this.setData({ feeState: 0 });
                        }
                        this.setData({
                            msg: res.data.message,
                            resultCode: resultCode,
                            state: true
                        });
                    } else if (resultCode === 8 || resultCode === '8') {
                        this.setData({
                            msg: '银行卡未绑定，请绑卡。',
                            resultCode: resultCode,
                            state: true
                        });
                    } else if (resultCode === 10 || resultCode === '10') {
                        this.setData({
                            msg: res.data.message,
                            resultCode: resultCode,
                            state: true
                        });
                    } else if (resultCode === 6 || resultCode === '6') {
                        if (res.data.feeState === 1) {
                            this.setData({ feeState: 0 });
                        } else {
                            if (repayState === 1 || repayState === '1') {
                                this.setData({ feeState: 1 });
                            } else {
                                // 去打卡
                                this.setData({ feeState: 2 });
                            }
                        }
                        this.setData({
                            msg: res.data.message,
                            resultCode: resultCode,
                            state: true
                        });
                    } else if (resultCode === 9 || resultCode === '9') {
                        wx.navigateTo({
                            url: '/pages/noAuthentication/index'
                        });
                    } else {
                        this.setData({
                            msg: res.data.message,
                            resultCode: resultCode,
                            state: true
                        });
                    }
                }
            } else {
                let url = '';
                let userType = wx.getStorageSync('user').userType;
                if (userType === 0) url = '/pages/authError/index?state=1';
                else url = '/pages/authError/index?state=2';
                wx.navigateTo({ url });
            }
        }).catch((err) => {
            this.setData({
                salaryViewShow: true,
                state: true
            });
        });
    }
})