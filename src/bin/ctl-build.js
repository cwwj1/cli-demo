import commander from 'commander';
import build from '../libs/build';

if (process.env.npm_config_argv) {
    console.log('请直接使用bf build或npx bf build！');
}

commander
    .option('-f --filter <file|folder|regexp>', '需要打包的页面，可以使用正则匹配多个页面，仅node-h5工程有效')
    .parse(process.argv);

build();
