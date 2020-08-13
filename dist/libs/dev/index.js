'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('../helper/utils');

var _nodeCommon = require('./nodeCommon');

var _nodeCommon2 = _interopRequireDefault(_nodeCommon);

var _catalyst = require('./catalyst');

var _catalyst2 = _interopRequireDefault(_catalyst);

var _console = require('./console');

var _console2 = _interopRequireDefault(_console);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var start = function start() {
    var project = (0, _utils.getProject)();
    switch (project) {
        case 'airjs-common':
            (0, _nodeCommon2.default)();
            break;
        case 'catalyst':
            (0, _catalyst2.default)();
            break;
        case 'console':
            (0, _console2.default)();
            break;
        default:
            console.log('找不到对应的执行命令，您是否在基础库执行了start命令？');
            console.log('基础库请自行增加start命令');
    }
};

exports.default = start;
module.exports = exports.default;