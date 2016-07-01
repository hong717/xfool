define(function () {

        /**
         * 获取位于两个标记子串之间的子字符串。
         * @param {String} string 要进行获取的大串。
         * @param {String} tag0 区间的开始标记。
         * @param {String} tag1 区间的结束标记。
         * @return {String} 返回一个子字符串。当获取不能结果时，统一返回空字符串。
         * @example
         $.String.between('abc{!hello!} world', '{!', '!}'); //结果为 'hello'
         */

        function between(string, tag0, tag1) {
            var startIndex = string.indexOf(tag0);
            if (startIndex < 0) {
                return '';
            }

            startIndex += tag0.length;

            var endIndex = string.indexOf(tag1, startIndex);
            if (endIndex < 0) {
                return '';
            }

            return string.substr(startIndex, endIndex - startIndex);
        }


        /*
         *
         * @dom {string} dom节点的id标识 或者jquery 包裹的对象
         * @returns 返回这个节点的默认模板
         *
         * */
        function template(domId) {
            var htmlStr = (typeof domId == 'string') ? document.getElementById(domId).innerHTML : domId[0].innerHTML;
            return between(htmlStr, '<!--', '-->');
        }


        /**
         * 产生指定格式或长度的随机字符串。
         * @param {string|int} [formater=12] 随机字符串的格式，或者长度（默认为12个字符）。
         格式中的每个随机字符用 'x' 来占位，如 'xxxx-1x2x-xx'
         * @return {string} 返回一个指定长度的随机字符串。
         * @example
         $.String.random();      //返回一个 12 位的随机字符串
         $.String.random(64);    //返回一个 64 位的随机字符串
         $.String.random('xxxx-你好xx-xx'); //类似 'A3EA-你好B4-DC'
         */
        function random(formater) {
            if (formater === undefined) {
                formater = 12;
            }

            //如果传入的是数字，则生成一个指定长度的格式字符串 'xxxxx...'
            if (typeof formater == 'number') {
                var size = formater + 1;
                if (size < 0) {
                    size = 0;
                }
                formater = [];
                formater.length = size;
                formater = formater.join('x');
            }

            return formater.replace(/x/g, function (c) {
                var r = Math.random() * 16 | 0;
                return r.toString(16);
            }).toUpperCase();
        }


        /**
         * 用指定的值去填充一个字符串。
         * 当不指定字符串的填充标记时，则默认为 {}。
         * @param {String} string 要进行格式填充的字符串模板。
         * @param {Object} obj 要填充的键值对的对象。
         * @return 返回一个用值去填充后的字符串。
         * @example
         * 用法：
         $.String.format('{id}{type}', {id: 1, type: 'app'});
         $.String.format('{2}{0}{1}', 'a', 'b', 'c');
         */
        function format(string, obj, arg2) {
            var s = string;
            if (typeof obj == 'object') {
                for (var key in obj) {
                    s = replaceAll(s, '{' + key + '}', obj[key]);
                }
            }
            else {
                var args = Array.prototype.slice.call(arguments, 1);
                for (var i = 0, len = args.length; i < len; i++) {
                    s = replaceAll(s, '{' + i + '}', args[i]);
                }
            }
            return s;
        }

        /**
         * 对字符串进行全局替换。
         * @param {String} target 要进行替换的目标字符串。
         * @param {String} src 要进行替换的子串，旧值。
         * @param {String} dest 要进行替换的新子串，新值。
         * @return {String} 返回一个替换后的字符串。
         * @example
         $.String.replaceAll('abcdeabc', 'bc', 'BC') //结果为 aBCdeBC
         */
        function replaceAll(target, src, dest) {
            return target.split(src).join(dest);
        }

        // 金额千分位格式化
        function formatMoney(money, digit) {
            if (money == undefined) {
                money = 0;
            }
            var moneystr = money + "";
            if (digit == undefined) {
                digit = moneystr.indexOf(".");
                if (digit < 0) {
                    digit = 0;
                } else {
                    digit = moneystr.length - 1 - digit;
                }
            }
            return formatM(moneystr, digit);
        }

        // 金额千分位格式化
        function formatM(money, digit) {
            try {
                var minusFlag = false;
                if (money < 0) {
                    money = -money;
                    minusFlag = true;
                }
                digit = digit >= 2 ? 2 : digit;
                money = parseFloat((money + "").replace(/[^\d\.-]/g, "")).toFixed(digit) + "";
                var intPart = "";
                var fraction = "";
                if (digit > 0) {
                    intPart = money.split(".")[0].split("").reverse();
                    fraction = money.split(".")[1];
                } else {
                    intPart = money.split("").reverse();
                }
                var temp = "";
                var inum = intPart.length;
                for (var i = 0; i < inum; i++) {
                    temp += intPart[i] + ((i + 1) % 3 == 0 && (i + 1) != inum ? "," : "");
                }
                var digitStr = '';
                if (digit > 0) {
                    digitStr = temp.split("").reverse().join("") + "." + fraction;
                } else {
                    digitStr = temp.split("").reverse().join("");
                }
                if (minusFlag) {
                    digitStr = '-' + digitStr;
                }
                return digitStr;
            }
            catch (ex) {
                return money;
            }

        }


        return {
            formatMoney: formatMoney,
            random: random,
            between: between,
            format: format,
            template: template
        }
    }
);
