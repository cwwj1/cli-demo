/* eslint-disable complexity */
/* eslint-disable promise/catch-or-return */
import toast from '@catalyst/toast';
import request from './request';
import {checkAuthorize} from './authorize';
// levelStorage,
import {sessionStorage, needCheckSessionStorage, openidStorage, uidStorage, userInfoStorage, userAuthStorage} from './storage';

/**
 * @description: session过期时间, 今日24点 + 24小时
 * @param {type} null
 * @return: String
 */
const creatExpirTime = () => {
    let gapHour = 24; // 登录态24小时失效
    // 今日24点
    let currentGmt = new Date(new Date().setHours(24, 0, 0, 0)).getTime();
    return currentGmt + (gapHour * 60 * 60 * 1000);
};
/**
 * @description: 微信登录
 * @param {type} null
 * @return: {Promise}
 */
const wxLogin = () => new Promise((resolve, reject) => {
    wx.login({
        success: (res) => {
            if (res.code) {
                resolve(res.code);
            } else {
                reject(res);
            }
        },
        fail: reject,
    });
});

/**
 * @description: 微信检查登录态是否过期
 * @param {type} null
 * @return: {Promise}
 */
// const wxCheckSession = () => new Promise((resolve, reject) => {
//     wx.checkSession({
//         success: resolve,
//         fail: reject,
//     });
// });

/**
 * @description: 检查Session
 * @param {function} 回调函数
 * @return: null
 */
const checkSession = (cb) => {
    let currentGmt = new Date().getTime();
    // let sessionValid = await wxCheckSession();
    if (sessionStorage.get() && needCheckSessionStorage.get() >= currentGmt) { // storage 有 session，checkSession
        typeof cb === 'function' && cb(true);
    } else {
        // 无session 或者 session失效，走静默登录
        // eslint-disable-next-line no-use-before-define
        login(() => {
            typeof cb === 'function' && cb(true);
        }, {
            needAuth: false,
        });
    }
};

/**
 * @description: 检查是否登录(有无uid)
 * @param {function} 回调函数
 * @return: null
 */
const checkLogin = (cb) => {
    checkSession((isLogin) => {
        if (isLogin && uidStorage.get()) {
            typeof cb === 'function' && cb(true);
            return;
        }
        typeof cb === 'function' && cb(false);
    });
};

const loginRequest = (params) => request({
    type: 'POST',
    method: 'member.wxmp.auth',
    headers: {
        // Cookie: 'HX-BETA=67;dubbo.tag=beicang_wxmp_login;',
        // Cookie: 'HX-BETA=67;dubbo.tag=store;',
    },
    data: Object.assign({
        register_type: 1, // 需要手机号
        scene: 'wxmp_bd_youtuan',
    }, params),
});

// 跳转到授权页
const goAuthLogin = (type) => {
    wx.navigateTo({
        url: `/biz/wxmp/auth_login/index?type=${type}`,
    });
};

/**
 * @description: 获取用户信息
 * @param {type} null
 * @return: {Promise}
 */
const wxGetUserInfo = () => new Promise((resolve, reject) => {
    wx.getUserInfo({
        success: (res) => {
            resolve(res);
        },
        fail: reject,
    });
});

/**
 * @description: 存储用户等级，打点用
 * @param {type} null
 * @return: null
 */
const saveUserLevel = () => {
    // request({
    //     type: 'GET',
    //     method: 'xretail.member.info.get',
    // })
    //     .then((resp) => {
    //         levelStorage.set(resp.data.level);
    //     })
    //     .catch(() => ({}));
};

/**
 * @description: 业务登录
 * @param {function} 回调函数
 * @param option {object} option.needAuth 为 true 则授权登录
 * @return: null
 */
const login = async (cb, option = {
    needAuth: true,
}, failCallback = {}) => {
    try {
        if (option.needAuth) { // 授权登录
            let {
                needAuth,
                needTel,
            } = userAuthStorage.get();
            // 需要头像授权
            if (needAuth) {
                let avatarAuthorized = await checkAuthorize('scope.userInfo');
                if (!avatarAuthorized) {
                    goAuthLogin('avatar'); // 未授权过，去授权页
                    return;
                }
                let code = await wxLogin();
                let userInfo = await wxGetUserInfo();
                if (!userInfo) {
                    goAuthLogin('avatar'); // 获取不到用户信息，去授权页
                    return;
                }
                let resp = await loginRequest({
                    code,
                    encrypt_data: userInfo.encryptedData,
                    iv: userInfo.iv,
                    is_avatar_authorization: 1,
                });
                if (!resp || !resp.data) {
                    throw new Error('登录返回信息有误！');
                }
                const {
                    session,
                    oid,
                    xid,
                    expire_time: expireTime,
                    // need_auth: needAvatarAuth,
                    need_tel: needTelAuth,
                    user_info: userInfoKey,
                } = resp.data;
                if (!session || !oid) {
                    throw new Error('登录返回信息有误！');
                }
                userInfoKey && userInfoStorage.set(userInfoKey);
                // 这里接口返回的needAuth字段不对，因此前端自己做判断
                userAuthStorage.set({
                    needAuth: false,
                    needTel: needTelAuth,
                });
                if (needTelAuth) {
                    goAuthLogin('tel');
                    return;
                }
                session && sessionStorage.set(session);
                oid && openidStorage.set(oid);
                xid && uidStorage.set(xid);
                needCheckSessionStorage.set(expireTime * 1000 || creatExpirTime());
                typeof cb === 'function' && cb();
                xid && saveUserLevel();
            }
            // 需要手机号授权
            if (!needAuth && needTel) {
                goAuthLogin('tel'); // 需要手机号授权，去授权页
                return;
            }
        } else { // 静默登录
            const data = {};
            let code = await wxLogin();
            data.code = code;
            data.is_avatar_authorization = 1;
            data.register_type = 2;
            let resp = await loginRequest(data);
            if (!resp.success) {
                throw new Error('静默登录失败！');
            }
            const {
                session,
                oid,
                xid,
                expire_time: expireTime,
                need_auth: needAuth,
                need_tel: needTel,
            } = resp.data;
            if (!session || !oid) {
                throw new Error('登录返回信息有误！');
            }
            session && sessionStorage.set(session);
            oid && openidStorage.set(oid);
            xid && uidStorage.set(xid);
            needCheckSessionStorage.set(expireTime * 1000 || creatExpirTime());
            userAuthStorage.set({
                needTel,
                needAuth,
            });
            typeof cb === 'function' && cb();
        }
    } catch (err) {
        toast(`登录失败！${err.errMsg || err.message || err || ''}`);
        failCallback && (typeof failCallback === 'function') && failCallback();
    }
};

const loginDirectly = (cb, option = {}) => {
    loginRequest({
        ...option.data,
    })
        .then((resp) => {
            if (!resp || !resp.data) {
                throw new Error('登录返回信息有误！');
            }
            const {
                session,
                oid,
                xid,
                expire_time: expireTime,
                need_tel: needTel,
                need_auth: needAuth,
                user_info: userInfo,
            } = resp.data;
            if (!oid) {
                throw new Error('登录返回信息有误！');
            }
            session && sessionStorage.set(session);
            userInfo && userInfoStorage.set(userInfo);
            oid && openidStorage.set(oid);
            xid && uidStorage.set(xid);
            needCheckSessionStorage.set(expireTime * 1000 || creatExpirTime());
            userAuthStorage.set({
                needAuth,
                needTel,
            });
            xid && saveUserLevel();
            typeof cb === 'function' && cb(needTel);
            return true;
        })
        .catch((err) => {
            toast(`登录失败！${err.errMsg || err.message || err || ''}`);
        });
};

export {
    checkLogin,
    login,
    wxLogin,
    loginDirectly,
};
