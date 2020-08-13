/* eslint-disable new-cap */
/* eslint-disable no-undef */
import statistics from 'src/biz/wxmp/common/tool/statistics';
import {throttle, Base64} from 'src/common/js/utils.js';
import {getUrlParams} from './tool.js';

/**
 *
 * Page扩展函数
 * @param {*} Page 原生Page
 */
const pageExtend = (Page) => (object) => {
    const {
        onLoad,
        onPageScroll,
        onShareAppMessage,
    } = object;
    // 公共的onLoad生命周期函数
    object.onLoad = function (options) {
        console.log('onLoad', options);
        // 每个页面自动添加pageStart打点
        statistics.sendLog({
            et: 'pageStart',
            json: {
                store_code: wx.getStorageSync('storeCode'),
            },
        });
        // 小程序卡片 或者是 小程序码扫码进入
        if (options.redirect_url) {
            console.log(options.redirect_url);
            try {
                let url = Base64.parse(options.redirect_url);
                delete options.redirect_url;
                url && wx.navigateTo({
                    url,
                });
            } catch (err) {
                console.error(err);
            }
        }
        // 普通二维码扫码进入
        if (options.q) {
            let url = decodeURIComponent(options.q);
            let urlParams = getUrlParams(url);
            console.log(urlParams.redirect_url);
            if (urlParams.redirect_url) {
                try {
                    let redirectUrl = Base64.parse(urlParams.redirect_url);
                    delete urlParams.redirect_url;
                    redirectUrl && wx.navigateTo({
                        url: redirectUrl,
                    });
                } catch (err) {
                    console.error(err);
                }
            }
        }
        if (typeof onLoad === 'function') {
            onLoad.call(this, options);
        }
    };
    /**
     * onPageScroll统一增加节流
     * @param {} options
     */
    object.onPageScroll = function (options) {
        if (typeof onPageScroll === 'function') {
            throttle(onPageScroll.call(this, options));
        }
    };
    // 分享落地页增加店铺中间页
    object.onShareAppMessage = function (options) {
        let params = onShareAppMessage.call(this, options);
        // 把分享链接转换成先跳到首页，再跳到目标页
        if (params.redirect && params.path.indexOf('store_home/index') === -1) {
            params.path = `/biz/wxmp/store_home/index?storeCode=${params && params.queryObj && params.queryObj.storeCode}&redirect_url=${Base64.stringify(params.path).replace(/=*$/, '')}`;
        }
        return params;
    };
    return Page(object);
};

const originalPage = Page;
Page = pageExtend(originalPage);
