/**
 * bbpages 的 webpack 配置相关
 *
 * @author wujohns
 * @date 17/9/10
 */
'use strict';

const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

class BBConfig {
    /**
     * 基础包打包配置
     * @param {Object} config - 简化配置
     * @param {Boolean} config.uglify - 是否压缩
     * @param {Boolean} config.sourceMap - 是否启用 sourceMap
     * @returns {Object} - 相应的webpack配置
     */
    static baseLibs (config) {
        const plugins = [];
        if (config.uglify) {
            plugins.push(new UglifyJsPlugin());
        }
        const lessRule = {
            test: /\.less$/,
            include: [path.resolve(process.cwd(), 'node_modules/antd')],
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [
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
                            modifyVars: {},
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
     * 自定义包/页面 打包配置
     * @param {config} - 简化配置
     * @param {Boolean} - config.uglify - 是否压缩
     * @param {Boolean} - config.sourceMap - 是否使用sourceMap
     * @param {String} - config.cacheDir - 缓存目录
     * @returns {Object} - 相应的webpack配置
     */
    static cusLibsOrPages (config) {

    }
}

module.exports = BBConfig;