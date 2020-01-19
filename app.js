App({
    onLaunch: function() {
        wx.getSystemInfo({
            success: res => {
                this.globalData.navHeight = res.statusBarHeight + 46;
            }, fail(err) {
                
            }
        })
        wx.getSetting({
            success(res) {
                if (res.authSetting['scope.userInfo']) {
                    
                } else {
                    wx.setStorage({
                        key: "isLogin",
                        data: false
                    });
                }
            }
        })
    },
    globalData: {
        navHeight: 0,
        usercode: '',
        isLogin: false
    }
})