# catalyst_beidian_store

贝店私域工具跨端项目工程

### 相关清单

**catalyst_beidian_store环境/工具清单**

| 现有环境/工具 |  版本 |
|--------|--------|
|    CentOS Linux    |   7.2.1511     |
|    node     |  8.5.0      |
|    pm2     |  2.7.1      |
|    koa 1.x     |  airjs(基于koa 2.x)      |


### 快速开始

为了统一开发环境、和生产环境保持同步、采用docker开发。

#### docker安装方法

**docker下载地址** : 
[https://www.docker.com/community-edition](https://www.docker.com/community-edition)
推荐国内下载地址[https://www.kancloud.cn/jingyucloud/docker/306050](https://www.kancloud.cn/jingyucloud/docker/306050)

**1.绑定本地host,host列表**
~~~
127.0.0.1 tools.beidian.com
127.0.0.1 local.beidian.com
~~~

**2.启动容器**

`Linux/Mac` :

```shell
$ git clone http://git.beibei.com.cn/node-projects/catalyst_beidian_store.git
$ cd catalyst_beidian_store
$ npm install --registry="http://npm.repos.beibei.com.cn/"
$ (sudo) npm start # 启动容器
```
`注意 : 其中第一次执行npm start会比较慢，因为第一次docker会拉取操作系统的镜像，请大约等待5min~10min.`

`Windows` :

windows开发需要安装`VirtualBox`/`Vagrant`

VirtualBox和Vagrant下载地址 : [http://doc.husor.com/pages/viewpage.action?pageId=24808062](http://doc.husor.com/pages/viewpage.action?pageId=24808062),只需要下载vagrant和virtualbox就好,其他不需要下载.

```shell
$ git clone http://git.beibei.com.cn/node-projects/catalyst_beidian_store.git
$ cd activ
$ curl -sS http://192.168.20.198:9099/win-init.sh | bash ## 密码beibei123,后续开发只需要执行vagrant ssh
$ vagrant ssh # 密码beibei123
$ node-start # 启动容器
```

**3.监听webpack变化**

如果你看到这段代码，恭喜你，后端服务已经成功启动了。

~~~
 |************************************************
 |
 |               容器正在启动，请稍等...
 | 1.重新进入容器 : npm run ssh
 | 2.查看node日志 : pm2 logs
 | 3.重启pm2 : npm run pm2:restart
 |
 |************************************************
 .
 ..
 ...
 ☞ 请在docker外启动webpack监听, 如npm run dev src/biz/demo/hello/index.vue
~~~

现在新开一个终端窗口，npm run dev your-path(输入完整调试路径，以index.vue结尾)。
等待调试工具devtool出现.

**4.访问链接**
在devtool中输入url即可调试web端。  
weex端调试需要在手机上打开贝贝APP, 即可自动展示实机投影。  
devtool使用说明[详见](http://git.beibei.com.cn/catalyst/catalyst-devtools)

附: 实际访问地址  
web: [http://tools.beidian.com/ctl/demo/hello.html](http://tools.beidian.com/ctl/demo/hello.html)
weex: [http://m.beicang.com/ctl/demo/hello/index.weex.js](http://m.beicang.com/ctl/demo/hello/index.weex.js)

### 业务发布

目前业务发布走悟空,悟空对应项目为`贝贝跨端项目发布`

### 其他功能
catalyst-toolkit支持调试线上Weex页面、本地新建跨端项目等功能，请先全局安装[@catalyst/catalyst-toolkit](http://git.beibei.com.cn/catalyst/catalyst-toolkit).  

启动weex工程命令
```
npm run dev:weex demo/hello
npm run dev:weex xretail/album/my_material
```

### 常见的问题

| Q | A |
|--------|--------|
| userland proxy: listen tcp 0.0.0.0:80: bind: address already in use.     |  80端口被占用.请检查nginx,tomcat,node服务是否存在占有80的情况.常用命令`sudo lsof -i:80`   |
| Cannot connect to the Docker daemon. Is the docker daemon running on this host | docker服务没启动，检查docker是否启动. |
| ERROR in assest2/static/demo/address-f2f2a18b.js from UglifyJs Unexpected token: name  | node版本过低，请升级node版本到8.5.0 |
| 服务正常启动，但是This site can’t be reached(ERR_NAME_NOT_RESOLVED) |  检查本地host是否绑定. |
| 如何打开多个虚拟机窗口?(比如同时查看pm2日志以及查看webpack打包日志) |  npm run ssh |
| 服务正常启动，页面能正常访问，但是静态资源404. | 检查容器中webpack是否正常启动.若没启动则执行`npm run dev [--project]`启动. |
| 项目中webpack如何监听指定目录  | npm run dev --project.其中project是项目名称 |
| 如何访问容器? | npm run ssh |
| 如何启动webpack | npm run dev [--project] |
| An unexpected error occurred: "EPROTO: protocol error, symlink XXX | 原因是vagrant需要admin操作权限，GIT-BASH按照admin权限启动即可 |
| 开发环境使用上有问题的话 | 请联系陈泽韦 |
| 项目开发上使用有问题的话 | 请联系何文俊 |

