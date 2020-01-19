const app = getApp()
import Axios from '../../utils/request/index';
import { BASE_IMG_PATH } from './../../utils/request/config';
import util from './../../utils/util';

Page({
    onShareAppMessage: function(ops) {
        if (ops.from === 'button') {
            // 来自页面内转发按钮
            console.log(ops.target)
        }
        return {
            title: '快薪宝',
            path: 'pages/index/index', // 路径，传递参数到指定页面。
            imageUrl: 'http://seopic.699pic.com/photo/50041/3216.jpg_wh1200.jpg', // 分享的封面图
            success: function(res) {
                // 转发成功
                console.log("转发成功:" + JSON.stringify(res));
            },
            fail: function(res) {
                // 转发失败
                console.log("转发失败:" + JSON.stringify(res));
            }
        }

    },
    data: {
        name: '',
        phone: '',
        BASE_IMG_PATH: BASE_IMG_PATH,
        navH: app.globalData.navHeight,
        viewlist: [
            {
                name: '历史周薪账单',
                icon: `${BASE_IMG_PATH}lujing.png`,
                path: 'historySalaryBill',
                img: `${BASE_IMG_PATH}zxa.png`,
                contact: false
            },
            {
                name: '公告',
                icon: `${BASE_IMG_PATH}lujing.png`,
                path: 'noticeList',
                img: `${BASE_IMG_PATH}zxa.png`,
                contact: false
            },
            {
                name: '客服',
                icon: `${BASE_IMG_PATH}lujing.png`,
                path: '',
                img: `${BASE_IMG_PATH}zxa.png`,
                contact: true
            }
        ]
    },
    onShow: function() {
        let wxPhone = wx.getStorageSync('wxPhone');
        let isLogin = wx.getStorageSync('isLogin');
        if (isLogin) {
            if (wxPhone) wx.switchTab({ url: '/pages/clockIn/index' });
            else this.getUser();
        }
        this.setData({ isLogin });
    },
    getUser: function() {
        let user = wx.getStorageSync('user');
        let params = {
            userId: user.id,
            token: user.token
        }
        Axios('user/companyInfo', 'POST', params).then((res) => {
            if (res.code === '0') {
                let { name, phone } = res.data;
                this.setData({
                    name,
                    phone
                });
            } else {
                this.showToast(res.msg);
            }
        }).catch((err) => {
            this.showToast('网络异常...');
        });
    },
    handleNavigateTo: util.throttle(function (e) {
        let path = e.currentTarget.dataset.path;
        if (path === '') return;
        let url = `/pages/${path}/index`;
        wx.navigateTo({ url });
    }, 1000),
    showToast: function(title) {
        wx.showToast({
            title,
            icon: 'none',
            duration: 2000
        });
    }
})