// ==UserScript==
// @name         小红点
// @namespace    https://itakeo.com
// @version      0.5.4
// @description  快速刷新/新建/关闭标签
// @author       takeo
// @match        *
// @match        *://*/*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        window.open
// @grant        window.close
// @updateURL    https://itakeo.com/relaod/reloas.js
// ==/UserScript==
/*
    小红点脚本，主要是为了解决大屏或者在单手持手机的场景下，对刷新/新建标签/关闭标签/前进/后退/返回顶部/返回底部功能的简化操作。
    单击：刷新；
    双击：新建标签页;
    长按：关闭当前标签（关闭的标签需由红点打开的情况下）

    ver 0.5.4
    1、新增前进/后退/返回顶部/返回底部功能

    ver 0.5.3
    1、修复访问pc端页面时，移动错位的问题。
    2、修改移动方式，由left,top改为transform。

    ver 0.5.2
    1、修复页面旋转时红点位置隐藏。
    2、新增红点移动限制功能，保证红点在屏幕内移动。
    3、修复页面缩放时红点移动出现偏差。
    4、增加红点位置记忆功能，刷新位置不变化。
    5、其他问题修复。

    ver 0.5.1
    1、修复页面有iFrame嵌套时，出现多个红点。
    2、修改双击，长按逻辑，增加容错率。
*/
(function() {
    if(window.top.document.querySelector('.zc_click_reload')) return;
    GM_addStyle(`.zc_click_reload{position: fixed;  z-index: 999999;background: red;opacity:0;visibility:hidden;left:0%;top:0px; box-sizing: border-box;border: 2px solid #fff;box-shadow: 0 0 3px grey; outline: none; cursor: pointer; width: 28px;height:28px;border-radius:50%;-webkit-user-select:none;user-select:none;transition: box-shadow 0.3s ease;-webkit-transition: box-shadow 0.3s ease;}.zc_click_reload:active{ box-shadow: 0px 0px 0px 8px red }.zc_click_reload:after{content: '';display: block;width: 100%;height: 100%;background: none;transform: scale(1.4);-webkit-transform: scale(1.4);}`);
    GM_addStyle(`.zc_click_reload.animation{transition:all .15s ease;-webkit-transition:all .15s ease}.takeo_touch_area{width:106px;height:106px;position:fixed;left:-200px;top:0;z-index:99997;border-radius:50%;box-sizing:border-box;background:#fff;border:2px solid #fff;box-shadow:0 0 3px grey;transform:rotate(-45deg) scale(0.7);-webkit-transform:rotate(-45deg) scale(0.7);opacity:0;visibility:hidden;}.takeo_touch_area span{display:block;z-index:10;-webkit-transition:all.15s ease;transition:all.15s ease;width:50%;height:50%;position:absolute;left:0;top:0}.takeo_touch_area:after{content:'';display:block;width:24px;height:24px;background:#fff;position:absolute;left:50%;top:50%;margin-left:-12px;margin-top:-12px;z-index:14;border-radius:50%}.takeo_touch_area span:nth-child(1){background:#f66;border-radius:120px 0 0 0}.takeo_touch_area span:nth-child(2){background:#53bf53;left:50%;border-radius:0 121px 0 0}.takeo_touch_area span:nth-child(3){background:#6b6bd9;top:50%;border-radius:0 0 0 121px}.takeo_touch_area span:nth-child(4){background:#f5bf5e;left:50%;top:50%;border-radius:0 0 121px 0}.takeo_touch_area div{position:absolute;width:100%;height:100%;left:0;top:0}.takeo_touch_area.show{opacity:1;visibility:inherit;transform:rotate(-45deg) scale(1);-webkit-transform:rotate(-45deg) scale(1); transition:opacity .15s  .2s ease,transform .15s .2s ease,visibility .15s .2s ease;-webkit-transition:opacity .15s  .2s ease,-webkit-transform .15s .2s ease,visibility .15s .2s ease}.takeo_touch_area .takeo_tool1 span:nth-child(2){transform:scale(1.2);-webkit-transform:scale(1.2);background:#1e9c1e;z-index:8;border-radius:19px 50px 19px 0;z-index:11}.takeo_touch_area .takeo_tool2 span:nth-child(3){transform:scale(1.2);-webkit-transform:scale(1.2);background:#3e3ec3;z-index:8;border-radius:19px 0 19px 50px;z-index:11}.takeo_touch_area .takeo_tool3 span:nth-child(1){transform:scale(1.2);-webkit-transform:scale(1.2);background:#ec3d3d;z-index:8;border-radius:50px 19px 0 19px;z-index:11}.takeo_touch_area .takeo_tool4 span:nth-child(4){transform:scale(1.2);-webkit-transform:scale(1.2);background:#ffe31a;z-index:8;border-radius:0 19px 50px 19px;z-index:11}.zc_click_reload:after{content:'';display:block;width:100%;height:100%;background:0;transform:scale(1.4);-webkit-transform:scale(1.4)}.takeo_touch_area.hide{opacity:0;visibility:inherit;transform:rotate(-45deg) scale(1.2);-webkit-transform:rotate(-45deg) scale(1.2); transition:opacity .15s ease,transform .15s ease,visibility .15s ease;-webkit-transition:opacity .15s  ease,-webkit-transform .15s ease,visibility .15s ease}`)
    window.top.document.body.insertAdjacentHTML("afterend", `<div class="zc_click_reload"></div><div class="takeo_touch_area"><div><span></span><span></span><span></span><span></span></div></div>`);
    let reload_dom = document.querySelector('.zc_click_reload');
        reload_dom.takeo_click_temp = 0;
        reload_dom.takeo_click_timer = null;
    let startX = 0,startY = 0,moveX=null,moveY=null,clientW =window.innerWidth, clientH =window.innerHeight;
    let timeCount='',reload_dom_width = 28,maxLeft = clientW - 30 - reload_dom_width ,maxTop = clientH - 20 - reload_dom_width;
    let toolFlag = null,
        takeo_touch_area = document.querySelector('.takeo_touch_area');
    let start_datax = 0,start_datay = 0,show_Tool = false;
    function _get(e){
        return [e.changedTouches[0].pageX,e.changedTouches[0].pageY]
    };
    function getAngle(angx, angy) {
        return Math.atan2(angy, angx) * 180 / Math.PI;
    };

    //根据起点终点返回方向 1向上 2向下 3向左 4向右 0未滑动
    function getDirection(startx, starty, endx, endy) {
        var angx = endx - startx;
        var angy = endy - starty;
        var result = 0;
        if (Math.abs(angx) < 3 && Math.abs(angy) < 3) {
            return result;
        }
        var angle = getAngle(angx, angy);
        if (angle >= -135 && angle <= -45) {
            result = 1;
        } else if (angle > 45 && angle < 135) {
            result = 2;
        } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
            result = 3;
        } else if (angle >= -45 && angle <= 45) {
            result = 4;
        }
        return result;
    };

    //设置默认位置
    function setXY(){
        ;(async () => {
            let getXY = await GM_getValue('x_y');
            if(getXY){
                if(getXY[0] <= maxLeft && getXY[1] <= maxTop){
                    reload_dom.style.transform = reload_dom.style.webkitTransform = 'translate3d('+ getXY[0] +'px,'+ getXY[1]+'px,0)';
                    reload_dom.dataset.x = getXY[0]
                    reload_dom.dataset.y = getXY[1]
                }else resetXY();
            }else{
                resetXY();
            };
            reload_dom.style.opacity='0.65';
            reload_dom.style.visibility='inherit';
        })();
    };
    setXY();
    window.addEventListener('pageshow', ()=>{
        setXY();
    },false);

    //重置位置
    function resetXY(){
        let _x = clientW/2-reload_dom_width/2,_y = clientH - 20 - reload_dom_width;
        reload_dom.style.transform = reload_dom.style.webkitTransform = 'translate3d('+ _x +'px,'+_y+'px,0)';
        reload_dom.dataset.x = _x
        reload_dom.dataset.y = _y
    };

    //屏幕旋转位置归位
    window.addEventListener('orientationchange', ()=>{
        setTimeout(()=>{
            clientW =window.innerWidth;
            clientH =window.innerHeight;
            resetXY();
        },100);
        GM_setValue('x_y',0);
    },false);

    // 手指触摸
    reload_dom.addEventListener('touchstart', function(e) {
        startX = _get(e)[0];
        startY = _get(e)[1]; 
        moveX=null;
        moveY=null;
        //设置tool位置
        toolFlag = 0;
        start_datax = this.dataset.x;
        start_datay = this.dataset.y;
        show_Tool = true
        takeo_touch_area.style.left = (this.dataset.x-53+reload_dom_width/2) +'px'
        takeo_touch_area.style.top = (this.dataset.y-53+reload_dom_width/2) +'px'
        takeo_touch_area.classList.add('show');
        timeCount = Date.now();
        e.preventDefault();
    },false);

    // 手指移动
    reload_dom.addEventListener('touchmove', function(e) {
        moveX = _get(e)[0] - startX + (+this.dataset.x);
        moveY = _get(e)[1] - startY + (+this.dataset.y);
        moveX = moveX<=30 ? 30 : (moveX >= maxLeft ? maxLeft : moveX);
        moveY = moveY<=30 ? 30 : (moveY >=maxTop ? maxTop : moveY);
        this.style.transform = this.style.webkitTransform = 'translate3d('+ moveX +'px,'+moveY+'px,0)';
        //显示tool
        if( (Math.abs(_get(e)[0] - startX)) <= 66 && (Math.abs(_get(e)[1] - startY)) <= 66 && show_Tool){
            //takeo_touch_area.classList.add('show');
            let _getDirection = getDirection(startX,startY, _get(e)[0], _get(e)[1]);
            takeo_touch_area.querySelector('div').className = 'takeo_tool'+_getDirection
            switch (_getDirection) {
                case 1:
                    toolFlag = 1;
                    break;
                case 2:
                    toolFlag = 2;
                    break;
                case 3:
                    toolFlag = 3;
                    break;
                case 4:
                    toolFlag = 4;
                    break;
             };
         }else{
            show_Tool = false;
            toolFlag = 0;
            takeo_touch_area.classList.add('hide');
         };
        e.preventDefault();
    },false);

    // 手指释放
    reload_dom.addEventListener('touchend', function(e) {        
        takeo_touch_area.querySelector('div').className = '';
        takeo_touch_area.classList.remove('show');
        takeo_touch_area.classList.remove('hide');
        if(toolFlag){
            this.classList.add('animation');
            this.style.transform = this.style.webkitTransform = `translate3d(${start_datax}px,${start_datay}px,0)`;
            moveX ? (this.dataset.x = start_datax,this.dataset.y = start_datay,GM_setValue('x_y',[start_datax,start_datay])) : ''
            if(toolFlag == 1) takeo_jump.init('top');
            else if(toolFlag == 2) takeo_jump.init('bottom');
            setTimeout(()=>{
                this.classList.remove('animation');
                if(toolFlag == 3) window.history.go(-1)
                else if(toolFlag == 4) window.history.go(1)
            },150);
            return
        };
        //功能判断
        if(Math.abs(_get(e)[0] - startX ) <= 3 && Math.abs(_get(e)[1] - startY ) <= 3){
            if( Date.now()- timeCount >=500 ){ //长按
                window.close();
                return;
            };
            this.takeo_click_temp++;
            clearTimeout(this.takeo_click_timer);
            this.takeo_click_timer = setTimeout(()=>{
                //单击、双击
                if(this.takeo_click_temp>=2) window.open('https://www.baidu.com','_blank');
                else window.location.reload();
                this.takeo_click_temp = 0;
            },280);
        };
        moveX ? (this.dataset.x = moveX,this.dataset.y = moveY,GM_setValue('x_y',[moveX,moveY])) : ''
        e.preventDefault();
    },false);
})();

;(function(d){
    window.takeo_jump = {
        timer : null,
        init : function(){
            var arg = arguments,t=this,end,cb,set = { mouse : true,speed : 500 };
            var _top = d.documentElement.scrollTop || d.body.scrollTop;
            if(typeof arg[1] == 'object'){
                for(var i in arg[1]){set[i] = arg[1][i]};
                cb = arg[2];
            }else{
                cb = arg[1];
            };
            if(set.mouse){
                this.bind(d,'DOMMouseScroll',fn);
                this.bind(d,'mousewheel',fn);
                this.bind(d,'touchmove',fn);
            };
            function fn(){clearInterval(t.timer);};
            var _btm = d.getElementsByTagName('html')[0].scrollHeight;
            if(typeof arg[0] == 'string'){
                switch(true){
                    case (arg[0] == 'top'):
                        end = 0;
                    break;
                    case (arg[0] == 'bottom'):
                        end = _btm;
                    break;
                    case ( !isNaN(parseInt(arg[0]))):
                        end = parseInt(arg[0]) < 0 ? 0 : parseInt(arg[0]);
                    break;
                    default:
                        end = Math.round(d.querySelector(arg[0]).getBoundingClientRect().top +_top );
                };
            }else{
                if(typeof arg[0] == 'object'){
                    end = Math.round(arg[0].getBoundingClientRect().top + _top );
                }else end =(arg[0]) < 0 ? 0 : arg[0];
            };
            if(_btm <= end) end =_btm ;
            if(_top ==end){cb && cb();return false;}
            var startTime = nowTime();
            clearInterval(this.timer);
            set.speed = set.speed === 0 ? 1 : set.speed;
            this.timer = setInterval(function(){
                var _t = set.speed - Math.max(0,startTime - nowTime() + set.speed);
                var value = Tween["easeOut"](_t,_top, end - _top,set.speed);
                d.documentElement.scrollTop = d.body.scrollTop = value;
                if(_t == set.speed){
                    clearInterval(t.timer);
                    cb && cb();
                };
            },13);
        },
        bind : function(obj,name,fn){
            return obj.addEventListener? obj.addEventListener(name, fn, false):obj.attachEvent('on'+name,fn);
        }
    };
    function nowTime(){return (new Date()).getTime();};
    var Tween = { easeOut: function(t, b, c, d){ return -c *(t/=d)*(t-2) + b;}  }
})(document);