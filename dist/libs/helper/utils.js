'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getProject = exports.compare = exports.execSync = undefined;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _child_process = require('child_process');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* ------------------------------ execSync ------------------------------ */

/**
 *
 * @param evalCode 具体执行命令
 * @param execSyncOptions execSync额外参数
 * @description execSync函数二次分装
 */
var execSync = exports.execSync = function execSync(evalCode, execSyncOptions, forceExit) {
    if (typeof execSyncOptions === 'boolean') {
        forceExit = execSyncOptions;
        execSyncOptions = {
            stdio: 'inherit',
            encoding: 'utf8'
        };
    }
    try {
        var result = (0, _child_process.execSync)(evalCode, Object.assign({
            encoding: 'utf8'
        }, execSyncOptions));
        return (result || '').trim();
    } catch (error) {
        !(execSyncOptions && execSyncOptions.slience) && console.error(_chalk2.default.red(evalCode + ' execError: \n '), error.stderr || error.stdout || error);
        if (forceExit) {
            _shelljs2.default.exit(1);
        }
        return error;
    }
};

/* ------------------------------ compare ------------------------------ */

/**
 *
 * @param target 需要转换的数字或字符串
 * @returns 转换以后的数字数组
 * @description 将数字或以点隔开的数字字符串切割为数组，不可转换为数字的字符串转化为0
 */
var convertToArray = function convertToArray(target) {
    if (typeof target === 'number') {
        return [target];
    }
    return target.split('.').map(function (item) {
        var numberItem = Number(item);
        return !Number.isNaN(numberItem) ? numberItem : 0;
    });
};

/**
 *
 * @param source 要比较的数字或字符串
 * @param target 被比较的数字或字符串
 * @returns 1: source 大于target -1: source 小于target 0: source等于target
 */
var compare = exports.compare = function compare(source, target) {
    if (source === target) {
        return 0;
    }
    var arrayedSource = convertToArray(source);
    var arrayedTarget = convertToArray(target);
    for (var index in arrayedSource) {
        var _source = arrayedSource[index];
        var _target = arrayedTarget[index] || 0;
        if (_source > _target) {
            return 1;
        } else if (_source < _target) {
            return -1;
        }
    }
    if (arrayedSource.length < arrayedTarget.length) {
        return -1;
    }
    return 0;
};

/* ------------------------------ getProject ------------------------------ */
var getProject = exports.getProject = function getProject(type) {
    if (['lib-common', 'lib-catalyst', 'lib-node', 'airjs-common', 'catalyst', 'console'].includes(type || '')) {
        return type || '';
    }
    var fullPath = _path2.default.resolve('./package.json');
    var isExist = _fs2.default.existsSync(fullPath);
    if (!isExist) {
        console.error(_chalk2.default.red('\u274C \u5F53\u524D\u6587\u4EF6\uFF1A' + fullPath + '\u4E0D\u5B58\u5728\uFF01'));
        _shelljs2.default.exit(1);
    }
    var keywords = require(fullPath).keywords || []; // eslint-disable-line global-require
    if (keywords.includes('lib-catalyst')) {
        return 'lib-catalyst';
    } else if (keywords.includes('lib-node')) {
        return 'lib-node';
    } else if (keywords.includes('lib-common')) {
        return 'lib-common';
    } else if (keywords.includes('airjs-common')) {
        return 'airjs-common';
    } else if (keywords.includes('catalyst')) {
        return 'catalyst';
    } else if (keywords.includes('console')) {
        return 'console';
    }
    console.error(_chalk2.default.red('\u274C \u5F53\u524Dkeywords\uFF1A' + keywords + '\u4E0D\u7B26\u5408\u89C4\u8303\uFF01\uFF0C\u8BF7\u4F7F\u7528\'lib-catalyst\', \'lib-node\', \'lib-common\', \'airjs-common\', \'catalyst\', \'console\''));
    _shelljs2.default.exit(1);
    return '';
};