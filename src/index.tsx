/**
 * 主页面逻辑
 *
 * @author wujohns
 * @date 17/10/25
 */

import * as _ from 'lodash';
import * as async from 'async';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as marked from 'marked';
import * as $ from 'jquery';
import * as highlight from 'highlight.js';

import { default as MDFetch } from './fetch_md';

const mdFetch: MDFetch = new MDFetch({
    srcLink: 'https://raw.githubusercontent.com/wujohns/graphql-learn/master/docs/1.graphql%E5%9F%BA%E7%A1%80%E6%9F%A5%E8%AF%A2.md'
});
mdFetch.getMarkedValue((err, content) => {
    $('#content').html(content);
    highlight.initHighlightingOnLoad();
});

// markdown 转换后 html 的显示采用 react 的 dangerouslySetInnerHTML 特性实现