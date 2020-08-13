import commander from 'commander';
import glob from 'glob';
import path from 'path';
import {execSync} from '../helper/utils';

// 获取ssl下文件的名称
const getHttpsFileName = () => {
    const sslPath = path.resolve('./', 'ssl');
    const home = path.resolve('./');
    const files = glob.sync(`${sslPath}/*`, {
        nodir: true,
    });
    const httpsFile = {};
    files.forEach((file) => {
        if (file.match(/key$/)) {
            httpsFile.key = path.relative(home, file);
        }
        if (file.match(/crt$/)) {
            httpsFile.crt = path.relative(home, file);
        }
    });
    return httpsFile;
};

const startScript = () => {
    // 对node-h5工程的过滤方法临时兼容
    let npmFilter = '';
    try {
        const npmConfig = JSON.parse(process.env.npm_config_argv || '{}');
        const argv = npmConfig.original || [];
        argv.forEach((item) => {
            if (item.indexOf('--') === 0 && item !== '--filter') {
                console.log('您正在使用bf cli，临时对--的方式兼容处理，请使用-f参数来过滤页面，详见bf dev -h');
                npmFilter = item.replace('--', '');
            }
        });
    } catch (error) {
        npmFilter = '';
    }

    const {
        filter,
        watch,
        https,
    } = commander;
    // eslint-disable-next-line max-len
    let script = 'rm -f /tmp/local_source.lock && ./node_modules/.bin/webpack-dev-server --config ./node_modules/@fe-tool/webpack-config/src/webpack.dev.conf.js --port 8000';
    if (https) {
        const httpsFile = getHttpsFileName();
        script = `rm -f /tmp/local_source.lock && ./node_modules/.bin/webpack-dev-server --https --key ${httpsFile.key} --cert ${httpsFile.crt} --config ./node_modules/@fe-tool/webpack-config/src/webpack.dev.conf.js --port 8000`;
    }
    if (filter || npmFilter) {
        script += ` -f "${filter || npmFilter}"`;
    }
    const configArgv = {
        original: '',
    };
    if (watch) {
        configArgv.original = '-watch';
    }

    process.env.npm_config_argv = JSON.stringify(configArgv);
    execSync(script, {
        stdio: 'inherit',
        encoding: 'utf8',
    });
};

export default startScript;
