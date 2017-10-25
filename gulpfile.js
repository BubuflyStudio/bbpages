/**
 * ts前端工程研究
 *
 * @author wujohns
 * @date 17/10/20
 */
'use strict';

const _ = require('lodash');
const async = require('async');
const del = require('del');
const gulp = require('gulp');
const webpack2b = require('webpack-2b');

const BBConfig = require('./bbconfig');

// 基础包编译配置
const baseLibsPackConfig = {
    libs: [
        { src: 'lodash', expose: 'lodash' },
        { src: 'async', expose: 'async' },
        { src: 'react', expose: 'react' },
        { src: 'react-dom', expose: 'react-dom' },
        { src: 'marked', expose: 'marked' },
        { src: 'jquery', expose: 'jquery' },
        { src: './src/antd.js', expose: 'antd' }
    ],
    savePath: './dist/base_libs.js'
};
const baseLibsExternals = webpack2b.getExternals(baseLibsPackConfig);

// 页面编译配置
const pagesPackConfig = {
    pages: [
        { name: 'index', src: ['./src/index.tsx'] }
    ],
    destDir: './dist/pages',
    externals: baseLibsExternals
};

// 基础包编译任务
gulp.task('libs', (callback) => {
    const webpackConfig = BBConfig.baseLibs({
        uglify: false,
        sourceMap: true,
        cacheDir: 'libs'
    });
    webpack2b.libsPack(baseLibsPackConfig, webpackConfig, callback);
});

// 页面编译任务
gulp.task('pages', (callback) => {
    const webpackConfig = BBConfig.cusPages({
        uglify: false,
        sourceMap: true,
        cacheDir: 'pages'
    });
    webpack2b.pagesPack(pagesPackConfig, webpackConfig, callback);
});

gulp.task('dev', ['libs', 'pages']);

// 清理工程冗余文件
gulp.task('del', (callback) => {
    del([
        'package.json', 'tsconfig.json',
        '.cache', 'dist/libs/*', 'dist/pages/**'
    ]).then(() => {
        return callback();
    });
});