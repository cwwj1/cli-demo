'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.transform = undefined;

var _path = require('path');

var path = _interopRequireWildcard(_path);

var _glob = require('glob');

var glob = _interopRequireWildcard(_glob);

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// import {format} from 'date-fns';

/* eslint-disable no-console */
// import * as nunjucks from 'nunjucks';
var cwd = process.cwd();

var getData = function getData() {
    var now = new Date();
    var year = ('0' + now.getFullYear()).slice(-4);
    var month = ('0' + (now.getMonth() + 1)).slice(-2);
    var day = ('0' + now.getDate()).slice(-2);
    return year + '-' + month + '-' + day;
};

var transform = exports.transform = function transform(answer, sourcePath, relationPath) {
    // const assigns = {
    //     projectType: answer.libType,
    //     projectName: answer.projectName,
    //     dateString: format(new Date(), 'yyyy.MM.dd'),
    // };
    var targetPath = path.join(cwd, answer.projectName);

    if (fs.existsSync(targetPath)) {
        console.log(_chalk2.default.red('目录中已存在同名称的文件夹！'));
        process.exit(1); // eslint-disable-line no-process-exit
    }
    var files = glob.sync(sourcePath, {
        nodir: true,
        matchBase: true,
        dot: true
    });
    var projectName = answer.projectName,
        platform = answer.platform;

    var projectType = ''; // eslint-disable-line
    var dateString = getData(); //eslint-disable-line
    if (platform === '贝店') {
        projectType = 'catalyst-beidian-demo';
    }
    if (platform === '贝仓') {
        projectType = 'catalyst-beicang-demo';
    }
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = files[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var file = _step.value;

            // 模板相对路径
            var relativPath = path.relative(relationPath, file);
            // 模板目录路径 - 最后需要生成的文件的目录
            var dirname = path.join(targetPath, path.dirname(relativPath));
            // 模板文件路径 - 最后需要生成的真实文件名
            var filename = path.basename(relativPath, '.text');

            // 目录不存在的情况下递归的创建目录
            if (!fs.existsSync(dirname)) {
                fs.mkdirSync(dirname, {
                    recursive: true
                });
                console.log('新建文件夹：', dirname);
            }
            // 写入文件内容
            console.log('file,', file);
            var data = fs.readFileSync(file);
            var wirteContent = eval(data); // eslint-disable-line no-eval
            fs.writeFileSync(path.join(dirname, filename), wirteContent);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
};