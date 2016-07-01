define(function (require, exports, module) {


        var $ = require('lib/jquery2.1.1');
        var xObject = require('xlib/xObject');
        var xScroll = require('xlib/xScroll');


        function View(viewid) {
            this.$viewPage = $(viewid);
            this.hasInit = false;
            this.scrollTop = 0;
            this.fnlist = {};
        }


        function fireFn(fnname, args) {
            var cinit = this.context.fnlist[fnname];
            cinit && cinit.apply(null, args);
        }

        View.prototype = {

            init: function () {
                this.init = arguments.callee;
                var args = ['init'].concat([].slice.call(arguments, 0));
                fireFn.apply(this, args);
            },

            render: function () {
                this.render = arguments.callee;
                if(!this.context.hasInit){
                    this.init.apply(this,null);
                    this.context.hasInit =true;
                }
                this.show.apply(this, null);
                var args = ['render'].concat([].slice.call(arguments, 0));
                fireFn.apply(this, args);
            },

            show: function () {
                this.show = arguments.callee;

                this.context.$viewPage && this.context.$viewPage.show();

                var args = ['show'].concat([].slice.call(arguments, 0));
                fireFn.apply(this, args);

                document.body.scrollTop = this.context.scrollTop;
            },

            hide: function () {

                this.hide = arguments.callee;

                this.context.scrollTop = document.body.scrollTop;
                this.context.$viewPage && this.context.$viewPage.hide();

                var args = ['hide'].concat([].slice.call(arguments, 0));
                fireFn.apply(this, args);

            },

            refresh: function () {

            },

            destroy: function () {

            },


            on: function (name, fn) {
                this.fnlist[name] = fn;
            },

            wrap: function (obj) {
                var r= {
                    context: this,
                    init: this.init,
                    render: this.render,
                    show: this.show,
                    hide: this.hide
                };
                return xObject.extend(r,obj);
            }
        };


        return View;

    }
);

