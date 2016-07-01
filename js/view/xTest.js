(function(){

    var Student=(function(){
        function student(name){
            this.name=name;
        }
        student.prototype={
            hello:function(){
                console.log('hello :'+this.name);
            }
        };
        return student;
    })();

    var BBStudent=(function(){
        /* var f=function(){};
         f.prototype=Student.prototype;
         var bbstudent=function(name){
         //this.name=name;
         };
         bbstudent.prototype=new f();
         bbstudent.prototype.constructor=bbstudent();
         return  bbstudent;
         */
        var bbstudent=function(name){
            //this.name=name;
        };
        bbstudent.prototype=new Student();
        bbstudent.prototype.constructor=bbstudent();
        return  bbstudent;
    })();
    var c=new BBStudent('小bb');
    c.hello();
})();

(function(){

    var startTime=(new Date()).getTime();
    function fnTime(fn){
        fn && fn();
        var endTime=(new Date()).getTime();
        console.log('消耗时间:'+endTime-startTime);
    }
    fnTime(function(){
        for(var i=0;i<10000;i++){
            $('#viewid_goodslist [data-index="15"]');
        }
  /*    var page=$('#viewid_goodslist);
        for(var i=0;i<10000;i++){

            page.find('[data-index="15"]');
        }*/
    });

})();