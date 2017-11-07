/**
 * 文档页面组件
 *
 * @author wujohns
 * @date 17/10/25
 */

import * as _ from 'lodash';
import * as async from 'async';
import * as React from 'react';

import { Layout, Menu, Breadcrumb } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

import { default as Utils } from './utils';
import { default as MDFetch } from './fetch_md';

// TODO 初始参数的规范化
class Page extends React.Component {
    private type: string;
    private branch: string;
    private username: string;
    private project: string;
    private list: [any];
    private menuMap: any;
    private pathMap: any;

    private rootUrl: string;
    state = {};

    constructor (props: any) {
        super(props);
        this.type = props.type || 'github';
        this.branch = props.branch || 'master';
        this.username = props.username;
        this.project = props.project;
        this.list = props.list || [];

        this.rootUrl = this.getRootUrl();
        this.initMenuMap();
    }

    private getRootUrl ():string {
        let rootUrl = '';
        switch (this.type) {
            case 'github':
                rootUrl = `https://raw.githubusercontent.com/${ this.username }/${ this.project }/${ this.branch }`;
                break;
            default:
                break;
        }
        return rootUrl;
    }

    private initMenuMap ():void {
        this.menuMap = {};
        this.pathMap = {};
        let key = 0;
        const addItem = (item) => {
            let url = item.rawUrl;
            if (!url) {
                this.pathMap[item.path] = key;
                url = Utils.getFullUrl(this.rootUrl, item.path);
            }
            this.menuMap[key] = {
                title: _.get(item, 'title', ''),
                url: url
            };
        };
        _.forEach(this.list, (item) => {
            key++;
            if (_.isEmpty(item.list)) {
                let url = item.rawUrl;
                if (!url) {
                    this.pathMap[item.path] = key;
                    url = Utils.getFullUrl(this.rootUrl, item.path);
                }
                this.menuMap[key] = {
                    type: 'menu',
                    key: key,
                    title: _.get(item, 'title', ''),
                    url: url
                };
            } else {
                this.menuMap[key] = {
                    type: 'subMenu',
                    key: key,
                    title: _.get(item, 'title', ''),
                    list: _.map(item.list, (subItem) => {
                        key++;
                        let url = item.rawUrl;
                        if (!url) {
                            this.pathMap[item.path] = key;
                            url = Utils.getFullUrl(this.rootUrl, item.path);
                        }
                        return {
                            type: 'menu',
                            key: key,
                            title: _.get(subItem, 'title', ''),
                            url: url
                        };
                    })
                };
            }
        });
    }

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
                        {
                            this.menuMap.map((item: any) => {
                                if (item.type === 'menu') {
                                    return (
                                        <Menu.Item key={ item.key }><span>item.title</span></Menu.Item>
                                    );
                                } else {
                                    return (
                                        <SubMenu key={ item.key } title={ <span>item.title</span> }>
                                            {
                                                item.list.map((subItem: any) => {
                                                    return (
                                                        <Menu.Item key={ subItem.key }><span>subItem.title</span></Menu.Item>
                                                    );
                                                })
                                            }
                                        </SubMenu>
                                    );
                                }
                            })
                        }
                    </Menu>
                </Sider>
                <Layout style={{ background: '#fff' }}>
                    <Header style={{ padding: 0, background: '#fff' }} />
                    <Content>
                        
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        案例 footer 可以考虑使用参数配置
                    </Footer>
                </Layout>
            </Layout>
        );
    }
}

export default Page;