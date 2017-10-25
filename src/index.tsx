/**
 * 主页面逻辑
 *
 * @author wujohns
 * @date 17/10/25
 */

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as marked from 'marked';
import * as $ from 'jquery';

// BBFetch 初始化参数结构
interface BBFetchConfig {
    id: string;     // dom 元素的 id
    src: string;    // 资源路径
    type: string;   // 资源类型
}

interface Callback {
    (err: any, value: any): any;
    (err: any): any;
    (): any;
}

class BBFetch {
    private id: string;
    private src: string;
    private type: string;
    private source: string;

    constructor (config: BBFetchConfig) {
        this.id = config.id;
        this.src = config.src;
        this.type = config.type;
    }

    /**
     * 只能获取公开的资源（不带cookie的get请求）
     */
    private _getSource (callback: Callback): void {
        $.ajax({
            type: 'GET',
            url: this.src,
            crossDomain: true,
            success: (data, state) => {
                this.source = data;
                return callback();
            },
            error: (err, state) => {
                this.source = '';
                return callback(err);
            }
        });
    }

    /**
     * json 资源的解析
     */
    public getJsonValue () {}

    /**
     * markdown 资源的解析
     */
    public getMarkedValue () {}
}

const bbfetch: BBFetch = new BBFetch({
    id: 'try',
    src: 'https://raw.githubusercontent.com/wujohns/learn-ts/master/readme.md',
    type: 'md'
});

// markdown 转换后 html 的显示采用 react 的 dangerouslySetInnerHTML 特性实现