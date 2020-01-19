const app = getApp()
import Axios from '../../utils/request/index.js';
import { BASE_IMG_PATH } from './../../utils/request/config';
// pages/faceDiscern/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navH: 0,
        isFace: true,
        faceImg: 'https://line.mimidai.com/static/img/shanxin/images/face-1.png',
        BASE_IMG_PATH: BASE_IMG_PATH
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            navH: app.globalData.navHeight
        })
    },
    uploadFaceImg: function() {
        this.chooseImage((data, path) => {
            var user = wx.getStorageSync('user');
            let params = {
                image: data,
                userId: user.id,
                token: user.token
            }
            wx.showLoading({
                mask: true,
                title: '上传中...',
            });
            Axios('user/auth/uploadCompleted', 'POST', params).then((res) => {
                if (res.code === '0') {
                    wx.hideLoading();
                    this.setData({
                        isFace: false,
                        faceImg: path
                    })
                } else {
                    wx.hideLoading();
                    // wx.showToast({
                    //     title: res.msg,
                    //     icon: 'none',
                    //     duration: 2000
                    // });
                    // this.setData({
                    //     isFace: true,
                    // })
                    this.setData({
                        isFace: false,
                        faceImg: path
                    })
                }
            }).catch((err) => {
                wx.hideLoading();
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 2000
                })
                this.setData({
                    isFace: true,
                })
            });
        })
    },
    chooseImage: function(callback) {
        let _this = this;
        const ctx = wx.createCanvasContext('myCanvas');
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                if (res.tempFilePaths) {
                    ctx.drawImage(res.tempFilePaths[0], 0, 0, 150, 150);
                    ctx.draw(true);
                    _this.prodImageOpt((data) => {
                        callback(data, res.tempFilePaths[0]);
                    });
                    // _this.transformImageBase64(res.tempFilePaths, (data) => {
                    //     callback(data);
                    // });
                }
            }
        })
    },
    transformImageBase64: function(tempFilePaths, callback) {
        let FSM = wx.getFileSystemManager();
        let base64Path = 'data:image/jpeg;base64,';
        FSM.readFile({
            filePath: tempFilePaths,
            encoding: 'base64',
            success: function(data) {
                callback(data.data);
            }
        });
    },
    prodImageOpt: function (callback) {
        let _this = this;
        setTimeout(() => {
            wx.canvasToTempFilePath({
                canvasId: 'myCanvas',
                success: function (res) {
                    _this.transformImageBase64(res.tempFilePath, (data) => {
                        callback(data);
                    });
                },
                fail: function (err) {
                    console.log(err)
                }
            })
        }, 2000);
    },
    handleNavigateTo: function() {
        wx.navigateTo({
            url: '/pages/message/index'
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