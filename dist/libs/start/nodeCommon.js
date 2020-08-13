'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _commander2 = require('commander');

var _commander3 = _interopRequireDefault(_commander2);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _utils = require('../helper/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var commander = _commander3.default;
var execSync = _utils.execSync;

var startScript = function startScript() {
    var platform = commander.platform,
        _commander$port = commander.port,
        port = _commander$port === undefined ? 8080 : _commander$port;

    if (platform === 'win') {
        var fullPath = _path2.default.resolve('./package.json');
        var projectName = require(fullPath).name; // eslint-disable-line global-require
        // eslint-disable-next-line max-len
        return execSync('sudo ./node_modules/.bin/airjs-deploy-win ' + projectName + ' dev && rm -f /tmp/local_source.lock && ./node_modules/.bin/webpack-dev-server --https --key ./ssl/beidian_dev.key --cert ./ssl/beidian_dev.crt --config ./bin/build/webpack.dev.conf.js --port 8000 --watch-poll', {
            stdio: 'inherit',
            encoding: 'utf8'
        });
    }
    // eslint-disable-next-line max-len
    return execSync('sudo ./node_modules/.bin/airjs-docker-up -d "-p 80:' + port + ' -p 443:443 -p 9229:9229" -w "[\'app\', \'bin\', \'config\', \'index.web.js\']"', {
        stdio: 'inherit', // 子进程使用父进程的stdout、stdin、stderr
        encoding: 'utf8'
    });
};

exports.default = startScript;
module.exports = exports.default;