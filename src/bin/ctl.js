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
        .command('check', '检查基础库是否可以提交')
        .command('check:env', '预检查开发环境与项目工程是否符合标准')
        .command('publish', '提交基础库')
        .command('start', '启动docker服务与js静态服务器')
        .command('dev', '启动js静态服务器')
        .command('build', '打包页面')
        .command('build:lib', '打包项目的lib文件夹')
        .command('build:hms', '打包hms所需文件')
        .command('hook <name>', '执行对应工程的对应git hook命令')
        .parse(process.argv);
})();
