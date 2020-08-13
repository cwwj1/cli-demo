import * as fs from 'fs';
import request from 'request';

export const checkEnv = () => {
    const filePath = '/tmp/bf-check-env.js';
    return new Promise((resolve) => request.get('http://git.beibei.com.cn/public_group/bf-cli/raw/master/check-env.js', {
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
