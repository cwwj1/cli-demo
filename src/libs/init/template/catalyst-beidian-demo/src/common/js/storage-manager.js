/*
 * @Description: Storage Manager
 * @Author: GaoSong
 * @Date: 2019-09-25 21:02:01
 * @LastEditTime: 2019-10-28 14:41:58
 * @LastEditors: GaoSong
 */
export const wxStorage = (key) => ({
    set(v = '') {
        wx.setStorageSync(key, v);
    },
    get() {
        return wx.getStorageSync(key);
    },
    remove() {
        wx.removeStorageSync(key);
    },
});

export const XIDStorage = wxStorage('xid');

export const SessionManager = wxStorage('wxmp_session');


export const CodeStorage = wxStorage('wxmp_code');

export const TimeStorage = wxStorage('down_time');

export const InviteCodeStorage = wxStorage('invite_code');
