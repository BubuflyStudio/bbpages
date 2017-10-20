/**
 * module bundler with simple configure
 */
'use strict';

const packageConfig = {
    // 基础说明配置
    name: 'bbpages',
    version: '0.0.1',
    author: 'wujohns',
    description: 'tool for docs based on git',
    license: 'MIT',

    /**
     * scripts
     */
    scripts: {
        // test: './node_modules/mocha/bin/mocha ./test/build.test.js'
    },

    engine: {
        node: '>=4.0.0'
    },

    dependencies: {
        // 基础工具
        'lodash': '^4.17.4',
        'async': '^2.5.0',

        // react 相关
        'react': '^16.0.0',
        'react-dom': '^16.0.0',
        'react-router-dom': '^4.2.2',
        'mobx': '^3.3.1',
        'mobx-react': '^4.3.3',

        // ui 组件
        'antd': '^2.13.6',

        // 动画效果
        'jquery': '^3.2.1'
    },

    devDependencies: {
        'webpack-2b': '^2.0.2',
        'gulp': '~3.9.1',
        'del': '^3.0.0',

        // typescript 依赖的包
        'typescript': '^2.5.3',
        'ts-loader': '^3.0.3',

        // less 编译依赖的包（css）
        'less': '^3.0.0-alpha.3',
        'style-loader': '^0.19.0',
        'css-loader': '^0.28.7',
        'less-loader': '^4.0.5',
        'less-plugin-autoprefix': '^1.5.1',
        'extract-text-webpack-plugin': '^3.0.1',

        // 其他loader（json、image）
        'json-loader': '^0.5.7'
    }
};

const fs = require('fs');
const path = require('path');
const targetFile = path.join(__dirname, '../package.json');
fs.writeFileSync(targetFile, JSON.stringify(packageConfig, null, 2), {
    encoding: 'utf8',
    flags: 'w',
    mode: 0o666
});