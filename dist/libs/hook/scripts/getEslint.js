'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _path = require('path');

var path = _interopRequireWildcard(_path);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var getEslint = function getEslint() {
    var cwd = process.cwd();
    var eslintPath = !path.relative(cwd, __dirname).startsWith('..') ? 'eslint' : cwd + '/node_modules/eslint';
    console.log('\u4F7F\u7528 ' + eslintPath + ' \u4E0B\u7684eslint');

    var _require = require(eslintPath),
        CLIEngine = _require.CLIEngine; // eslint-disable-line global-require


    return CLIEngine;
}; // 优先使用工程本身的eslint，以防出现不可预测的异常状况
exports.default = getEslint;
module.exports = exports.default;