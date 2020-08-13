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

var _nodeCommonEslintDiff = require('../scripts/nodeCommonEslintDiff');

var _nodeCommonEslintDiff2 = _interopRequireDefault(_nodeCommonEslintDiff);

var _catalystEslintDiff = require('../scripts/catalystEslintDiff');

var _catalystEslintDiff2 = _interopRequireDefault(_catalystEslintDiff);

var _consoleEslintDiff = require('../scripts/consoleEslintDiff');

var _consoleEslintDiff2 = _interopRequireDefault(_consoleEslintDiff);

var _checkBundleFile = require('../scripts/checkBundleFile');

var _checkBundleFile2 = _interopRequireDefault(_checkBundleFile);

var _checkIllegalKeywords = require('../scripts/checkIllegalKeywords');

var _checkIllegalKeywords2 = _interopRequireDefault(_checkIllegalKeywords);

var _imageCheck = require('../scripts/imageCheck');

var _imageCheck2 = _interopRequireDefault(_imageCheck);

var _utils = require('../../helper/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hook = function hook() {
    var isSuccess = true;
    var type = _commander2.default.type;

    var project = (0, _utils.getProject)(type);
    switch (project) {
        case 'airjs-common':
            isSuccess = (0, _checkBundleFile2.default)() && (0, _checkIllegalKeywords2.default)() && (0, _nodeCommonEslintDiff2.default)() && (0, _imageCheck2.default)();
            break;
        case 'catalyst':
            isSuccess = (0, _checkBundleFile2.default)() && (0, _checkIllegalKeywords2.default)() && (0, _catalystEslintDiff2.default)();
            break;
        case 'console':
            isSuccess = (0, _checkBundleFile2.default)() && (0, _checkIllegalKeywords2.default)() && (0, _consoleEslintDiff2.default)();
            break;
        case 'lib-node':
        case 'lib-catalyst':
        case 'lib-common':
            break;
        default:
            console.log('找不到对应的执行命令，请确认您的工程类型是否正确？');
    }
    if (!isSuccess) {
        console.log(_chalk2.default.red('\nPRE COMMIT ERROR!'));
        _shelljs2.default.exit(1);
    }
};

exports.default = hook;
module.exports = exports.default;