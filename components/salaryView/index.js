import Axios from '../../utils/request/index';
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        state: {
            type: Number,
            value: 1
        },
        msg: {
            type: String,
            value: ''
        },
        feeState: {
            type: Number,
            value: 1
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

    },
    attached: function() {
        let feeState = this.properties.feeState;
        console.log(feeState)
    },
    ready: function() {

    },
    /**
     * 组件的方法列表
     */
    methods: {
        handleToClockin: function() {
            wx.navigateTo({
                url: '/pages/clockExplain/index'
            });
        },
        handleToBank: function() {
            wx.navigateTo({
                url: '/pages/bankCard/index'
            });
        },
        handleChangeClick: function() {
            let state = this.properties.state;
            let feeState = this.properties.feeState;
            if (state === 4 || state === 5 || state === 2 || state === 7 || feeState === 2) {
                wx.switchTab({
                    url: '/pages/clockIn/index'
                });
            } else if (state === 1) {
                wx.navigateTo({
                    url: '/pages/bankList/index'
                });
            }
        },
        handlePayFee: function() {
            wx.switchTab({
                url: '/pages/clockIn/index'
            });
            return

            // 交服务费
            let user = wx.getStorageSync('user');
            let params = {
                userId: user.id,
                token: user.token,
            }
            Axios('fee/getWaitFeeLoanApply', 'POST', params).then((res) => {
                if (res.code === '0') {
                    wx.setStorage({
                        key: "loanApplyId",
                        data: res.data.loanApplyId
                    });
                    wx.navigateTo({
                        url: '/pages/serviceCharge/index'
                    });
                } else {

                }
            }).catch((err) => {

            });
        },
        handleNavigateTo: function() {
            let user = wx.getStorageSync('user');
            let params = {
                userId: user.id,
                token: user.token
            }
            Axios('repay/totalRepay', 'POST', params).then((res) => {
                if (res.code === '0') {
                    wx.navigateTo({
                        url: '/pages/salaryBill/index'
                    });
                } else {
                    wx.navigateTo({
                        url: '/pages/historySalaryBill/index'
                    });
                }
            }).catch((err) => {

            });
        }
    }
})