/**
 * 文档页面组件
 *
 * @author wujohns
 * @date 17/10/25
 */

import * as _ from 'lodash';
import * as async from 'async';
import * as React from 'react';
import * as $ from 'jquery';

import { Layout, Menu } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

import { default as Utils } from './libs/utils';
import { default as MDFetch } from './libs/fetch_md';

// TODO 初始参数的规范化
class Page extends React.Component {
    private type: string;
    private branch: string;
    private username: string;
    private project: string;
    private logo: any;
    private footer: string;
    private list: any;

    private menuMap: any;
    private pathMap: any;
    private urlMap: any;
    private itemClick: (params: any) => void;
    private subMenuClick: (params: any) => void;

    private rootUrl: string;
    private fileUrl: string;
    private dirUrl: string;
    private keyConfig: any = {
        openKeys: [''],
        activeKey: ''
    };
    state = {
        openKeys: [''],
        activeKey: '',
        content: ''
    };

    constructor (props: any) {
        super(props);
        this.type = props.type || 'github';
        this.branch = props.branch || 'master';
        this.username = props.username;
        this.project = props.project;
        this.footer = props.footer;
        this.list = props.list || [];

        if (props.logo) {
            this.logo = (<div dangerouslySetInnerHTML={{ __html: props.logo }}></div>);
        } else {
            this.logo = (
                <p style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    textAlign: 'left',
                    color: '#fff',
                    padding: '16px 0 0 24px'
                }}>{ this.project }</p>
            );
        }

        this.initUrl();
        this.initMenuMap();
        this.addClickHandle();
    }

    componentDidMount () {
        this.setState(this.keyConfig, () => {
            this.getContent();
        });
    }

    // 按照配置获取基础根路径
    private initUrl ():void {
        const rawBaseUrl = Utils.getRawBaseUrl(this.type);
        switch (this.type) {
            case 'github':
                this.rootUrl = `${ rawBaseUrl }/${ this.username }/${ this.project }/${ this.branch }`;
                this.fileUrl = `https://github.com/${ this.username }/${ this.project }/blob/${ this.branch }`;
                this.dirUrl = `https://github.com/${ this.username }/${ this.project }/tree/${ this.branch }`;
                break;
            default:
                break;
        }
    }

    // 初始化目录菜单配置
    private initMenuMap ():any {
        this.menuMap = [];
        this.pathMap = {};
        this.urlMap = {};
        let key = 0;
        let openKey:any = null;
        let activeKey:any = null;
        _.forEach(this.list, (item) => {
            key++;
            if (_.isEmpty(item.list)) {
                let url = item.rawUrl;
                if (!url) {
                    const pathKey = /^\//.test(item.path) ? item.path : `/${ item.path }`;
                    this.pathMap[pathKey] = {
                        active: `${ key }`
                    };
                    url = Utils.getFullUrl(this.rootUrl, item.path);
                }
                if (!activeKey) {
                    activeKey = `${ key }`;
                }
                this.urlMap[`${ key }`] = url;
                this.menuMap.push({
                    type: 'menu',
                    key: `${ key }`,
                    title: _.get(item, 'title', '')
                });
            } else {
                const subKey = key;
                if (!activeKey && _.isEmpty(item.list)) {
                    openKey = `${ subKey }`;
                }
                this.menuMap.push({
                    type: 'subMenu',
                    key: `${ key }`,
                    title: _.get(item, 'title', ''),
                    list: _.map(item.list, (subItem: any) => {
                        key++;
                        let url = item.rawUrl;
                        if (!url) {
                            const pathKey = /^\//.test(subItem.path) ? subItem.path : `/${ subItem.path }`;
                            this.pathMap[pathKey] = {
                                open: `${ subKey }`,
                                active: `${ key }`
                            };
                            url = Utils.getFullUrl(this.rootUrl, subItem.path);
                        }
                        if (!activeKey) {
                            activeKey = `${ key }`;
                        }
                        this.urlMap[`${ key }`] = url;
                        return {
                            type: 'menu',
                            key: `${ key }`,
                            title: _.get(subItem, 'title', '')
                        };
                    })
                });
            }
        });
        openKey = openKey ? openKey : '';
        activeKey = activeKey ? activeKey : '';
        this.keyConfig = {
            openKeys: [openKey],
            activeKey: activeKey
        };
    }

    // 获取文章内容
    private getContent ():void {
        const activeKey = this.state.activeKey;
        const self = this;
        if (activeKey === '') {
            this.setState({
                content: ''
            });
        } else {
            const url = this.urlMap[activeKey];
            const mdFetch = new MDFetch({
                srcLink: url,
                rootUrl: this.rootUrl,
                fileUrl: this.fileUrl,
                dirUrl: this.dirUrl,
                pathMap: this.pathMap
            });
            mdFetch.getMarkedValue(function (err: any, content: string) {
                this.setState({
                    content: content
                }, () => {
                    $('.siteLink').click(function () {
                        const path = $(this).attr('path');
                        const active = self.pathMap[path].active;
                        const open = self.pathMap[path].open;
                        const openKeys = self.state.openKeys;
                        if (open && !_.includes(self.state.openKeys, open)) {
                            openKeys.push(open);
                        }
                        self.setState({
                            openKeys: openKeys,
                            activeKey: active
                        }, () => {
                            self.getContent();
                        });
                    });
                });
            }.bind(this));
        }
    }

    private addClickHandle () {
        this.itemClick = (params: any) => {
            this.setState({
                activeKey: params.key
            }, () => {
                this.getContent();
            });
        };

        this.subMenuClick = (params: any) => {
            const openKeys = this.state.openKeys;
            if (_.includes(openKeys, params.key)) {
                _.remove(openKeys, (key) => {
                    return (params.key === key);
                });
            } else {
                openKeys.push(params.key);
            }
            this.setState({
                openKeys: openKeys
            });
        };
    }

    render () {
        return (
            <Layout style={{ height: '100vh' }}>
                <Sider
                    breakpoint='lg'
                    collapsedWidth='0'
                >
                    <div style={{ height: '64px' }}>{ this.logo }</div>
                    <Menu
                        theme='dark'
                        openKeys={ this.state.openKeys }
                        selectedKeys={[this.state.activeKey]}
                        mode='inline'
                        onClick={ this.itemClick }
                    >
                        {
                            this.menuMap.map((item: any) => {
                                if (item.type === 'menu') {
                                    return (
                                        <Menu.Item key={ item.key }><span>{ item.title }</span></Menu.Item>
                                    );
                                } else {
                                    return (
                                        <SubMenu
                                            key={ item.key }
                                            title={ <span>{ item.title }</span> }
                                            onTitleClick={ this.subMenuClick }
                                        >
                                            {
                                                item.list.map((subItem: any) => {
                                                    return (
                                                        <Menu.Item key={ subItem.key }><span>{ subItem.title }</span></Menu.Item>
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
                    <Content style={{ padding: '0 64px 32px 64px' }}>
                        <div dangerouslySetInnerHTML={{ __html: this.state.content }} />
                    </Content>
                    <Footer>
                        <div
                            style={{ textAlign: 'center' }}
                            dangerouslySetInnerHTML={{ __html: this.footer }}
                        />
                    </Footer>
                </Layout>
            </Layout>
        );
    }
}

export default Page;