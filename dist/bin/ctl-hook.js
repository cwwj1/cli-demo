'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _preCommit = require('../libs/hook/hooks/preCommit');

var _preCommit2 = _interopRequireDefault(_preCommit);

var _postCommit = require('../libs/hook/hooks/postCommit');

var _postCommit2 = _interopRequireDefault(_postCommit);

var _prePush = require('../libs/hook/hooks/prePush');

var _prePush2 = _interopRequireDefault(_prePush);

var _preInstall = require('../libs/hook/hooks/preInstall');

var _preInstall2 = _interopRequireDefault(_preInstall);

var _postInstall = require('../libs/hook/hooks/postInstall');

var _postInstall2 = _interopRequireDefault(_postInstall);

var _prePublish = require('../libs/hook/hooks/prePublish');

var _prePublish2 = _interopRequireDefault(_prePublish);

var _postPublish = require('../libs/hook/hooks/postPublish');

var _postPublish2 = _interopRequireDefault(_postPublish);

var _preStart = require('../libs/hook/hooks/preStart');

var _preStart2 = _interopRequireDefault(_preStart);

var _postStart = require('../libs/hook/hooks/postStart');

var _postStart2 = _interopRequireDefault(_postStart);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var allowHook = [
// git hook
'pre-commit', 'post-commit', 'pre-push',
// npm hook
'preinstall', 'postinstall', 'prepublish', 'postpublish', 'prestart', 'poststart'];

_commander2.default.usage('<name> [options]\n\n\u652F\u6301\u7684hook\u4E3A: ' + allowHook).option('-t --type <projectType>', 'hook执行的工程类型，默认为根据keywords获取，可选类型：airjs-common, catalyst, console').parse(process.argv);

var _commander$args = _commander2.default.args,
    args = _commander$args === undefined ? [] : _commander$args;

var _args = _slicedToArray(args, 1),
    _args$ = _args[0],
    hook = _args$ === undefined ? '' : _args$;

if (!allowHook.includes(hook)) {
    console.log(_chalk2.default.red('\u274C \u73B0\u652F\u6301\u7684hook\u4E3A\uFF1A ' + allowHook + '\uFF0C\u4E0D\u652F\u6301' + hook + '\uFF0C\u8BF7\u786E\u8BA4\u8F93\u5165\u7684hook\u540D\u79F0\u662F\u5426\u6B63\u786E\uFF01'));
    _shelljs2.default.exit(1);
}

switch (hook) {
    case 'pre-commit':
        (0, _preCommit2.default)();
        break;
    case 'post-commit':
        (0, _postCommit2.default)();
        break;
    case 'pre-push':
        (0, _prePush2.default)();
        break;
    case 'preinstall':
        (0, _preInstall2.default)();
        break;
    case 'postinstall':
        (0, _postInstall2.default)();
        break;
    case 'prepublish':
        (0, _prePublish2.default)();
        break;
    case 'postpublish':
        (0, _postPublish2.default)();
        break;
    case 'prestart':
        (0, _preStart2.default)();
        break;
    case 'poststart':
        (0, _postStart2.default)();
        break;
    default:
        console.log(_chalk2.default.red('\u274C \u73B0\u652F\u6301\u7684hook\u4E3A\uFF1A ' + allowHook + '\uFF0C\u8BF7\u786E\u8BA4\u8F93\u5165\u7684hook\u540D\u79F0\u662F\u5426\u6B63\u786E\uFF01'));
}