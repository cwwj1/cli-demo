'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _libCheck = require('../../check/libCheck');

var _utils = require('../../helper/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hook = async function hook() {
    // npm 5- 特殊行为 npm install会触发prepublish hook
    var npmConfigArgv = JSON.parse(process && process.env && process.env.npm_config_argv || '{}');
    var argv = npmConfigArgv && npmConfigArgv.original || [];
    if (argv.includes('install')) {
        return;
    }
    var isSuccess = true;
    var type = _commander2.default.type;

    var project = (0, _utils.getProject)(type);
    switch (project) {
        case 'airjs-common':
        case 'catalyst':
        case 'console':
            break;
        case 'lib-node':
        case 'lib-catalyst':
        case 'lib-common':
            await (0, _libCheck.checkTag)();
            break;
        default:
            console.log('找不到对应的执行命令，请确认您的工程类型是否正确？');
    }
    if (!isSuccess) {
        console.log(_chalk2.default.red('pre commit Error!'));
        _shelljs2.default.exit(1);
    }
};

exports.default = hook;
module.exports = exports.default;