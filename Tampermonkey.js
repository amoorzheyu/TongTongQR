// ==UserScript==
// @name         超星 canvas WebSocket 推送（仅变化时发送）
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  每50ms检查canvas变化，仅在变更时通过WebSocket发送Blob
// @match        https://mobilelearn.chaoxing.com/page/sign/endSign*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const ws = new WebSocket('wss://tongtongtong.21wb.com/ws/');
    ws.binaryType = 'blob';

    ws.onopen = () => {
        console.log('[油猴] WebSocket 连接成功');
    };

    ws.onclose = () => {
        console.warn('[油猴] WebSocket 已断开');
    };

    let lastHash = null;

    function getCanvasHash(canvas) {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

        // 简单 hash：取前100像素作为特征值（优化性能）
        let hash = 0;
        for (let i = 0; i < Math.min(400, imageData.length); i++) {
            hash = (hash * 31 + imageData[i]) >>> 0;
        }
        return hash;
    }

    function checkAndSendCanvas() {
        const canvas = document.querySelector('canvas');
        if (!canvas || ws.readyState !== WebSocket.OPEN) return;

        const currentHash = getCanvasHash(canvas);
        if (currentHash !== lastHash) {
            lastHash = currentHash;

            canvas.toBlob(blob => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(blob);
                    console.log('[油猴] 检测到变化，发送 canvas Blob');
                }
            }, 'image/png');
        }
    }

    setInterval(checkAndSendCanvas, 10);
})();
