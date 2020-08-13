'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _utils = require('../../helper/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var checkBundleFile = function checkBundleFile(global) {
    var keyword = 'hucdn.com'; // 需要检查的关键词
    var searchScope = _path2.default.resolve('./src');
    if (!global) {
        var GITDIFF = 'git diff HEAD --name-only --cached';
        var stdout = (0, _utils.execSync)(GITDIFF).split('\n').map(function (diffPath) {
            return _path2.default.resolve(diffPath);
        });
        console.log('关键词待检查的文件列表\n', stdout);
        searchScope = stdout.join(' ');
    }
    console.log('grep -r -n \'' + keyword + '\' ' + searchScope);
    var result = (0, _utils.execSync)('grep -r -n \'' + keyword + '\' ' + searchScope, {
        slience: true
    });
    if (typeof result === 'string') {
        console.log(_chalk2.default.red('提交内容包含违法关键词：\n'));
        console.log(_chalk2.default.red(result));
        return false;
    }
    if (result && result.stderr) {
        console.log(result.stderr);
    }
    console.log(_chalk2.default.green('\u63D0\u4EA4\u5185\u5BB9\u4E0D\u5305\u542B\u8FDD\u6CD5\u5173\u952E\u8BCD\uFF1A' + keyword + '\n'));
    return true;
};

exports.default = checkBundleFile;
module.exports = exports.default;