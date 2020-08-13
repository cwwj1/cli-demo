'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('../../helper/utils');

var imageCheck = function imageCheck() {
    var result = (0, _utils.execSync)('npx image-check --size=1024 --diff=HEAD');
    if (result && result.match(/校验通过/)) {
        return true;
    }
    return false;
};

exports.default = imageCheck;
module.exports = exports.default;