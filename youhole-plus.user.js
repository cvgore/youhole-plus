// ==UserScript==
// @name         You Hole Plus
// @namespace    http://cvgo.re/
// @version      0.1.0
// @description  try to take over the world!
// @author       cvgore
// @match        http://youhole.tv/
// @icon         https://i.imgur.com/XI2bQyB.png
// @grant        none
// @updateURL    https://raw.githubusercontent.com/cvgore/youhole-plus/master/youhole-plus.user.js
// @supportURL   https://github.com/cvgore/youhole-plus/discussions/new
// ==/UserScript==

(function() {
    "use strict";

    const watchOnYtBtn = document.createElement("a");

    watchOnYtBtn.innerHTML = "View on Youtube"
    watchOnYtBtn.style.right = 0;
    watchOnYtBtn.style.bottom = 0;
    watchOnYtBtn.style.zIndex = 1000;
    watchOnYtBtn.style.position = 'fixed';
    watchOnYtBtn.style.padding = '.5rem 1rem';
    watchOnYtBtn.style.backgroundColor = '#fff';
    watchOnYtBtn.style.fontFamily = "sans-serif";
    watchOnYtBtn.target = "_blank";

    window.onmessage = (msg) => {
        if (!msg.data) {
            return;
        }

        const rawData = msg.data;
        const data = JSON.parse(rawData);

        if (data.event === "infoDelivery"
            && data.info
            && data.info.videoData
            && data.info.videoData.video_id
           ) {
            watchOnYtBtn.href = `https://www.youtube.com/watch?v=${data.info.videoData.video_id}`;
        }
    };

    document.body.appendChild(watchOnYtBtn);
})();
