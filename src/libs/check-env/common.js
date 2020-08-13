import * as fs from 'fs';
import request from 'request';

const isExecuteInOneHour = (filePath) => {
    if (!fs.existsSync(filePath)) {
        return false;
    }
    if (Date.now() - fs.statSync(filePath).mtime < 3600000) {
        return true;
    }
    return false;
};

export default () => {
    const filePath = '/tmp/bf-check-common.js';
    // 一小时检测一次版本
    if (isExecuteInOneHour(filePath)) {
        return Promise.resolve();
    }
    return new Promise((resolve) => request.get('http://git.beibei.com.cn/public_group/bf-cli/raw/master/check-common.js', {
        timeout: 2000,
    }, (_error, response) => {
        let code = '';
        if (response && response.statusCode === 200) {
            code = response.body;
            fs.writeFile(filePath, response.body, () => true);
        } else if (fs.existsSync(filePath)) {
            code = fs.readFileSync(filePath, {
                encoding: 'utf8',
            });
        }
        eval(code); // eslint-disable-line no-eval
        resolve();
    })
    );
};
