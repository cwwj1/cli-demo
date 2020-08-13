/* eslint-disable no-process-exit */
/* 从模板中替换项目配置 */

/**
 * 获取第三个参数
 *
 * @example
 *      node init_project.js '{"project": "console_fed2", "url":"fed.beibei.com.cn"}'
 *
 * @type {string}
 */
const inputCommend = process.argv[2];

/**
 * @type {{project: String, url: String}}
 */
let commends;
try {
    commends = JSON.parse(inputCommend);

    // 入参必须要包含project
    if (!commends.project || !commends.url) {
        throw new Error('入参必须要包含url/project');
    }

    commends.project = commends.project
        .replace(/\s/g, '')
        .replace(/^[\s\S]+\/\//, '');
} catch (e) {
    console.error(`入参解析失败 : ${e.message}`, e);
    process.exit(-1);
}

const fs = require('fs');

let walk = (dir) => {
    let children = [];
    fs.readdirSync(dir).forEach((filename) => {
        let path = `${dir}/${filename}`;
        let stat = fs.statSync(path);
        if (stat && stat.isDirectory()) {
            children = children.concat(walk(path));
        } else if (path.indexOf('.git') === -1 && filename[0] !== '.') {
            children.push(path);
        }
    });

    return children;
};

let toReplace = (filePath) => {
    let data = fs.readFileSync(filePath, 'utf8');
    // let needChange = false;

    data = data.replace(/catalyst_beidian_store/g, commends.project);
    data = data.replace(/{#__URL__#}/g, commends.url);
    fs.writeFileSync(filePath, data, 'utf8');
};

let dirs = [
    './bin',
    './config',
    './app/helpers',
];

let files = [
    './index.web.js',
    './package.json',
];

dirs.forEach((dir) => {
    let dirFiles = walk(dir);
    files = files.concat(dirFiles);
});

files.forEach(toReplace);
