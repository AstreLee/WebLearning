module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: [
        'plugin:vue/essential',
        '@vue/standard'
    ],
    parserOptions: {
        parser: 'babel-eslint'
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        // 允许项目中的文件有多个空行
        'no-multiple-empty-lines': 0,
        // 让项目不进行末尾是否有分号的检查
        'semi': 'off',
        // 关闭首行缩进的检查，有一说一首行缩进4个空格还是好看一点
        'indent': ['off', 2],
        // 取消方法名和括号之间的一个空格的检查
        'space-before-function-paren': 0,
        // 关闭多余的空格的检查
        'no-multi-spaces':'off'
    }
}
