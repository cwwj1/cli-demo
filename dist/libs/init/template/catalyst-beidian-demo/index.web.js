(async () => {
    const Airjs = require('@node/airjs').Application;
    const Env = require('@node/airjs').Env;

    const Xtpl = require('koa-xtpl');
    const Router = require('koa-router');
    const etag = require('koa-etag');
    const koaLog = require('koa-log');
    const conditional = require('koa-conditional-get');

    const config = require('./config/config');
    const route = require('./app/route');
    const middleware = require('./app/helpers/middleware');
    const helperView = require('./app/helpers/view');

    const isDev = config.isDev;
    const productionAsset = config.productionAsset;

    const app = new Airjs();
    // 添加全局对象
    global.airjs = app;

    // 添加模板引擎
    app.use(Xtpl({
        root: './app/views',
        extname: 'html',
        commands: helperView
    }));

    app.enableAutoAccessLogCollect();
    // 添加默认首页
    app.use(middleware.indexRewrite());
    // 前缀重定向
    app.use(middleware.prefixRewrite());
    // 添加内部重定向
    app.use(middleware.internalRewrite());
    // HTML文件压缩
    // app.use(middleware.htmlMinifier());
    // 记录接口响应时间 response header中的X-Response-Time
    app.use(middleware.responseTime());
    // 静态资源绑定
    app.disableAutoMountStatic();
    app.use(conditional());
    app.use(etag());
    app.use(middleware.staticMount());
    app.use(middleware.wxCheckMount());
    // TODO TXT 静态资源确认
    // 添加日志记录
    app.use(koaLog('common'));
    // 添加页面CND中间件
    app.use(middleware.pageCache);
    // 添加错误重定向中间件
    app.use(middleware.errorRedirect);

    app.use(async (ctx, next) => {
        const devSrc = productionAsset ? '' : `*.beibei.com:${config.port} *.beidian.com:${config.port}`;

        // view 中的全局变量
        ctx.state.path = ctx.path.slice(1); // 去掉后缀.html,用于页面上自动载于静态资源
        ctx.state.isDev = isDev;
        ctx.state.productionAsset = productionAsset;
        ctx.state.securityPolicy = `script-src 'self' *.beibei.com.cn *.beibei.com *.beidian.com ${devSrc} 'unsafe-inline' 'unsafe-eval';child-src 'self';frame-src weixin://*;`;
        ctx.cache(300); // 默认缓存300s

        return next();
    });

    // 从路由注册表中获取路由
    const router = new Router();

    let controller;
    for (let urlPath in route) {
        controller = route[urlPath];

        router.get(urlPath, controller);
    }

    await app.startup('catalyst_beidian_store', router, {
        logger: !Env.isDev(),
    });
    // 如果是开发环境,开启https服务
    if (Env.isDev()) {
        await app.ssl('./ssl/h5_biz_dev.key', './ssl/h5_biz_dev.crt');
    }
})();
