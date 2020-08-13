'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getEslint = require('./getEslint');

var _getEslint2 = _interopRequireDefault(_getEslint);

var _utils = require('../../helper/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-process-exit */
// import {CLIEngine} from 'eslint';
var eslintDiff = function eslintDiff() {
    var CLIEngine = (0, _getEslint2.default)();
    var cli = new CLIEngine({});
    var GITDIFF = 'git diff HEAD --name-only --cached';

    var stdout = (0, _utils.execSync)(GITDIFF) || '';
    var diffFileArray = stdout.split('\n').filter(function (diffFile) {
        return (/(\.js|\.vue)(\n|$)/gi.test(diffFile)
        );
    });
    if (diffFileArray.length > 0) {
        console.log('待检查的文件列表');
        console.log(diffFileArray);
        var errorCount = 0;
        var warningCount = 0;
        var eslintResults = cli.executeOnFiles(diffFileArray).results;
        eslintResults.forEach(function (result) {
            errorCount += result.errorCount;
            warningCount += result.warningCount;
            if (result.errorCount && result.messages) {
                console.log('\x1b[38m', 'Errors in file: ' + result.filePath);
                result.messages.forEach(function (msg) {
                    console.log('\x1b[38m', '\u2716 Error : ' + msg.message + ' in Line ' + msg.line + ' Column ' + msg.column);
                });
                console.log('\x1b[38m', '');
            }
        });
        if (errorCount >= 1) {
            console.log('\x1b[31m', 'ESLint failed');
            console.log('\x1b[36m', '\u2716 ' + (errorCount + warningCount) + ' problems(' + errorCount + ' error, ' + warningCount + ' warning)');
            console.log('\x1b[31m', 'Please use "npm run eslint:fix" before you commit.\uD83D\uDE0C');
            return false;
        }
        console.log('\x1b[32m', 'ESLint passed');
        return true;
    }
    return true;
};

exports.default = eslintDiff;
module.exports = exports.default;