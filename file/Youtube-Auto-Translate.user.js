// ==UserScript==
// @name			Youtube Auto Translate
// @author			ACTCD
// @version			20220316.2
// @namespace		https://t.me/ACTCD
// @description		Automatically translate any non-specified language.
// @match			*://*.youtube.com/*
// @match			*://www.youtube-nocookie.com/embed/*
// @grant			none
// @run-at			document-start
// ==/UserScript==

(function () {
    'use strict';

    const translate = () => {
        const tlang = 'zh-CN'; // Specified language
        const XMLHttpRequest_open = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function () {
            let url = new URL(arguments[1], location.href);
            if (url.pathname == '/api/timedtext') {
                let lang = url.searchParams.get('lang');
                if (lang && lang != tlang) {
                    url.searchParams.set('tlang', tlang);
                    arguments[1] = url.href;
                }
            }
            XMLHttpRequest_open.apply(this, arguments);
        };
    }

    const script = document.createElement("script");
    script.textContent = '(' + translate + ')();';
    document.head.appendChild(script);

})();