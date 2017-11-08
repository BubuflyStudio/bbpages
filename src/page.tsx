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
    private list: any;

    private menuMap: any;
    private pathMap: any;
    private urlMap: any;
    private itemClick: (params: any) => void;
    private subMenuClick: (params: any) => void;

    private rootUrl: string;
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
        this.list = props.list || [];

        this.rootUrl = this.getRootUrl();
        this.initMenuMap();
        this.addClickHandle();
    }

    componentDidMount () {
        this.setState(this.keyConfig, () => {
            this.getContent();
        });
    }

    // 将必要参数暴露到全局
    private initGlobal () {
        // TODO 比较痛苦的部分
    }

    // 按照配置获取基础根路径
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
                    this.pathMap[item.path] = {
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
                            this.pathMap[subItem.path] = {
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
        if (activeKey === '') {
            this.setState({
                content: ''
            });
        } else {
            const url = this.urlMap[activeKey];
            const mdFetch = new MDFetch({
                srcLink: url,
                rootUrl: this.rootUrl
            });
            mdFetch.getMarkedValue(function (err: any, content: string) {
                this.setState({
                    content: content
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
                    <div
                        style={{
                            height: '32px',
                            background: '#333',
                            margin: '0 16px 32px'
                        }}
                    />
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
                                        <Menu.Item key={ item.key }><span>item.title</span></Menu.Item>
                                    );
                                } else {
                                    return (
                                        <SubMenu
                                            key={ item.key }
                                            title={ <span>item.title</span> }
                                            onTitleClick={ this.subMenuClick }
                                        >
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
                    <Content style={{ padding: '0 64px 32px 64px' }}>
                        <div dangerouslySetInnerHTML={{ __html: this.state.content }} />
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