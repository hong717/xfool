define(function (require, exports, module) {

        /**
         *
         * @param 接口参数
         * @returns
         *
         * @date 2016-03-21
         * @author yaohong_zhou
         */

        var $ = require('lib/jquery2.1.1');
       // require('lib/mobscroll.debug');

        var xToast = $("#xctrl-toast");
        var xLoading = $("#xctrl-loading");

        //toast消息提醒
        function toast(msg, fn, itime) {
            xToast.find("span").html(msg);
            xToast.show();
            if (fn && (typeof fn != 'function')) {
                itime = fn;
                fn = null;
            }
            itime = itime || 1300;
            setTimeout(function () {
                if (fn) {
                    fn()
                }
                xToast.hide();
            }, itime);
        }


        //loading消息提醒
        function loading(bview, msg) {
            if (bview) {
                if (!msg) {
                    msg = "正在努力加载...";
                }
                xLoading.find(".loading-text")[0].innerHTML = msg;
                xLoading.show();
            } else {
                xLoading.hide();
            }
        }


        var maxDate = new Date(2030, 11, 31, 23, 59, 59);//最大日期2030.12.31
        var minDate = new Date(1949, 0, 01, 00, 00, 00);//最小日期1949.1.1
        function date(dateCtrl, dateStr, event) {

           /* event = event || {};
            $.extend(event, {
                'onSelect': event.onSelect || function () {
                },
                'onChange': event.onChange || function () {
                },
                'onCancel': event.onCancel || function () {
                }
            });

            //初始化日期控件
            dateCtrl.mobiscroll().date({
                theme: 'android-ics',
                lang: 'zh',
                maxDate: maxDate,
                minDate: minDate,
                display: 'bottom',
                mode: 'scroller',
                dateFormat: "yy-mm-dd",
                inputDateFormat: "yy-mm-dd",
                showLabel: false,
                dateOrder: 'yymmdd',
                cancelText: "取消",
                setText: "确定",
                rows: 5,
                //点击确定按钮，触发事件。
                'onSelect': event.onSelect,
                //当时间选择的内容发生变化触发的事件
                'onChange': event.onChange,
                //点击取消按钮触发的事件
                'onCancel': event.onCancel
            });

            if (dateStr) {
                dateCtrl.val(dateStr);
            }
*/
        }

        return {
            toast: toast,
            loading: loading,
            date: date
        }
    }
);
