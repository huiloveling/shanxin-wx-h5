const app = getApp()
import Axios from '../../utils/request/index';
const util = require('../../utils/util');
import { accAdd } from '../../utils/calculationPrice';
import { BASE_IMG_PATH } from './../../utils/request/config';
// pages/serviceCharge/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navH: 0,
        list: ['a', 'b', 'c'],
        result: ['a', 'b'],
        repayList: [{
                money: 100,
                day: '20191009',
            },
            {
                money: 200,
                day: '20191009'
            },
            {
                money: 300,
                day: '20191009'
            }
        ],
        BASE_IMG_PATH: BASE_IMG_PATH
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            navH: app.globalData.navHeight
        });
        this.totalRepay();
    },
    handleCheckboxChange(event) {
        this.setData({
            result: event.detail
        });
    },
    handleBackClick: function() {
        wx.navigateBack({
            delta: 1
        });
    },
    totalRepay: function() {
        let data = wx.getStorageSync('repayList');
        let repayList = data.repayList;
        for (let i = 0; i < repayList.length; i++) {
            repayList[i].color = true;
            repayList[i].applyTime = util.formatDate(repayList[i].applyTime);
        }
        this.setData({
            repayList: repayList,
            totalAmount: data.totalAmount,
            planDate: data.planDate,
            totalFee: data.totalFee,
            overdue: data.overdue
        });
    },
    handleSelectClick: function(e) {
        let index = e.currentTarget.dataset.index;
        let repayList = this.data.repayList;
        if (index === repayList.length - 1) {
            if (repayList.length > 0) {
                if (repayList[index].color === true && repayList[index - 1].color === true) {
                    repayList[index].color = false;
                } else if (repayList[index].color === false && repayList[index - 1].color === true) {
                    repayList[index].color = true;
                }
            }
        } else if (index === 0) {
            if (repayList.length > 0) {
                if (repayList[index].color === true && repayList[index + 1].color === false) {
                    // repayList[index].color = false;
                } else if (repayList[index].color === false && repayList[index + 1].color === false) {
                    repayList[index].color = true;
                }
            }
        } else if (repayList[index].color === true && repayList[index - 1].color === true && repayList[index + 1].color === false) {
            repayList[index].color = false;
        } else if (repayList[index].color === false && repayList[index - 1].color === true && repayList[index + 1].color === false) {
            repayList[index].color = true;
        }
        console.log(repayList)
        let repayTotal = 0;
        let totalFee = 0;
        for (let i = 0; i < repayList.length; i++) {
            if (repayList[i].color) {
                // repayTotal += repayList[i].repayTotal;
                // totalFee += repayList[i].feeMoney;
                repayTotal = accAdd(repayList[i].repayTotal, repayTotal);
                totalFee = accAdd(repayList[i].feeMoney, totalFee);
            }
        }
        repayTotal = accAdd(totalFee, repayTotal);
        this.setData({
            repayList: repayList,
            totalAmount: repayTotal,
            totalFee: totalFee
        });
    },
    handlePay: function() {
        let data = [];
        for (let i = 0; i < this.data.repayList.length; i++) {
            if (this.data.repayList[i].color) {
                data.push(this.data.repayList[i]);
            }
        }
        if (data.length === 0) {
            wx.showToast({
                title: '选择还款金额',
                icon: 'none',
                duration: 2000
            })
        }
        let repayList = {
            repayList: data,
            totalAmount: this.data.totalAmount,
            totalFee: this.data.totalFee,
            overdue: this.data.overdue
        }
        console.log(repayList)
        wx.navigateTo({
            url: '/pages/repayment/index?repayList=' + JSON.stringify(repayList)
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