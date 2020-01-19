const app = getApp()

var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;

Page({
    toSetting() {
        wx.openSetting({
            success(res) {
                console.log(res.authSetting)
                if (res.authSetting["scope.userLocation"]) {
                    // res.authSetting["scope.userLocation"]为trueb表示用户已同意获得定位信息，此时调用getlocation可以拿到信息
                    wx.getLocation({
                        type: 'wgs84',
                        success(res) {
                            console.log(res)
                            const latitude = res.latitude
                            const longitude = res.longitude
                            const speed = res.speed
                            const accuracy = res.accuracy
                        }
                    })
                }
            }
        })
    },
    getLocation: (qqmapsdk) => {
        wx.getLocation({
            success: function(res) {
                // 调用sdk接口
                qqmapsdk.reverseGeocoder({
                    location: {
                        latitude: res.latitude,
                        longitude: res.longitude
                    },
                    success: function(res) {
                        //获取当前地址成功
                        let address = res.result.address_component;
                        wx.showModal({
                            title: '当前地址',
                            content: address.nation + address.province + address.city + address.district + address.street + address.street_number,
                            success(res) {
                                if (res.confirm) {
                                    console.log('用户点击确定')
                                } else if (res.cancel) {
                                    console.log('用户点击取消')
                                }
                            }
                        })
                    },
                    fail: function(res) {
                        console.log('获取当前地址失败');
                    }
                });
            },
        })
    },
    data: {
        navH: 0
    },
    onLoad: function() {
        this.getLocation(new QQMapWX({
            key: 'BQ2BZ-UBH34-K52U6-DYQGJ-BCXB5-ZJBJY'
        }));
        this.setData({
            navH: app.globalData.navHeight
        })

    }
})