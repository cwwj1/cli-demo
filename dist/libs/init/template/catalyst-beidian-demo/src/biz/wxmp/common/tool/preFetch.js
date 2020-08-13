/* eslint-disable no-undef */

import {TypeCheck} from './tool.js';
const prefetchList = {};
/**
 * 创建wx.$route函数, 用于预加载
 */
let navigateTo = wx.navigateTo.bind(wx);
Object.defineProperties(wx, {
    $route: {
        configurable: true,
        enumerable: true,
        writable: true,
        value(options) {
            // 需要传递给下个页面的数据
            let {
                url,
                ...preloadValue
            } = options;
            console.log(url);
            let re = /[^/][^?]*/;
            let urlPatten = url.match(re);
            if (urlPatten && TypeCheck.isFunction(prefetchList && prefetchList[urlPatten])) {
                prefetchList[urlPatten](preloadValue);
            }
            setTimeout(() => {
                navigateTo({
                    url,
                });
            }, 150);
        },
    },
});

/**
 * 保存页面的onPreFetch函数
 * @param {object} object Vue实例
 */
const register = (object) => {
    if (TypeCheck.isFunction(object && object.methods && object.methods.onPreFetch)) {
        // __wxRoute是小程序框架中定义的全局变量，指向当前页面路径，如biz/wxmp/detail/index
        prefetchList[__wxRoute] = object.methods.onPreFetch;
    }
};
export default {
    register,
};
