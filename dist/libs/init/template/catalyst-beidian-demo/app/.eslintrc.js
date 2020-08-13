module.exports = {
    "root": true, // 不会向上找其它配置文件
    "extends": "@fe-base/eslint-config/backend",
    "parser": "babel-eslint",
    // TODO：以下 rules 需要业务同学修复，直至移除 rules
    // 驼峰 0 = off, 1 = warn, 2 = error
    "rules": {
        "camelcase": 1,
        "no-unused-vars": 1,
        "require-atomic-updates": 1,
        "no-trailing-spaces": 1,
    },
};