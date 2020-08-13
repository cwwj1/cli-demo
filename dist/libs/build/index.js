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

var _checkIllegalKeywords = require('../hook/scripts/checkIllegalKeywords');

var _checkIllegalKeywords2 = _interopRequireDefault(_checkIllegalKeywords);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getProject = _utils.getProject;
var nodeCommonScript = _nodeCommon2.default;
var catalystScript = _catalyst2.default;
var consoleScript = _console2.default;
var checkKeywords = _checkIllegalKeywords2.default;

var start = function start() {
    if (!checkKeywords(true)) {
        console.log(123);
        process.exit(1); // eslint-disable-line no-process-exit
    }
    var project = getProject();
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