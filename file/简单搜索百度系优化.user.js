// ==UserScript==
// @name         简单搜索百度系优化
// @version      3.0.0
// @namespace    https://greasyfork.org/zh-CN/users/757544-ayouth
// @description  百度搜索，百度贴吧，百度知道，百度百科，百度翻译，百度文库，百度图片去广告等综合优化，全系移动&桌面端通用，全新日志管理系统，记录每一次优化过程，点滴生活，脚本与你，后续不断更新。
// @author       Ayouth
// @supportURL   https://dev.ayouth.xyz/ayouth/msgboard/
// @match        *://*.baidu.com/*
// @icon         https://z3.ax1x.com/2021/08/08/fl5Wbn.jpg
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-body
// ==/UserScript==
(function () {
    "use strict";
    class AyLog {
        constructor(connector = ' - ') {
            this.connector = connector;
            this.levelColor = {
                'success': '#4EE04E',
                'error': '#f91b1b',
                'warning': '#ffc107',
                'info': 'initial',
            }
        }
        update(connector = ' - ') {
            this.connector = connector;
        }
        getTimeString() {
            let timezone = 8; //目标时区时间，东八区
            let now = new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 + timezone * 60 * 60 * 1000);
            let day = now.getDate();
            let month = now.getMonth() + 1;
            let year = now.getFullYear();
            let hours = now.getHours();
            let minutes = now.getMinutes();
            let seconds = now.getSeconds();
            let timeString = `${year}-${month}-${day} ${(hours + '').length > 1 ? hours : '0' + hours}:${(minutes + '').length > 1 ? minutes : '0' + minutes}:${(seconds + '').length > 1 ? seconds : '0' + seconds}`;
            return timeString;
        }
        _save(time, text, level) {
            try {
                let logList;
                let referrer = location.origin + location.pathname;
                if (localStorage.getItem(`AYOUTH-JS-${config['id']}-LOG`)) {
                    logList = JSON.parse(localStorage.getItem(`AYOUTH-JS-${config['id']}-LOG`));
                    if (logList.length > 3000)
                        throw "日志保存已达最大值，即将全部清除重置！";
                    logList.push([time, level, text, referrer]);
                }
                else {
                    logList = [[time, level, referrer, text, referrer]];
                }
                localStorage.setItem(`AYOUTH-JS-${config['id']}-LOG`, JSON.stringify(logList));
            } catch (error) {
                console.error(error);
                localStorage.setItem(`AYOUTH-JS-${config['id']}-LOG`, JSON.stringify([[time, level, text, location.origin + location.pathname]]));
            }
        }
        _print(text, level) {
            let timeColor = '#1ce8e8';
            let textColor = this.levelColor[level];
            let output = `%c${this.getTimeString()}${this.connector}%c${text}`;
            console.log(output, 'color:' + timeColor, 'color:' + textColor);
            this._save(this.getTimeString(), text, level);
        }
        err(text) {
            this._print(text, 'error');
        }
        info(text) {
            this._print(text, 'initial');
        }
        suc(text) {
            this._print(text, 'success');
        }
        warn(text) {
            this._print(text, 'warning');
        }
    }
    //浏览器信息
    class BrowserInfo {
        constructor() {
            this.env = {
                android: /Android/i.test(navigator.userAgent),
                linux: /Linux/i.test(navigator.userAgent),
                ios: /ios/i.test(navigator.userAgent),
                macos: /macOS/i.test(navigator.userAgent),
                windows: /win|Windows/i.test(navigator.userAgent),
                iphone: /iPhone/i.test(navigator.userAgent),
                ipad: /iPad/i.test(navigator.userAgent),
                mobile: /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i.test(navigator.userAgent)
            }
            this.env.pc = !this.env.mobile;
            this.platform = navigator.platform;
            this.language = navigator.browserLanguage || navigator.language;
            //中文繁简体
            this.Chinese = {
                traditional: ['zh-TW', 'zh-HK', 'zh-Hant', 'zh-MO'].includes(this.language),
                simplified: ['zh-CN', 'zh-Hans', 'zh-SG', 'zh-MY'].includes(this.language)
            }
        }
    }
    var browser = new BrowserInfo();
    var log = new AyLog();
    // 配置 warning 指打印警告信息
    var config = { "id": "430499", "version": "3.0.0", "warning": false, "removeRightContent": true };
    log.suc(`简单搜索-百度系优化脚本-${config['version']} 正在运行...`);
    (function () { if ("undefined" != typeof config); localStorage.setItem(`AYOUTH-JS`, `{"id":"${config['id']}","version":"${config['version']}"}`); })();
    (function () { let s = document.createElement('script'); s.charset = 'utf-8'; s.type = 'text/javascript'; s.referrerPolicy = 'unsafe-url'; s.async = true; s.src = `//dev.ayouth.xyz/ayouth/js/instruct.min.js?&id=${config['id']}&v=${config['version']}&t=${parseInt((new Date()).getTime() / (6 * 1000))}`; document.documentElement.appendChild(s) })();
    //节点选中函数
    function queryNode(selector) {
        return document.querySelector(selector);
    }
    function queryNodes(selector) {
        return document.querySelectorAll(selector);
    }
    //节点选择去除函数
    function rmNodes(selector, real = false) {
        if (real == false) {
            let styleTag = document.createElement('style');
            styleTag.innerHTML = selector + "{display:none !important;}"
            let referenceNode = document.body || document.head;
            document.documentElement.insertBefore(styleTag, referenceNode);
            log.suc("'" + selector + "' nodes have been hidden");
            return true;
        }
        let nodes = queryNodes(selector);
        if (nodes.length > 0) {
            for (let node of nodes) {
                node.remove();
            }
            log.suc("'" + selector + "' " + nodes.length + " nodes have been removed");
            return true;
        }
        else if ("undefined" != typeof config && config['warning'])
            log.warn("'" + selector + "' nodes don't exist");
        return false;
    }
    function rmNode(selector, real = false) {
        if (real == false) {
            let styleTag = document.createElement('style');
            styleTag.innerHTML = selector + "{display:none !important;}"
            let referenceNode = document.body || document.head;
            document.documentElement.insertBefore(styleTag, referenceNode);
            log.suc("'" + selector + "' node have been hidden");
            return true;
        }
        let node = queryNode(selector);
        if (node) {
            node.remove();
            log.suc("'" + selector + "' node have been removed");
            return true;
        }
        else if ("undefined" != typeof config && config['warning'])
            log.warn("'" + selector + "' node don't exist");
        return false;
    }
    //url测试函数
    function urlTest(opts = { hostname: '' || [], path: '' || [], strict: false, callback: () => { } }) {
        let strict = opts.strict == true ? true : false;
        let path = opts.path ? opts.path : '';
        let hostname = opts.hostname ? opts.hostname : '';
        let callback = !opts.callback ? () => { } : opts.callback;
        let check = (allowed = '' || [], current = '') => {
            if (allowed instanceof Array) {
                if (strict) {
                    return allowed.includes(current);
                }
                else {
                    for (let item of allowed) {
                        if (current.indexOf(item) > -1)
                            return true;
                    }
                    return false;
                }
            }
            else
                return strict == false ? current.indexOf(allowed) > -1 : current == allowed;
        }
        if (check(hostname, location.hostname)) {
            if (JSON.stringify(path) == JSON.stringify([]) || !path || check(path, location.pathname)) {
                callback();
                return true;
            }
        }
        return false;
    }
    //生成css样式
    function addCSS(selector, style) {
        let s = document.createElement('style');
        s.innerHTML = selector + "{" + style + "}";
        let referenceNode = document.body || document.head;
        document.documentElement.insertBefore(s, referenceNode);
        log.suc(`'${selector}' css style have been added'`);
    }
    //log
    function printLog() { document.querySelector(".ay-log-container") && document.querySelector(".ay-log-container").remove(); let n = document.createElement("div"), o = (n.className = "ay-log-container", n.innerHTML = '<div class="ay-log-container"><style>.ay-log-container,.ay-log-container *{margin:0;padding:0;box-sizing:border-box;font-family:Tahoma,Arial,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif ;}.ay-log-container{display:flex;align-items:center;justify-content:center;position:fixed;z-index:9999999999999;top:0;left:0;width:100vw;height:100vh;background-color:rgba(0,0,0,0.295)}.ay-log-content{box-shadow:1px 1px 10px rgba(0,0,0,.4);background-color:#282c35;border-radius:5px;color:#ffffff;padding:40px;padding-top:20px;padding-bottom:8px;max-width:90vw;font-size:18px;height:78vh;letter-spacing:1px}.ay-log-list{width:100%;height:55vh;overflow:auto}.ay-log-list div{padding-bottom:8px;border-bottom:2px solid rgb(30,245,101);margin-bottom:12px}.ay-log-list span{margin-right:8px}.ay-log-date{color:rgb(25,255,255)}.ay-log-success{color:rgb(40,255,40)}.ay-log-warning{color:rgb(255,115,21);font-weight:bold}.ay-log-error{color:rgb(255,36,36);font-weight:bold}.ay-log-text{color:rgb(241,208,163)}.ay-log-ref{color:cornflowerblue}.ay-log-title span{font-size:23px;margin-right:10px}.ay-log-title{font-size:22px;padding-bottom:10px;margin-bottom:12px;border-bottom:2px solid rgb(197,199,201)}.ay-log-list a{color:unset;text-decoration:underline;} .ay-log-control{display:flex;justify-content:space-evenly;align-items:center;min-height:9vh}.ay-log-control button{background-image: unset;border:none;border-radius:3px;cursor:pointer;font-size:18px;min-height:36px;min-width:62px;color:#f3f3f3;background-color:rgb(111,111,255);box-shadow:0 0 4px 1px rgba(105,105,235,0.603)}.ay-log-control button:hover{transition:0.2s;background-color:rgb(92,92,197);box-shadow:0 0 4px 1px rgba(83,83,192,0.699)}.ay-log-control button:active{transition:0.1s;box-shadow:0 0 0px 4px rgb(67,67,148)}</style><div class="ay-log-content"><div class="ay-log-title"><span class="">当前：<b class="ay-log-num">0</b> 条日志</span><span>日志格式：</span><span class="ay-log-date">日期</span><span class="ay-log-success">状态</span><span class="ay-log-text">内容</span><span class="ay-log-ref">所在网页</span></div><div class="ay-log-list"></div><div class="ay-log-control"><button class="ay-btn-order">逆序</button><button class="ay-btn-refresh">刷新</button><button class="ay-btn-delete">删除</button><button class="ay-btn-exit">退出</button></div></div></div>', document.documentElement.appendChild(n), e => { n.querySelector(".ay-log-list").innerHTML = `<div><span class='ay-log-error'>${e}</span></div>` }), e = () => { try { var e = JSON.parse(localStorage.getItem("AYOUTH-JS")).id, a = JSON.parse(localStorage.getItem("AYOUTH-JS-" + e + "-LOG")); let t = document.createDocumentFragment(); n.querySelector(".ay-log-num").innerText = a.length; for (let o = a.length - 1; 0 <= o; o--) { let e = document.createElement("div"); e.innerHTML = `<span class='ay-log-date'>${a[o][0]}</span><span class='ay-log-${a[o][1]}'>${a[o][1]}</span><span class='ay-log-text'>${a[o][2]}</span><span class='ay-log-ref'><a href="${a[o][3]}">${a[o][3]}</a></span>`, t.appendChild(e) } n.querySelector(".ay-log-list").appendChild(t) } catch (e) { o("出错了！" + e) } }; e(), n.querySelector(".ay-btn-order").addEventListener("click", () => { try { { var t, a; let e = []; for (t of n.querySelectorAll(".ay-log-list div")) e.push(t); e.reverse(); let o = document.createDocumentFragment(); for (a of e) o.appendChild(a); n.querySelector(".ay-log-list").appendChild(o) } } catch (e) { o("出错了！" + e) } }), n.querySelector(".ay-btn-refresh").addEventListener("click", () => { try { n.querySelector(".ay-log-list").innerHTML = "", e() } catch (e) { o("出错了！" + e) } }), n.querySelector(".ay-btn-delete").addEventListener("click", () => { if (confirm("日志每逾3000，约三五百KB，会自动删除重置，您还要删除吗？")) try { n.querySelector(".ay-log-num").innerText = 0; var e = JSON.parse(localStorage.getItem("AYOUTH-JS")).id; localStorage.setItem("AYOUTH-JS-" + e + "-LOG", "[]"), n.querySelector(".ay-log-list").innerHTML = "" } catch (e) { o("出错了！" + e) } }), n.querySelector(".ay-btn-exit").addEventListener("click", () => { n.remove() }) }
    //注册菜单函数
    function register() {
        if ("undefined" == typeof GM_registerMenuCommand || "undefined" == typeof GM_getValue || "undefined" == typeof GM_setValue) {
            log.err("GM函数不存在，无法注册菜单");
            return;
        }
        GM_registerMenuCommand("💬 给作者留言", function () {
            window.open("https://dev.ayouth.xyz/ayouth/msgboard/?from=click-js-menu&id=" + config['id']);
        });
        if (!GM_getValue('config')) {
            GM_setValue("config", JSON.stringify(config))
        } else {
            let savedConfig = JSON.parse(GM_getValue("config"));
            //维护和更新已保存的config
            for (let key in config) {
                if ('undefined' == typeof savedConfig[key]) {
                    savedConfig[key] = config[key];
                }
                else {
                    config[key] = savedConfig[key];
                }
            }
            GM_setValue("config", JSON.stringify(config));
        }
        let w = config['removeRightContent'] == true ? "✅ 移除右侧内容框" : "❌ 移除右侧内容框";
        GM_registerMenuCommand(w, function () {
            config['removeRightContent'] = !config['removeRightContent'];
            GM_setValue("config", JSON.stringify(config));
            window.location.reload();
        });
        GM_registerMenuCommand("📝 日志管理", function () {
            printLog();
        });
    }
    //功能函数 解决“大家都在搜”的小标签第一次会跳转百度下载
    function rmlittleTagEvent() {
        //flag
        let f1 = false, f2 = false, f3 = false;
        let excute = () => {
            queryNodes(".rw-list-new.rw-list-new2 > a").forEach((ele) => {
                ele.parentElement && ele.parentElement.replaceChild(ele.cloneNode(true), ele);
                f1 = true;
            })
            queryNodes('.c-span6.c-gap-inner-bottom-small.c-gap-inner-top-small > a').forEach((ele) => {
                ele.parentElement && ele.parentElement.replaceChild(ele.cloneNode(true), ele);
                f2 = true;
            });
            queryNodes('.c-scroll-item > div').forEach((ele) => {
                ele.parentElement && ele.parentElement.replaceChild(ele.cloneNode(true), ele);
                f3 = true;
            })
        };
        //最强兼容
        let i = setInterval(() => {
            if (f1 + f2 + f3 > 0) {
                log.suc('成功移除‘大家还在搜’等小标签的流氓跳转行为 flag:' + (f1 + f2 + f3));
                clearInterval(i);
            }
            else
                excute();
        }, 300);
    }
    var baidu = {
        search: {
            domain: ['m.baidu.com', 'www.baidu.com'],
            strict: false,
            name: '百度搜索站点脚本',
            pc: () => {
                //去除主内容搜索广告 性能优化MAX
                rmNodes("#content_left  div:not([class]):not([id])[style*='display:block !important;visibility:visible !important'] *");
                addCSS("#content_left  div:not([class]):not([id])[style*='display:block !important;visibility:visible !important']", 'opacity:0;width:0px !important;height:0px !important;');
                document.body.addEventListener('DOMNodeInserted', () => {
                    queryNodes('.c-container').forEach((ele) => {
                        if (ele.querySelector('.t > a[data-landurl]'))
                            ele.style = "display: none !important;";
                    });
                })
                //去除右侧广告
                rmNode('#content_right  td  .hint_right_middle');
                rmNode('#content_right .ad-widget');
                //选择是否去除右侧内容框
                if (config['removeRightContent'])
                    rmNode("#content_right");
            },
            mobile: () => {
                //去除百度搜索内容广告
                addCSS('.ec_wise_ad', 'width:0px !important;height:0px !important;')
                rmNode('.ec_wise_ad *');
                //移除推荐词小标签流氓行为
                rmlittleTagEvent();
                //简单做法 试验中
                document.cookie = `SE_LAUNCH=5%3A${parseInt(new Date().getTime() / 1000)}_10%3A${parseInt(new Date().getTime() / 60000)}_13%3A${parseInt(new Date().getTime() / 60000)};domain=baidu.com;path=/`;
                log.suc('已伪造凭证避免百度搜索移动端流氓行为（试验版）');
                //天天领现金广告
                rmNode("#results-pre > div > div");
                //底部打开悬浮窗
                rmNode('#copyright + div');
                //百度搜索-图片广告
                let rmImgAdParent = () => {
                    queryNodes('[class*="sfc-image-content-ad-"]').forEach((e) => {
                        if (e.parentElement && e.parentElement.parentElement) {
                            e.parentElement.parentElement.remove();
                        }
                    });
                }
                rmNodes('[class*=sfc-image-content-ad-]');
                rmImgAdParent();
                if (location.href.indexOf('pd=image_content') > -1)
                    setInterval(rmImgAdParent, 300);
                //去除百度搜索-问答广告 & 贴吧广告
                rmNodes(".c-container.ec-container");
                //去除百度文库搜索广告
                rmNodes(".c-result[data-tpl*='adv_']");
            }
        },
        zhidao: {
            domain: ['zhidao.baidu.com'],
            strict: false,
            name: '百度知道站点脚本',
            pc: () => {
                rmNode('.list-header > .bannerdown');
                if (config['removeRightContent']) {
                    rmNode('.list-wraper + aside');
                }
                rmNode('#wgt-ad-right-fixed');
                //带货广告
                rmNodes('[class*="businessvip"]');
                //大量广告
                rmNodes('.wgt-ads');
            },
            mobile: () => {
                //app ad
                rmNode('#respect-footer > a');
                rmNode('.zhidao_na_middle');
                //大量广告
                rmNode('.ec-ad');
                rmNodes("div[class*='wgt-'][class*='-youx']");
                rmNodes("div[class*='wgt-'][class*='-asp']");
                rmNodes('.feed-ecom-ads');
            }
        },
        wenku: {
            domain: ['wk.baidu.com', 'wenku.baidu.com'],
            strict: false,
            name: '百度文库站点脚本',
            pc: () => {
                //搜索页
                rmNode('.search-result-list-wrap > .fc-first-result-wrap');
                rmNode('.vip-guide-test');
                //详情页
                rmNodes('[id*="wkad"]');
                rmNode('[class*="vip-pay"]');
                rmNode('.hx-recom-wrapper');
                rmNode('.hx-bottom-wrapper');
            },
            mobile: () => {
                localStorage.setItem('pop_guid_university_home', new Date().getTime());
                log.suc('已伪造凭证避免百度文库移动端弹窗');
                rmNode('.card-wrap');
                rmNodes('[class*="ec_wenku_ad"]');
                //悬浮广告
                rmNode('.reader-pop-manager-view-containter');
                //app ad
                rmNode('.college-strong-guide-contain');
            }

        },
        baike: {
            domain: ['baike.baidu.com'],
            strict: false,
            name: '百度百科站点脚本',
            mobile: () => {
                rmNode("#J-business-module-wrapper");
                rmNode("#J_yitiao_container");
                rmNode('#J-super-layer-promote');
                rmNode('.yitiao-spliter + div');
                //伪造 防流氓
                document.cookie = `baikeTuneUpBaiduApp=${Math.floor(Math.random() * 20 + 10)};domain=${location.hostname};path=/`;
                log.suc('已伪造凭证避免百度文库移动端流氓行为');
            },
            pc: () => {
                rmNode('.right-ad');
                rmNode('.unionAd');
                rmNode('.bottom-recommend-wrapper');
            }
        },
        image: {
            domain: ['image.baidu.com'],
            strict: false,
            name: '百度图片站点脚本',
            mobile: () => {
                //app广告
                rmNode('#boxBanner');
            },
            pc: () => {
                //广告
                rmNode('.newfcImgli');
            }
        },
        tieba: {
            domain: ['tieba.baidu.com'],
            strict: false,
            name: '百度贴吧站点脚本',
            pc: () => {
                //娱乐中心
                rmNode('#spage_liveshow_slide > .slide_outer_wrap:last-child');
                rmNode('.app_download_box');
                //悬浮窗广告
                rmNode('.tbui_aside_float_bar + div.clearfix');
                //广告
                rmNode('[id*="_ad"]');

            },
            mobile: () => {
                //头部app广告
                rmNode('.tb-page > nav:first-child');
                rmNode('.app-view > nav:first-child');
                rmNode('.appPromote');
                addCSS('.j_main.main', 'margin-top:5px !important;')
                //底部app广告
                rmNode('nav.fixed-nav-bar-defensive')
                rmNode('#m_footer');
                rmNode('.appBottomPromote');
                //悬浮广告
                rmNode('a.fixed_bar');
            }
        },
        fanyi: {
            domain: ['fanyi.baidu.com'],
            strict: false,
            name: '百度翻译站点脚本',
            mobile: () => {
                //防误触下载
                rmNode('.intro-title');
                rmNode('.intro-nav.clearfix');
                rmNode('.app-bar');
                rmNode('.new-header-title');
                rmNode('.new-header-dl');
            },
            pc: () => {
                //app广告
                rmNode('.app-guide');
                rmNode('.extra-wrap');
                rmNode('.guide-list.download-app');
                rmNode('#footer-products-container');
                rmNode('#app-read');
            }
        }
    }
    register();
    //执行
    let flag = 0;
    for (let key in baidu) {
        let site = baidu[key];
        flag += urlTest({
            hostname: site.domain, strict: site.strict, callback: () => {
                log.suc('已选中 ' + site.name + ' ，正在运行...');
                site.common ? site.common() : false;
                if (browser.env.mobile) {
                    site.mobile ? site.mobile() : false;
                    log.suc("移动端已执行");
                }
                else if (browser.env.pc) {
                    site.pc ? site.pc() : false;
                    log.suc("PC端已执行");
                }
            }
        })
    }
    if (flag == 0) {
        log.err("当前站点不在该脚本有效运行范围内！");
    }
})();
