const app = getApp()
// pages/salaryDel/index.js
import Axios from '../../utils/request/index.js'
import { BASE_IMG_PATH } from './../../utils/request/config';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        defaultText: '请选择',
        selectArray: [],
        phone: '',
        name: '',
        relation: 0,
        BASE_IMG_PATH: BASE_IMG_PATH
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            navH: app.globalData.navHeight
        });
        this.getContactsRelations();
    },
    getContactsRelations: function () {
        var user = wx.getStorageSync('user');
        let params = {
            userId: user.id,
            token: user.token
        }
        Axios('user/getContactsRelations', 'POST', params).then((res) => {
            if (res.code === '0') {
                this.setData({
                    selectArray: res.data.list
                });
            }
        }).catch((err) => {

        });
    },
    selectChange: function(e) {
        this.setData({
            relation: e.detail.code
        });
    },
    saveUserContacts: function() {
        let { name, phone, relation } = this.data;
        if (name === '') {
            this.showToast('请输入姓名');
            return;
        }
        if (phone.length !== 11) {
            this.showToast('手机号格式不正确');
            return;
        }
        if (relation === 0) {
            this.showToast('请选择关系');
            return;
        }
        let user = wx.getStorageSync('user');
        let contactsJsons = [{
            relation: this.data.relation,
            name: this.data.name,
            phone: this.data.phone
        }];
        let params = {
            userId: user.id,
            token: user.token,
            isNeedCheck: 1,
            contactsJsons: JSON.stringify(contactsJsons)
        }
        wx.showLoading({
            title: '提交中...',
            mask: true
        });
        Axios('user/saveUserContacts', 'POST', params).then((res) => {
            if (res.code === '0') {
                this.handleBackClick();
            } else {
                this.showToast(res.msg);
            }
            wx.hideLoading();
        }).catch((err) => {
            wx.hideLoading();
        });
    },
    handleInputChange: function(e) {
        this.setData({
            [e.currentTarget.dataset.value]: e.detail.value
        });
    },
    handleBackClick: function() {
        wx.navigateBack({
            delta: 1
        });
    },
    showToast: function(title) {
        wx.showToast({
            title: title,
            icon: 'none',
            duration: 2000
        });
    }
})