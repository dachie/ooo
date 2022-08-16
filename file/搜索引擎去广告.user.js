// ==UserScript==
// @name 搜索引擎去广告
// @author 大萌主
// @description 谷歌百度搜狗神马必应搜索去广告，适配电脑和手机
// @version 7
// @match *://www.google.ca/*
// @match *://www.google.co.jp/*
// @match *://www.google.com.hk/*
// @match *://www.google.com/*
// @match *://m.baidu.com/*
// @match *://www.baidu.com/*
// @match *://m.sm.cn/*
// @match *://yz.m.sm.cn/*
// @match *://wap.sogou.com/*
// @match *://www.sogou.com/*
// @match *://cn.bing.com/*
// @match *://www.bing.com/*
// @run-at document-start
// @namespace https://greasyfork.org/users/452911
// ==/UserScript==

(function(){
function remove(sel) {
  document.querySelectorAll(sel).forEach( a => a.remove());
}
var g_times = 0;
function myfun() {
function removeads() {
remove(".ec_wise_ad");
remove(".se-recommend-word-list-container");
remove("#se-recommend-word-list-container");
remove('[class*="ball-wrapper"]');
remove('[style="position: fixed; bottom: 0px; left: 0px; z-index: 300; width: 100%; height: 52px; background: rgb(255, 255, 255); opacity: 1; border-top: 1px solid rgb(224, 224, 224); display: flex;"]');
remove('[ad_dot_url*="http"]');
remove(".dl-banner-without-logo");
remove(".ad_result");
remove(".ad_sc");
remove('[data-text-ad="1"]');
remove('#content_left > *:not([id]) *');
remove('[class="result c-container new-pmd"][id="1"][tpl="se_com_default"][data-click="{"]');
remove(".biz_sponsor");
remove(".b_algospacing");
remove('div.b_caption > p[class]');
remove('[onmousedown*="ad"][h*="Ads"]');
remove("LI.b_ad.b_adTop");
}
removeads();
window.setTimeout(removeads);
 if(g_times >= 9999) {
   window.clearInterval(timer);
 }
 g_times ++;
}
var timer = setInterval(myfun,150);
myfun();
})();