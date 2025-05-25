// ==UserScript==
// @name         超星 canvas WebSocket 推送（仅变化时发送）
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  每50ms检查canvas变化，仅在变更时通过WebSocket发送Blob，并自动重连WebSocket
// @match        https://mobilelearn.chaoxing.com/page/sign/endSign*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let ws;
    let reconnectTimeout = null;
    let lastHash = null;

    function createWebSocket() {
        ws = new WebSocket('wss://tongtongtong.21wb.com/ws/');
        ws.binaryType = 'blob';

        ws.onopen = () => {
            console.log('[油猴] WebSocket 连接成功');
        };

        ws.onclose = () => {
            console.warn('[油猴] WebSocket 已断开，尝试重连...');
            reconnect();
        };

        ws.onerror = (err) => {
            console.error('[油猴] WebSocket 出错', err);
            ws.close(); // 确保触发 onclose
        };
    }

    function reconnect() {
        if (reconnectTimeout) return;
        reconnectTimeout = setTimeout(() => {
            reconnectTimeout = null;
            createWebSocket();
        }, 3000); // 3秒后重连
    }

    function getCanvasHash(canvas) {
        try {
            const ctx = canvas.getContext('2d');
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

            let hash = 0;
            for (let i = 0; i < Math.min(400, imageData.length); i++) {
                hash = (hash * 31 + imageData[i]) >>> 0;
            }
            return hash;
        } catch (err) {
            console.error('[油猴] 获取 canvas 哈希出错:', err);
            return null;
        }
    }

    function checkAndSendCanvas() {
        try {
            const canvas = document.querySelector('canvas');
            if (!canvas || !ws || ws.readyState !== WebSocket.OPEN) return;

            const currentHash = getCanvasHash(canvas);
            if (currentHash !== null && currentHash !== lastHash) {
                lastHash = currentHash;

                canvas.toBlob(blob => {
                    if (ws.readyState === WebSocket.OPEN && blob) {
                        ws.send(blob);
                        console.log('[油猴] 检测到变化，发送 canvas Blob');
                    }
                }, 'image/png');
            }
        } catch (err) {
            console.error('[油猴] Canvas 检查或发送出错:', err);
        }
    }

    createWebSocket(); // 初始化连接
    setInterval(checkAndSendCanvas, 50); // 每50ms检查一次（性能更友好）
})();
