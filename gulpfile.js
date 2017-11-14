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
const concat = require('gulp-concat');
const cssnano = require('gulp-cssnano');
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
        { src: './src/common/hljs.js', expose: 'highlight.js' },
        { src: './src/common/antd.js', expose: 'antd' },
        { src: './src/md_styles', expose: 'md-styles' }
    ],
    savePath: './dist/base_libs.js'
};
const baseLibsExternals = webpack2b.getExternals(baseLibsPackConfig);

// 页面编译配置
const pagesPackConfig = {
    pages: [
        { name: 'index', src: ['./src/index.tsx'] }
    ],
    destDir: './dist',
    externals: baseLibsExternals
};

// 基础包编译任务
gulp.task('libs', (callback) => {
    const webpackConfig = BBConfig.baseLibs({
        uglify: true,
        sourceMap: false,
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

// 以下为发布时的操作 --------------------------------------
gulp.task('pro-libs', (callback) => {
    const webpackConfig = BBConfig.baseLibs({
        uglify: true,
        sourceMap: false,
        cacheDir: 'pro-libs'
    });
    webpack2b.libsPack(
        _.defaults({ savePath: './release/base_libs.js' }, baseLibsPackConfig),
        webpackConfig,
        callback
    );
});

gulp.task('pro-pages', (callback) => {
    const webpackConfig = BBConfig.cusPages({
        uglify: true,
        sourceMap: false,
        cacheDir: 'pro-pages'
    });
    webpack2b.pagesPack(
        _.defaults({ destDir: './release' }, pagesPackConfig),
        webpackConfig,
        callback
    );
});

gulp.task('pro', ['pro-libs', 'pro-pages'], (callback) => {
    const jsStream = gulp.src(['./release/base_libs.js', './release/index.js'])
        .pipe(concat('bbpages.min.js'))
        .pipe(gulp.dest('./release'));

    const cssStream = gulp.src(['./release/base_libs.css'])
        .pipe(concat('bbpages.min.css'))
        .pipe(cssnano())
        .pipe(gulp.dest('./release'));

    const streams = [jsStream, cssStream];
    async.each(streams, (stream, callback) => {
        stream.on('end', () => {
            return callback();
        });
    }, () => {
        del([
            './release/base_libs.js',
            './release/base_libs.css',
            './release/index.js'
        ]).then(() => callback());
    });
});