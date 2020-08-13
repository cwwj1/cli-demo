import {showSimpleModal} from './modal.js';

/**
 * 获取url上携带的参数
 * @param {*} url
 */
const getUrlParams = (url) => {
    let params = {};
    if (url.indexOf('?') !== -1) {
        let search = url.split('?')[1];
        let strs = search.split('&');
        for (let i = 0; i < strs.length; i++) {
            params[strs[i].substring(0, strs[i].indexOf('='))] = strs[i].substring(strs[i].indexOf('=') + 1);
        }
    }
    return params;
};

/**
 * 订阅消息
 * 1、不可以写在onLoad里自动弹出
 * 2、一次调用最多可订阅3条消息
 * 3、iOS客户端7.0.6版本、Android客户端7.0.7版本之后的一次性订阅/长期订阅才支持多个模板消息，iOS客户端7.0.5版本、Android客户端7.0.6版本之前的一次订阅只支持一个模板消息
 */
const wxSubscribeMessage = (tmplIds = [], callBack) =>
    new Promise((resolve, reject) => {
        if (wx.canIUse('requestSubscribeMessage')) {
            wx.requestSubscribeMessage({
                tmplIds,
                success(res) {
                    for (let key in res) {
                        if (key !== 'errMsg') {
                            if (res[key] === 'reject') {
                                showSimpleModal({
                                    title: '订阅消息',
                                    content: '您已拒绝了订阅消息，如需重新订阅请前往设置打开。',
                                    confirmText: '去设置',
                                    // showCancel: false,
                                    confirm: () => {
                                        wx.openSetting({});
                                    },
                                });
                            }
                        }
                    }
                    resolve();
                },
                fail(res) {
                    // console.log(res)/*20004-errorCode*/
                    showSimpleModal({
                        title: '订阅消息',
                        content: '您关闭了“接收订阅信息”，请前往设置打开！',
                        confirmText: '去设置',
                        showCancel: false,
                        confirm: () => {
                            wx.openSetting({});
                        },
                    });
                    reject();
                },
                complete(res) {
                    callBack && callBack(res);
                },
            });
        } else {
            // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
            wx.showModal({
                title: '提示',
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
            });
        }
    });

const formatSingleNum = (num) => (num > 9 ? num : `0${num}`);

const formatDate = (timestamp, formatString = 'yyyy.MM.dd hh:mm:ss') => {
    const date = new Date(timestamp);
    const yyyy = date.getFullYear();
    const MM = formatSingleNum(date.getMonth() + 1);
    const dd = formatSingleNum(date.getDate());
    const hh = formatSingleNum(date.getHours());
    const mm = formatSingleNum(date.getMinutes());
    const ss = formatSingleNum(date.getSeconds());
    const dateFormat = {
        yyyy,
        MM,
        dd,
        hh,
        mm,
        ss,
    };
    for (let key in dateFormat) {
        let val = dateFormat[key];
        formatString = formatString.replace(key, val);
    }
    return formatString;
};

/**
 * 判断是否是刘海屏
 * @return {*} Boolean
 */
const needSafeArea = () => {
    const systemInfo = wx.getSystemInfoSync();
    let model =  systemInfo.model.toLowerCase().replace(' ', '');
    return model.indexOf('iphonex') > -1 || model.indexOf('iphone11') > -1 || model.indexOf('iphone12') > -1;
};

/**
 * 类型检查
 * @return {*} Boolean
 */
const TypeCheck = (function () {
    let check = {};

    ['String', 'Number', 'Array', 'Boolean', 'Object', 'Undefined', 'Null', 'Function', 'Date'].forEach((type) => {
        check[`is${type}`] = function (obj) {
            return toString.call(obj) === `[object ${type}]`;
        };
    });

    return check;
}());


export default {
    getUrlParams,
    wxSubscribeMessage,
    formatDate,
    needSafeArea,
    TypeCheck,
};
