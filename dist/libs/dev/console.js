'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _utils = require('../helper/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var startScript = function startScript() {
    // 对console工程的过滤方法临时兼容
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
        watch = _commander2.default.watch;

    var configArgv = {
        original: ''
    };
    if (watch) {
        configArgv.original = '-watch';
    }

    process.env.npm_config_argv = JSON.stringify(configArgv);
    var script = 'rm -f /tmp/local_source.lock && ./node_modules/.bin/webpack-dev-server --config ./bin/build/webpack.dev.conf.js --port 8000';
    if (filter || npmFilter) {
        script += ' -f "' + (filter || npmFilter) + '"';
    }
    // eslint-disable-next-line max-len
    (0, _utils.execSync)(script, {
        stdio: 'inherit', // 子进程使用父进程的stdout、stdin、stderr
        encoding: 'utf8'
    });
};

exports.default = startScript;
module.exports = exports.default;