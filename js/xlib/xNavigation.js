define(function (require, exports, module) {

        /**
         *
         * @param 接口参数
         * @returns
         *
         * @date 2016-03-21
         * @author yaohong_zhou
         */




        var appEvent = require('xlib/xAppEvent');
        var xHash = require('xlib/xHash');
        var views = [];
        var historys = [];


        function push(name, view) {
            views[name] = view;
        }

        function to(name, args, reload) {

            var current = historys[historys.length - 1];
            if (current) {
                views[current.name].hide.apply(views[current.name], args);
            }

            historys.push({
                name: name,
                args: args
            });

            var item = views[name];
            if (reload) {
                item.show.apply(item, args);
            }
            else {
                item.render.apply(item, args);
                appEvent.trigger('xHash', 'push', [name]);
            }
        }

        function back(reload, count) {

            if (typeof reload == 'number') {
                count = reload;
                reload = false;
            }
            reload = reload || false;
            count = count || 1;
            var index = historys.length - 1 - count;
            var obj = historys[index];
            if (obj) {
                this.to(obj.name, obj.args, reload);
                historys.length = index + 1;
            }
        }

        function clear(step) {
            var len = historys.length - 1;
            var deleteStart = len - step;
            if (deleteStart < 0) {
                deleteStart = 0;
            }
            historys.splice(deleteStart, step);
        }

        return  {
            views: views,
            historys: historys,
            push: push,
            to: to,
            back: back,
            clear: clear
        };

    }
);
