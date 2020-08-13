const path = require('path');
const glob = require('glob');
const fs = require('fs');
const sourceName = path.resolve('./src/libs/init/template');

const files = glob.sync(`${sourceName}/**/*`, {
    nodir: true,
    matchBase: true,
    dot: true,
});

const targetName = path.resolve('./dist/libs/init/template');
// src下文件路径
for (const file of files) {
    // 模板相对路径
    const relativPath = path.relative(sourceName, file);
    // 真实路径
    const realPath = path.join(targetName, relativPath);
    // 目录
    const dirName = path.dirname(realPath);
    // 目录不存在的情况下递归的创建目录
    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, {
            recursive: true,
        });
    }
    fs.copyFileSync(file, realPath);
}
