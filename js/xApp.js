define(function (require, exports, module) {

    var xUrl = require('xlib/xUrl');
    var xString = require('xlib/xString');
    var xCache = require('xlib/xCache');

    var param ;
    var chatOpenidKey='chatOpenidKey';

    var isIphone=0;
    var isPc=false;


    function init() {

        if (!param) {
            var openid=xUrl.get('openid');
            param = {
                'eid': xUrl.get('eid'),
                'appid': 10091,//xUrl.get('appid'),
                'openid': openid,
                'appflag': xUrl.get('appflag'), //0 表示微信 1表示云之家
                'img': xUrl.get('img'),
                'nick': xUrl.get('nick'),
                'phone': xUrl.get('phone'),
                'groupid': xUrl.get('groupid'),

                'goodsImg': xUrl.get('goodsImg'),
                'goodsName': xUrl.get('goodsName'),
                'goodsPrice': xUrl.get('goodsPrice'),
                'goodsModel': xUrl.get('goodsModel')
            };
            if(!openid){
                //不是由微商城过来的客服
                openid=xCache.get(chatOpenidKey);
                if(openid==''){
                    openid=xString.random(18);
                    openid=xCache.set(chatOpenidKey,openid);
                }
                param.openid=openid;
                param.appflag=0;
                param.nick='客户'+openid.substring(0,3);
            }
        }

        return param;
    }

    //是否iphone flag=1 iphone微信浏览器 flag=2
    function checkIphoneSeries() {
        var userAgentInfo = navigator.userAgent.toLowerCase();
        var Agents = ["iphone", "ipad", "ipod"];
        var wxchat = ["micromessenger"];
        var flag = 0;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = 1;
                if (userAgentInfo.indexOf(wxchat) > 0){
                    flag = 2;
                }
                break;
            }
        }
        return flag;
    }


    //是否PC浏览器  true 表示pc端 false表示手机端
    function checkIsPcBrower() {
        var userAgentInfo = navigator.userAgent.toLowerCase();
        var Agents = ["android", "iphone", "ipad", "ipod"];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    }

    init();
    isIphone=checkIphoneSeries();
    isPc=checkIsPcBrower();

    return {
        init:init,
        isPc:isPc,
        isIphone:isIphone
    }

});

