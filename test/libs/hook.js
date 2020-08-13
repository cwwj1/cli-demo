const test = require('ava');
const rewire = require('rewire');
const postCommit = rewire('../../src/libs/hook/hooks/postCommit.js');
const postinstall = rewire('../../src/libs/hook/hooks/postInstall.js');
const postpublish = rewire('../../src/libs/hook/hooks/postPublish.js');
const poststart = rewire('../../src/libs/hook/hooks/postStart.js');
const preinstall = rewire('../../src/libs/hook/hooks/preInstall.js');
const prepush = rewire('../../src/libs/hook/hooks/prePush.js');
const prestart = rewire('../../src/libs/hook/hooks/preStart.js');

test('run postCommit hook', (t) => {
    t.is(postCommit(), undefined);
});

test('run postinstall hook', (t) => {
    t.is(postinstall(), undefined);
});

test('run postpublish hook', (t) => {
    t.is(postpublish(), undefined);
});

test('run poststart hook', (t) => {
    t.is(poststart(), undefined);
});

test('run preinstall hook', (t) => {
    t.is(preinstall(), undefined);
});

test('run prepush hook', (t) => {
    t.is(prepush(), undefined);
});

test('run prestart hook', (t) => {
    t.is(prestart(), undefined);
});
