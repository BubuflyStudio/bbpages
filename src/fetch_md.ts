/**
 * markdown 抓取解析
 *
 * @author wujohns
 * @date 17/10/26
 */

import * as _ from 'lodash';
import * as async from 'async';
import * as marked from 'marked';
import * as highlight from 'highlight.js';

import { default as Utils } from './utils';

// marked 的高亮配置
marked.setOptions({
    highlight: (code: string) => {
        return highlight.highlightAuto(code).value;
    }
});

// MDFetch 初始化参数结构
interface Callback {
    (err?: any, value?: any): any;
};

interface MDFetchConfig {
    srcLink: string;    // 资源路径
    rootUrl?: string;    // 根路径
    siteLinkMap: object; // 站内链接 map
};

class MDFetch {
    private srcLink: string;
    private srcContent: string = '';
    private renderer = new marked.Renderer();    // markdown 自定义渲染对象

    constructor (config: MDFetchConfig) {
        this.srcLink = config.srcLink;

        // 自定义 link 的解析
        let rootUrl = config.rootUrl;
        if (/\/$/.test(rootUrl)) {
            rootUrl = rootUrl.substr(0, rootUrl.length - 1);
        }
        this.renderer.link = function (href: string, title: string, text: string) {
            let resultHref = href;
            if (Utils.isFullUrl(href)) {
                // 如果连接跳转为完整链接则直接跳转
                const titleConfig = title ? `title="${ title }"` : '';
                return `<a href="${ resultHref }" ${ titleConfig }>${ text }</a>`
            } else if () {
                // TODO 需要支持站内跳转（网页内跳转与github工程页跳转）
            }
        };

        // 自定义 image 的解析
        this.renderer.image = function (href: string, title: string, text: string) {
            let imgSrc = href;
            if (rootUrl && !Utils.isFullUrl(href)) {
                // 如果根路径设定存在，且使用的连接不是完整url
                imgSrc = Utils.getImageUrl(rootUrl, href);
            }
            const titleConfig = title ? `title="${ title }"` : '';
            return `<img src="${ imgSrc }" alt="${ text }" ${titleConfig} />`;
        }
    }

    /**
     * markdown 资源解析
     * @param {Callback} - callback 回调函数
     */
    public getMarkedValue (callback: Callback): void {
        async.auto({
            // source 的获取
            getSource: (callback: Callback) => {
                if (!_.isEmpty(this.srcContent)) {
                    return callback(null, this.srcContent);
                }
                Utils.getSource(this.srcLink, (err, content) => {
                    if (err) {
                        return callback(err);
                    }
                    this.srcContent = content;
                    return callback();
                });
            },
            // 解析获取的 markdown 数据
            marked: ['getSource', (err, results) => {
                const content: string = `
                    <div class='markdown-body'>
                        ${ marked(this.srcContent, { renderer: this.renderer }) }
                    </div>
                `;
                return callback(null, content);
            }]
        }, Infinity, (err, results) => callback(err, _.get(results, 'marked')));
    }
}

export default MDFetch;