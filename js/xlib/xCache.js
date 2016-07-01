define(function (require, exports, module) {

        /**
         *
         * @param 接口参数
         * @returns
         *
         * @date 2016-03-21
         * @author yaohong_zhou
         */

        function get(key) {
            var storage = window.localStorage;
            if (storage) {
                var keyv = storage.getItem(key);
                keyv=(keyv == null ? "" : keyv);
                try {
                    return JSON.parse(keyv);
                } catch (e) {
                    return keyv;
                }
            }
            return '';
        }

        function set(key, keyv) {
            var storage = window.localStorage;
            if (storage) {
                if (typeof keyv == 'object') {
                    keyv = JSON.stringify(keyv);
                }
                storage.setItem(key, keyv);
            }
        }

        return {
            get: get,
            set: set
        }
    }
);
