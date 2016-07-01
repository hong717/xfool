define(function (require, exports, module) {

        /**
         *
         * @param 接口参数
         * @returns
         *
         * @date 2016-03-21
         * @author yaohong_zhou
         */


        var events = {};


        //需要观察的事件
        function observe(module, eventName, fn) {
            //模块级事件
            if (events[module]) {
                if (!events[module][eventName]) {
                    events[module][eventName] = [];
                }
            } else {
                events[module] = {};
                events[module][eventName] = [];
            }
            events[module][eventName].push(fn);
        }

        //触发事件
        function trigger(module, eventName, args) {
            var mod = events[module] || {};
            var fns = mod[eventName] || [];
            for (var i in fns) {
                fns[i].apply(null, args);
            }
        }

        return  {
            observe: observe,
            trigger: trigger
        }
    }
);
