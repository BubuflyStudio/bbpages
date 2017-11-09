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

(window as any).BBPages = (config: any) => {
    $(`<div id='content' />`).appendTo($('body'));
    if (config.link) {
        // 从远端配置文件中获取目录配置
    } else {
        // 直接使用已有配置
        ReactDOM.render(<Page { ...config } />, document.querySelector('#content'));
    }
};