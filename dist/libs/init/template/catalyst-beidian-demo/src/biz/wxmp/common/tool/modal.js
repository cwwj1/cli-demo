// 基础的弹窗
const showSimpleModal = ({
    title = '提示',
    content = '网络繁忙，请稍后重试',
    showCancel = true,
    cancelText = '取消',
    cancelColor = '#000000',
    confirmText = '确定',
    confirmColor = '#ff4965',
    confirm = function () {
        // do nothing
    },
    cancel = function () {
        // do nothing
    },
}) => {
    wx.showModal({
        title: String(title),
        content: String(content),
        showCancel,
        cancelText,
        cancelColor,
        confirmText,
        confirmColor,
        success(res) {
            if (res.confirm) {
                wx.vibrateShort();
                confirm();
            } else {
                wx.vibrateShort();
                cancel(res.cancel);
            }
        },
    });
};

// 不允许用户关闭的弹窗，只接受msg参数，没有取消按钮，点击确认后（或者Android上点击朦层）立即返回上一页

const showModalAndBack = (msg) => {
    showSimpleModal({
        content: String(msg),
        showCancel: false,
        confirm() {
            wx.navigateBack();
        },
        cancel() {// Android可通过点击朦层关闭弹窗，所以要针对这种情况进行处理
            wx.navigateBack();
        },
    });
};

export {
    showSimpleModal,
    showModalAndBack,
};
