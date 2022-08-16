// ==UserScript==
// @name         安乐视
// @author       Jones Miller
// @version      999.2.19.2
// @namespace    https://t.me/jsday
// @description  /=====// 在支持的手机浏览器 长按 全选 复制 新建脚本 - 匹配、域名 填入 * //=====/.安乐视. 无广告、免登录. 解析VIP视频、超前点播. 多接口自由选择,部分接口支持高清播放. 不保证能解析所有视频. 手机扫码播放、抖音去水印. 非专业人士 所有数据收集于互联网 - 感谢原作者 如有侵权 联系删除. 此脚本为本地版，远程引用安乐视库 一次安装 永久最新.
// @icon         https://greasyfork.s3.us-east-2.amazonaws.com/0k4g3nu602105gzad2uqs8ky0i9r
// @include      *://v.qq.com/x/cover/*
// @include      *://m.v.qq.com/*
// @include      *://*.iqiyi.com/v_*
// @include      *://v.youku.com/v_show/*
// @include      *://m.youku.com/alipay_video/*
// @include      *://m.youku.com/video/id*
// @include      *://www.le.com/ptv/vplay/*
// @include      *://m.le.com/vplay_*
// @include      *://www.bilibili.com/bangumi/play/*
// @include      *://m.bilibili.com/bangumi/play*
// @include      *://www.mgtv.com/b/*
// @include      *://m.mgtv.com/b*
// @include      *://*.pptv.com/show/*
// @include      *://tv.sohu.com/v*
// @include      *://m.tv.sohu.com/v*
// @include      *://www.douyin.com/video/*
// @include      *://www.iesdouyin.com/share/video/*
// @include      *://www.douyin.com/share/video/*
// @include      *://*.youtube.com/*
// @grant        unsafeWindow
// @license MIT
// ==/UserScript==

(function() {
    'use strict';
  
  function jmanuser() {
    
    /* user接口 开关: true开启  false关闭 */
    var userswitch = true;
    
    /* user 接口 使用英文的,符号隔开 */
    var userapis=[
      {name:"m1907",url: "https://z1.m1907.cn/?jx="},
      //{name:"填入名称",url: "填入接口url"},
      //{name:"填入名称",url: "填入接口url"},
      //{name:"填入名称",url: "填入接口url"},
      //{name:"填入名称",url: "填入接口url"},
      //{name:"填入名称",url: "填入接口url"},
    ];/* ^_^ */
    
    /* user 项 */
    /*背景颜色*/ var UserColor = "none";
    /*背景图片*/ var UserImage = "https://img.alicdn.com/imgextra/i2/O1CN01WpOLdY1DG97PbESGP_!!6000000000188-2-tps-80-80.png";
    /*图片宽高*/ var UserSize = "30px 30px";
    
    /* user接口 触摸 悬浮 */
    /*背景颜色*/ var apisColor = "#666";
    /*字体颜色*/ var apisTextColor = "yellow";
    
    /* ***** 自定义结束 ***** */
    /* 新的简介 见安乐视页面 最底部 */
    
    function GetHttpRequest () { window.XMLHttpRequest;return new XMLHttpRequest();};
    function ajaxPage (sId, url) { var oXmlHttp = GetHttpRequest (); oXmlHttp.onreadystatechange = function() { if (oXmlHttp.readyState == 4) { includeJS(sId,url,oXmlHttp.responseText ); } }; oXmlHttp.open('GET',url,false); oXmlHttp.send(null); };
    function includeJS (sId,fileUrl,source) { if ((source != null) && (!document.getElementById (sId))) { var oHead = document.getElementsByTagName('HEAD').item(0); var oScript = document.createElement("script"); oScript.type = "text/javascript"; oScript.id = sId; oScript.text = source; oHead.appendChild(oScript); } }; ajaxPage("scrA","https://greasyfork.org/scripts/430383-anlslibrary/code/Anlslibrary.js");
    function jwmew98yg1bqeaurb$15nwu4609123rg () { jmupdate.style.display='none';jmup1.style.display=jmup2.style.display='none';jmupneg.style.display=jmuplog.style.display='block';jmupalk.style.display=jmupall.style.display='none';}; function jwmew98yg1bqeaurb$15nwujkyf7976 () { jmupneg.style.display=jmodlog.style.display='block';};
    if (location.href.match('douyin.com|iesdouyin.com|youtube.com')) { var userswitch = false;};
    function userSelect() {
      function jmonuserbd() {
        jmanlsapis.ontouchstart=jmanlsapis.onmouseover=function () {
          this.style="background:"+apisColor+";color:"+apisTextColor+" !important;";
        }; 
        jmanlsapis.ontouchend=jmanlsapis.onmouseout=function () { 
          this.style="";
        };
      }; 
      function jmuserParsing() {
        (function (jm) { 
          jmonuserbd(); 
        })(i); 
      }; 
      function jmuserParsing2() { 
        (function (jm) { 
          jmanlsapis.onclick = function () {
            window.open(userapis[jm].url + location.href, '_blank'); 
          }; 
          jmonuserbd(); 
        })(i); 
      }; 
      for (var i=0; i < userapis.length; i++) { 
        var jmanlsapis=document.createElement("div"); 
        jmanlsapis.id="jmanlsapis";
        jmuserParsing();
        jmanlsapis.innerHTML="<span class='spanStyle' style='"+jmanlsapis+"' url='"+userapis[i].url+"'>"+userapis[i].name+"</span>";
        jmforuser.appendChild(jmanlsapis);
      };
      for (var i=0; i < userapis.length; i++) { 
        var jmanlsapis=document.createElement("div");
        jmanlsapis.id="jmanlsapis";
        jmuserParsing2();
        jmanlsapis.innerHTML=userapis[i].name;
        jmforusers.appendChild(jmanlsapis);
      }; 
      jmuser.style="display:block;background-color:"+UserColor+";background-image:url("+UserImage+");background-size:"+UserSize+";";
    };
    var jmvers='2.19';
    if (userswitch) {
      userSelect();
    };
    jmver_bd.innerHTML=jmver_bd2.innerHTML=jmvers;
    if (jmver_bdnew.innerHTML==jmvers) { jwmew98yg1bqeaurb$15nwu4609123rg ();} else { jwmew98yg1bqeaurb$15nwujkyf7976 ();};
  }; 
  if (location.href.match('v.qq.com|iqiyi.com|youku.com|www.le.com|m.le.com|bilibili.com|mgtv.com|pptv.com|tv.sohu.com|douyin.com|iesdouyin.com|youtube.com')) { 
    jmanuser();
  };
})();