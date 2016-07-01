define(function (require, exports, module) {

        /**
         *
         * @param 接口参数
         * @returns
         *
         * @date 2016-03-21
         * @author yaohong_zhou
         */

        var Api = require('xlib/xApi');
        var xDate = require('xlib/xDate');
        var xObject = require('xlib/xObject');
        var Param = require('views/chat/param');

        //var url = 'http://172.18.1.58/cs/rest';
        var url = 'http://kismob.kingdee.com/cs/rest';

        //以下2个参数 微信用户使用。云之家不需要
        var groupid;
        var talktime = '';


        /*
         *   //url 接口url，param  接口参数， fnCall 回调
         * */

        function login(fnCall) {
            var parm = xObject.toQueryStr(Param.login());
            Api.post({
                url: url,
                param: parm,
                fnCall: fnCall
            });
        }

        function talkList(imsg, fnCall) {

            if (Param.init().appflag == 0) {
                //微信用户
                if (talktime) {
                    getTalk(fnCall, {
                        groupid: groupid,
                        talktime: talktime
                    });
                } else {
                    //微信首次加载要登录
                    login(function (json) {
                        if (json.Result == 200) {
                            var data = json.Data || {};
                            groupid = data.groupid || 0;
                            getTalk(fnCall, {
                                groupid: groupid,
                                talktime: ''
                            });
                        }
                        console.log(JSON.stringify(json));
                    });
                }
            } else {
                getTalk(fnCall, {
                    groupid: imsg.groupid,
                    talktime: imsg.talktime
                });
            }

        }

        function getTalk(fnCall, imsg) {
            var parm = xObject.toQueryStr(Param.talklist({
                groupid: imsg.groupid,
                talktime: imsg.talktime
            }));

            Api.post({
                url: url,
                param: parm,
                fnCall: function (json) {
                    var data;
                    if (json.Result == 200) {
                        data = json.Data || {};
                        groupid = data.GroupID || 0;
                        talktime = data.getTime || '';
                        fnCall && fnCall(json);
                    }else{
                        //fnCall && fnCall(json);
                        //console.log('api_fnCall');
                    }
                }
            });
        }

        function talkGroup(fnCall) {
            var parm = xObject.toQueryStr(Param.talkgroup());
            Api.post({
                url: url,
                param: parm,
                fnCall: fnCall
            });
        }

        function sendMsg(imsg, fnCall) {

            var vmsg;
            var vgroupid;
            //微信
            if (Param.init().appflag == 0) {
                vmsg = imsg.msg;
                vgroupid = groupid;
            } else {
                vmsg = imsg.msg;
                vgroupid = imsg.groupid;
            }

            var parm = xObject.toQueryStr(Param.sendmsg({
                other: imsg.other,
                msgid: imsg.msgid,
                msg: vmsg,
                groupid: vgroupid
            }));
            Api.post({
                url: url,
                param: parm,
                fnCall: fnCall
            });
        }

        function getMsg(bfirst) {
            var msg = [
                '说什么？不明白',
                '再说一次',
                '你逗我啊',
                '小样...',
                '我不懂，别问我为什么不懂，不想懂就不懂。你听不明白那就不明白呗...',
                '说点什么吧？那么沉默...'
            ];
            return bfirst ? msg[5] : msg[parseInt(Math.random() * 10) % 5];
        }

        return {
            talkList: talkList,
            sendMsg: sendMsg,
            talkGroup: talkGroup,
            getMsg: getMsg
        }
    }
);
