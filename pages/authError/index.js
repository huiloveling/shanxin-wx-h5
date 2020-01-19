const app = getApp();
import { BASE_IMG_PATH } from './../../utils/request/config';

Page({
    data: {
        navH: 0,
        BASE_IMG_PATH: BASE_IMG_PATH
    },
    onLoad: function (options) {
        if (options.state === '1' || options.state === '2') {
            this.setData({
                title: '周薪'
            });
        } else {
            this.setData({
                title: '身份证认证',
            });
        }
        this.setData({
            navH: app.globalData.navHeight,
            state: options.state
        })
    },
    handleNavigateTo: function() {
        wx.switchTab({
            url: '/pages/clockIn/index'
        })
    }
})