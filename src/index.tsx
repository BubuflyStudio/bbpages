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

import { Layout, Menu, Breadcrumb } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

import { default as MDFetch } from './fetch_md';

const bookConfig = {
    type: 'github',
    username: 'wujohns',
    project: 'graphql-learn',
    branch: 'master',
    list: [
        {
            title: '简介',
            path: 'readme.md',
        },
        {
            title: '基础部分',
            list: [
                {
                    title: 'graphql base1',
                    path: 'docs/base1.md'
                },
                {
                    title: 'graphql base2',
                    path: 'docs/base2.md'
                },
                {
                    title: 'graphql base3',
                    path: 'docs/base3.md'
                }
            ]
        }
    ]
};

class SiderDemo extends React.Component {
    state = {}
}

const mdFetch: MDFetch = new MDFetch({
    srcLink: 'https://raw.githubusercontent.com/wujohns/graphql-learn/master/readme.md',
    rootUrl: 'https://raw.githubusercontent.com/wujohns/graphql-learn/master/'
});
mdFetch.getMarkedValue((err, content) => {
    $('#content').html(content);
    highlight.initHighlightingOnLoad();
});

// markdown 转换后 html 的显示采用 react 的 dangerouslySetInnerHTML 特性实现