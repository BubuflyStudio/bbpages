/**
 * 主页面逻辑
 *
 * @author wujohns
 * @date 17/10/25
 */

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as $ from 'jquery';

// BBFetch 初始化参数结构
interface BBFetchConfig {
    id: string;     // dom 元素的 id
    src: string;    // 资源路径
    type: string;   // 资源类型
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
        this.source = this._getSource();
    }

    /**
     * 通过 iframe 获取相应的资源
     */
    private _getSource (): string {
        const iframe: string = `
            <iframe
                id='${ this.id }'
                style='display:none'
                src='${ this.src }'
            />
        `;
        $(iframe).appendTo('body');
        return '';
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

// markdown 转换后 html 的显示采用 react 的 dangerouslySetInnerHTML 特性实现