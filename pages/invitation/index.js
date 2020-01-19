Page({
    onShareAppMessage: function (ops) {
        if (ops.from === 'button') {
            // 来自页面内转发按钮
            console.log(ops.target)
        }
        return {
            title: '快薪宝',
            path: 'pages/index/index',  // 路径，传递参数到指定页面。
            imageUrl: 'http://seopic.699pic.com/photo/50041/3216.jpg_wh1200.jpg', // 分享的封面图
            success: function (res) {
                // 转发成功
                console.log("转发成功:" + JSON.stringify(res));
            },
            fail: function (res) {
                // 转发失败
                console.log("转发失败:" + JSON.stringify(res));
            }
        }

    },
    data: {
    },
    onLoad: function () {

    }
})