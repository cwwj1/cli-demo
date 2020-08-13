// diff eslint
/* eslint-disable no-process-exit */
const exec = require('child_process').exec;
const CLIEngine = require('eslint').CLIEngine;
const cli = new CLIEngine({});
const GITDIFF = 'git diff HEAD --name-only --cached';

exec(GITDIFF, (error, stdout) => {
    if (error) {
        console.error(`exec error: ${error}`);
    }
    const diffFileArray = stdout.split('\n').filter((diffFile) => (
        // /(\.js|\.vue)(\n|$)/gi.test(diffFile)
        /^(?!dist).+(\.js|\.vue)(\n|$)/gi.test(diffFile)
    ));
    let errorCount = 0;
    let warningCount = 0;
    if (diffFileArray.length > 0) {
        console.log('待检查的文件列表');
        console.log(diffFileArray);
        const eslintResults = cli.executeOnFiles(diffFileArray).results;
        eslintResults.forEach((result) => {
            errorCount += result.errorCount;
            warningCount += result.warningCount;
            if (result.messages && result.messages.length) {
                console.log('\x1b[38m', `Eslint has found problems in file: ${result.filePath}`);
                result.messages.forEach((msg) => {
                    if (msg.severity === 2) {
                        console.log('\x1b[38m', `❌  Error : ${msg.message} in Line ${msg.line} Column ${msg.column}`);
                    } else {
                        console.log('\x1b[38m', `⚠️  warning : ${msg.message} in Line ${msg.line} Column ${msg.column}`);
                    }
                    
                });
                console.log('\x1b[38m', ``);
            }
        });
    }
    if (errorCount >= 1) {
        console.log('\x1b[31m', `🐞  ESLint failed`);
        console.log('\x1b[31m', `✖ ${errorCount + warningCount} problems(${errorCount} error, ${warningCount} warning)`);
        console.log('\x1b[31m', `You can fix it by using "npm run eslint:fix" or review your changes 😯`);
        process.exit(1);
    } else if (warningCount >= 2) {
        console.log('\x1b[32m', '🦁  ESLint passed, but need to be improved.');
        process.exit(0);
    } else {
        var emojis = ['🐳','🐬','🦄','🐢','🕊','🐝'];
        console.log('\x1b[32m', `${emojis[Math.floor(Math.random() * 6)]}  ESLint passed`);
        process.exit(0);
    }
});
