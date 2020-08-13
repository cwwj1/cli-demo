/* eslint-disable no-console */
// import * as nunjucks from 'nunjucks';
import * as path from 'path';
import * as glob from 'glob';
import * as fs from 'fs';
import chalk from 'chalk';
// import {format} from 'date-fns';

const cwd = process.cwd();

const getData = () => {
    const now = new Date();
    const year = `0${now.getFullYear()}`.slice(-4);
    const month = `0${now.getMonth() + 1}`.slice(-2);
    const day = `0${now.getDate()}`.slice(-2);
    return `${year}-${month}-${day}`;
};

export const transform = function (answer, sourcePath, relationPath) {
    // const assigns = {
    //     projectType: answer.libType,
    //     projectName: answer.projectName,
    //     dateString: format(new Date(), 'yyyy.MM.dd'),
    // };
    const targetPath = path.join(cwd, answer.projectName);

    if (fs.existsSync(targetPath)) {
        console.log(chalk.red('目录中已存在同名称的文件夹！'));
        process.exit(1); // eslint-disable-line no-process-exit
    }
    const files = glob.sync(sourcePath, {
        nodir: true,
        matchBase: true,
        dot: true,
    });
    const {
        projectName,  // eslint-disable-line
        platform,
    } = answer;
    let projectType = ''; // eslint-disable-line
    let dateString = getData(); //eslint-disable-line
    if (platform === '贝店') {
        projectType = 'catalyst-beidian-demo';
    }
    if (platform === '贝仓') {
        projectType = 'catalyst-beicang-demo';
    }
    for (const file of files) {
        // 模板相对路径
        const relativPath = path.relative(relationPath, file);
        // 模板目录路径 - 最后需要生成的文件的目录
        const dirname = path.join(targetPath, path.dirname(relativPath));
        // 模板文件路径 - 最后需要生成的真实文件名
        const filename = path.basename(relativPath, '.text');

        // 目录不存在的情况下递归的创建目录
        if (!fs.existsSync(dirname)) {
            fs.mkdirSync(dirname, {
                recursive: true,
            });
            console.log('新建文件夹：', dirname);
        }
        // 写入文件内容
        const data = fs.readFileSync(file, {
            encoding: 'utf8',
        });
        const wirteContent = eval(data); // eslint-disable-line no-eval
        fs.writeFileSync(
            path.join(dirname, filename),
            wirteContent,
        );
    }
};
