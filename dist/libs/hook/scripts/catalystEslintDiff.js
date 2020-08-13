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
        return (
            // /(\.js|\.vue)(\n|$)/gi.test(diffFile)
            /^(?!dist).+(\.js|\.vue)(\n|$)/gi.test(diffFile)
        );
    });
    var errorCount = 0;
    var warningCount = 0;
    if (diffFileArray.length > 0) {
        console.log('待检查的文件列表');
        console.log(diffFileArray);
        var eslintResults = cli.executeOnFiles(diffFileArray).results;
        eslintResults.forEach(function (result) {
            errorCount += result.errorCount;
            warningCount += result.warningCount;
            if (result.messages && result.messages.length) {
                console.log('\x1b[38m', 'Eslint has found problems in file: ' + result.filePath);
                result.messages.forEach(function (msg) {
                    if (msg.severity === 2) {
                        console.log('\x1b[38m', '\u274C  Error : ' + msg.message + ' in Line ' + msg.line + ' Column ' + msg.column);
                    } else {
                        console.log('\x1b[38m', '\u26A0\uFE0F  warning : ' + msg.message + ' in Line ' + msg.line + ' Column ' + msg.column);
                    }
                });
                console.log('\x1b[38m', '');
            }
        });
    }
    if (errorCount >= 1) {
        console.log('\x1b[31m', '\uD83D\uDC1E  ESLint failed');
        console.log('\x1b[31m', '\u2716 ' + (errorCount + warningCount) + ' problems(' + errorCount + ' error, ' + warningCount + ' warning)');
        console.log('\x1b[31m', 'You can fix it by using "npm run eslint:fix" or review your changes \uD83D\uDE2F');
        return false;
    } else if (warningCount >= 2) {
        console.log('\x1b[32m', '🦁  ESLint passed, but need to be improved.');
        return true;
    }
    var emojis = ['🐳', '🐬', '🦄', '🐢', '🕊', '🐝']; //eslint-disable-line
    console.log('\x1b[32m', emojis[Math.floor(Math.random() * 6)] + '  ESLint passed');
    return true;
};

exports.default = eslintDiff;
module.exports = exports.default;