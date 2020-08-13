const test = require('ava');
const rewire = require('rewire');
const publish = rewire('../../src/libs/publish/publish.js');

publish.__set__({
    check: async () => true, // eslint-disable-line
    execSync: (...args) => args,
    'console.log': () => '',
    postPublish: () => true,
});

test.serial('test publish', async (t) => {
    const result = await publish();
    t.true(result);
});
