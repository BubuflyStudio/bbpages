/**
 * json 抓取解析（作为文档目录使用）
 *
 * @author wujohns
 * @date 17/10/26
 */

import { default as Utils } from './utils';

interface JsonFetchConfig {
    srcLink: string;    // 资源路径
};

interface Callback {
    (err?: any, value?: any): any;
}

class JsonFetch {
    private srcLink:string;

    constructor (config: JsonFetchConfig) {
        this.srcLink = config.srcLink;
    }

    public getJsonValue (callback: Callback): void {
        Utils.getSource(this.srcLink, (err, config) => {
            if (err) {
                return callback(err);
            }
            if (typeof config === 'string') {
                return callback(null, JSON.parse(config));
            }
            return callback(null, config);
        });
    }
}

export default JsonFetch;