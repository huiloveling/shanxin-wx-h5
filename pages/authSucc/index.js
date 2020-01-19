const app = getApp();
import { BASE_IMG_PATH } from './../../utils/request/config';

Page({
    data: {
        navH: 0,
        BASE_IMG_PATH: BASE_IMG_PATH
    },
    onLoad: function() {
        this.setData({
            navH: app.globalData.navHeight
        })

    },
    handleNavigateTo: function() {
        // wx.navigateTo({
        //     url: '/pages/faceDiscern/index'
        // })
        wx.navigateTo({
            url: '/pages/message/index'
        });
        // wx.navigateTo({
        //     url: '/pages/message/index'
        // });
    }
})