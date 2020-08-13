# beibei-frontend-cli

<!-- 标签 START -->

[![build status](http://git.beibei.com.cn/fe-tool/beibei-frontend-cli/badges/master/build.svg)](http://git.beibei.com.cn/fe-tool/beibei-frontend-cli/commits/master)
[![coverage report](http://git.beibei.com.cn/fe-tool/beibei-frontend-cli/badges/master/coverage.svg)](http://git.beibei.com.cn/fe-tool/beibei-frontend-cli/commits/master)
[![version](http://npm.beibei.com.cn/badge/v/@fe-tool/beibei-frontend-cli.svg)](http://npm.beibei.com.cn/package/@fe-tool/beibei-frontend-cli)
<!-- 标签 END -->

<!-- 描述 START -->

贝贝集团前端统一命令行工具

<!-- 描述 END -->
_ _ _

<!-- 目录 START -->

+ [安装](#安装)
+ [用法](#用法)
+ [文档](#文档)
    + [API](#api)
        + [version](#version)
        + [init](#init)
        + [check](#check)
        + [publish](#publish)
        + [check:env](#check:env)
        + [start](#start)
        + [dev](#dev)
        + [build](#build)
        + [build:lib](#build:lib)
        + [build:hms](#build:hms)
        + [hook](#hook)
+ [联系我们](#联系我们)

<!-- 目录 END -->

_ _ _

<!-- 安装 START -->

## 安装
```bash
$ npm install -g @fe-tool/beibei-frontend-cli --registry="http://npm.repos.beibei.com.cn/" --save
```
<!-- 安装 END -->

<!-- 用法 START -->

## 用法

<!-- 用法 END -->

- 查询帮助
```bash
    $ bf -h(--help)

    $ bf [command] -h(--help)
```

- 初始化基础库工程
```bash
    $ bf init
```

- 检查基础库工程
```bash
    $ bf check
```

- 发布基础库工程
```bash
    $ bf publish
```

- 启动docker服务
```bash
    $ bf start

    $ bf start -p win // windows环境下启动docker
```

- 启动本地服务
```bash
    $ bf dev -f detail/detail
```

- 打包工程
```bash
    $ bf build
```

- 执行hook

> 工程安装bf或者安装指定依赖 && package.json增加hook与scripts：

```
 $ npm install --save-dev post-commit pre-commit pre-push
```

``` JSON
// scripts
"pre-commit": "bf hook pre-commit",
"post-commit": "bf hook post-commit",
"pre-push": "bf hook pre-push",
"postinstall": "bf hook postinstall",
"prepublishOnly": "bf hook prepublish",
"postpublish": "bf hook postpublish",
"prestart": "bf hook prestart",
"poststart": "bf hook poststart"
// hook
"pre-commit": [
    "pre-commit"
],
"post-commit": [
    "post-commit"
],
"pre-push": [
    "pre-push"
],
```

```bash
    $ bf hook pre-commit
```

_ _ _

<!-- 文档START -->
## 文档

### API

#### init

初始化新建一个基础库工程；通过命令行交互根据提示输入基础库类型、包名与描述来初新建工程

``` bash
 $ bf init
```

#### check

发布前检查模块，未通过检查则中止发布流程（不需要手动执行）。检查项和执行项如下：
- 是否安装 git 与 npm；
- npm 版本是否6.4.1以上；
- 包版本是否提升
- 检查资源是否已经打包并提交
- 当前 git 分支是否是 master 主干；
- 检查是否使用bf进行提交

``` bash
  $ bf check
```

#### publish

发布模块，发布前会执行 `bf check`，发布后会执行自动打tag至gitlab

``` bash
  $ bf publish
```

#### check:env

工程通用性检查，调用远程js脚本进行检查，脚本地址为`http://git.beibei.com.cn/public_group/bf-cli/raw/master/check-env.js`

```bash
    $ bf check:env
```

#### start

启动docker服务，catalyst在wxmp与weex端不需要启动docker服务

参数：
- -h --help 获取帮助
- -t --type 强制指定start的工程类型，cli会根据keywords自动获取类型，可选参数为 `node-common` , `catalyst` , `console`
- -p --platform docker执行的平台，可选参数为 `win`  `other`默认为other

```bash
    $ bf start
```

#### dev

启动本地静态服务

参数：
- -h --help 获取帮助
- -f --filter 需要监听的页面地址
- -w --watch 开去轮训监听，确保热更新有效（自带热更新无效的情况下开启）
- --https 开启https服务
- -c --ctl-build-type catalyst使用，指定打包类型，默认为all 可选参数为 `all` , `weex` , `web` , `wxmp` , `old_wxmp` , `new_wxmp`

```bash
    $ bf dev -f detail/detail
```

#### build

打包业务代码

参数：
- -h --help 获取帮助
- -f --filter 需要监听的页面地址

```bash
    $ bf build -f detail/detail
```

#### build:lib

打包lib库业务代码

参数：
- -h --help 获取帮助
- -f --filter 需要监听的页面地址

```bash
    $ bf build:lib -f vue
```

#### build:hms

打包lib库业务代码

参数：
- -h --help 获取帮助
- -f --filter 需要监听的页面地址

```bash
    $ bf build:hms
```

#### hook

执行对应hook命令

参数：
- [hook name] 执行的hook名称
- -h --help 获取帮助

``` bash
    bf hook pre-commit
```

<!-- 文档END -->
_ _ _

<!-- 联系我们 START -->

## 联系我们

|作者|Email|
|---|---|
|陆晨杰|chenjie.lue@beibei.com|
|陈泽伟|zewei.chen@beibei.com|

Issue反馈：[http://git.beibei.com.cn/fe-tool/beibei-frontend-cli/issues](http://git.beibei.com.cn/fe-tool/beibei-frontend-cli/issues)

<!-- 联系我们 END -->
