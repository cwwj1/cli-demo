// const HtmlMinifier = require('koa-html-minifier');
const koaRewrite = require('koa-rewrite');
const koaResponseTime = require('koa-response-time');
const koaMount = require('koa-mount');
const koaStatic = require('koa-static');
const enforceHttps = require('koa-sslify');

/**
 * https 301重定向
 *
 * @return {Function}
 */
let httpsRewrite = () => enforceHttps({
    trustProtoHeader: true,
});

/**
 * 默认首页
 *
 * @return {Function}
 */
let indexRewrite = () => koaRewrite(/^\/?$/, '/index.html');

/**
 * 前缀重定向
 *
 * @return {Function}
 */
let prefixRewrite = () => koaRewrite(/^\/ctl\/activ(.*)/, '$1');

/**
 * 内部重定向,代替原先nginx重定向
 *
 * @return {Function}
 */
let internalRewrite = () => koaRewrite(/^\/ctl(\/[\w/]+)\.html(.*)/, '$1$2');

/**
 * HTML文件压缩
 *
 * @public
 * @return {HtmlMinifier}
 */
// let htmlMinifier = () => HtmlMinifier({
//     collapseWhitespace: true,
//     removeComments: false,
// });

/**
 * 响应时间中间件
 *
 * @public
 * @return {Function}
 */
let responseTime = () => koaResponseTime();

/**
 * 静态资源绑定
 *
 * @public
 * @return {Function}
 */
let staticMount = () => {
    const mount = koaMount('/ctl/dist/', koaStatic(`./dist`, {
        maxage: 300000,
    }));

    return mount;
};

/**
 * 页面CDN缓存中间件
 *
 * @public
 * @param ctx
 * @param next
 * @throws {Error}
 */
let pageCache = (ctx, next) => {
    ctx.cache = (maxAge) => {
        if (maxAge === false) {
            ctx.set('Cache-Control', 'private, no-cache, no-store');
            return;
        }

        if (typeof maxAge === 'number') {
            maxAge = Math.round(maxAge);
            ctx.set('Cache-Control', `max-age=30,s-maxage=${maxAge}`);
        } else {
            throw new Error(`invalid cache control value: ${maxAge}`);
        }
    };

    return next();
};

/**
 * 错误重定向
 *
 * @TODO 测试
 * @public
 * @param ctx
 * @param next
 * @return {Promise.<void>}
 */
let errorRedirect = async (ctx, next) => {
    await next();
    const status = ctx.response.status;

    if (status === 500) {
        ctx.status = 404;
        ctx.state.path = 'error/404';
        await ctx.render('error/404');
    }

    if (status === 404) {
        ctx.status = 404;
        ctx.state.path = 'error/404';
        await ctx.render('error/404');
    }
};

// 此中间件用于微信小程序的普通二维码校验(友团)
let wxCheckMount = () => {
    const mount = koaMount('/ctl/wxcheck/', koaStatic(`./wxcheck`, {
        maxage: 300000,
    }));

    return mount;
};

module.exports = {
    indexRewrite,
    internalRewrite,
    prefixRewrite,
    httpsRewrite,
    pageCache,
    errorRedirect,
    responseTime,
    // htmlMinifier,
    staticMount,
    wxCheckMount,
};
