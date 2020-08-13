'use strict';

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _utils = require('../libs/helper/utils');

var _libCheck = require('../libs/check/libCheck');

var _libCheck2 = _interopRequireDefault(_libCheck);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import nodeCommonCheck from '../libs/check/node-common';

_commander2.default.option('-d, --dir <path>', '需要检测的项目根目录').option('-n, --ignore', '跳过检测').option('-t, --type <projectType>', '强制指定检测类型，可选类型：lib-catalyst, lib-node, catalyst, airjs-common, console').parse(process.argv);

var ignore = _commander2.default.ignore,
    _type = _commander2.default.type;


var type = (0, _utils.getProject)(_type);
if (ignore) {
    console.log(_chalk2.default.keyword('orange')('⚠️  危险！！强制跳过检测！'));
}
switch (type) {
    case 'lib':
    case 'lib-common':
    case 'lib-catalyst':
    case 'lib-node':
        (0, _libCheck2.default)();
        break;
    case 'airjs-common':
        // nodeCommonCheck();
        break;
    default:
        console.log('找不到对应的执行命令，类型是否正确？');
}