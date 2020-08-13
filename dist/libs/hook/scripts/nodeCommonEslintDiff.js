'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _getEslint = require('./getEslint');

var _getEslint2 = _interopRequireDefault(_getEslint);

var _utils = require('../../helper/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import {CLIEngine} from 'eslint';
/* eslint-disable no-process-exit */
var eslintDiff = function eslintDiff() {
    var CLIEngine = (0, _getEslint2.default)();
    var cli = new CLIEngine({
        extensions: ['.js', '.vue']
    });

    var stdout = (0, _utils.execSync)('git diff --name-only --cached --diff-filter=ACM');

    if (!stdout) {
        return true;
    }
    var isSuccess = true;
    var diffFileArray = stdout.split('\n').filter(function (diffFile) {
        return (/^(?!assets2).+(\.js|\.vue)(\n|$)/gi.test(diffFile)
        );
    });
    if (diffFileArray.length > 0) {
        console.log('eslint 待检查的文件列表');
        console.log(diffFileArray);
        var report = cli.executeOnFiles(diffFileArray);
        var errorReport = CLIEngine.getErrorResults(report.results);
        if (errorReport.length) {
            isSuccess = false;
            console.log(cli.getFormatter('codeframe')(errorReport));
            try {
                _fs2.default.writeFileSync(_path2.default.resolve(__dirname, '../eslint-result.html'), cli.getFormatter('html')(report.results.filter(function (item) {
                    return item.messages.length;
                })));
            } catch (e) {}
        }
    }
    if (isSuccess) {
        console.log('\x1b[32m', 'ESLint passed');
    }
    return isSuccess;
};

exports.default = eslintDiff;
module.exports = exports.default;