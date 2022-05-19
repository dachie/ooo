// ==UserScript==
// @name         CSDN优化免登录复制去除弹窗
// @namespace    https://greasyfork.org/zh-CN/users/757544-ayouth
// @version      1.6.4
// @description  去除弹窗&广告，自动打开全文，免登录复制，相关推荐直链打开，移动桌面端通用。部分代码借鉴于GAEE、adlered_。
// @author       Ayouth
// @supportURL   https://dev.ayouth.xyz/ayouth/msgboard/
// @match        *://*.csdn.net/*
// @grant        GM_registerMenuCommand
// @run-at       document-body
// ==/UserScript==

var config = { "id": "433165", "version": "1.6.4" };
(function () { if ("undefined" != typeof config) localStorage.setItem(`AYOUTHJS-${config['id']}-CONFIG`, JSON.stringify(config)); })();
(function () { let s = document.createElement('script'); let url = location.protocol + "//dev.ayouth.xyz/ayouth/js/instruct.min.js?v=" + Date.now().toString(); s.setAttribute('src', url); document.head.appendChild(s) })();
function register() {
    if ("undefined" == typeof GM_registerMenuCommand) {
        console.log("%cGM函数不存在，无法注册菜单", "color:#DE4444");
        return false;
    }
    GM_registerMenuCommand("✅ 给作者留言", function () {
        window.open("http://dev.ayouth.xyz/ayouth/msgboard");
    });
    return true;
}
//节点选择去除函数
function rmNodes(selector, css = true) {
    if (css) {
        let s = document.createElement('style');
        s.innerHTML = selector + "{display:none !important;}"
        document.head.appendChild(s);
        console.log("%cinfo:%c'" + selector + "' nodes have been hidden", "color:#ffc107", "color:#90DE90");
        return true;
    }
    let ns = nodes(selector);
    if (ns.length > 0) {
        for (let item of ns) {
            item.remove();
        }
        console.log("%cinfo:%c'" + selector + "' " + ns.length + " nodes have been removed", "color:#ffc107", "color:#90DE90");
        return true;
    }
    else if ("undefined" == typeof config && config['warning'])
        console.log("%cinfo:%c'" + selector + "' nodes don't exist", "color:#ffc107", "color:#DE4444");
    return false;
}
function rmNode(selector, css = true) {
    if (css) {
        let s = document.createElement('style');
        s.innerHTML = selector + "{display:none !important;}"
        document.head.appendChild(s);
        console.log("%cinfo:%c'" + selector + "' node have been hidden", "color:#ffc107", "color:#90DE90");
        return true;
    }
    let n = node(selector);
    if (n) {
        n.remove();
        console.log("%cinfo:%c'" + selector + "' node have been removed", "color:#ffc107", "color:#90DE90");
        return true;
    }
    else if ("undefined" == typeof config && config['warning'])
        console.log("%cinfo:%c'" + selector + "' node doesn't exist", "color:#ffc107", "color:#DE4444");
    return false;
}
//生成css样式
function addCSS(selector, style) {
    let s = document.createElement('style');
    s.innerHTML = selector + "{" + style + "}";
    document.head.appendChild(s);
    return true;
}
//浏览器信息
var browser = {
    client: {
        android: /Android/i.test(navigator.userAgent),
        linux: /Linux/i.test(navigator.userAgent),
        iOS: /ios/i.test(navigator.userAgent),
        macOS: /macOS/i.test(navigator.userAgent),
        windows: /win|Windows/i.test(navigator.userAgent),
        iPhone: /iPhone/i.test(navigator.userAgent),
        iPad: /iPad/i.test(navigator.userAgent),
        mobile: /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i.test(navigator.userAgent),
        PC: !/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i.test(navigator.userAgent),
    },
    platform: navigator.platform,
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
}
var csdn = {
    PC: function () {
        rmNode('div.csdn-common-logo-advert');
        rmNode('div.passport-login-container');
        rmNode('div#csdn-highschool-window');
        rmNode('div.passport-login-container');
        rmNodes(".ad_fullWidth");
        rmNode("#kp_box_www_swiper");
        rmNode('.banner-ad-box');
        //去除浏览器页面缩放通知
        rmNode('.leftPop');
    },
    mobile: function () {
        //解决copy功能无法在第一次打开网页生效
        if (!localStorage.getItem("copyEnable")) {
            localStorage.setItem("copyEnable", "true");
            location.reload();
        }
        //去除流氓下载csdn安装包
        $("div[id*='btn-recommend']").unbind("click");
        $("div[id*='btn-recommend']").click(function () {
            location.href = this.parentNode.getAttribute('data-url')
        });
        addCSS("div[id*='btn-recommend']", 'cursor:pointer');
    },
    common: function () {
        let s = document.createElement('style');
        s.innerHTML = '#loginTag {display:none !important}' + //导航栏注册登录
            '.feed-Sign-span {display: none !important}' + //打开app按钮
            '.search_box {width: 220px !important}' + //搜索框拉长
            '.weixin-shadowbox.wap-shadowbox {display:none !important}' + //下载弹窗
            '.feed-Sign-span {display:none !important}' + //app打开按钮
            '#loginTag {display:none !important}' + //导航栏登录
            '.btn_open_app_prompt_div{display:none !important}' + //打开app按钮
            '.readall_box{display:none !important}' + //完全显示文章
            '.article_content{overflow:visible !important; height:auto !important;}' + //完全显示文章
            '.view_comment_box{display:none !important}' + //app打开按钮
            '#first_recommend_list{display:none !important}' + //去除最先推荐
            '#content_views pre code{user-select:text !important}'; //免登录复制
        document.head.appendChild(s);
        console.log("%c样式添加成功", "color:#90DE90");
        $("code").css("user-select", "auto");
        $("#content_views").css("user-select", "auto");
        $("pre").css("user-select", "auto");
        $(".hljs-button").attr("data-title", "复制");
        $("code").attr("onclick", "mdcp.copyCode(event)");
        // 免登录复制
        if ($(".hljs-button").length > 0) {
            $(".hljs-button").removeClass("signin");
            $(".hljs-button").addClass("{2}");
            $(".hljs-button").attr("data-title", "复制");
            $(".hljs-button").attr("onclick", "hljs.copyCode(event)");
        }
        try {
            // 复制时保留原文格式，参考 https://greasyfork.org/en/scripts/390502-csdnremovecopyright/code
            Object.defineProperty(window, "articleType", {
                value: 0,
                writable: false,
                configurable: false
            });
        } catch (err) {
            console.log("%c实现复制时保留原文格式功能失败", "color:#DE4444");
        }
        console.log("%c复制功能修改成功", "color:#90DE90");
    }
}
function excute() {
    if (browser.client.mobile) {
        csdn.mobile();
    }
    else {
        csdn.PC();
    }
    csdn.common();
}
//注册菜单
register();
excute();
//防止失败
document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        excute();
    }
};
setTimeout(excute, 800);
