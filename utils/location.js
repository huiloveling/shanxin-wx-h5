var QQMapWX = require('./../libs/qqmap-wx-jssdk');
var qqmapsdk = new QQMapWX({
    key: 'BQ2BZ-UBH34-K52U6-DYQGJ-BCXB5-ZJBJY'
});

let amapFile = require('./../libs/amap-wx.js');
let config = require('./../libs/config.js');

function isArray(o) {
    return Object.prototype.toString.call(o) == '[object Array]';
}

const GetLocation = function (callback) {
    let addressData = {};
    let key = config.Config.key;
    let myAmapFun = new amapFile.AMapWX({ key: key });
    myAmapFun.getRegeo({
        iconPath: "./../static/images/marker.png",
        iconWidth: 22,
        iconHeight: 32,
        success: function (data) {
            let address = data[0].regeocodeData.addressComponent;
            addressData.lat = data[0].latitude;
            addressData.lng = data[0].longitude;
            addressData.code = 0;
            addressData.province = address.province;
            if (isArray(data[0].regeocodeData.addressComponent.city)) {
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
            addressData.address = data[0].name + data[0].desc;
            callback(addressData);
        },
        fail: function (info) {
        }
    })
    // let addressData = {};
    // wx.getLocation({
    //     success: (location) => {
    //         qqmapsdk.reverseGeocoder({
    //             location: {
    //                 latitude: location.latitude,
    //                 longitude: location.longitude
    //             },
    //             success: function (res) {
    //                 let address = res.result.address_component;
    //                 addressData.code = 0;
    //                 addressData.lat = location.latitude;
    //                 addressData.lng = location.longitude;
    //                 addressData.province = address.province;
    //                 addressData.city = address.city;
    //                 addressData.area = address.district;
    //                 addressData.address = address.nation + address.province + address.city + address.district + address.street + address.street_number;
    //                 callback(addressData);
    //             },
    //             fail: function (res) {
                    
    //             }
    //         });
    //     }
    // });
}

export default GetLocation;