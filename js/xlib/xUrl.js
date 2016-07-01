define(function (require, exports, module) {

        /**
         *
         * @param 接口参数
         * @returns
         *
         * @date 2016-05-22
         * @author yaohong_zhou
         */

        function get(name, urlStr) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = urlStr ? urlStr.match(reg) : window.location.search.substr(1).match(reg);
            if (r != null) {
                var qstr = r[2];
                qstr == "null" ? "" : qstr;
                return decodeURIComponent(qstr);
            }
            return "";
        }


        return {
            get: get
        }
    }
);
