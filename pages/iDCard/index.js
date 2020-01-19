const app = getApp()

import Axios from '../../utils/request/index.js';
import { BASE_IMG_PATH } from './../../utils/request/config';

let timeId = null;

let dpositiveCardata = {};

// pages/iDCard/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navH: 0,
        positiveCard: true,
        reverseCard: true,
        showModal: false,
        showModalStatus: false,
        timer: 3,
        dpositiveCardata: {
            name: '',
            idcard: '',
            validDate: '',
            isUsedBy: ''
        },
        BASE_IMG_PATH: BASE_IMG_PATH
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.queryAttenDanceScope();
        this.setData({
            navH: app.globalData.navHeight
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
        console.log(99);
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
    queryAttenDanceScope: function() {
        let user = wx.getStorageSync('user');
        let params = {
            userId: user.id,
            token: user.token
        }
        Axios('user/auth/queryUserAuthState', 'POST', params).then((res) => {
            if (res.code === '0') {
                let data = res.data;
                let identityState = data.identityState;
                if (identityState === '0') return;
                if (identityState === '4') {
                    dpositiveCardata.name = data.name;
                    dpositiveCardata.idcard = data.idcard;
                    this.setData({
                        positiveCard: false,
                        idcardFrontImg: data.idcardFrontUrl
                    });
                } else if (identityState === '5') {
                    dpositiveCardata.name = data.name;
                    dpositiveCardata.idcard = data.idcard;
                    dpositiveCardata.validDate = data.validDate;
                    dpositiveCardata.isUsedBy = data.isUsedBy;
                    this.setData({
                        positiveCard: false,
                        reverseCard: false,
                        idcardFrontImg: data.idcardFrontUrl,
                        idcardBackImg: data.idcardBackUrl
                    });
                } else if (identityState === '3') {
                    wx.switchTab({
                        url: '/pages/clockIn/index'
                    })
                }
                this.setData({
                    dpositiveCardata: dpositiveCardata,
                });
            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 4000
                });
            }
        }).catch((err) => {
            wx.showToast({
                title: '网络错误',
                icon: 'none',
                duration: 4000
            });
        });
    },
    uploadPositiveCardImg: function() {
        this.chooseImage((data) => {
            var userId = wx.getStorageSync('user').id;
            var formId = wx.getStorageSync('formId');
            let params = {
                image: data,
                userId: userId,
                formId: formId
            }
            wx.showLoading({
                mask: true,
                title: '上传中...',
            })
            Axios('user/auth/idcardAuthentication', 'POST', params).then((res) => {
                if (res.code === '0') {
                    let identityState = res.data.identityState;
                    if (identityState === 3 || identityState === '3') {
                        wx.navigateTo({
                            url: '/pages/authError/index?state=3'
                        });
                        return;
                    } else {
                        let retry = res.data.retry || 0;
                        if (retry !== 1 && retry !== 2 && retry !== '1' && retry !== '2') {
                            let data = res.data.idcardFront;
                            dpositiveCardata.name = data.name;
                            dpositiveCardata.idcard = data.idcardNo;
                            this.setData({
                                dpositiveCardata: dpositiveCardata,
                                positiveCard: false,
                                idcardFrontImg: data.photoUrl
                            });
                            wx.hideLoading();
                        } else {
                            wx.showToast({
                                title: res.msg,
                                icon: 'none',
                                duration: 4000
                            });
                        }
                    }
                } else {
                    wx.hideLoading();
                    wx.showToast({
                        title: res.msg,
                        icon: 'none',
                        duration: 4000
                    });
                }
            }).catch((err) => {
                wx.hideLoading();
                wx.showToast({
                    title: '上传失败',
                    icon: 'none',
                    duration: 4000
                });
            });
        });
    },
    uploadReverseCardImg: function() {
        if (this.data.positiveCard) {
            return;
        }
        this.chooseImage((data) => {
            var userId = wx.getStorageSync('user').id;
            var formId = wx.getStorageSync('formId');
            let params = {
                image: data,
                userId: userId,
                formId: formId
            }
            wx.showLoading({
                mask: true,
                title: '上传中...',
            })
            Axios('user/auth/idcardAuthentication', 'POST', params).then((res) => {
                if (res.code === '0') {
                    let identityState = res.data.identityState;
                    if (identityState === 3 || identityState === '3') {
                        wx.navigateTo({
                            url: '/pages/authError/index?state=3'
                        });
                        return;
                    } else {
                        let retry = res.data.retry || 0;
                        if (retry !== 1 && retry !== 2 && retry !== '1' && retry !== '2') {
                            let data = res.data.idcardBack;
                            let validDateEnd = data.validDateEnd;
                            let validDateStart = data.validDateStart;
                            data.data = validDateStart + '-' + validDateEnd;
                            dpositiveCardata.isUsedBy = data.issuedBy;
                            dpositiveCardata.validDate = data.data;
                            this.setData({
                                dpositiveCardata: dpositiveCardata,
                                reverseCard: false,
                                idcardBackImg: data.photoUrl
                            });
                            wx.hideLoading();
                        } else {
                            wx.hideLoading();
                            wx.showToast({
                                title: res.msg,
                                icon: 'none',
                                duration: 4000
                            });
                        }
                    }
                    
                } else {
                    wx.hideLoading();
                    wx.showToast({
                        title: res.msg,
                        icon: 'none',
                        duration: 4000
                    });
                }
            }).catch((err) => {
                wx.hideLoading();
                wx.showToast({
                    title: '上传失败',
                    icon: 'none',
                    duration: 4000
                });
            });
        });
    },
    transformImageBase64: function(tempFilePaths, callback) {
        let FSM = wx.getFileSystemManager();
        let base64Path = 'data:image/jpeg;base64,';
        FSM.readFile({
            filePath: tempFilePaths[0],
            encoding: 'base64',
            success: function(data) {
                callback(data.data);
            }
        });
    },
    chooseImage: function(callback) {
        let _this = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                if (res.tempFilePaths) {
                    _this.transformImageBase64(res.tempFilePaths, (data) => {
                        callback(data);
                    });
                }
            }
        })
    },
    powerDrawer: function(e) {
        let currentStatu = e.currentTarget.dataset.statu;
        this.util(currentStatu)
        if (currentStatu === 'close') return;
        let timer = this.data.timer;
        timeId = setInterval(() => {
            if (timer === 0) {
                clearInterval(timeId);
            }
            this.setData({
                timer: timer--
            });
        }, 1000);
    },
    handleSalarySystemUser: function() {
        let user = wx.getStorageSync('user');
        let params = {
            userId: user.id,
            token: user.token
        }
        this.setData({
            showModalStatus: false
        });
        wx.showLoading({
            mask: true,
            title: '上传中...',
        });
        Axios('user/queryIsPaySalarySystemUser', 'POST', params).then((res) => {
            if (res.code === '0') {
                if (res.data) {
                    if (res.data.flag === '1') {
                        wx.navigateTo({
                            url: '/pages/authSucc/index'
                        });
                    } else {
                        wx.navigateTo({
                            url: '/pages/authError/index'
                        });
                    }
                }
            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 4000
                });
            }
            wx.hideLoading();
        }).catch((err) => {
            wx.hideLoading();
            wx.showToast({
                title: '网络错误',
                icon: 'none',
                duration: 4000
            });
        });
    },
    util: function(currentStatu) {
        /* 动画部分 */
        // 第1步：创建动画实例 
        var animation = wx.createAnimation({
            duration: 200, //动画时长
            timingFunction: "linear", //线性
            delay: 0 //0则不延迟
        });

        // 第2步：这个动画实例赋给当前的动画实例
        this.animation = animation;

        // 第3步：执行第一组动画：Y轴偏移240px后(盒子高度是240px)，停
        animation.translateY(240).step();

        // 第4步：导出动画对象赋给数据对象储存
        this.setData({
            animationData: animation.export()
        })

        // 第5步：设置定时器到指定时候后，执行第二组动画
        setTimeout(function() {
            // 执行第二组动画：Y轴不偏移，停
            animation.translateY(0).step()
            // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
            this.setData({
                animationData: animation
            })

            //关闭抽屉
            if (currentStatu == "close") {
                clearInterval(timeId);
                this.setData({
                    showModalStatus: false,
                    timer: 3
                }, () => {
                    
                });
            }
        }.bind(this), 200)

        // 显示抽屉
        if (currentStatu == "open") {
            this.setData({
                showModalStatus: true
            });
        }
    }
})