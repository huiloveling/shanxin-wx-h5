const app = getApp()
import { BASE_IMG_PATH } from './../../utils/request/config';
import util from './../../utils/util';
Page({
    data: {
        BASE_IMG_PATH: BASE_IMG_PATH,
        viewlist: [
            {
                imgurl: `${BASE_IMG_PATH}bank-icon-s.png`,
                title: '银行卡信息',
                icon: `${BASE_IMG_PATH}right-icon.png`,
                nextPath: 'bankInfo'
            },
            {
                imgurl: `${BASE_IMG_PATH}jj-icon.png`,
                title: '紧急联系人',
                icon: `${BASE_IMG_PATH}right-icon.png`,
                nextPath: 'contacts'
            },
            {
                imgurl: `${BASE_IMG_PATH}gs-icon.png`,
                title: '我的公司信息',
                icon: `${BASE_IMG_PATH}right-icon.png`,
                nextPath: 'company'
            }
        ]
    },
    onLoad: function () {
        this.setData({
            navH: app.globalData.navHeight
        });
    },
    handleNavigateTo: util.throttle(function (e) {
        let url = `/pages/${e.currentTarget.dataset.url}/index`;
        wx.navigateTo({ url });
    }, 1000),
    handleBackClick: function () {
        wx.navigateBack({ delta: 1 });
    }
})