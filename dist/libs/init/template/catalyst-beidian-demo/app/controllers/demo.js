let hello = async function (ctx, next) {
    await ctx.render('demo/hello', {
        title: 'vue',
    });

    return next();
};

module.exports = {
    hello,
};
