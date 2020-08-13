'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('../helper/utils');

var execSync = _utils.execSync;

var startScript = function startScript() {
    // eslint-disable-line arrow-body-style
    // eslint-disable-next-line max-len
    return execSync('sudo ./node_modules/.bin/airjs-docker-up -d "-p 80:80 -p 8000:8000 -p 443:443 -p 9229:9229" -w "[\'app\', \'bin\', \'config\', \'index.web.js\']"', {
        stdio: 'inherit',
        encoding: 'utf8'
    });
};

exports.default = startScript;
module.exports = exports.default;