import shell from 'shelljs';
import chalk from 'chalk';
import commander from 'commander';
import preCommit from '../libs/hook/hooks/preCommit';
import postCommit from '../libs/hook/hooks/postCommit';
import prePush from '../libs/hook/hooks/prePush';
import preInstall from '../libs/hook/hooks/preInstall';
import postInstall from '../libs/hook/hooks/postInstall';
import prePublish from '../libs/hook/hooks/prePublish';
import postPublish from '../libs/hook/hooks/postPublish';
import preStart from '../libs/hook/hooks/preStart';
import postStart from '../libs/hook/hooks/postStart';

const allowHook = [
    // git hook
    'pre-commit',
    'post-commit',
    'pre-push',
    // npm hook
    'preinstall',
    'postinstall',
    'prepublish',
    'postpublish',
    'prestart',
    'poststart',
];

commander
    .usage(`<name> [options]

支持的hook为: ${allowHook}`)
    .option('-t --type <projectType>', 'hook执行的工程类型，默认为根据keywords获取，可选类型：airjs-common, catalyst, console')
    .parse(process.argv);

const {args = []} = commander;
const [hook = ''] = args;

if (!allowHook.includes(hook)) {
    console.log(chalk.red(`❌ 现支持的hook为： ${allowHook}，不支持${hook}，请确认输入的hook名称是否正确！`));
    shell.exit(1);
}

switch (hook) {
    case 'pre-commit':
        preCommit();
        break;
    case 'post-commit':
        postCommit();
        break;
    case 'pre-push':
        prePush();
        break;
    case 'preinstall':
        preInstall();
        break;
    case 'postinstall':
        postInstall();
        break;
    case 'prepublish':
        prePublish();
        break;
    case 'postpublish':
        postPublish();
        break;
    case 'prestart':
        preStart();
        break;
    case 'poststart':
        postStart();
        break;
    default:
        console.log(chalk.red(`❌ 现支持的hook为： ${allowHook}，请确认输入的hook名称是否正确！`));
}
