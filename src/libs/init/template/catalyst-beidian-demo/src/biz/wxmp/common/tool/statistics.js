/*
 * @Author: lin.cao
 * @Date: 2020-04-27 19:43:55
 * @LastEditTime: 2020-04-28 09:23:13
 * @LastEditors: lin.cao
 * @Description: 封装打点，带上用户等级信息
 * @FilePath: /catalyst_beicang/src/biz/wxmp/common/tool/statistics.js
 */
import statistics from '@catalyst/statistics';
// import request from './request';
import {levelStorage} from './storage';

const originSendLog = statistics.sendLog;

const getUserLevel = () => new Promise((resolve, reject) => {
    if (levelStorage.get() !== '') {
        resolve(levelStorage.get());
    } else {
        reject();
    }
});

statistics.sendLog = (info) => {
    getUserLevel()
        .then((level) => {
            if (info.json) {
                info.json.uid_type = level;
            } else {
                info.json = {
                    uid_type: level,
                };
            }
            originSendLog(info);
        })
        .catch(() => {
            originSendLog(info);
        });
};

export default statistics;
