define(function (require, exports, module) {

        /**
         *
         * @param 接口参数
         * @returns
         *
         * @date 2016-06-12
         * @author yaohong_zhou
         */

        var xEvent = require('xlib/xEvent');
        var xString = require('xlib/xString');
        var xCtrl = require('xlib/xCtrl');
        var xDate = require('xlib/xDate');
        var xUtils = require('xlib/xUtils');
        var xArray = require('xlib/xArray');


        var Api = require('views/chat/api');
        var Param = require('views/chat/param');


        //格式化数据
        function format(uList, msgs, groupid, talktime) {
            var defaultImg = '../img/weixin.png';

            function getImg(openid) {
                var iuser = user[openid];
                if (iuser) {
                    return iuser.img || defaultImg;
                }
                for (var i in uList) {
                    if (uList[i].openid == openid) {
                        user[openid] = {
                            img: uList[i].imgurl,
                            nick: uList[i].nick
                        };
                        return user[openid].img || defaultImg;
                    }
                }
                return '';
            }

            function getNick(openid) {
                var iuser = user[openid];
                if (iuser) {
                    return iuser.nick || '';
                }
                for (var i in uList) {
                    if (uList[i].openid == openid) {
                        user[openid] = {
                            img: uList[i].imgurl,
                            nick: uList[i].nick
                        };
                        return user[openid].nick;
                    }
                }
                return '';
            }

            var user = {};
            var param = Param.init();
            var openid = param.openid;
            var meImg=getImg(openid);
            var list = [];
            var vOpenid;
            var msgid;
            var msgObj;
            var msg;
            var other;
            var itime;
            var msgtime;

            var len = msgs.length - 1;
            for (var i = len; i >= 0; i--) {
                vOpenid = msgs[i].openID;
                msgid = msgs[i].fid;

                //解析消息格式
                try {
                    msgObj = JSON.parse(msgs[i].message);
                    msg = msgObj.msg || '';
                    other = msgObj.other || '';
                } catch (e) {
                    msg = msgs[i].message;
                    other = '';
                }

                //把消息时间 转换成时间戳 方便比较大小
                msgtime = msgs[i].createTime;
                try {
                    itime = xDate.parseitime(msgtime);
                    itime = itime / 1000;
                } catch (e) {
                }

                //console.log(msgtime+'*'+itime);
                list.push({
                        msgid: msgid,
                        msg: msg,
                        other: other,
                        time: msgtime,
                        itime: itime,
                        me: openid == vOpenid,
                        img: getImg(vOpenid),
                        nick: getNick(vOpenid)
                    }
                );
            }

            return {
                list: list,
                talktime: talktime,
                img: meImg,
                msgid: msgid,
                groupid: groupid
            };
            /*
             * {"openid":"hong1012","nick":"宏哥007","imgurl":"ggg",
             * "heartTime":"2016-06-07 16:57:45","IsOnline":true}
             * */
        }

        //获取聊天记录
        function get(imsg, fnCall) {
            Api.talkList(imsg, function (json) {
                var data;
                if (json.Result == 200) {
                    data = json.Data || {};
                    var user = data.msgUsers || [];
                    var msgs = data.msgs || [];
                    var groupid = data.GroupID || 0;
                    var talktime = data.getTime || '';
                    fnCall && fnCall(format(user, msgs, groupid, talktime));
                } else {
                    //fnCall && fnCall({});
                }
                // console.log(JSON.stringify(json));
            });
        }

        function send(imsg, fnCall) {
            Api.sendMsg(imsg, function (json) {
                if (json.Result == 200) {
                    fnCall && fnCall(json);
                } else {
                    //var ErrMsg=json.ErrMsg;
                }
                // console.log(JSON.stringify(json));
            });
        }

        return {
            get: get,
            send: send
        };
    }
)
;
