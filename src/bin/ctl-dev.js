import commander from 'commander';
import dev from '../libs/dev';

if (process.env.npm_config_argv) {
    console.log('请直接使用bf dev或npx bf dev！');
}

commander
    .option('-f --filter <file|folder|regexp>', '需要打包并监听更改的页面，可以使用正则匹配多个页面')
    .option('-w --watch', '开启主动监听，确保热更新有效（非必须）')
    .option('--https', '开始https')
    .option('-c --ctl-build-type <type>', 'catalyst打包与启动静态服务的类型，可选类型：all, weex, web, wxmp, old_wxmp, new_wxmp，默认为all')
    .parse(process.argv);

dev();
