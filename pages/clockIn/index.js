const app = getApp()
const util = require('../../utils/util');
import Axios from '../../utils/request/index';
import Toast from './../../dist/toast/toast';
let QQMapWX = require('../../libs/qqmap-wx-jssdk');
let amapFile = require('../../libs/amap-wx.js');
let config = require('../../libs/config.js');
import { BASE_IMG_PATH } from './../../utils/request/config';
let qqmapsdk = new QQMapWX({
    key: 'BQ2BZ-UBH34-K52U6-DYQGJ-BCXB5-ZJBJY'
    // key: 'ZEUBZ-6S6KO-YGYWF-SHN44-E5B7H-PKFHG'
});
Page({
    data: {
        navH: 0,
        calendarTitle: '',
        itemCurDay: '',
        showPopup: false,
        showPopupCard: false,
        showPopupAbnormal: false,
        showPopupSubmission: false,
        showPopupClockRecord: false,
        showPopupClockTips: false,
        showPopupClockInsufficient: false,
        workendtime: '',
        workstarttime: '',
        currentDate: '',
        currentWeekSalary: 0,
        nextWeekSalary: 0,
        up_btn: true,
        down_btn: true,
        current_day: false,
        current_day_data: {},
        current_day_data_time: '', // 打卡时间
        addressData: {
            lat: '',
            lng: '',
            address: '',
            province: '',
            city: '',
            area: ''
        },
        interval: 5000,
        duration: 1000,
        selectArray: [],
        defaultText: '请选择',
        reasonId: 0,
        articles: [],
        isCanClockMsg: '',
        BASE_IMG_PATH: BASE_IMG_PATH,

        isCanClockText: ''
    },
    onHide: function () {
        this.setData({
            showPopup: false,
            showPopupCard: false,
            showPopupAbnormal: false,
            showPopupSubmission: false,
            showPopupClockRecord: false,
            showPopupClockTips: false,
            showPopupClockInsufficient: false,
        });
    },
    onShow: function () {
        let that = this;
        let wxPhone = wx.getStorageSync('wxPhone');
        let isLogin = wx.getStorageSync('isLogin');
        if (isLogin) {
            if (wxPhone) {
                this.setData({
                    showPopup: true,
                    showPopupCard: false,
                    showPopupAbnormal: false,
                    showPopupSubmission: false,
                    showPopupClockRecord: false,
                    showPopupClockTips: false,
                    showPopupClockInsufficient: false,
                });
            } else {
                this.setData({
                    navH: app.globalData.navHeight
                });
                let arr = [];
                for (let i = 0; i < 42; i++) {
                    arr.push({});
                }
                this.showCalendar(arr);
                this.location(qqmapsdk);
            }
        } else {
            this.setData({
                navH: app.globalData.navHeight
            });
            let arr = [];
            for (let i = 0; i < 42; i++) {
                arr.push({});
            }
            this.showCalendar(arr);
        }
    },
    onLoad: function (options) {
        
    },
    getSystemInfo: function () {
        wx.getSystemInfo({
            success: function (res) {
                let user = wx.getStorageSync('user');
                let params = {
                    phoneBrand: res.brand,
                    phoneModel: res.model,
                    phoneOs: res.system,
                    resolution: res.pixelRatio,
                    userId: user.id,
                    token: user.token
                }
                Axios('user/uploadUserDevice', 'POST', params).then((res) => {

                }).catch((res) => {

                })
            }
        })
    },
    handleNewsClick: function (e) {
        let dataset = e.currentTarget.dataset;
        wx.setStorage({
            key: "webview",
            data: 'readState=' + dataset.readstate + '&id=' + dataset.id
        })
        wx.navigateTo({
            url: '/pages/tpl/index?url=webview/details'
        });
    },
    // 公告
    webviewList: function () {
        let user = wx.getStorageSync('user');
        let params = {
            userId: user.id,
            token: user.token
        }
        Axios('webview/list', 'POST', params).then((res) => {
            if (res.code === '0') {
                let articles = res.data.articles;
                let list = [];
                for (let i = 0; i < articles.length; i++) {
                    if (i < 4) {
                        list.push(articles[i]);
                    }
                }
                this.setData({
                    articles: articles
                });
            }
        }).catch((err) => {
            wx.showToast({
                title: '网络异常...',
                icon: 'none',
                duration: 2000
            });
        })
    },
    getCalendarData: function (data) {
        let AllDay_str = this.getAllDay_str();
        if (AllDay_str) {
            this.showCalendar(data);
        }
    },
    getAllDay_str: function () {
        let data = [];
        for (let i = 0; i < 42; i++) {
            data.push({});
        }
        let allDay_str_list = [];
        let year = util.dateObj.getDate().getFullYear();
        let month = util.dateObj.getDate().getMonth() + 1;
        let firstDay = new Date(year, month - 1, 1); // 当前月的第一天
        data.map((item, index) => {
            let allDay = new Date(year, month - 1, index + 1 - firstDay.getDay());
            let allDay_str = util.returnDateStr(allDay);
            allDay_str_list.push(allDay_str);
        });
        return allDay_str_list;
    },
    showCalendar: function (list) {
        let data = list;
        let year = util.dateObj.getDate().getFullYear();
        let month = util.dateObj.getDate().getMonth() + 1;
        let dateStr = util.returnDateStr(util.dateObj.getDate());
        let calendar = util.formatDateTime(util.dateObj.getDate(), true);
        let firstDay = new Date(year, month - 1, 1); // 当前月的第一天
        data.map((item, index) => {
            let allDay = new Date(year, month - 1, index + 1 - firstDay.getDay());
            let allDay_str = util.returnDateStr(allDay);
            item.currentDate = util.formatDateTime(allDay);
            item.data = allDay.getDate();
            if (util.returnDateStr(new Date()) === allDay_str) {
                if (item.workStartTime) {
                    this.setData({
                        up_btn: false,
                        up_btn_current_day: true
                    });
                }
                if (item.workEndTime) {
                    this.setData({
                        down_btn: false,
                        down_btn_current_day: true
                    });
                }
                this.setData({
                    current_day_data: item
                });
                item.itemCurDay = true;
            } else {
                item.itemCurDay = false;
            }
        });
        this.setData({
            calendarTitle: calendar,
            calendarData: data
        });
    },
    handleUpDate: function () {
        let _date = util.dateObj.getDate();
        util.dateObj.setDate(new Date(_date.getFullYear(), _date.getMonth() - 1, 1));
        let AllDay_str = this.getAllDay_str();
        this.location(qqmapsdk);
    },
    handleDownDate: function () {
        let _date = util.dateObj.getDate();
        util.dateObj.setDate(new Date(_date.getFullYear(), _date.getMonth() + 1, 1));
        this.location(qqmapsdk);
    },
    // 
    formSubmit: function (e) {
        wx.setStorageSync('formId', e.detail.formId);
    },
    getPhoneNumber: function (data) {
        let _this = this;
        if (data.detail.errMsg === 'getPhoneNumber:ok') {
            wx.checkSession({
                success() {
                    _this.bindWxPhone(data);
                },
                fail() {
                    wx.login({
                        success(res) {
                            if (res.code) {
                                _this.bindWxPhone(data);
                            } else {
                                wx.showToast({
                                    title: '登录失败',
                                    icon: 'none',
                                    duration: 2000
                                });
                            }
                        }
                    })
                }
            })
        } else {
            wx.showToast({
                title: '登录失败',
                icon: 'none',
                duration: 2000
            });
        }
    },
    bindWxPhone: function (data) {
        let user = wx.getStorageSync('user');
        let params = {
            encryptedData: data.detail.encryptedData,
            iv: data.detail.iv,
            userId: user.id,
            token: user.token
        }
        Axios('user/bindWxPhone', 'POST', params).then((res) => {
            if (res.code == '0') {
                this.setData({
                    showPopup: false
                }, () => {
                    // 获取手机号成功
                    wx.setStorage({
                        key: "wxPhone",
                        data: false
                    })
                    this.location(qqmapsdk);
                    this.getSystemInfo();
                });
            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 2000
                });
            }
        }).catch((err)=> {
            wx.showToast({
                title: '网络异常...',
                icon: 'none',
                duration: 2000
            });
        })
    },
    // 上传用户地址位置信息
    uploadUserLocationDetail: function (addressData) {
        let user = wx.getStorageSync('user');
        let params = {
            address: addressData.address,
            area: addressData.area,
            city: addressData.city,
            lat: addressData.lat,
            lng: addressData.lng,
            province: addressData.province,
            type: 0,
            userId: user.id,
            token: user.token
        }
        Axios('user/uploadUserLocationDetail', 'POST', params).then((res) => { }).catch((err) => { });
    },
    //获取地理位置
    location: function (qqmapsdk, queryAttenDanceScope, locaDta = {}) {
        let that = this;
        let key = config.Config.key;
        let addressData = {};
        let myAmapFun = new amapFile.AMapWX({ key: key });
        myAmapFun.getRegeo({
            iconPath: "./../../static/images/marker.png",
            iconWidth: 22,
            iconHeight: 32,
            success: function (data) {
                var marker = [{
                    id: data[0].id,
                    latitude: data[0].latitude,
                    longitude: data[0].longitude,
                    iconPath: data[0].iconPath,
                    width: data[0].width,
                    height: data[0].height
                }]
                let address = data[0].regeocodeData.addressComponent;
                addressData.lat = data[0].latitude;
                addressData.lng = data[0].longitude;
                addressData.province = address.province;
                if (that.isArray(data[0].regeocodeData.addressComponent.city)) {
                    if (address.province === '北京市') {
                        addressData.city = '北京市';
                    } else if (address.province === '上海市') {
                        addressData.city = '上海市';
                    } else if (address.province === '天津市') {
                        addressData.city = '天津市';
                    } else if (address.province === '重庆市') {
                        addressData.city = '重庆市';
                    }
                } else {
                    addressData.city = address.city;
                }
                addressData.area = address.district;
                addressData.address = data[0].name + data[0].desc
                that.setData({
                    addressData: addressData
                })
                wx.setStorage({
                    key: "location",
                    data: addressData
                })
                if (queryAttenDanceScope) {
                    // 重新定位接口
                    if (JSON.stringify(locaDta) !== '{}') {
                        that.queryAttenDanceScope(addressData, locaDta);
                    } else {
                        that.queryAttenDanceScope(addressData);
                    }
                    return;
                }
                that.uploadUserLocationDetail(addressData);
                that.webviewList();
                that.handleClcok({
                    latitude: data[0].latitude,
                    longitude: data[0].longitude
                });
            },
            fail: function (info) {

            }
        })
    },
    isArray: function(o) {
        return Object.prototype.toString.call(o) == '[object Array]';
    },
    // 重新定位接口
    queryAttenDanceScope: function (data, e = {}) {
        let user = wx.getStorageSync('user');
        let params = {
            userId: user.id,
            token: user.token,
            lat: data.lat,
            lng: data.lng
        }
        Axios('user/clock/queryAttenDanceScope', 'POST', params).then((res) => {
            if (res.code === '0') {
                if (JSON.stringify(e) !== '{}') {
                    this.commitClock(e)
                } else {
                    this.location(qqmapsdk);
                }
            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 2000
                });
            }
        }).catch((err) => {

        });
    },
    // 获取地位位置失败
    gitLocationErr: function () {
        let dateList = [];
        for (let i = 0; i < 42; i++) {
            dateList.push({});
        }
        this.setData({
            up_btn: false,
            down_btn: false,
            isCanClock: '8'
        });
        this.getCalendarData(dateList);
    },
    // 重新定位
    handleAgainLocation: function () {
        let that = this;
        wx.openSetting({
            success: function (res) {
                if (res.authSetting['scope.userLocation']) {
                    that.location(qqmapsdk, true);
                } else {
                    wx.showToast({
                        title: '定位失败',
                        icon: 'none',
                        duration: 2000
                    });
                }
            }
        })
    },
    // 考勤范围外原因
    handleNotClockReason: function () {
        Axios('user/clock/getCanNotClockReason', 'POST', {
            userId: wx.getStorageSync('user').id
        }).then((res) => {
            if (res.code === '0') {
                this.setData({
                    selectArray: res.data.list,
                    showPopupAbnormal: true
                });
            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 2000
                });
            }
        })
    },
    // 打卡异常原因
    selectChange: function (e) {
        this.setData({
            defaultText: e.detail.name,
            reasonId: e.detail.code
        });
    },
    // 提交打卡异常原因
    handleCommitCanNotClockReason: function () {
        if (this.data.defaultText == '请选择') {
            Toast({
                message: '请选择原因！',
                mask: true,
            });
            return;
        }
        let user = wx.getStorageSync('user');
        let location = wx.getStorageSync('location');
        let params = {
            reasonId: this.data.reasonId,
            userId: user.id,
            token: user.token,
            lat: location.lat,
            lng: location.lng,
            address: location.address
        }
        Axios('user/clock/commitCanNotClockReason', 'POST', params).then((res) => {
            if (res.code === '0') {
                this.setData({
                    showPopupAbnormal: false
                })
                Toast({
                    message: '提交成功，如存在定位问题，客服人员会尽快的与您沟通处理，请耐心等待！',
                    mask: true,
                });

            } else {
                this.setData({
                    showPopupAbnormal: false
                })
                Toast({
                    message: '您今天已经提交过，如有问题请联系客服沟通。',
                    mask: true,
                });
            }
        }).catch((err) => {
            this.setData({
                showPopupAbnormal: false
            });
            Toast({
                message: '提交失败',
                mask: true,
            });
        })
    },
    // 认证
    handleCard: function () {
        wx.navigateTo({
            url: '/pages/iDCard/index'
        });
    },
    handleClcok: function (location) {
        if (!location) return;
        let AllDay_str = this.getAllDay_str();
        if (!wx.getStorageSync('user')) {
            this.setData({
                showPopup: true
            })
            return;
        }
        const params = {
            startTime: AllDay_str[0],
            endTime: AllDay_str[AllDay_str.length - 1],
            lat: location.latitude,
            lng: location.longitude,
            userId: wx.getStorageSync('user').id,
            token: wx.getStorageSync('user').token
        }
        Axios('user/clock/toClock', 'POST', params).then((res) => {
            if (res.code === '0') {
                let dateList = res.data.dateList;
                let isCanClock = res.data.isCanClock;
                this.setData({
                    isCanClockText: isCanClock
                })
                let flag = res.data.flag;
                let isCanClockMsg = res.data.message;
                if (isCanClock === '2') {
                    this.setData({
                        showPopupCard: true,
                        isCanClockMsg
                    });
                } else if (isCanClock === '3') {
                    wx.navigateTo({
                        url: '/pages/message/index'
                    });
                } else if (isCanClock === '5') {
                    // 很抱歉，个人信息审核失败请重新添加
                } else if (isCanClock === '8') {
                    if (flag === 0) {
                        this.setData({
                            isCanClock: '0'
                        });
                    } else {
                        this.setData({
                            isCanClock: isCanClock
                        })
                    }
                } else {
                    this.setData({
                        isCanClock: isCanClock,
                        isCanClockMsg: isCanClockMsg,
                        currentWeekSalary: res.data.currentWeekSalary || 0,
                        nextWeekSalary: res.data.nextWeekSalary || 0
                    })
                }
                
                this.getCalendarData(dateList);
            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 10000
                })
            }
        }).catch((err) => {
            wx.showToast({
                title: '网络异常...',
                icon: 'none',
                duration: 2000
            });
        })
    },
    commitClock: function(e) {
        let addressData = this.data.addressData;
        this.getBatteryInfo((res) => {
            let params = {
                userId: wx.getStorageSync('user').id,
                type: e.target.dataset.current_day_type,
                ...addressData,
                ...res
            }
            Axios('user/clock/commitClock', 'POST', params).then((res) => {
                if (res.code === '0') {
                    this.location(qqmapsdk);
                    this.setData({
                        showPopupClockTips: true,
                        current_day_data_time: res.data.clockTime
                    });
                } else {
                    this.setData({
                        showPopupClockInsufficient: true
                    })
                };
            }).catch((err) => {
                wx.showToast({
                    title: '网络异常...',
                    icon: 'none',
                    duration: 2000
                });
            })
        })
    },
    // 上班打卡
    handleDownClock: function (e) {
        if (!e.target.dataset.current_day_type) {
            this.setData({
                showPopupClockInsufficient: true
            });
        } else {
            this.location(qqmapsdk, true, e);
        }
    },
    // 查看打卡记录
    handleClockRecord: function (e) {
        let workstarttime = e.target.dataset.workstarttime;
        let workendtime = e.target.dataset.workendtime;
        let currentdate = e.target.dataset.currentdate;
        this.setData({
            workstarttime,
            workendtime,
            currentdate,
            showPopupClockRecord: true
        })
    },
    // 关闭打卡记录模块
    handleCloseClockRecord: function () {
        this.setData({
            showPopupClockRecord: false
        })
    },
    getBatteryInfo: function (callback) {
        wx.getBatteryInfo({
            success: function (res) {
                let isCharge = 0;
                let level = res.level;
                if (res.isCharging) {
                    isCharge = 1;
                } else {
                    isCharge = 0;
                }
                callback({
                    isCharge: isCharge,
                    electricLevel: level
                })
            },
            fail: function (err) {
                callback({
                    isCharge: '',
                    electricLevel: ''
                })
            }
        })
    },
    handleNav: util.throttle(function () {
        wx.navigateTo({
            url: '/pages/paySlip/index'
        });
    }, 1000),
    handleToDk: util.throttle(function () {
        wx.navigateTo({
            url: '/pages/clockExplain/index'
        });
    }, 1000),
    handleToMessageClick: util.throttle(function () {
        wx.navigateTo({
            url: '/pages/message/index'
        });
    }, 1000),
    handleToLoginClick: util.throttle(function () {
        wx.navigateTo({
            url: '/pages/login/index'
        });
    }, 1000),
    handleCloseShowPopupClockTips: function () {
        this.setData({
            showPopupClockTips: false
        })
    },
    handleCloseShowPopup: function () {
        this.setData({
            showPopup: false
        });
    },
    handleCloseClockInsufficient: function () {
        this.setData({
            showPopupClockInsufficient: false
        })
    },
    handleClosePopupAbnormal: function () {
        this.setData({
            showPopupAbnormal: false
        })
    }
})