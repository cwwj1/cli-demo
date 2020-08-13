/*
 * @Author: lin.cao
 * @Date: 2020-04-22 10:27:55
 * @LastEditTime: 2020-04-27 11:41:06
 * @LastEditors: lin.cao
 * @Description: request
 * @FilePath: /catalyst_beicang/src/biz/wxmp/common/tool/request.js
 */
import {ajax} from '@catalyst/request';
import toast from '@catalyst/toast';
import {login} from './login';

const MAX_RESEND_TIMES = 3; // 最大重发次数
let resendTime = 0; // 重发次数

const getNetworkType = () => new Promise((resolve, reject) => {
    wx.getNetworkType({
        success: (res) => {
            resolve(res.networkType);
        },
        fail: reject,
    });
});

const url = 'https://api.beidian.com/wx_gateway/route.html?_airborne_channel=beidian';

const request = (options) => getNetworkType()
    .then((res) => {
        if (res !== 'none') {
            return Promise.resolve();
        }
        toast('请检查网络设置～');
        throw new Error('请检查网络设置～');
    })
    .then(() => new Promise((resolve, reject) => ajax({
        ...Object.assign({}, {
            url,
            formData: true,
            abr: true,
            timeout: 5000,
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                // Cookie: 'HX-BETA=8;pre=xq;',
                // Cookie: 'HX-BETA=1;airborne=true;dubbo.tag=store;',
                // Cookie: 'HX-BETA=67;dubbo.tag=store;',

            },
        }, options),
        success(resp) {
            if (resp.err_code === '2') { // session 失效
                if (resendTime <= MAX_RESEND_TIMES) {
                    login(() => {
                        resendTime += 1;
                        request(options)
                            .then((res) => {
                                resolve(res);
                            })
                            .catch(reject);
                    }, {
                        needAuth: true,
                    });
                } else {
                    toast('无法获得正确会话！');
                    throw new Error('无法获得正确会话！');
                }
            }
            resolve(resp);
        },
        error(err) {
            reject(err);
        },
    })));


export default request;
