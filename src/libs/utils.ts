/**
 * 通用方法集合
 *
 * @author wujohns
 * @date 17/10/26
 */

import * as _ from 'lodash';
import * as $ from 'jquery';

interface Callback {
    (err?: any, value?:any): any;
}

interface UtilsType {
    getSource: (src: string, callback: Callback) => void;
    isFullUrl: (url: string) => boolean;
    getFullUrl: (rootUrl: string, path: string) => string;
};

const Utils: UtilsType = {
    /**
     * 通过 noSession 获取原始资源
     * @param {String} src - 资源路径
     * @param {Callback} callback - 回调
     */
    getSource: (src, callback) => {
        $.ajax({
            type: 'GET',
            url: src,
            crossDomain: true,
            success: (data, state) => {
                return callback(null, data);
            },
            error: (err, state) => {
                return callback(err);
            }
        });
    },

    /**
     * 判断是否为完整路径
     * @param {String} url - url路径
     * @return {Boolean} - 是否为完整路径
     */
    isFullUrl: (url) => {
        return /^(http:\/\/|https:\/\/)/.test(url);
    },

    /**
     * 获取相对路径的图片在页面中的完整路径
     * @param {String} rootUrl - 项目 raw 根路径
     * @param {String} path - 路径
     * @return {String} - 拼接后的路径
     */
    getFullUrl: (rootUrl, path) => {
        if (/^\//.test(path)) {
            return `${ rootUrl }${ path }`;
        }
        return `${ rootUrl }/${ path }`;
    }
};

export default Utils;