import commander from 'commander';
import start from '../libs/start';

if (process.env.npm_config_argv) {
    console.log('请直接使用bf start或npx bf start！');
}

commander
    .option('-t, --type <projectType>', '强制指定start的工程类型，可选类型：airjs-common, catalyst, console')
    .option('-p, --platform <platform>', '平台类型，win或other，默认为other')
    .option('--port <port>', 'node服务启动的端口号，默认为8080')
    .parse(process.argv);

start();
