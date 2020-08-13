/*
 * @Author: lin.cao
 * @Date: 2020-04-22 10:28:10
 * @LastEditTime: 2020-04-30 16:51:52
 * @LastEditors: lin.cao
 * @Description: 这里仅放应用级的公用 storage, 业务细节的 storage 存取请使用 @fe-wxmp/storage
 * @FilePath: /catalyst_beicang/src/biz/wxmp/common/tool/storage.js
 */
const wxStorage = (key) => ({
    get: () => wx.getStorageSync(key),
    set: (val = '') => {
        wx.setStorageSync(key, val);
    },
    remove: () => {
        wx.removeStorageSync(key);
    },
});

const sessionStorage = wxStorage('wxmp_session'); // 业务 session

const needCheckSessionStorage = wxStorage('need_check_session'); // 是否需要 wx.checkSession 标志，一般在小程序启动时需要检查

const openidStorage = wxStorage('oid'); // openid

const uidStorage = wxStorage('xid'); // uid 的 base64

const levelStorage = wxStorage('level'); // 用户等级

const userInfoStorage = wxStorage('user_info'); // 登陆主动授权后，获取的头像昵称

const userAuthStorage = wxStorage('user_auth'); // 用户授权状态

export {
    sessionStorage,
    needCheckSessionStorage,
    openidStorage,
    uidStorage,
    levelStorage,
    userInfoStorage,
    userAuthStorage,
};
