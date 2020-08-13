#! /usr/bin/env node
'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _importLocal = require('import-local');

var _importLocal2 = _interopRequireDefault(_importLocal);

var _common = require('../libs/check-env/common');

var _common2 = _interopRequireDefault(_common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

process.on('uncaughtException', function (error) {
    console.log(error);
});
process.on('unhandledRejection', function (reason) {
    console.log(reason);
});

(0, _common2.default)();

(function () {
    // 优先使用本地的cli
    if ((0, _importLocal2.default)(__filename)) {
        return;
    }
    _commander2.default.usage('[options] command\n\u5177\u4F53\u4FE1\u606F\u8BF7\u67E5\u770B http://git.beibei.com.cn/fe-tool/beibei-frontend-cli\n        ').version('0.0.4', '-v, --version').command('init', '创建一个基础库').command('check', '检查基础库是否可以提交').command('check:env', '预检查开发环境与项目工程是否符合标准').command('publish', '提交基础库').command('start', '启动docker服务与js静态服务器').command('dev', '启动js静态服务器').command('build', '打包页面').command('build:lib', '打包项目的lib文件夹').command('build:hms', '打包hms所需文件').command('hook <name>', '执行对应工程的对应git hook命令').parse(process.argv);
})();