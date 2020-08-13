/* eslint-disable no-process-exit */
// import {CLIEngine} from 'eslint';
import getEslint from './getEslint';
import {execSync} from '../../helper/utils';

const eslintDiff = () => {
    const CLIEngine = getEslint();
    const cli = new CLIEngine({});
    const GITDIFF = 'git diff HEAD --name-only --cached';

    const stdout = execSync(GITDIFF) || '';
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
        return false;
    } else if (warningCount >= 2) {
        console.log('\x1b[32m', '🦁  ESLint passed, but need to be improved.');
        return true;
    }
    var emojis = ['🐳','🐬','🦄','🐢','🕊','🐝']; //eslint-disable-line
    console.log('\x1b[32m', `${emojis[Math.floor(Math.random() * 6)]}  ESLint passed`);
    return true;
};

export default eslintDiff;
