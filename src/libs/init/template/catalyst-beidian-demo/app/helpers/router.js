/* eslint-disable global-require */
const fs = require('fs');
const Router = require('koa-router');

// 从路由注册表中获取路由
const router = new Router();

// 正则匹配路由
const regRoute = require(`../route/reg`);
for (let urlPath in regRoute) {
    let controller = regRoute[urlPath];

    router.get(RegExp(urlPath), controller);
}

// 普通 string 匹配路由
const routeFiles = fs.readdirSync('./app/route/');
// eslint-disable-next-line es/no-for-of-loops
for (let routeFile of routeFiles) {
    let route = require(`../route/${routeFile}`);

    for (let urlPath in route) {
        router.get(urlPath, route[urlPath]);
    }
}

module.exports = router;
