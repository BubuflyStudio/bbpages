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
    state = {};

    constructor (props: any) {
        super(props);
    }

    

    render () {
        return (<div />);
    }
}

export default Page;