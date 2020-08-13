'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _utils = require('../helper/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 获取ssl下文件的名称
var getHttpsFileName = function getHttpsFileName() {
    var sslPath = _path2.default.resolve('./', 'ssl');
    var home = _path2.default.resolve('./');
    var files = _glob2.default.sync(sslPath + '/*', {
        nodir: true
    });
    var httpsFile = {};
    files.forEach(function (file) {
        if (file.match(/key$/)) {
            httpsFile.key = _path2.default.relative(home, file);
        }
        if (file.match(/crt$/)) {
            httpsFile.crt = _path2.default.relative(home, file);
        }
    });
    return httpsFile;
};

var startScript = function startScript() {
    // 对node-h5工程的过滤方法临时兼容
    var npmFilter = '';
    try {
        var npmConfig = JSON.parse(process.env.npm_config_argv || '{}');
        var argv = npmConfig.original || [];
        argv.forEach(function (item) {
            if (item.indexOf('--') === 0 && item !== '--filter') {
                console.log('您正在使用bf cli，临时对--的方式兼容处理，请使用-f参数来过滤页面，详见bf dev -h');
                npmFilter = item.replace('--', '');
            }
        });
    } catch (error) {
        npmFilter = '';
    }

    var filter = _commander2.default.filter,
        watch = _commander2.default.watch,
        https = _commander2.default.https;
    // eslint-disable-next-line max-len

    var script = 'rm -f /tmp/local_source.lock && ./node_modules/.bin/webpack-dev-server --config ./node_modules/@fe-tool/webpack-config/src/webpack.dev.conf.js --port 8000';
    if (https) {
        var httpsFile = getHttpsFileName();
        script = 'rm -f /tmp/local_source.lock && ./node_modules/.bin/webpack-dev-server --https --key ' + httpsFile.key + ' --cert ' + httpsFile.crt + ' --config ./node_modules/@fe-tool/webpack-config/src/webpack.dev.conf.js --port 8000';
    }
    if (filter || npmFilter) {
        script += ' -f "' + (filter || npmFilter) + '"';
    }
    var configArgv = {
        original: ''
    };
    if (watch) {
        configArgv.original = '-watch';
    }

    process.env.npm_config_argv = JSON.stringify(configArgv);
    (0, _utils.execSync)(script, {
        stdio: 'inherit',
        encoding: 'utf8'
    });
};

exports.default = startScript;
module.exports = exports.default;