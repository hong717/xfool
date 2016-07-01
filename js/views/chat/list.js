define(function (require, exports, module) {

        /**
         *
         * @param 接口参数
         * @returns
         *
         * @date 2016-03-21
         * @author yaohong_zhou
         */

        var xEvent = require('xlib/xEvent');
        var xString = require('xlib/xString');
        var xCtrl = require('xlib/xCtrl');
        var xUtils = require('xlib/xUtils');
        var xArray = require('xlib/xArray');
        var xObject = require('xlib/xObject');
        var xDate = require('xlib/xDate');

        var Chat = require('views/chat/chat');
        var xView = require('view/xView');
        var xApp = require('xApp');
        var view = new xView('#viewid-chat');

        var viewPage;
        var chatList;
        var chatView;
        var me_li;
        var other_li;
        var time_li;
        var goods_li;
        var msgText;

        var msgTxtId = 'viewid-chat-msg';

        var config;
        //消息重复获取标志
        var repeat = 1;
        //消息获取间隔时间
        var repeatTime = 1000;
        //消息id最大值
        var maxMsgId = 0;
        //用来做发送消息成功与否的判断
        var msgId = 0;
        //用来记录消息发送时间
        var msgSendList = {};
        //最后一条消息的时间
        var lastMsgTime = 0;
        //微商城商品信息
        var goodsInfo;
        //消息时间显示 默认间隔5分钟
        var timeApart = 60 * 5;
        //自身头像
        var meImg = '';
        var today = xDate.getDay(0);
        var defaultImg = '../img/weixin.png';

        view.on('init', function () {

            viewPage = view.$viewPage;
            chatView = document.getElementById('viewid-chat-list');
            chatList = $(chatView);
            var chatHtml = chatView.innerHTML;
            me_li = xString.between(chatHtml, '<!--me', 'me-->');
            other_li = xString.between(chatHtml, '<!--other', 'other-->');
            time_li = xString.between(chatHtml, '<!--time', 'time-->');
            goods_li = xString.between(chatHtml, '<!--goods', 'goods-->');
            chatView.innerHTML = '';
            msgText = $('#' + msgTxtId);
            bindEvents();
        });


        //获取消息框的内容行数
        function getTxtRow() {
            var msg = document.getElementById(msgTxtId).value;
            var row = msg.split("\n").length;
            return row < 4 ? row : 4;
        }

        //监控消息框的内容
        function txtChange() {
            initTxt();
            var irow = getTxtRow();
            msgText.addClass('msgH' + irow);
        }

        //初始化消息发送框
        function initTxt() {
            for (var i = 1; i <= 4; i++) {
                msgText.removeClass('msgH' + i);
            }
        }

        //处理聊天消息中的回车符号
        function dealSpecialChar(msg) {
            return msg.replace(/\n/g, '<br />');
        }

        function sendClick() {
            var msg = msgText.val();
            if (msg != '') {
                msgText.val('');
                initTxt();
                var other = '';
                if (!xObject.isEmpty(goodsInfo)) {
                    other = JSON.stringify(goodsInfo);
                    msgId += 1;
                    sendMsg({
                        other: other,
                        msgid: msgId,
                        msg: '',
                        groupid: config.groupid
                    });
                    goodsInfo = {};
                    other = '';
                    //延迟一点点 免得消息的先后顺序区分不开
                    setTimeout(function () {
                        msgId += 1;
                        sendMsg({
                            other: other,
                            msgid: msgId,
                            msg: msg,
                            groupid: config.groupid
                        });
                    }, 10);
                } else {
                    msgId += 1;
                    sendMsg({
                        other: other,
                        msgid: msgId,
                        msg: msg,
                        groupid: config.groupid
                    })
                }
            }
            document.getElementById(msgTxtId).focus();
        }

        function bindEvents() {

            viewPage.on('click', '[data-cmd="send"]', function () {
                sendClick();
            })
                .on('input propertychange', '#' + msgTxtId, xUtils.throttle(txtChange, 500))
                .on('focus', '#' + msgTxtId, function () {
                    refresh();
                });
/*
                .on('keydown', '#' + msgTxtId, function (event) {
                    if (xApp.isPc) {
                        var e = event || window.event || arguments.callee.caller.arguments[0];
                        if (e.keyCode == 13) {
                            sendClick();
                        }
                    }
                });*/
            //.on('keyup', '#' + msgTxtId, xUtils.throttle(txtChange, 500));

            var resizeTimer = null;
            $(window).on('resize', function () {
                    if (resizeTimer) {
                        clearTimeout(resizeTimer);
                        resizeTimer = null;
                    }
                    resizeTimer = setTimeout(function () {
                        refresh();
                    }, 120);
                }
            );
        }


        //消息发送成功后 由消息对象检查列表中删除
        function sendMsgCallBack(json) {
            if (json.Result == 200) {
                var Data = json.Data;
                var msgid = Data.msgid;
                delete msgSendList[msgid];
                var msgv = chatList.find('[data-id="' + msgid + '"]');
                msgv.addClass('hide');
            }
        }


        //发送消息
        function sendMsg(imsg) {
            Chat.send(imsg, sendMsgCallBack);
            var itime = (new Date().getTime());
            var time = xDate.format(new Date(), "yyyy-MM-dd HH:mm:ss");
            msgSendList[imsg.msgid] = itime;
            //window.itest = msgSendList;
            var img = (meImg == '' ? defaultImg : meImg);
            iSay({
                msg: imsg.msg,
                sendid: imsg.msgid,
                img: img,
                time: time,
                itime: itime / 1000
            });
        }


        //刷新聊天窗口，滚动条置底
        function refresh() {
            document.body.scrollTop = document.body.scrollHeight;
        }


        //显示消息时间
        function showTime(time) {
            var t = time.substring(0, time.length - 3);
            if (t.indexOf(today) >= 0) {
                t = t.replace(today, '');
            } else {
                t = t.substring(5);
            }
            var msgli = xString.format(time_li, {time: t});
            chatList.append(msgli);
            //refresh();
        }

        //显示商品信息
        function showGoods(other) {
            var goods = JSON.parse(other);
            var msgli = xString.format(goods_li, goods);
            chatList.append(msgli);
            //refresh();
        }

        //发送聊天信息
        function iSay(imsg, nofresh) {
            if (imsg.other) {
                if (imsg.itime - lastMsgTime > timeApart) {
                    showTime(imsg.time);
                    lastMsgTime = imsg.itime;
                }
                showGoods(imsg.other);
            }

            if (imsg.msg != '') {
                if (imsg.itime - lastMsgTime > timeApart) {
                    showTime(imsg.time);
                    lastMsgTime = imsg.itime;
                }
                var msgli = xString.format(me_li, {
                    'sendid': imsg.sendid || '-1',
                    'img': imsg.img,
                    'msg': dealSpecialChar(imsg.msg)
                });
                chatList.append(msgli);
            }
            if (!nofresh) {
                refresh();
            }
        }

        //其它人发送的消息显示
        function otherSay(imsg, nofresh) {
            if (imsg.other) {
                showGoods(imsg.other);
            }
            if (imsg.msg != '') {
                if (imsg.itime - lastMsgTime > timeApart) {
                    showTime(imsg.time);
                    lastMsgTime = imsg.itime;
                }
                var msgli = xString.format(other_li, {
                    'nick': imsg.nick,
                    'img': imsg.img,
                    'msg': dealSpecialChar(imsg.msg)
                });
                chatList.append(msgli);
            }
            if (!nofresh) {
                refresh();
            }
        }


        //聊天历史
        function hisList(msg) {
            var list = msg.list;
            if (list.length > 0) {
                for (var i in list) {
                    if (list[i].msgid > maxMsgId) {
                        list[i].me ? (!config.talktime ? iSay(list[i], true) : '')
                            : otherSay(list[i], true);
                    }
                }
                maxMsgId = msg.msgid;
                refresh();
            }
            if (msg.talktime) {
                config.talktime = msg.talktime;
                config.groupid = msg.groupid;
                if (msg.img) {
                    meImg = msg.img;
                }
            }
        }


        //检查消息是否发送成功 根据超时来判断
        function checkMsgSend() {
            var checktime = (new Date().getTime());
            var diff = 2000;
            var failList = [];
            for (var i in msgSendList) {
                if (checktime - msgSendList[i] >= diff) {
                    failList.push(i);
                }
            }
            for (var j in failList) {
                chatList.find('[data-id="' + failList[j] + '"]').removeClass('hide');
            }

        }

        //循环检测是否有消息 以及检查消息是否发送成功
        function repeatCall() {
            setTimeout(function () {
                if (repeat) {
                    checkMsgSend();
                    Chat.get({
                        groupid: config.groupid,
                        talktime: config.talktime
                    }, function (msg) {
                        hisList(msg);
                        repeatCall();
                    });
                }
            }, repeatTime);
        }

        //检测是否携带浏览商品信息
        function checkGoods() {
            var init = xApp.init();
            if (init.goodsName) {
                goodsInfo = {
                    'img': init.goodsImg,
                    'name': init.goodsName,
                    'price': init.goodsPrice,
                    'model': init.goodsModel
                }
            }
        }

        view.on('render', function (param) {
            repeat = 1;
            maxMsgId = 0;
            msgId = 0;
            lastMsgTime = 0;
            chatList.empty();
            config = param;
            Chat.get({
                groupid: config.groupid,
                talktime: config.talktime
            }, hisList);
            repeatCall();
            checkGoods();
            //xCtrl.toast('new2');
        });

        view.on('hide', function () {
            repeat = 0;
        });


        return view.wrap();
    }
);


