'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _start = require('../libs/start');

var _start2 = _interopRequireDefault(_start);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (process.env.npm_config_argv) {
    console.log('请直接使用bf start或npx bf start！');
}

_commander2.default.option('-t, --type <projectType>', '强制指定start的工程类型，可选类型：airjs-common, catalyst, console').option('-p, --platform <platform>', '平台类型，win或other，默认为other').option('--port <port>', 'node服务启动的端口号，默认为8080').parse(process.argv);

(0, _start2.default)();