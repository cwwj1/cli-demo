// @desc
// @author  wei.nan
// @date    16/10/9 模板中的方法
'use strict';

const fs = require('fs');
const nodePath = require('path');
const config = require('../../config/config');
const productionAsset = config.productionAsset;
const devStaticHost = config.devStaticHost;
const manifest = require('../../manifest.json');

const isLocalSource = () => config.isDev && fs.existsSync('/tmp/local_source.lock');

let url = function (scope, option) {
    const publicAsset = nodePath.join('/ctl', manifest[option.params[0]] || '');
    let path = null;
    if (productionAsset) {
        path = publicAsset;
    } else {
        path = `${devStaticHost}/web/${option.params[0]}`;
    }
    if (isLocalSource()) {
        path = publicAsset;
    }
    return path;
};

let libsPath = function (scope, option) {
    let path = option.params[0];
    if (productionAsset) {
        return `//tools.beidian.com/ctl/dist/static/${path}`;
    }
    if (isLocalSource()) {
        return `//tools.beidian.com/ctl/dist/static/${path}`;
    }
    return `${devStaticHost}/assets/${path}`;
};

let urlMd5 = function (scope, option) {
    const filter = /-([\w]+)\.js/;
    let urlPath = url(scope, option);
    let hashAry = filter.exec(urlPath);
    let hash = hashAry[1];
    return hash;
};

let urlWithoutMd5 = function (scope, option) {
    const filter = /-([\w]+)\.js/;
    let urlPath = url(scope, option);
    urlPath = urlPath.replace(filter, '.js');
    return urlPath;
};

exports.url = url;

exports.urlMd5 = urlMd5;

exports.urlWithoutMd5 = urlWithoutMd5;

exports.libsPath = libsPath;

exports.isLocalSource = isLocalSource;
