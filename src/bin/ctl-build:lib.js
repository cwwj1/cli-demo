import commander from 'commander';
import build from '../libs/build/lib';

commander
    .option('-f --filter <file|folder|regexp>', '需要打包的页面，可以使用正则匹配多个页面')
    .parse(process.argv);

build();
