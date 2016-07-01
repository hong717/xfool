define(function (require, exports, module) {

    var nav = require('xlib/xNavigation');
    var xEvent = require('xlib/xEvent');
    var xApp = require('xApp');

    var chat_list = require('views/chat/list');
    nav.push('chat-list', chat_list);
    var chat_group = require('views/chat-group/chat-group');
    nav.push('chat-group', chat_group);
    var pc_chat = require('views/pc-chat/pc-chat');
    nav.push('pc-chat', pc_chat);

    var param = xApp.init();

    var isPc = xApp.isPc;
    if (isPc && param.appflag == 1) {
        xEvent.toview('pc-chat', [{}]);
    } else {
        if (param.appflag == 0) {
            //微信
            xEvent.toview('chat-list', [{}]);
        } else if (param.appflag == 1) {
            xEvent.toview('chat-group', [{}]);
        }
    }


});

