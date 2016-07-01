define(function (require, exports, module) {

        /**
         *
         * @param 接口参数
         * @returns
         *
         * @date 2016-03-21
         * @author yaohong_zhou
         */


        var xAppEvent = require('xlib/xAppEvent');
        xAppEvent.observe('xEvent', 'backview', back);

        var nav = require('xlib/xNavigation');

        function toview(name) {
            var args = Array.prototype.slice.call(arguments, 1);
            //先判断视图是否存在 不存在则先load进来
            if (nav.views[name]) {
                nav.to(name, args);
            } else {
                /*                    loadview({
                 name: name,
                 fnSuccess: function () {
                 nav.push(name, window[name]);
                 nav.to(name, true, args);
                 if (args && args.noBack) {
                 return;
                 }
                 OptHash.pushHash(name);
                 }
                 });*/
            }
        }

        //程序回退上一个页面
        function backview(reload) {

            //reload =true 回退页面 并且不刷新,false 则重新rander
            //nav.back(reload);
            history.back();
        }


        //用户点击浏览器回退按钮
        function back(reload) {
            //reload =true 回退页面 并且不刷新,false 则重新rander
            nav.back(reload);
        }


        //删除回退页面个数
        function clearbackview(step) {
            nav.clear(step);
        }


        return {
            toview: toview,
            backview: backview
        }
    }
);
