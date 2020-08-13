import commander from 'commander';
import {execSync} from '../helper/utils';

const startScript = () => {
    // 对console工程的过滤方法临时兼容
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
    } = commander;
    const configArgv = {
        original: '',
    };
    if (watch) {
        configArgv.original = '-watch';
    }

    process.env.npm_config_argv = JSON.stringify(configArgv);
    let script = 'rm -f /tmp/local_source.lock && ./node_modules/.bin/webpack-dev-server --config ./bin/build/webpack.dev.conf.js --port 8000';
    if (filter || npmFilter) {
        script += ` -f "${filter || npmFilter}"`;
    }
    // eslint-disable-next-line max-len
    execSync(script, {
        stdio: 'inherit', // 子进程使用父进程的stdout、stdin、stderr
        encoding: 'utf8',
    });
};

export default startScript;
