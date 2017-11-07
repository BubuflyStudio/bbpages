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
import { default as Page } from './page';

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
    render () {
        return (
            <Layout style={{ height: '100vh' }}>
                <Sider
                    breakpoint='lg'
                    collapsedWidth='0'
                >
                    <div 
                        style={{
                            height: '32px',
                            background: '#333',
                            margin: '0 16px 16px'
                        }}
                    />
                    <Menu
                        theme='dark'
                        defaultSelectedKeys={['1']}
                        mode='inline'
                    >
                        <Menu.Item key='1'><span>直接文本1</span></Menu.Item>
                        <Menu.Item key='2'><span>直接文本2</span></Menu.Item>
                        <SubMenu
                            key='sub1'
                            title={ <span>目录</span> }
                        >
                            <Menu.Item key='3'><span>直接文本3</span></Menu.Item>
                            <Menu.Item key='4'><span>直接文本4</span></Menu.Item>
                        </SubMenu>
                    </Menu>
                </Sider>
                <Layout style={{ background: '#fff' }}>
                    <Header style={{ padding: 0, background: '#fff' }} />
                    <Content>
                        <div style={{ padding: '0 16px' }}>
                            Bill is a cat.
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        Ant Design ©2016 Created by Ant UED
                    </Footer>
                </Layout>
            </Layout>
        );
    }
}

ReactDOM.render(<SiderDemo />, document.querySelector('#content'));

const mdFetch: MDFetch = new MDFetch({
    srcLink: 'https://raw.githubusercontent.com/wujohns/graphql-learn/master/readme.md',
    rootUrl: 'https://raw.githubusercontent.com/wujohns/graphql-learn/master/'
});
// mdFetch.getMarkedValue((err, content) => {
//     $('#content').html(content);
//     highlight.initHighlightingOnLoad();
// });

// markdown 转换后 html 的显示采用 react 的 dangerouslySetInnerHTML 特性实现