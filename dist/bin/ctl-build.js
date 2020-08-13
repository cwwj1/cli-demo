'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _build = require('../libs/build');

var _build2 = _interopRequireDefault(_build);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (process.env.npm_config_argv) {
    console.log('请直接使用bf build或npx bf build！');
}

_commander2.default.option('-f --filter <file|folder|regexp>', '需要打包的页面，可以使用正则匹配多个页面，仅node-h5工程有效').parse(process.argv);

(0, _build2.default)();