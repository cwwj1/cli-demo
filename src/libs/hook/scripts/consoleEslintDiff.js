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
        /(\.js|\.vue)(\n|$)/gi.test(diffFile)
    ));
    if (diffFileArray.length > 0) {
        console.log('待检查的文件列表');
        console.log(diffFileArray);
        let errorCount = 0;
        let warningCount = 0;
        const eslintResults = cli.executeOnFiles(diffFileArray).results;
        eslintResults.forEach((result) => {
            errorCount += result.errorCount;
            warningCount += result.warningCount;
            if (result.errorCount && result.messages) {
                console.log('\x1b[38m', `Errors in file: ${result.filePath}`);
                result.messages.forEach((msg) => {
                    console.log('\x1b[38m', `✖ Error : ${msg.message} in Line ${msg.line} Column ${msg.column}`);
                });
                console.log('\x1b[38m', ``);
            }
        });
        if (errorCount >= 1) {
            console.log('\x1b[31m', `ESLint failed`);
            console.log('\x1b[36m', `✖ ${errorCount + warningCount} problems(${errorCount} error, ${warningCount} warning)`);
            console.log('\x1b[31m', `Please use "npm run eslint:fix" before you commit.😌`);
            return false;
        }
        console.log('\x1b[32m', 'ESLint passed');
        return true;
    }
    return true;
};

export default eslintDiff;
