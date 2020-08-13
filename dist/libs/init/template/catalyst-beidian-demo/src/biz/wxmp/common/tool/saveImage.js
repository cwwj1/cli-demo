/* eslint-disable prefer-promise-reject-errors */
export const STATUS_AUTH = 'STATUS_AUTH'; // 授权成功
export const STATUS_UNAUTH = 'STATUS_UNAUTH'; // 拒绝授权
export const STATUS_NORMAL = 'STATUS_NORMAL'; // 未授权过

const ACTION_KEY = 'scope.writePhotosAlbum';

// 微信系统设置判断授权类型
export const switchAuthSetting = (authSetting) => {
    if (authSetting && typeof authSetting[ACTION_KEY] === 'boolean') {
        return authSetting[ACTION_KEY] ? STATUS_AUTH : STATUS_UNAUTH;
    }
    return STATUS_NORMAL;
};

// 获取保存图片授权状态
const getWritePhotosAlbumStatus = () => new Promise((resolve) => {
    wx.getSetting({
        success: (resp) => {
            resolve(switchAuthSetting(resp.authSetting));
        },
    });
});

// 保存图片到相册
const saveImageToPhotosAlbum = (src) => new Promise((resolve, reject) => {
    wx.downloadFile({
        url: src.replace(/http(s)?/, 'https'),
        success: (res) => {
            wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success(resp) {
                    resolve(resp);
                },
                fail() {
                    reject('图片保存失败');
                },
            });
        },
        fail() {
            reject('图片下载失败');
        },
    });
});
// 保存本地图片
const saveLocalImage = (url) => new Promise((resolve, reject) => {
    wx.saveImageToPhotosAlbum({
        filePath: url,
        success(resp) {
            resolve(resp);
        },
        fail() {
            reject('图片保存失败');
        },
    });
});

// 保存图片
const handleSave = ({
    url, successCb, failCb, type,
}) => {
    let saveFuc;
    if (type === 'url') {
        saveFuc = saveImageToPhotosAlbum;
    } else if (type === 'file') {
        saveFuc = saveLocalImage;
    } else {
        saveFuc = Promise.reject;
    }

    saveFuc(url)
        .then(successCb)
        .catch(failCb);
};

// 暴露公用方法
export const saveImage = ({
    url, successCb, failCb, type = 'url',
} = {}) => {
    getWritePhotosAlbumStatus().then((status) => {
        switch (status) {
            case STATUS_NORMAL:
            case STATUS_AUTH: {
                handleSave({
                    url, successCb, failCb, type,
                });
                break;
            }
            case STATUS_UNAUTH:
            default:
                break;
        }
    })
        .catch((e) => {
            console.log(e);
        });
};
// 需要打开设置
export const isNeedOpenSettings = () => getWritePhotosAlbumStatus().then((status) => status === STATUS_UNAUTH);
