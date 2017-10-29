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
    getImageUrl: (rootUrl: string, path: string) => string;
};

const Utils: UtilsType = {
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

    isFullUrl: (url) => {
        return /^(http:\/\/|https:\/\/)/.test(url);
    },

    getImageUrl: (rootUrl, path) => {
        if (/^\//.test(path)) {
            return `${ rootUrl }${ path }`;
        }
        return `${ rootUrl }/${ path }`;
    }
};

export default Utils;