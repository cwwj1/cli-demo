const test = require('ava');
const rewire = require('rewire');
const build = rewire('../../src/libs/build');
const catalyst = rewire('../../src/libs/build/catalyst');
const nodeH5 = rewire('../../src/libs/build/nodeCommon');
const lib = rewire('../../src/libs/build/lib');
const hms = rewire('../../src/libs/build/hms');

build.__set__({
    nodeCommonScript: () => true,
    catalystScript: () => true,
    consoleScript: () => true,
    checkKeywords: () => true,
    'console.log': () => '',
});

test.serial('test without type and type in switch build', async (t) => {
    build.__set__({
        getProject: () => 'airjs-common',
    });
    const result = await build();
    t.true(result);
});

test.serial('test without type and type in switch build', async (t) => {
    build.__set__({
        getProject: () => 'lib-common',
    });
    const result = await build();
    t.false(result);
});

test.serial('test airjs-common build', async (t) => {
    build.__set__({
        getProject: () => 'airjs-common',
    });
    const result = await build();
    t.true(result);
});

test.serial('test catalyst build', async (t) => {
    build.__set__({
        getProject: () => 'catalyst',
    });
    const result = await build();
    t.true(result);
});

test.serial('test console build', async (t) => {
    build.__set__({
        getProject: () => 'console',
    });
    const result = await build();
    t.true(result);
});

test.serial('test other build', async (t) => {
    build.__set__({
        getProject: () => 'other',
    });
    const result = await build();
    t.false(result);
});

test('run catalyst build with catalyst/tookit less than 1.0.0', (t) => {
    catalyst.__set__({
        execSync: (...args) => args,
        require: () => ({
            dependencies: {
                '@catalyst/catalyst-toolkit': '0.9.0',
            },
        }),
    });
    t.deepEqual(catalyst(), [
        'rimraf ./dist && BUILD_OLD_WXMP=true npx node ./bin/build-all.js',
        {
            stdio: 'inherit',
            encoding: 'utf8',
        }, true,
    ]);
});

test('run catalyst build with catalyst/tookit greater than 1.0.0', (t) => {
    catalyst.__set__({
        execSync: (...args) => args,
        require: () => ({
            dependencies: {
                '@catalyst/catalyst-toolkit': '1.1.0',
            },
        }),
    });
    t.deepEqual(catalyst(), [
        'BUILD_OLD_WXMP=true npx node ./bin/build-all.js',
        {
            stdio: 'inherit',
            encoding: 'utf8',
        }, true,
    ]);
});

test('run catalyst build with catalyst/tookit equal 1.0.0', (t) => {
    catalyst.__set__({
        execSync: (...args) => args,
        require: () => ({
            dependencies: {
                '@catalyst/catalyst-toolkit': '1.0.0',
            },
        }),
    });
    t.deepEqual(catalyst(), [
        'BUILD_OLD_WXMP=true npx node ./bin/build-all.js',
        {
            stdio: 'inherit',
            encoding: 'utf8',
        }, true,
    ]);
});

test('run catalyst build with filter', (t) => {
    catalyst.__set__({
        execSync: (...args) => args,
        require: () => ({
            dependencies: {
                '@catalyst/catalyst-toolkit': '1.0.0',
            },
        }),
        commander: {
            filter: 'filter',
        },
    });
    t.deepEqual(catalyst(), [
        'BUILD_OLD_WXMP=true npx node ./bin/build-all.js "filter"',
        {
            stdio: 'inherit',
            encoding: 'utf8',
        }, true,
    ]);
});

test.serial('run node h5 build', (t) => {
    nodeH5.__set__({
        execSync: (...args) => args,
    });
    t.deepEqual(nodeH5(), [
        'node ./node_modules/@fe-tool/webpack-config/src/clean-file && npx cross-env NODE_ENV=production node ./node_modules/@fe-tool/webpack-config/src/deploy.js --config ./node_modules/@fe-tool/webpack-config/src/webpack.prod.conf.js',
        {
            stdio: 'inherit',
            encoding: 'utf8',
        }, true,
    ]);
});

test.serial('run node h5 build with filter', (t) => {
    nodeH5.__set__({
        execSync: (...args) => args,
        commander: {
            filter: 'filter',
        },
    });
    t.deepEqual(nodeH5(), [
        'node ./node_modules/@fe-tool/webpack-config/src/clean-file && npx cross-env NODE_ENV=production ./node_modules/.bin/webpack --config ./node_modules/@fe-tool/webpack-config/src/webpack.prod.conf.js -f "filter"',
        {
            stdio: 'inherit',
            encoding: 'utf8',
        }, true,
    ]);
});

test.serial('run lib build', (t) => {
    lib.__set__({
        execSync: (...args) => args,
    });
    t.deepEqual(lib(), [
        'npx cross-env NODE_ENV=production ./node_modules/.bin/webpack --config ./node_modules/@fe-tool/webpack-config/src/webpack.libs.conf.js',
        {
            stdio: 'inherit',
            encoding: 'utf8',
        }, true,
    ]);
});

test.serial('run lib build with filter', (t) => {
    lib.__set__({
        execSync: (...args) => args,
        commander: {
            filter: 'filter',
        },
    });
    t.deepEqual(lib(), [
        'npx cross-env NODE_ENV=production ./node_modules/.bin/webpack --config ./node_modules/@fe-tool/webpack-config/src/webpack.libs.conf.js -f "filter"',
        {
            stdio: 'inherit',
            encoding: 'utf8',
        }, true,
    ]);
});

test.serial('run hms build', (t) => {
    hms.__set__({
        execSync: (...args) => args,
    });
    t.deepEqual(hms(), [
        './node_modules/.bin/webpack --config ./bin/build-hms/webpack.hms.conf.js --env production  --progress',
        {
            stdio: 'inherit',
            encoding: 'utf8',
        }, true,
    ]);
});
