const app = getApp()
import Axios from '../../utils/request/index.js';
import { BASE_IMG_PATH } from './../../utils/request/config';
let nameReg = /^[\u4E00-\u9FA5]{2,4}$/;
let phoneReg = /^[1][2,3,4,5,6,7,8,9][0-9]{9}$/;

Page({
    data: {
        navH: 0,
        showModalStatus: false,
        workmate: false,
        selectArray: [],
        inputBottom: 0,
        showModal: false,
        friendState: false, // 朋友状态
        relativeState: false, // 亲友状态
        friendName: '',
        friendPhone: '',
        friendInputName: '',
        friendInputPhone: '',
        defaultText: '请选择',
        relativeRelation: '',
        relativeName: '',
        relativeInputName: '',
        relativePhone: '',
        relativeInputPhone: '',
        show: true,
        BASE_IMG_PATH: BASE_IMG_PATH
    },
    onLoad: function() {
        this.setData({
            navH: app.globalData.navHeight
        })
        this.get_companyInfo();
        this.get_userContacts();
        this.getContactsRelations();
    },
    handleBackClick: function () {
        wx.switchTab({
            url: '/pages/clockIn/index'
        })
    },
    // 获取联系人关系列表
    getContactsRelations: function() {
        let user = wx.getStorageSync('user');
        let params = {
            userId: user.id,
            token: user.token
        }
        Axios('user/getContactsRelations', 'POST', params).then((res) => {
            if (res.code === '0') {
                let list = res.data.list;
                list.splice(0, 1);
                this.setData({
                    selectArray: list
                });
            } else {

            }
        }).catch((err) => {

        });
    },
    get_companyInfo: function() {
        let user = wx.getStorageSync('user');
        let params = {
            userId: user.id,
            token: user.token
        }
        Axios('user/companyInfo', 'POST', params).then((res) => {
            if (res.code === '0') {
                let data = res.data;
                this.setData({
                    companyName: data.companyName,
                    address: data.address,
                    workJobs: data.workJobs,
                    paySalaryDate: data.paySalaryDate,
                    jobSalary: data.jobSalary
                });
            } else {

            }
        }).catch((err) => {

        });
    },
    formSubmit: function (e) {
        wx.setStorageSync('formId', e.detail.formId);
    },
    // 保存信息
    handleSaveUserContacts: function() {
        let user = wx.getStorageSync('user');
        let formId = wx.getStorageSync('formId');
        let friendInputName = this.data.friendInputName;
        let friendInputPhone = this.data.friendInputPhone;
        let relativeInputName = this.data.relativeInputName;
        let relativeInputPhone = this.data.relativeInputPhone;
        let contactsJsons = [];
        contactsJsons.push({
            name: friendInputName,
            phone: friendInputPhone,
            relation: 1
        }, {
            name: relativeInputName,
            phone: relativeInputPhone,
            relation: this.data.relation
        });
        let params = {
            userId: user.id,
            token: user.token,
            contactsJsons: JSON.stringify(contactsJsons),
            isNeedCheck: 0,
            formId: formId
        }
        Axios('user/saveUserContacts', 'POST', params).then((res) => {
            if (res.code === '0') {
                wx.switchTab({
                    url: '/pages/clockIn/index'
                })
            } else {

            }
        }).catch((err) => {

        });
    },
    get_userContacts: function() {
        let user = wx.getStorageSync('user');
        let params = {
            userId: user.id,
            token: user.token
        }
        Axios('user/userContacts', 'POST', params).then((res) => {

        }).catch((err) => {

        });
    },
    powerDrawer: function(e) {
        let currentStatu = e.currentTarget.dataset.statu;
        let currentFriend = e.currentTarget.dataset.friend;
        this.util(currentStatu, currentFriend)
    },
    util: function(currentStatu, currentFriend) {
        /* 动画部分 */
        // 第1步：创建动画实例 
        var animation = wx.createAnimation({
            duration: 200, //动画时长
            timingFunction: "linear", //线性
            delay: 0 //0则不延迟
        });

        // 第2步：这个动画实例赋给当前的动画实例
        this.animation = animation;

        // 第3步：执行第一组动画：Y轴偏移240px后(盒子高度是240px)，停
        animation.translateY(240).step();

        // 第4步：导出动画对象赋给数据对象储存
        this.setData({
            animationData: animation.export()
        })

        // 第5步：设置定时器到指定时候后，执行第二组动画
        setTimeout(function() {
            // 执行第二组动画：Y轴不偏移，停
            animation.translateY(0).step()
            // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
            this.setData({
                animationData: animation
            })

            //关闭抽屉
            if (currentStatu == "close") {
                this.setData({
                    showModalStatus: false
                });
            }
        }.bind(this), 200)

        // 显示抽屉
        if (currentStatu == "open") {
            if (currentFriend == 'friend') {
                this.setData({
                    showModalStatus: true,
                    workmate: true
                })
            } else if (currentFriend == 'relative') {
                this.setData({
                    showModalStatus: true,
                    workmate: false
                })
            }
        }
    },
    selectChange: function(e) {
        this.setData({
            defaultText: e.detail.name,
            relation: e.detail.code
        })
    },
    foucus: function(e) {
        this.setData({
            inputBottom: 260
        });
    },
    blur: function(e) {
        this.setData({
            inputBottom: 0
        });
    },
    handleInpueChange: function(e) {
        let valName = e.currentTarget.dataset['contacts'];
        this.setData({
            [valName]: e.detail.value
        });
    },
    // 保存工友信息
    drawer_save_friend: function(e) {
        let friendName = this.data.friendInputName;
        let friendPhone = this.data.friendInputPhone;
        let currentStatu = e.currentTarget.dataset.statu;
        let currentFriend = e.currentTarget.dataset.friend;
        if (!nameReg.test(friendName)) {
            wx.showToast({
                title: '姓名格式不正确！',
                icon: 'none',
                duration: 2000
            });
            return;
        }
        if (!phoneReg.test(friendPhone)) {
            wx.showToast({
                title: '手机号格式不正确！',
                icon: 'none',
                duration: 2000
            });
            return;
        }
        this.setData({
            friendState: true,
            friendName: friendName,
            friendPhone: friendPhone
        }, () => 　{
            this.util(currentStatu, currentFriend);
        });
    },
    // 保存亲友信息
    drawer_save_relative: function(e) {
        let defaultText = this.data.defaultText;
        if (defaultText == '请选择') {
            wx.showToast({
                title: '请选择联系人关系',
                icon: 'none',
                duration: 2000
            });
            return;
        }
        let currentStatu = e.currentTarget.dataset.statu;
        let currentFriend = e.currentTarget.dataset.friend;
        let relativeRelation = this.data.defaultText;
        let relativeName = this.data.relativeInputName;
        let relativePhone = this.data.relativeInputPhone;
        if (!nameReg.test(relativeName)) {
            wx.showToast({
                title: '姓名格式不正确！',
                icon: 'none',
                duration: 2000
            });
            return;
        }
        if (!phoneReg.test(relativePhone)) {
            wx.showToast({
                title: '手机号格式不正确！',
                icon: 'none',
                duration: 2000
            });
            return;
        }
        this.setData({
            relativeState: true,
            relativeRelation: relativeRelation,
            relativeName: relativeName,
            relativePhone: relativePhone
        }, () => {
            this.util(currentStatu, currentFriend)
        })
    },
    handleSaveClick: function() {
        this.setData({
            showModal: true
        });
    },
    modalConfirm: function() {
        this.setData({
            showModal: false
        });
    }
})