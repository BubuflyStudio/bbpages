/**
 * 主页面逻辑
 *
 * @author wujohns
 * @date 17/10/25
 */

import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as $ from 'jquery';

import { default as JsonFetch } from './libs/fetch_json';
import { default as Page } from './page';
import { default as Utils } from './libs/utils';

(window as any).BBPages = (config: any) => {
    // viewport 的 meta 添加
    const viewportMeta = $(`meta[name='viewport']`);
    const metaContent = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
    if (viewportMeta.length === 0) {
        $('head').append(`<meta name="viewport" content="${ metaContent }">`);
    } else {
        viewportMeta.attr('content', metaContent);
    }

    // 渲染主体
    $(`<div id='content' />`).appendTo($('body'));
    _.defaults(config, {
        type: 'github',
        branch: 'master'
    });
    const configLink = config.configLink;
    if (configLink) {
        // 从远端配置文件中获取目录配置
        let srcLink = configLink;
        if (!Utils.isFullUrl(configLink)) {
            srcLink = `${ Utils.getRawBaseUrl(config.type) }/${ config.username }/${ config.project }/${ config.branch }`;
            srcLink = Utils.getFullUrl(srcLink, configLink);
        }
        const jsonFetch = new JsonFetch({
            srcLink: srcLink
        });
        jsonFetch.getJsonValue((err, remoteConfig) => {
            ReactDOM.render(<Page { ..._.defaults(remoteConfig, config) } />, document.querySelector('#content'));
        });
    } else {
        // 直接使用已有配置
        ReactDOM.render(<Page { ...config } />, document.querySelector('#content'));
    }
};