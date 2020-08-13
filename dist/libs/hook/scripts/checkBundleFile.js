'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('../../helper/utils');

var checkBundleFile = function checkBundleFile() {
    var result = (0, _utils.execSync)('git diff --name-only --cached') || '';
    if (result.match(/assets2\/(static|webpack-assets)/)) {
        console.log('请不要提交打包后的文件');
        return false;
    }
    console.log('checkbundle 通过！');
    return true;
};

exports.default = checkBundleFile;
module.exports = exports.default;