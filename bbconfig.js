/**
 * webpack 的配置相关
 *
 * @author wujohns
 * @data 17/10/23
 */
'use strict';

const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const lessPluginAutoPrefix = require('less-plugin-autoprefix');

class BBConfig {
    /**
     * 获取 cache-loader 的相关配置
     * @param {String} cacheDir - 缓存目录名称
     * @return {Object} 相关的缓存配置
     * @private 
     */
    static _getCacheLoaderConfig (cacheDir) {
        const cachePath = path.join('.cache', cacheDir);
        return {
            loader: 'cache-loader',
            options: {
                cacheDirectory: path.resolve(cachePath)
            }
        };
    }

    /**
     * 基础包打包配置
     * @param {Object} config - 简化配置
     * @param {Boolean} config.uglify - 是否压缩
     * @param {Boolean} config.sourceMap - 是否启用 sourceMap
     * @param {String} config.cacheDir - 缓存目录
     * @returns {Object} - 相应的 webpack 配置
     * @public
     */
    static baseLibs (config) {
        const plugins = [new ExtractTextPlugin('[name].css')];
        if (config.uglify) {
            plugins.push(new UglifyJsPlugin());
        }
        const lessCacheDir = path.join(config.cacheDir, 'less');
        const lessRule = {
            test: /\.less$/,
            include: [path.resolve(process.cwd(), 'node_modules/antd')],
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [
                    BBConfig._getCacheLoaderConfig(lessCacheDir),
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: false, // 对于 antd 的编译中不启用 css-module 功能
                            sourceMap: !!config.sourceMap
                        }
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            sourceMap: !!config.sourceMap,
                            // modifyVars: antdTheme,
                            plugins: [
                                new lessPluginAutoPrefix({ cascade: true, browsers: ["last 5 versions"] })
                            ]
                        }
                    }
                ]
            })
        };
        const webpackConfig = {
            module: {
                rules: [lessRule]
            },
            plugins: plugins
        };
        if (!!config.sourceMap) {
            webpackConfig.devtool = 'inline-source-map';
        }
        return webpackConfig;
    }

    /**
     * 自定义页面打包配置
     * @param {Object} config - 简化配置
     * @param {Boolean} - config.uglify - 是否压缩
     * @param {Boolean} - config.sourceMap - 是否使用sourceMap
     * @param {String} - config.cacheDir - 缓存目录
     * @returns {Object} - 相应的 webpack 配置
     * @public
     */
    static cusPages (config) {
        const plugins = [new ExtractTextPlugin('[name].css')];
        if (config.uglify) {
            plugins.push(new UglifyJsPlugin());
        }

        // ts 编译配置
        const tsCacheDir = path.join(config.cacheDir, 'ts');
        const tsRule = {
            test: /\.tsx?$/,
            use: [
                BBConfig._getCacheLoaderConfig(tsCacheDir),
                'ts-loader'
            ]
        };

        // less 编译配置
        const lessCacheDir = path.join(config.cacheDir, 'less');
        const lessRule = {
            test: /\.less$/,
            exclude: [path.resolve(process.cwd(), 'node_modules')],
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [
                    BBConfig._getCacheLoaderConfig(lessCacheDir),
                    {
                        loader: 'typings-for-css-modules-loader',
                        options: {
                            importLoaders: 1,
                            modules: true,
                            sourceMap: !!config.sourceMap,
                            namedExport: true   // 直接将变量 export 不采用 .locals 方案
                        }
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            sourceMap: !!config.sourceMap,
                            modifyVars: {
                                site_static_host: ''
                            },
                            plugins: [
                                new lessPluginAutoPrefix({ cascade: true, browsers: ["last 5 versions"] })
                            ]
                        }
                    }
                ]
            })
        };

        // webpack 编译配置汇总
        const webpackConfig = {
            module: {
                rules: [tsRule, lessRule]
            },
            plugins: plugins
        };
        if (!!config.sourceMap) {
            webpackConfig.devtool = 'inline-source-map';
        }
        return webpackConfig;
    }
}

module.exports = BBConfig;