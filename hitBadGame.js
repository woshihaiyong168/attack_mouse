/**
 * Created by Administrator on 2017/7/28.
 */
var imgNum = 1;//游戏开始倒计时变量
var second = 60;//游戏倒计时秒
var personShow1,personShow2;//人物出现的变量
var linkPoint = 0;//连击点变量
var bossShow;//控制boss出现隐藏的定时器变量
var bossShowTime = 5;//boss出现时间
var _room,_troops;//房间和队伍
var index = 100;//进度条变量
var playid;//用户id
var pointNum = 0;//积分变量
var numTop = 0;//控制击打boss飘数字变量
var starTime = 0;//能量条满后控制星星动画的变量
//var starNum = 0;//控制星星动画图片切换的变量

//游戏开始倒计时函数
function onTime() {
    $('.timeMark').show();
    var imgTime = setInterval(function () {
        imgNum++;
        if (imgNum == 4) {
            $('.timeMark').find('img').css('width','4.76rem');
        }
        $('.timeMark').find('img').attr('src','./hitBadGame/'+imgNum+'.png');
        if(imgNum > 4){
            $('.timeMark').hide();
            clearInterval(imgTime);
            overtime();
            personShow1 = setInterval(personShow,700);
        }
    },1000);
}

//游戏时间计时函数
function overtime(){
    var overtime = setInterval(function () {
        second--;
        $('footer').text(second);
        if (second == 40) {
            personShow2 = setInterval(personShow,400);
        }if (second <= 0) {
            clearInterval(overtime);
            window.clearInterval(personShow1);
            window.clearInterval(personShow2);
            ws.send('4,' + _room + ',' + playid + ',' + _troops);
            $('.bad').hide();
            $('.bad img').hide();
            $('.bad div').hide();
            $('.boss-box').hide();
        }
    },1000)
}


/*地鼠随机出现和隐藏*/
function personShow() {
    var imgArr = [6,5,6,7,6,5,7,6,6];
    var images = parseInt(Math.random()*9);
    var imageData = parseInt(Math.random()*3+5);
    var that = $('.bad div').eq(images).find('img').attr('src',"./hitBadGame/" + imgArr[imageData] + ".png");
    that.show();
    if (imgArr[imageData] == 5) {
        that.prev().text('-100');
    }if(imgArr[imageData] == 6){
        that.prev().text('+100');
    }if (imgArr[imageData] == 7) {
        that.prev().text('+200');
    }
    setTimeout(function () {
        that.hide();
    },1000);
}


//固定位置地鼠出现隐藏方案
/*function personShow() {
     var images = parseInt(Math.random()*9);
     $('.bad div').eq(images).find('img').show();
     var that = $('.bad div').eq(images).find('img');
     setTimeout(function () {
     that.hide();
     },1000)
 }*/


//随机出现地鼠替换方案
/*function personShow() {
    var images = parseInt(Math.random()*9);
    var imageData = parseInt(Math.random()*9);
    console.log(images + '---' + imageData);
    var that = $('.bad').find('div').eq(imageData).insertBefore($('.bad').find('div').eq(images));
    that.find('img').show();
    if (that.data('num') == 0) {
        that.prev().text('-200');
    }if(that.data('num') == 1){
        that.prev().text('+100');
    }if (that.data('num') == 2) {
        that.prev().text('+200');
    }
    setTimeout(function () {
        that.find('img').hide();
    },2000);
}*/


//点boss后飘分数
function clickNumUp() {
    numTop++;
    $("<i>+300</i>").appendTo($('.boss-box'));
    setTimeout(function () {
        $('.boss-box i').eq(numTop-2).hide();
    },300);
}

//匹配同步
// var ws = new WebSocket("ws://47.94.0.90:2555");
var ws = new WebSocket("ws://47.94.0.90:2555");
//监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
/*window.onblur = function () {
    ws.close();
}*/
window.onbeforeunload = function () {
    //alert('链接已断开');
    ws.close();
}
/*window.showOnFocus = function () {
    //alert('链接已断开');
    ws.close();
}*/
window.addEventListener('popstate',function (e) {
    //alert('监听到浏览器返回');
    ws.close();
},false);

ws.onopen = function(){
    console.log("握手成功");
    //点击取消关闭连接
    $('.closeMatch img').bind('touchstart',function () {
        ws.close();
        history.go(-1);
    });
    //点击退出游戏后关闭连接并退出
    $('.over-btn img:first-child').bind('touchstart',function () {
        ws.close();
        history.go(-1);
    });
};
ws.onmessage = function(e){
    //console.log(e.data);
    //从url截取用户id
    var str = window.location.href;
    //var str = 'asdasdsadasdasd?uid=200081';
    playid = str.substring(str.indexOf('?uid=')+5);
    var data = JSON.parse(e.data);
    var _type = data.code;
    var _data = data.data;
    //console.log(_data)
    if(_type == 1){
        _room = _data.room;
        _troops = _data.troops;
        ws.send('2,' + _data.room + ',' + playid + ',' + _data.troops);
        $('.gameMark').hide();
        onTime();
        /*点击人物锤子砸下去*/
        $('.bad img').bind('touchstart',function () {
            if ($(this).attr('src') == "./hitBadGame/6.png") {
                $(this).prev().show();
                var that = this;
                setTimeout(function () {
                    $(that).prev().hide();
                },300);
                pointNum = pointNum + 100;
                linkPoint++;
                $('.linkPoint').find('span').text(linkPoint);
                index -= 5;
                $('.in-plan').animate({
                    left:"-" + index +　'%'
                },100);
            }if ($(this).attr('src') == "./hitBadGame/7.png") {
                $(this).prev().show();
                var that = this;
                setTimeout(function () {
                    $(that).prev().hide();
                },300);
                pointNum = pointNum + 200;
                linkPoint++;
                $('.linkPoint').find('span').text(linkPoint);
                index -= 5;
                $('.in-plan').animate({
                    left:"-" + index +　'%'
                },100);
            }
            if ($(this).attr('src') == "./hitBadGame/5.png") {
                $(this).prev().show();
                var that = this;
                setTimeout(function () {
                    $(that).prev().hide();
                },300)
                linkPoint = 0;
                $('.linkPoint').find('span').text(linkPoint);
                if (pointNum != 0){
                    pointNum = pointNum - 100;
                    index = 100;
                    $('.linkPoint').find('span').text(linkPoint);
                    $('.in-plan').animate({
                        left:"-" + index +　'%'
                    },100);
                }if(pointNum <= 0){
                    pointNum = 0;
                }
            }if (linkPoint == 20) {  //连击点达到20后，boss出现
                $('.starBlink').css({
                    'width':'.56rem',
                    'height':'1rem'
                });
                $('.starBlink').attr('src',"./hitBadGame/stargf.gif");
                /*starTime = setInterval(function () {
                    starNum++;
                    $('.starBlink').attr('src',"./hitBadGame/10" + starNum + ".png");
                    if (starNum == 14) {
                        starNum = 1;
                    }
                },100);*/
                $('.bad').hide();
                $('.boss-box').show();
                bossShow = setInterval(function () {
                    bossShowTime--;
                    if (bossShowTime == 0) {   //5秒后boss消失
                        window.clearInterval(starTime);
                        $('.starBlink').attr('src',"./hitBadGame/star.png");
                        $('.starBlink').css({
                            'width':'.56rem',
                            'height':'.54rem'
                        });
                        $('i').remove();
                        $('.boss-box').hide();
                        $('.bad').show();
                        linkPoint = 0;
                        $('.linkPoint').show();
                        $('.linkPoint').find('span').text(linkPoint);
                        index = 100;
                        $('.in-plan').animate({
                            left:"-" + index +　'%'
                        },100);
                        window.clearInterval(bossShow);
                        bossShowTime = 5;
                    }
                },1000)
                $('.boss').bind('touchstart',function () {
                    $(this).attr('src',"./hitBadGame/333.png");
                    setTimeout(function () {
                        $('.boss').attr('src',"./hitBadGame/boss.png");
                    },100);
                    clickNumUp();
                    linkPoint++;
                    $('.linkPoint').find('span').text(linkPoint);
                    pointNum += 300;
                    $('.boss-hit').show();
                    setTimeout(function () {
                        $('.boss-hit').hide();
                    },500);
                    ws.send('3,' + _data.room + ',' + pointNum + ',' + _data.troops);
                });
            }
            $('.hitDuang').show();
            var _thisTop = $(this).offset().top - 30;
            var _thisLeft = $(this).offset().left;
            $('.hitDuang').offset({top:_thisTop,left:_thisLeft});
            setTimeout(function () {
                $('.hitDuang').hide();
            },1000)
            var that = this;
            setTimeout(function () {
                $(that).toggle();
                $('.hitDuang').hide();
            },200);
            ws.send('3,' + _data.room + ',' + pointNum + ',' + _data.troops);
        });
    }
    if(_type == 2){
        if(_data.troops == 0){
            $('.over-player1 .playUid').text(_data.uid);
            $('.over-player1').find('img').attr('src','http://doudoujiaoyou.oss-cn-beijing.aliyuncs.com/PlayerIcon/' + _data.pic + '.png');
            $('.player-red .playerName').text(_data.name);
            $('.player-red').find('img').attr('src','http://doudoujiaoyou.oss-cn-beijing.aliyuncs.com/PlayerIcon/' + _data.pic + '.png');
            if (_data.sex == 0) {
                $('.player-red .playerName').css('color','#00c1f0');
            }else{
                $('.player-red .playerName').css('color','#f038a4');
            }
        }else{
            $('.over-player2 .playUid').text(_data.uid);
            $('.over-player2').find('img').attr('src','http://doudoujiaoyou.oss-cn-beijing.aliyuncs.com/PlayerIcon/' + _data.pic + '.png');
            $('.player-blue .playerName').text(_data.name);
            $('.player-blue').find('img').attr('src','http://doudoujiaoyou.oss-cn-beijing.aliyuncs.com/PlayerIcon/' + _data.pic + '.png');
            if (_data.sex == 0) {
                $('.player-blue .playerName').css('color','#00c1f0');
            }else{
                $('.player-blue .playerName').css('color','#f038a4');
            }
        }
    }
    if (_type == 3) {
        if (_data.troops == 0) {
            $('.player-red .playerNum span').text(_data.grade);
            $('.over-player1 p span').text(_data.grade);
        }else{
            $('.player-blue .playerNum span').text(_data.grade);
            $('.over-player2 p span').text(_data.grade);
        }
    }
    if (_type == 4) {
        if (_data.troops == _troops) {
            $('.game-winAndfall').show();
            $('.game-winAndfall .winOrfall').attr('src','./hitBadGame/win.png');
        }else{
            $('.game-winAndfall').show();
            $('.over-award span span').text('x1');
            $('.game-winAndfall .winOrfall').attr('src','./hitBadGame/fall.png');
        }
        ws.close();
    }
};
ws.onclose = function() {
    // 关闭 websocket
    //ws.close();
    console.log("连接已关闭...");
    //alert('连接已关闭...');
};


//点击用户头像跳转到对应用户id的个人信息页
/*$('.blinkBtn').on('touchstart',function (){
 var num = $(this).parent().find('h6').text();
 console.log(num);
 var ua = navigator.userAgent.toLowerCase();
 if (/iphone|ipad|ipod/.test(ua)){
 //调用ios方法传入id值
 getIosPersonDetails(num);
 }else{
 //调用安卓方法传入id值
 getAndroidPersonDetails(num);
 }
 });*/
/*
//调用ios的方法
function getIosPersonDetails (type) {
    window.webkit.messageHandlers.getIosPersonDetails.postMessage(type);
}
//调用Android方法
function getAndroidPersonDetails (type) {
    window.moshi.getAndroidPersonDetails(type);
}*/
