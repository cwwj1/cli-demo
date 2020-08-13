'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _commander2 = require('commander');

var _commander3 = _interopRequireDefault(_commander2);

var _utils = require('../helper/utils');

var _checkEnv2 = require('../check-env');

var _nodeCommon = require('./nodeCommon');

var _nodeCommon2 = _interopRequireDefault(_nodeCommon);

var _catalyst = require('./catalyst');

var _catalyst2 = _interopRequireDefault(_catalyst);

var _console = require('./console');

var _console2 = _interopRequireDefault(_console);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @Author: chenjie.lu
 * @Date: 2020-02-03 13:57:49
 * @Last Modified by: chenjie.lu
 * @Last Modified time: 2020-02-19 22:13:53
 * @Description: 启动对应工程
 */

var getProject = _utils.getProject;
var commander = _commander3.default;
var checkEnv = _checkEnv2.checkEnv;
var nodeCommonScript = _nodeCommon2.default;
var catalystScript = _catalyst2.default;
var consoleScript = _console2.default;

var start = async function start() {
    await checkEnv();
    var project = commander.type;

    if (!project) {
        project = getProject();
    }
    switch (project) {
        case 'airjs-common':
            return nodeCommonScript();
        case 'catalyst':
            return catalystScript();
        case 'console':
            return consoleScript();
        default:
            console.log('找不到对应的执行命令，您是否在基础库执行了start命令？');
            console.log('基础库请自行增加start命令');
            return false;
    }
};

exports.default = start;
module.exports = exports.default;