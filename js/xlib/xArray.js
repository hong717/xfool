define(function (require, exports, module) {

        /**
         *
         * @param 接口参数
         * @returns
         *
         * @date 2016-03-21
         * @author yaohong_zhou
         */


        //模糊过滤数组
        function filterLike(list, key, keyv) {
            function check(item, key, keyv) {
                for (var k in key) {
                    if (item[key[k]].indexOf(keyv) >= 0) {
                        return true;
                    }
                }
                return false;
            }

            var arr = [];
            var bArray = (key instanceof Array);
            for (var i in list) {
                var bcheck = bArray ? check(list[i], key, keyv) : (list[i][key].indexOf(keyv) >= 0);
                if (bcheck) {
                    arr.push(list[i]);
                }
            }
            return arr;
        }

        //增加数组索引序列号
        function addIndex(list, key) {
            key ? key : 'xindex';
            for (var i in list) {
                list[i][key] = i;
            }
            return list;
        }

        //根据某个字段的值 返回item
        function getItem(list, key, keyv) {
            for (var i in list) {
                if (list[i][key] == keyv) {
                    return list[i];
                }
            }
            return null;
        }

        //数组排序 key 排序字段 asc 是否升序
        function keySort(key, asc) {
            return function (x, y) {
                if (x[key] > y[key]) {
                    return asc ? 1 : -1;
                } else if (x[key] < y[key]) {
                    return asc ? -1 : 1;
                }
                return 0;
            }
        }

        //数组 某字段求和  keys 求和字段
        function sum(list, keys){
            var sums=[];
            for(var key in keys){
                sums.push(0);
            }
            for (var i in list) {
                for(var k in keys){
                    sums[k]=sums[k]+Number(list[i][keys[k]]);
                }
            }
            return sums;
        }

        return {
            filterLike: filterLike,
            keySort: keySort,
            getItem: getItem,
            sum: sum,
            addIndex: addIndex
        }
    }
);
