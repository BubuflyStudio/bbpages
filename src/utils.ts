/**
 * 通用方法集合
 *
 * @author wujohns
 * @date 17/10/26
 */

import * as $ from 'jquery';

interface Callback {
    (err?: any, value?:any): any;
}

interface UtilsType {
    getSource: (src: string, callback: Callback) => void;
    isFullUrl: (url: string) => boolean;
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
        return true;
    },

    
};

export default Utils;