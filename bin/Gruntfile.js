module.exports = function (grunt) {

    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        transport: {
            options: {
                paths: ['../js']
            },
            xlib: {
                options: {
                    idleading: 'xlib/',
                    debug: false
                },
                files: [
                    {
                        cwd: '../js/xlib',
                        src: '**/*.js',
                        dest: '../build/js/xlib_tmp'
                    }
                ]
            },
            pcchat: {
                options: {
                    idleading: 'views/pc-chat/',
                    debug: false
                },
                files: [
                    {
                        cwd: '../js/views/pc-chat',
                        src: '**/*.js',
                        dest: '../build/js/views_tmp'
                    }
                ]
            },
            viewchatgroup: {
                options: {
                    idleading: 'views/chat-group/',
                    debug: false
                },
                files: [
                    {
                        cwd: '../js/views/chat-group',
                        src: '**/*.js',
                        dest: '../build/js/views_tmp'
                    }
                ]
            },
            viewchat: {
                options: {
                    idleading: 'views/chat/',
                    debug: false
                },
                files: [
                    {
                        cwd: '../js/views/chat',
                        src: '**/*.js',
                        dest: '../build/js/views_tmp'
                    }
                ]
            },
            view: {
                options: {
                    idleading: 'view/',
                    debug: false
                },
                files: [
                    {
                        cwd: '../js/view',
                        src: '**/*.js',
                        dest: '../build/js/view_tmp'
                    }
                ]
            },
            lib: {
                options: {
                    idleading: 'lib/',
                    debug: false
                },
                files: [
                    {
                        cwd: '../js/lib',
                        src: '**/*.js',
                        dest: '../build/js/lib'
                    }
                ]
            },
            other: {
                options: {
                    idleading: '',
                    debug: false
                },
                files: [
                    {
                        cwd: '../js',
                        src: ['index.js', 'xApp.js'],
                        dest: '../build/js'
                    }
                ]
            }

        },

        //清除目录
        clean: {
            options: {
                force: true
            },
            js: ['../build/js/xlib_tmp',  '../build/js/view_tmp','../build/js/views_tmp',
                '../build/js/xApp.js']

        },

        copy: {
            index: {
                dest: '../build/html/index.html',
                src: '../html/index.html'
            },
            img: {
                expand: true,
                cwd: '../img/',
                dest: '../build/img',
                src: '**'
            },
            js: {
                expand: true,
                cwd: '../js/',
                dest: '../build/js',
                src: ['sea.js']
            }
        },

        //合并
        concat: {
            options: {
                // 相对路径地址
                relative: true
            },
            index: {
                dest: '../build/js/index.js',
                src: ['../build/js/index.js', '../build/js/xApp.js',
                    '../build/js/xlib_tmp/*.js', '../build/js/views_tmp/*.js',
                    '../build/js/view_tmp/*.js',
                    //自己添加下面这个, 被transport遗漏的依赖项
                    '../js/views/pc-chat/list.js'
                ]
            },
            css: {
                dest: '../build/css/index.css',
                src: ['../css/*.css', '../css/*/*.css']
            },
            allviews:{
                dest: '../css/allviews.css',
                src: ['../js/views/*.css', '../js/views/*/*.css', '../js/views/*/*/*.css']
            }
            , html: {
                dest: '../html/all.html',
                src: ['../html/ctrl/*.html','../js/views/*.html', '../js/views/*/*.html',
                    '../js/views/*/*/*.html']
            }
        },
        //压缩 js
        uglify: {
            index: {
                options: {

                },
                src: '../build/js/index.js',
                dest: '../build/js/index.js'
            }
        },

        cssmin: {
            css: {
                src: [ '../build/css/index.css'],
                dest: '../build/css/index.min.css'
            }

        },

        // 处理html中css、js 引入合并问题
        usemin: {
            html: ['../build/html/index.html'],
            options: {
                blockReplacements: {
                    css: function (block) {
                        function format(date, fmt) {
                            var o = {
                                "M+": date.getMonth() + 1, //月份
                                "d+": date.getDate(), //日
                                "h+": date.getHours(), //小时
                                "m+": date.getMinutes(), //分
                                "s+": date.getSeconds(), //秒
                                "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                                "S": date.getMilliseconds() //毫秒
                            };
                            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
                            for (var k in o)
                                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                            return fmt;
                        }

                        var random = Math.random().toString(10).substr(2, 8);
                        var buildDate = format(new Date(), 'yyyy-MM-dd hh:mm:ss');
                        return '<link id="kdbuildDate" kdbuildDate="' + buildDate + '" rel="stylesheet" href="' + block.dest + random + '">';
                    },
                    js: function (block) {
                        var random = Math.random().toString(10).substr(2, 8);
                        return '<script async ' + 'src="' + block.dest + random + '"><\/script>';//次处为js标签的定制

                    }
                }
            }
        },

        //编译 css
        less: {
            css: {
                options: {
                    compress: true
                },
                files: [
                    {
                        expand: true,
                        src: ['../css/*.less', '../css/*/*.less', '../js/views/*.less',
                            '../js/views/*/*.less', '../js/views/*/*/*.less'
                        ],
                        dest: '../css/',
                        ext: '.css'
                    }
                ]
            }
        },

        //监控文件变化
        watch: {
            css: {
                files: ['../css/*.less', '../css/*/*.less',
                    '../js/*/*.less', '../js/*/*/*.less', '../js/*/*/*/*.less'
                ],
                tasks: ['less','concat:allviews']
            },
            html: {
                files: ['../html/index-master.html','../html/ctrl/*.html',
                    '../js/*/*.html', '../js/*/*/*.html', '../js/*/*/*/*.html'],
                tasks: ['concat:html', 'htmlpack']
            }
        }
    });


    grunt.loadNpmTasks('grunt-cmd-transport');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-css');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');


    grunt.registerTask('htmlpack', function () {

        var fs = grunt.file;
        var srcFile = '../html/index-master.html'; //源文件的路径
        var destFile = '../html/index.html'; //要保存的路径

        var file = fs.read(srcFile);
        var include = file.match(/\<include.+?\/\>/);

        // 替换内容
        include.forEach(function (item) {
            var src = item.replace('<include src="', '').replace('"/>', '');
            var html = fs.read(src);
            file = file.replace(item, html);
        });
        // 输出文件
        fs.write(destFile, file);

    });

    //在命令行调用 grunt 时，会直接执行该任务。
    //如果要执行其他任务，请指定任务名称，如 grunt test
    grunt.registerTask('chat', [
        'copy',    //复制文件
        'transport',  //合并文件
        'concat',  //合并文件
        'uglify',  //JS压缩
        'cssmin',   //CSS压缩
        'usemin',    //HTML处理
        'clean'
    ]);

    grunt.registerTask('clear', [
        'clean' //清除文件
    ]);

    grunt.registerTask('publish', ['less:css', 'concat:html', 'htmlpack', 'chat']);

    /*      'imagemin',             //图片压缩
     'usemin',               //HTML处理
     'htmlmin'               //HTML压缩*/

};