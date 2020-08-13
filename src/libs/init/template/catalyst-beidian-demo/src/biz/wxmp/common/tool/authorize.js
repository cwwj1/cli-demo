/* eslint-disable promise/catch-or-return */
// 微信授权接口
// 使用方法:
// authorize({
//     key: 'scope.record', // 权限名称
//     modalContent: '检测到您没打开此小程序的麦克风权限，是否去设置打开？', // 第一次授权被拒绝后，第二后弹窗文案
// }).then(() => {
//      // 如下情况触发本回调
//      // 授权弹框点击同意
//      // 设置页面打开授权后点击返回
//     toast('成功');
// }, () => {
//      // 如下情况触发本回调
//      // 授权弹框点击拒绝
//      // 引导去设置页面的弹框选择拒绝
//      // 设置页面未打开相关权限后返回
//     toast('失败');
// });
//
// 后日谈:
// 后续修改授权步骤可以通过调整tasks实现，不要嵌套。
//
let promiseIter = function (tasks, option) {
    return new Promise((resolve) => {
        const nextPromise = (index, promises, data) => {
            let length = promises.length;
            if (index >= length) {
                resolve();
                return;
            }
            promises[index](option, data)
                .then((res) => {
                    if (res.next) {
                        nextPromise(index + 1, promises, res);
                    } else {
                        resolve(res);
                    }
                });
        };
        nextPromise(0, tasks, option);
    });
};

// 授权流程数组
const tasks = [
    (option) =>
        // 检查授权
        new Promise((resolve, reject) => {
            wx.getSetting({
                success: (res) => {
                    let result = res.authSetting[option.key];
                    if (!result) {
                        resolve({
                            needOpenSetting: result === false,
                            next: true,
                        });
                    } else {
                        resolve(true);
                    }
                },
            });
        }),
    (option, data) =>
        // 弹框授权
        new Promise((resolve, reject) => {
            wx.authorize({
                scope: option.key,
                success() {
                    // 同意授权
                    resolve(true);
                },
                fail() {
                    // 拒绝授权
                    if (!data || !data.needOpenSetting) {
                        resolve(false);
                    } else {
                        resolve({
                            next: true,
                        });
                    }
                },
            });
        }),
    (option, data) =>
        // 弹框引导用户设置授权
        new Promise((resolve, reject) => {
            wx.showModal({
                content: option.modalContent,
                confirmText: '确认',
                cancelText: '取消',
                success(res) {
                    if (res.confirm) {
                        resolve({
                            next: true,
                        });
                    } else if (res.cancel) {
                        resolve(false);
                    }
                },
            });
        }),
    (option) =>
        // 设置授权
        new Promise((resolve, reject) => {
            wx.openSetting({
                success(res) {
                    if (res.authSetting[option.key]) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                },
            });
        }),
];

const checkAuthorize = (key) => new Promise((resolve, reject) => {
    wx.getSetting({
        success: (res) => {
            let result = res.authSetting[key];
            if (!result) {
                resolve(false);
            } else {
                resolve(true);
            }
        },
    });
});

const authorize = (option) =>
    // 执行
    new Promise((resolve, reject) => {
        promiseIter(tasks, option).then((res) => {
            if (res === true) {
                // 授权成功
                resolve();
            } else {
                reject();
            }
        });
    });
export {
    checkAuthorize,
    authorize,
};

export default authorize;
