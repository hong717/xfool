define(function (require, exports, module) {

        /**
         * 调用url 的get方法
         *
         * @caller {object} 接口参数，包含 url,  fnSuccess, fnFail,fnError
         * @returns
         *
         * @date 2016-03-21
         * @author yaohong_zhou
         */

        function get(caller) {
            //url,  fnSuccess, fnFail,fnError
            var xhr = new window.XMLHttpRequest();
            xhr.open('GET', caller.url, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        var data = xhr.responseText;
                        var json = (new Function('return ' + data))();
                        if (json.code == 200) {
                            caller.fnSuccess && caller.fnSuccess(json.data);
                        } else {
                            caller.fnFail && caller.fnFail(json.msg);
                        }
                    }
                    else {
                        caller.fnError && caller.fnError("调用接口出错Error");
                    }
                }
            };
            xhr.send(null);
        }





        //url 接口url，param  接口参数， fnCall 回调
        function post(caller) {
            try {
                var xhr = new window.XMLHttpRequest();
                xhr.open('post', caller.url, true);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) {
                            var data = xhr.responseText;
                            var json = (new Function('return ' + data))();
                            caller.fnCall && caller.fnCall(json);

                            //随机延迟服务端响应
/*                            var itime=Math.random()*10*500;
                            setTimeout(function(){
                                caller.fnCall && caller.fnCall(json);
                            },itime);*/

                        }
                    }
                };
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.send(caller.param);
            } catch (e) {
                caller.fnCall && caller.fnCall({});
                //console.log('post_fnCall');
            }
        }

        return {
            get: get,
            post: post
        }
    }
);
