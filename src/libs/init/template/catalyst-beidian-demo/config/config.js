const Env = require('@node/airjs').Env;

const STATIC_PORT = 8081;

module.exports = {
    port: STATIC_PORT,
    devStaticHost: `//tools-dev.beidian.com:${STATIC_PORT}/ctl`,
    isDev: Env.isDev(),
    productionAsset: Env.isStaging() || Env.isProd(),
    development: {
    },
    production: {
    },
};
