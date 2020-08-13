const test = require('ava');
const rewire = require('rewire');
const utils = rewire('../../src/libs/helper/utils');
const _execSync = utils.execSync;
const compare = utils.compare;
const getProject = utils.getProject;
const execSync = require('child_process').execSync;

test('test execSync', (t) => {
    t.deepEqual(_execSync('ls'), execSync('ls', {
        encoding: 'utf8',
    }).trim());
});

test('test compare', (t) => {
    t.true(compare('1.0.0', '1.0.0') === 0);
    t.true(compare('2.0.0', '1.0.0') === 1);
    t.true(compare('0.0.9', '1.0.0') === -1);
});

test('test getProject', (t) => {
    utils.__set__({
        require: () => ({
            keywords: ['lib-catalyst'],
        }),
    });
    t.is(getProject(), 'lib-catalyst');
    utils.__set__({
        require: () => ({
            keywords: ['lib-node'],
        }),
    });
    t.is(getProject(), 'lib-node');
    utils.__set__({
        require: () => ({
            keywords: ['lib-common'],
        }),
    });
    t.is(getProject(), 'lib-common');
    utils.__set__({
        require: () => ({
            keywords: ['airjs-common'],
        }),
    });
    t.is(getProject(), 'airjs-common');
    utils.__set__({
        require: () => ({
            keywords: ['catalyst'],
        }),
    });
    t.is(getProject(), 'catalyst');
    utils.__set__({
        require: () => ({
            keywords: ['console'],
        }),
    });
    t.is(getProject(), 'console');
});
