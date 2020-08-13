/* eslint-disable */
// const wxPay = (params, success, cancel, fail, complete) => {
//     console.log('params=?',params);
//     wx.requestPayment({
//         // params,
//         timeStamp: params.timeStamp,
//         nonceStr: params.nonceStr,
//         package: params.package,
//         signType: params.signType || 'MD5',
//         paySign: params.paySign,
//         success (res) {
//             console.log('pay-success:',res);
//             success();
//         },
//         fail (res) {
//             console.log('pay-fail:',res);
//             fail(res.err_desc || '支付失败', res);
//         },
//         complete(res) {
//             console.log('pay-complete:',res);
//         },

//     });
//     // window.WeixinJSBridge.invoke('getBrandWCPayRequest', params, (res) => {
//     //     if (res.err_msg === 'get_brand_wcpay_request:ok') {
//     //         // 支付成功
//     //         success();
//     //     } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
//     //         // 支付取消
//     //         cancel();
//     //     } else {
//     //         // 支付失败
//     //         console.error('支付失败', res);
//     //         fail(res.err_desc || '支付失败');
//     //     }
//     // });
// };
const  TypeCheck = (function () {
    let TypeCheck = {};
    ['String', 'Number', 'Array', 'Boolean', 'Object', 'Undefined', 'Null', 'Function', 'Date'].forEach((type) => {
        (function (type) {
            TypeCheck[`is${type}`] = function (obj) {
                return toString.call(obj) === `[object ${type}]`;
            };
        }(type));
    });
    return TypeCheck;
}());

const ArrayUtils = {
    isFilledArray: (arr) => TypeCheck.isArray(arr) && arr.length,
    each: (elm, callback) => {
        if (TypeCheck.isArray(elm)) {
            let length = elm.length;
            for (let i = 0; i < length; i++) {
                if (callback(elm[i], i, elm) === false) {
                    break;
                }
            }
        } else if (TypeCheck.isObject(elm)) {
            for (let key in elm) {
                if (callback(elm[key], key, elm) === false) {
                    break;
                }
            }
        }
        return elm;
    },
    map: (elm, callback) => {
        let value = 0,
            ret = [];
        if (TypeCheck.isArray(elm)) {
            return elm.map(callback);
        } else if (TypeCheck.isObject(elm)) {
            for (let key in elm) {
                value = callback(elm[key], key, elm);
                ret.push(value);
            }
            return ret;
        }
    },
    findIndex: (elm, callback) => {
        if (TypeCheck.isArray(elm)) {
            return elm.findIndex(callback);
        }
    },
    find: (elm, callback) => {
        if (TypeCheck.isArray(elm)) {
            return elm.find(callback);
        } else if (TypeCheck.isObject(elm)) {
            for (let key in elm) {
                let ret = callback(elm[key], key, elm);
                if (ret) {return elm[key];}
            }
        }
    },
    compact: (elm) => {
        if (TypeCheck.isArray(elm)) {
            return elm.filter((item) => item);
        }
    },
    without: (elm, ...args) => {
        if (TypeCheck.isArray(elm)) {
            return elm.filter((item) => !args.includes(item));
        }
    },
    keys: (elm) => {
        if (TypeCheck.isObject(elm) || TypeCheck.isArray(elm)) {
            return Object.keys(elm);
        }
    },
    indexOf: (elm, val) => {
        if (TypeCheck.isArray(elm)) {
            return elm.indexOf(val);
        }
    },
    difference: (elm, args) => {
        if (TypeCheck.isArray(elm) && TypeCheck.isArray(args)) {
            return elm.filter((item) => !args.includes(item));
        }
    },
    reject: (elm, callback) => {
        if (TypeCheck.isArray(elm)) {
            let filArr = elm.filter(callback);
            return ArrayUtils.difference(elm, filArr);
        }
    },
    every: (elm, callback) => {
        if (TypeCheck.isArray(elm)) {
            return elm.every(callback);
        }
    },
};

export default {
    // wxPay,
    ArrayUtils,
};
