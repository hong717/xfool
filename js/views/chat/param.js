define(function (require, exports, module) {

        /**
         *
         * @param 接口参数
         * @returns
         *
         * @date 2016-03-21
         * @author yaohong_zhou
         */

        //var xUrl = require('xlib/xUrl');
        var xUtils = require('xlib/xUtils');
        var xApp = require('xApp');
        var param;
        var pagesize=20;


        function init() {
            param= xApp.init();
            return param;
        }

        /*eid	Y		企业号
         appid	Y		应用ID
         openid	Y		用户标识 微信、云之家
         method	Y		调用API名称
         ts*/
        /*Nick	Y		用户昵称
         isKisUser	0		登陆用户类型，从微信登陆0，云家之家1 默认0
         Imgurl			用户图像URL
         ServicersPhone*/

        function login() {
            init();
            return {
                eid: param.eid,
                appid: param.appid,
                openid: param.openid,
                method: 'kingdee.kis.customservice.login',
                ts: xUtils.timestamp(),
                Nick: param.nick,
                isKisUser: param.appflag,
                Imgurl: param.img,
                ServicersPhone: param.phone
            }
        }


        /*
         * groupid	Y		对话组ID
         talktime			如没有值，取最新10条对话记录，
         返回指定时间后的对话记录
         pageindex	N	1	当前页码
         pagesize	N	1	页码数
         * */

        function talklist(imsg) {
            init();
            return {
                eid: param.eid,
                appid: param.appid,
                openid: param.openid,
                method: 'kingdee.kis.customservice.talklist',
                ts: xUtils.timestamp(),
                groupid: imsg.groupid,
                talktime: imsg.talktime,
                pageindex: 1,
                pagesize: pagesize
            }
        }

        function sendmsg(imsg) {
            init();
            var msg={
                msg:imsg.msg
            };
            if(imsg.other){
                msg.other=imsg.other;
            }
            return {
                eid: param.eid,
                appid: param.appid,
                openid: param.openid,
                method: 'kingdee.kis.customservice.sendmsg',
                ts: xUtils.timestamp(),
                groupid: imsg.groupid,
                msgid: imsg.msgid || 0,
                msg: JSON.stringify(msg)
            }



        }

        function talkgroup() {
            init();
            return {
                eid: param.eid,
                appid: param.appid,
                openid: param.openid,
                method: 'kingdee.kis.customservice.talkgroup',
                ts: xUtils.timestamp(),
                pageindex: 1,
                pagesize: pagesize
            }
        }

        return {
            init: init,
            login: login,
            talklist: talklist,
            talkgroup: talkgroup,
            sendmsg: sendmsg
        }
    }
);
