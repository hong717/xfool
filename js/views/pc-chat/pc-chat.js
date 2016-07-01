define(function (require, exports, module) {

        /**
         *
         * @param 接口参数
         * @returns
         *
         * @date 2016-06-21
         * @author yaohong_zhou
         */

        var xEvent = require('xlib/xEvent');
        var xString = require('xlib/xString');
        var xCtrl = require('xlib/xCtrl');
        var xUtils = require('xlib/xUtils');
        var xArray = require('xlib/xArray');
        var xObject = require('xlib/xObject');

        var Api = require('views/chat/api');
        var xView = require('view/xView');
        var xApp = require('xApp');

        var pcList = require('views/pc-chat/list');
        var view = new xView('#viewid-pc-chat');

        var viewPage;
        var groupDom;
        var listDom;
        var sampleGroup;
        var sample;
        var groupData;  //groupid talklist
        var repeatTime = 2000;

        var defaultImg = '../img/weixin.png';


        view.on('init', function () {
            viewPage = view.$viewPage;
            groupDom = document.getElementById('viewid-pc-chat-group');
            listDom = document.getElementById('viewid-pc-chat-list');
            sample = xString.template(listDom.id);
            sampleGroup = xString.template(groupDom.id);
            bindEvents();
            pcList.init(viewPage);
        });


        function bindEvents() {

            viewPage.on('click', '[data-cmd="group"]', function () {
                var index = this.getAttribute('data-index');
                selectChat(index);
            });

        }


        //选中某个会话
        function selectChat(index) {
            var $groupDom = $(groupDom);
            $groupDom.find('[data-cmd="group"]').removeClass('on');
            var li = $groupDom.find('[data-index="' + index + '"]');
            li.addClass('on');
            li.find('[data-cmd="alert"]').removeClass('alert');
            var item = groupData[index];
            var groupid = item.groupid;
            var talktime = item.talktime || '';
            pcList.render({
                talktime: talktime,
                groupid: groupid
            });
        }

        //填充列表数据
        function fill(list) {
            var listArr = [];
            var item;
            for (var i in list) {
                item = list[i];
                listArr.push(xString.format(sampleGroup, {
                    'index': i,
                    'img': item.img || defaultImg,
                    'name': item.name,
                    'msg': item.msg,
                    'groupid': item.groupid
                }));
            }
            groupDom.innerHTML = listArr.join('');
        }


        view.on('render', function () {
            getList(function (list) {
                groupData = list;
                fill(groupData);
                startTalk();
            });
            repeatCall();
        });


        //比较2个数组差异 并返回差异数组
        function cmpList(list, listOrg) {
            var ilen = list.length;
            var jlen = listOrg.length;
            var item;
            var bexist;
            var cmpList = [];
            for (var i = 0; i < ilen; i++) {
                bexist = false;
                item = list[i];
                for (var j = 0; j < jlen; j++) {
                    if (item.groupid == listOrg[j].groupid) {
                        bexist = true;
                        if (item.time != listOrg[j].time) {
                            item.isnew = 0;
                            cmpList.push(item);
                            listOrg[j].time = item.time;
                        }
                        break;
                    }
                }
                if (!bexist) {
                    item.isnew = 1;
                    cmpList.push(item);
                }
            }
            //console.log(JSON.stringify(cmpList));
            return cmpList;
        }


        //更新会话组内容
        function updateGroupList(list) {
            var $groupDom = $(groupDom);
            for (var i in list) {
                if (list[i].isnew == 1) {
                    var item = xObject.clone(list[i]);
                    groupData.push(item);
                    var li = xString.format(sampleGroup, {
                        'index': groupData.length - 1,
                        'img': item.img || defaultImg,
                        'name': item.name,
                        'msg': item.msg,
                        'groupid': item.groupid
                    });
                    $groupDom.prepend(li);
                    var linew = $groupDom.find('[data-groupid="' + item.groupid + '"]');
                    linew.find('[data-cmd="alert"]').addClass('alert');
                } else {
                    var liv = $groupDom.find('[data-groupid="' + list[i].groupid + '"]');
                    liv.find('[data-msg]')[0].innerText = list[i].msg;
                    liv.find('[data-cmd="alert"]').addClass('alert');
                }
            }
        }

        //循环检测 会话组 是否有新消息
        function repeatCall() {
            setTimeout(function () {
                getList(function (list) {
                    var ls = cmpList(list, groupData);
                    if (ls.length > 0) {
                        updateGroupList(ls);
                    }
                    repeatCall();
                });
            }, repeatTime);
        }

        //默认选中第一个会话列表 来打开特定对话
        function startTalk() {
            if (groupData.length > 0) {
                selectChat(0);
            }
        }



        //格式化数据
        function format(list) {
            var ls = [];
            var msgObj;
            var msg;
            var other;
            for (var i in list) {
                try {
                    msgObj = JSON.parse(list[i].message);
                    msg = msgObj.msg || '';
                    other = msgObj.other || '';
                } catch (e) {
                    msg = list[i].message;
                    other = '';
                }
                ls.push({
                    'img': list[i].wxImgurl,
                    'name': list[i].wxnick,
                    'time': list[i].createTime,
                    'msg': msg,
                    'other': other,
                    'groupid': list[i].groupID
                });
            }
            return ls;
        }

        //获取会话组
        function getList(fncall) {
            Api.talkGroup(function (json) {
                if (json.Result = 200) {
                    var list = json.Data || [];
                    var ls = format(list);
                    fncall && fncall(ls);
                }
            });
        }


        return view.wrap();
    }
)
;
