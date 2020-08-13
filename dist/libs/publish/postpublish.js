'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('../helper/utils');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
    var dir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    var dirPath = _path2.default.resolve(dir);
    var packageJSONPath = _path2.default.resolve('./package.json');
    // eslint-disable-next-line global-require
    var version = require(packageJSONPath).version;
    (0, _utils.execSync)('git -C ' + dirPath + ' tag v' + version, true);
    (0, _utils.execSync)('git -C ' + dirPath + ' push origin v' + version, true);
    console.log('\u63D0\u4EA4tag\u6210\u529F\uFF01\u7248\u672C\u53F7' + version);
    return true;
};

module.exports = exports.default;