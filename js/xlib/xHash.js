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
        xAppEvent.observe('xHash', 'push', push);

        var xString = require('xlib/xString');
        var viewNameList = [];
        var viewHashList = [];

        window.addEventListener("hashchange", hashDeal, false);

        function hashDeal() {
            var hash = window.location.hash;
            hash = hash.substr(1, hash.length - 1);
            var len = viewHashList.length - 1;
            if (len >= 0 && hash != viewHashList[len]) {
                xAppEvent.trigger('xEvent', 'backview', [true]);
                pop();
            }
/*            console.log(viewNameList.join(','));
            console.log(viewHashList.join(','));*/
        }

        function push(viewName) {
            var inum = viewHashList.length;
            var hash = xString.random(7) + inum;

            viewHashList.push(hash);
            viewNameList.push(viewName);
            window.location.hash = hash;
        }

        function pop() {
            viewHashList.pop();
            viewNameList.pop();
        }

    }
);
