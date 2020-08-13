const test = require('ava');
const rewire = require('rewire');
const start = rewire('../../src/libs/start');
const catalyst = rewire('../../src/libs/start/catalyst');
const _console = rewire('../../src/libs/start/console');
const nodeH5 = rewire('../../src/libs/start/nodeCommon');

start.__set__({
    checkEnv: async () => true, // eslint-disable-line require-await
    nodeCommonScript: () => true,
    catalystScript: () => true,
    consoleScript: () => true,
    'console.log': () => '',
});

test.serial('test without type and type in switch start', async (t) => {
    start.__set__({
        getProject: () => 'airjs-common',
    });
    const result = await start();
    t.true(result);
});

test.serial('test without type and type in switch start', async (t) => {
    start.__set__({
        getProject: () => 'lib-common',
    });
    const result = await start();
    t.false(result);
});

test.serial('test airjs-common start', async (t) => {
    start.__set__({
        commander: {
            type: 'airjs-common',
        },
    });
    const result = await start();
    t.true(result);
});

test.serial('test catalyst start', async (t) => {
    start.__set__({
        commander: {
            type: 'catalyst',
        },
    });
    const result = await start();
    t.true(result);
});

test.serial('test console start', async (t) => {
    start.__set__({
        commander: {
            type: 'console',
        },
    });
    const result = await start();
    t.true(result);
});

test.serial('test other start', async (t) => {
    start.__set__({
        commander: {
            type: 'other',
        },
    });
    const result = await start();
    t.false(result);
});

test('run catalyst start', (t) => {
    catalyst.__set__({
        execSync: (...args) => args,
    });
    t.deepEqual(catalyst(), [
        'sudo ./node_modules/.bin/airjs-docker-up -d "-p 80:80 -p 8000:8000 -p 443:443 -p 9229:9229" -w "[\'app\', \'bin\', \'config\', \'index.web.js\']"',
        {
            stdio: 'inherit',
            encoding: 'utf8',
        },
    ]);
});

test.serial('run console unix start', (t) => {
    _console.__set__({
        execSync: (...args) => args,
    });
    t.deepEqual(_console(), [
        'sudo ./node_modules/.bin/airjs-docker-up -d "-p 80:80 -p 8000:8000 -p 9229:9229" -w "[\'app\', \'bin\', \'config\', \'index.web.js\']"',
        {
            stdio: 'inherit',
            encoding: 'utf8',
        },
    ]);
});

test.serial('run console win start', (t) => {
    _console.__set__({
        execSync: (...args) => args,
        commander: {
            platform: 'win',
        },
        require: () => ({
            name: 'projectName',
        }),
    });
    t.deepEqual(_console(), [
        'sudo ./node_modules/.bin/airjs-deploy-win projectName dev && rm -f /tmp/local_source.lock && ./node_modules/.bin/webpack-dev-server --config ./bin/build/webpack.dev.conf.js --port 8000 --watch-poll',
        {
            stdio: 'inherit',
            encoding: 'utf8',
        },
    ]);
});

test.serial('run node h5 unix start', (t) => {
    nodeH5.__set__({
        execSync: (...args) => args,
    });
    t.deepEqual(nodeH5(), [
        'sudo ./node_modules/.bin/airjs-docker-up -d "-p 80:8080 -p 443:443 -p 9229:9229" -w "[\'app\', \'bin\', \'config\', \'index.web.js\']"', {
            stdio: 'inherit',
            encoding: 'utf8',
        },
    ]);
});

test.serial('run node h5 win start', (t) => {
    nodeH5.__set__({
        execSync: (...args) => args,
        commander: {
            platform: 'win',
        },
        require: () => ({
            name: 'projectName',
        }),
    });
    t.deepEqual(nodeH5(), [
        'sudo ./node_modules/.bin/airjs-deploy-win projectName dev && rm -f /tmp/local_source.lock && ./node_modules/.bin/webpack-dev-server --https --key ./ssl/beidian_dev.key --cert ./ssl/beidian_dev.crt --config ./bin/build/webpack.dev.conf.js --port 8000 --watch-poll',
        {
            stdio: 'inherit',
            encoding: 'utf8',
        },
    ]);
});

