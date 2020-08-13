'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _lib = require('../libs/build/lib');

var _lib2 = _interopRequireDefault(_lib);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_commander2.default.option('-f --filter <file|folder|regexp>', '需要打包的页面，可以使用正则匹配多个页面').parse(process.argv);

(0, _lib2.default)();