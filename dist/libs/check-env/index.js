'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.checkEnv = undefined;

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var checkEnv = exports.checkEnv = function checkEnv() {
    var filePath = '/tmp/ctl-check-env.js';
    return new Promise(function (resolve) {
        return _request2.default.get('http://git.beibei.com.cn/public_group/ctl-cli/raw/master/check-env.js', {
            timeout: 2000
        }, function (_error, response) {
            var code = '';
            if (response && response.statusCode === 200) {
                code = response.body;
                fs.writeFile(filePath, response.body, function () {
                    return true;
                });
            } else if (fs.existsSync(filePath)) {
                code = fs.readFileSync(filePath, {
                    encoding: 'utf8'
                });
            }
            eval(code); // eslint-disable-line no-eval
            resolve();
        });
    });
};