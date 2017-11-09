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

import { default as JsonFetch } from './fetch_json';
import { default as Page } from './page';
import { default as Utils } from './utils';

(window as any).BBPages = (config: any) => {
    $(`<div id='content' />`).appendTo($('body'));
    const listLink = config.listLink;
    if (listLink) {
        // 从远端配置文件中获取目录配置
        let srcLink = listLink;
        if (!Utils.isFullUrl(listLink)) {
            srcLink = `https://cdn.rawgit.com/${ config.username }/${ config.project }/${ config.branch }`;
            srcLink = Utils.getFullUrl(srcLink, listLink);
        }
        const jsonFetch = new JsonFetch({
            srcLink: srcLink
        });
        jsonFetch.getJsonValue((err, list) => {
            config.list = list;
            ReactDOM.render(<Page { ...config } />, document.querySelector('#content'));
        });
    } else {
        // 直接使用已有配置
        ReactDOM.render(<Page { ...config } />, document.querySelector('#content'));
    }
};