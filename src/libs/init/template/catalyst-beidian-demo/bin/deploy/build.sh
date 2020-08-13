#!/bin/bash
export NODE_OPTIONS="--max-old-space-size=4096"
set -e
rm -rf ./node_modules

export NODE_VERSION=10.15.0
export NVM_NODEJS_ORG_MIRROR=https://npm.taobao.org/mirrors/node

. ~/.nvm/nvm.sh

nvm install ${NODE_VERSION}
NPM="nvm exec 10.15.0 npm"

${NPM} install --registry http://npm.repos.beibei.com.cn/
${NPM} run eslint
${NPM} run build

GIT_STATUS=`git status`
echo ${GIT_STATUS};

# 判断时候有需要提交的文件的文件
if [[ "${GIT_STATUS}" == *"nothing to commit"* ]]; then
    echo "没有可提交的内容";
else
    git add ./dist
    git add ./manifest.json

    git commit --no-verify -m "beicang auto commit build_files";
    git push
fi
