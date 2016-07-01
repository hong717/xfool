define(function (require, exports, module) {

        /**
         *
         * @param 接口参数
         * @returns
         *
         * @date 2016-03-21
         * @author yaohong_zhou
         */


        var xApp = require('xApp');


        //格式化日期 把2015-1-8 20:5:22  格式化成 2015-01-08 20:05:22
        function xformat(date) {

            if (!date) {
                return '';
            }

            function fmt(num) {
                num = num + '';
                return num.length > 1 ? num : '0' + num;
            }

            try {
                var dateStr = '';
                var d = date.split(' ');
                var day = d[0];
                var d1 = day.split('-');
                for (var i in d1) {
                    dateStr = (i == 0 ? dateStr + fmt(d1[i]) : dateStr + '-' + fmt(d1[i]));
                }
                dateStr = dateStr + ' ';
                var time = d[1];
                var t1 = time.split(':');
                for (var j in t1) {
                    dateStr = (j == 0 ? dateStr + fmt(t1[j]) : dateStr + ':' + fmt(t1[j]));
                }
                return dateStr;
            } catch (e) {
                return date;
            }
        }

        //day 是在当前日期上进行加减
        function getDay(iday,dateStr){
            var date = new Date();
            if(dateStr){
                date = new Date(dateStr);
            }
            date.setDate(date.getDate()+iday);
            var month=date.getMonth() + 1;
            var day=date.getDate();
            return date.getFullYear() + "-" + (month < 10 ? "0" : "")
                + month + "-" + (day < 10 ? "0" : "") + day;
        }

        //把日期转换成时间戳
        function parseitime(datestr){
            var isIphone=xApp.isIphone;
            var itime=0;
            if(isIphone>0){
                var msgtime=datestr.replace(/-/g, "/");
                itime=Date.parse(new Date(msgtime));
            }else{
                itime=Date.parse(new Date(datestr));
            }
            return Number(itime);

        }


        function format (date,fmt) { //author: meizz
            var o = {
                "M+": date.getMonth() + 1, //月份
                "d+": date.getDate(), //日
                "H+": date.getHours(), //小时
                "m+": date.getMinutes(), //分
                "s+": date.getSeconds(), //秒
                "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                "S": date.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }



        return {
            parseitime: parseitime,
            xformat: xformat,
            format: format,
            getDay:getDay
        }
    }
);
