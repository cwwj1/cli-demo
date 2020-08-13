#! /usr/bin/env node

import commander from 'commander';
import importLocal from 'import-local';
import checkCommon from '../libs/check-env/common';

process.on('uncaughtException', (error) => {
    console.log(error);
});
process.on('unhandledRejection', (reason) => {
    console.log(reason);
});

checkCommon();

(() => {
    // 优先使用本地的cli
    if (importLocal(__filename)) {
        return;
    }
    commander
        .usage(`[options] command
具体信息请查看 http://git.beibei.com.cn/fe-tool/beibei-frontend-cli
        `)
        .version('0.0.4', '-v, --version')
        .command('init', '创建一个基础库')
        .parse(process.argv);
})();
