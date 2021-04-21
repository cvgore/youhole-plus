// ==UserScript==
// @name         You Hole Plus
// @namespace    http://cvgo.re/
// @version      0.2.0
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

    const symbols = {
        play: "⏵︎",
        pause: "⏸︎",
    };

    function store(obj) {
        const watchers = {};

        obj.listen = (prop, cb) => {
            if (!watchers[prop]) {
                watchers[prop] = [];
            }

            watchers[prop].push(cb);
        };

        const proxy = new Proxy(obj, {
            set(target, prop, val) {
                if (watchers[prop]) {
                    watchers[prop].forEach(x => x(val));
                }

                return Reflect.set(...arguments);
            }
        });

        return proxy;
    }

    const state = store({
        playbackStatus: 'pause'
    });

    const containerEl = document.createElement("div");

    containerEl.style.right = 0;
    containerEl.style.bottom = 0;
    containerEl.style.zIndex = 1000;
    containerEl.style.position = 'fixed';

    document.body.appendChild(containerEl);

    function mkBtn(label) {
        const btn = document.createElement("a");

        btn.innerHTML = label;
        btn.style.padding = ".5rem 1rem";
        btn.style.backgroundColor = "#e6e6e6";
        btn.style.textDecoration = "none";
        btn.style.borderRadius = 2;
        btn.style.fontFamily = "sans-serif";
        btn.style.color = "rgba(0,0,0,.8)";
        btn.style.marginLeft = ".128rem";

        containerEl.appendChild(btn);

        return btn;
    }

    const playPauseBtn = mkBtn(symbols.play);
    playPauseBtn.addEventListener("click", (ev) => {
        ev.preventDefault();

        const playerEl = document.querySelector("#player");

        playerEl.contentWindow.postMessage(
            JSON.stringify({
                event: "command",
                func: state.playbackStatus === "pause" ? "playVideo" : "pauseVideo",
                args: [],
                id: playerEl.id
            }),
            '*'
        );
    }, false);

    state.listen('playbackStatus', (val) => {
        playPauseBtn.innerHTML = val === "pause" ? symbols.play : symbols.pause;
    });

    const watchOnYtBtn = mkBtn("View on Youtube");
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

        if (data.event === "onStateChange"
            && data.id === 1
            ) {
            state.playbackStatus = data.info == 2 ? "pause" : "play";
        }
    };
})();
