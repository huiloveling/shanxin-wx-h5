import {
    commonParams,
    URL,
    ERR_OK
} from './config';
const Axios = function(url, method, params, fn) {
    return new Promise((resolve, reject) => {
        wx.request({
            url: URL + url,
            method: method,
            data: requestParams(params),
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success(res) {
                if (res.statusCode === ERR_OK) {
                    if (res.data.code === '9') {
                        wx.clearStorage();
                        wx.navigateTo({
                            url: '/pages/login/index'
                        });
                    } else {
                        resolve(res.data);
                    }
                } else {
                    reject(res);
                }
            },
            fail(err) {
                wx.showToast({
                    title: '网络异常...',
                    icon: 'none',
                    duration: 2000
                });
            }
        })
    })
}

function requestParams(params) {
    return Object.assign({}, commonParams, params);
}
export default Axios