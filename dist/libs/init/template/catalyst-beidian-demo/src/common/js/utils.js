import hybrid from '@catalyst/hybrid';
import EncBase64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';
// import login from '@weex/login';

import {XIDStorage} from './storage-manager';
import {STRAIGHT_BANGS_DEVICE} from './constant';

export const IS_WEB = ctl.isWeb;
export const IS_WEEX = ctl.isWeex;
export const IS_WX = ctl.isWx;

// 是否为空
export const isEmpty = (val) => typeof val === 'undefined' || val === null;

// 是否为非空字符串
export const isValidString = (str) => typeof str === 'string' && str !== '';

// 是否为空对象
export const isEmptyObject = (obj) => typeof obj !== 'object' || obj === null || Object.keys(obj).length <= 0;

// 是否为刘海屏
export const isStraightBangsDevice = () => {
    if (IS_WEEX) {
        const deviceName = weex.config.env.deviceModel;
        // 为了兼容 ios8 以下版本
        if (Array.prototype.includes) {
            return STRAIGHT_BANGS_DEVICE.includes(deviceName);
        } else {
            for(let i = 0; i < STRAIGHT_BANGS_DEVICE.length ; i++) {
                if (STRAIGHT_BANGS_DEVICE[i] === deviceName) {
                    return true;
                }
            }
            return false;
        }
    }
    return false;
}

// 将对象转成 url 参数格式
export const toParams = (json) => {
    if (typeof json !== 'object' || json === null) {
        throw Error('Type Error: Export Object');
    }
    return Object.keys(json)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(json[key])}`)
        .join('&');
};

// 跳转路径
export const goto = ({
    web, weex, WeChatMiniProgram,
} = {}, options = {}) => {
    const createUrl = (url) => (isEmptyObject(options) ? `${url}` : `${url}?${toParams(options)}`);

    if (IS_WEB && isValidString(web)) {
        location.href = createUrl(web);
    } else if (IS_WEEX && isValidString(weex)) {
        hybrid('openURL').openURL({
            url: createUrl(weex),
        });
    } else if (IS_WX && isValidString(WeChatMiniProgram)) {
        wx && wx.navigateTo({
            url: createUrl(WeChatMiniProgram),
        });
    }
};

/**
 * 跳转到对应 weex 页面
 * @param {string} target  跳转目标地址
 * @param {string} options 跳转参数
 */
export const gotoWeex = (target = '', options = {}) => {
    if(isValidString(target)) {
        hybrid('openURL').openURL({
            url: isEmptyObject(options) ? `${target}` : `${target}?${toParams(options)}`,
        });
    }
}

export const Base64 = {
    // 加密
    stringify(str) {
        return EncBase64.stringify(Utf8.parse(String(str)));
    },
    // 解密
    parse(str) {
        let res = '';
        try {
            res = EncBase64.parse(str).toString(Utf8);
        } catch (e) {
            console.error(e);
        }
        return res;
    },
};

export const getCookie = (cname) => {
    let name = `${cname}=`;
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let co = ca[i];
        while (co.charAt(0) === ' ') {
            co = co.substring(1);
        }
        if (co.indexOf(name) === 0) {
            return co.substring(name.length, co.length);
        }
    }
    return '';
};

// 获取uid、base64Uid
export const getUid = () => {
    let uid;
    let base64Uid;
    return new Promise((resolve) => {
        if (IS_WX) {
            base64Uid = XIDStorage.get() || '';
            uid = base64Uid ? Base64.parse(base64Uid) : '';
            resolve({
                uid,
                base64Uid,
            });
        }
        if (IS_WEB) {
            uid = getCookie('_logged_') || '';
            base64Uid = Base64.stringify(getCookie('_logged_'));
            resolve({
                uid,
                base64Uid,
            });
        }
        if (IS_WEEX) {
            // login.checkLoginCommon((res) => {
            //     console.log('checkLoginCommon', res);
            //     if (res.data) {
            //         login.loginCommon((resp) => {
            //             console.log('checkLoginCommon', res);
            //             uid = resp.data.uid || (JSON.parse(`{${resp.data}}`)).uid || '1';
            //             base64Uid = Base64.stringify(uid);
            //             console.log(uid, base64Uid);
            //             resolve({
            //                 uid,
            //                 base64Uid,
            //             });
            //         });
            //     } else {
            //         uid = '';
            //         base64Uid = Base64.stringify(uid);
            //         console.log(uid, base64Uid);
            //         resolve({
            //             uid,
            //             base64Uid,
            //         });
            //     }
            // });
            hybrid('checkLogin').checkLogin({}, (err, res) => {
                if (res) {
                    hybrid('login').login({}, (error, resp) => {
                        console.log('login', resp);
                        uid = resp.uid || (JSON.parse(`{${resp}}`)).uid || '1';
                        base64Uid = Base64.stringify(uid);
                        resolve({
                            uid,
                            base64Uid,
                        });
                    });
                } else {
                    uid = '';
                    base64Uid = Base64.stringify(uid);
                    console.log(uid, base64Uid);
                    resolve({
                        uid,
                        base64Uid,
                    });
                }
            });
        }
    });
};

/**
 * 页面内存缓存
 * @param {number} validTime 缓存有效时间
 */
export class MemoryCache {
    constructor({validTime = 2 * 60 * 1000} = {}) {
        this._cache = {};
        this.validTime = validTime;
    }
    /**
     * 添加缓存
     * @param {string} key    缓存名称
     * @param {string} value  缓存值
     */
    add(key, value) {
        if (this._cache[key]) {
            this.update(key, value);
        } else {
            this._cache[key] = {
                value,
            };
            this.timer(key);
        }
    }
    /**
     * 更新缓存
     * @param {string} key    缓存名称
     * @param {string} value  缓存值
     */
    update(key, value) {
        const old = this._cache[key];
        if (typeof old !== typeof value) {
            this._cache[key] = {
                value,
            };
        }
        if (Array.isArray(old)) {
            this._cache.value = [...old, ...value];
        } else if (typeof old === 'object') {
            this._cache.value = {
                ...old, ...value,
            };
        } else {
            this._cache[key] = {
                value,
            };
        }
        this.timer(key);
    }
    /**
     * 清除缓存
     * @param {string} key 缓存名称
     */
    clear(key) {
        this._cache[key] = null;
    }
    /**
     * 定时器
     * @param {string} key 缓存名称
     */
    timer(key) {
        if (this.validTime && this.has(key)) {
            clearTimeout(this._cache[key].timer);
            this._cache[key].timer = setTimeout(() => {
                this.clear(key);
            }, this.validTime);
        }
    }
    /**
     * 查找
     * @param {string} key 缓存名称
     */
    search(key) {
        return (this._cache[key] && this._cache[key].value) || null;
    }
    /**
     * 是否存在某个缓存
     * @param {string} key 缓存名称
     */
    has(key) {
        const cache = this._cache[key];
        return typeof cache === 'object' &&
                cache !== null &&
                cache.value !== null &&
                typeof cache.value !== 'undefined';
    }
}

/**
 * 节流
 * @param {function} fn 执行函数
 * @param {number} time 节流事件
 */
export const throttle = (fn, timeInterval = 50) => {
    let timer = null;
    let isFirstExeced = false;

    return (...args) => {
        if (!isFirstExeced) {
            fn(...args);
            isFirstExeced = true;
            return;
        }

        if (timer) {
            return;
        }

        timer = setTimeout(() => {
            clearTimeout(timer);
            timer = null;
            fn(...args);
        }, timeInterval);
    };
}

/**
 * 从图片地址中，获取图片宽度
 * @param {string} url 图片地址
 * @param {number} height 固定高度
 */
export const getWidth = (url, height) => {
    let result = url.match(/_(\d+)x(\d+)\./);
    let width = height / result[2] * result[1];
    return width;
};