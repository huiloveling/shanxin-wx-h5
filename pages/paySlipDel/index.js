// pages/noticeList/index.js
const app = getApp()
function _objToStrMap(obj) {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
        strMap.set(k, obj[k]);
    }
    return strMap;
}
function _jsonToMap(jsonStr) {
    return _objToStrMap(JSON.parse(jsonStr));
}
import Axios from '../../utils/request/index';
import { BASE_IMG_PATH } from './../../utils/request/config';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        state: false,
        vanLoading: true,
        BASE_IMG_PATH: BASE_IMG_PATH
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.querySalaryDetail(options.month);
        this.setData({
            navH: app.globalData.navHeight
        });
    },
    querySalaryDetail: function (month) {
        let user = wx.getStorageSync('user');
        let params = {
            userId: user.id,
            token: user.token,
            month: month
        }
        Axios('user/querySalaryDetail', 'POST', params).then((res) => {
            if (res.code === '0') {
                let salaryPayroll = res.data.salaryPayroll;
                let fields = res.data.fields;
                let map = _jsonToMap(JSON.stringify(salaryPayroll));
                let list = [];
                for (let k = 0; k < fields.length; k++) {
                    if (map.get(fields[k]) !== null) {
                        list.push({
                            key: fields[k],
                            value: map.get(fields[k])
                        });
                    }
                }
                // for (let key in salaryPayroll) {
                //     list.push({
                //         key: key,
                //         value: salaryPayroll[key]
                //     })
                // }
                this.setData({
                    list: list
                });
            } else {
                this.setData({
                    state: true
                })
            }
            this.setData({
                vanLoading: false
            });
        }).catch((err) => {
            this.setData({
                vanLoading: false
            });
        });
    },
    handleBackClick: function () {
        wx.navigateBack({
            delta: 1
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})