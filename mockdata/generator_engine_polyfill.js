(function(global){
    'use strict';

    console.log("🔧 [Polyfill] 正在檢查與修復 Generator Engine...");

    // 1. 確保全域物件存在
    global.RigorousGenerator = global.RigorousGenerator || { _templates: {} };
    const G = global.RigorousGenerator;

    // 2. 確保模板儲存空間存在
    G._templates = G._templates || {};

    // 3. ★★★ 關鍵修復：補上 getTemplateIds ★★★
    // 這是造成您系統崩潰的主因，我們強制補上它
    if (typeof G.getTemplateIds !== 'function') {
        G.getTemplateIds = function() {
            return Object.keys(this._templates);
        };
        console.log("🔧 [Polyfill] 已修復缺失的 getTemplateIds 函式");
    }

    // 4. 確保註冊函式存在
    if (typeof G.registerTemplate !== 'function') {
        G.registerTemplate = function(id, func, tags) {
            this._templates[id] = { 
                func: func, 
                tags: tags || [],
                meta: tags || [] 
            };
        };
    }

    // 5. 確保生成函式存在
    if (typeof G.generateQuestion !== 'function') {
        G.generateQuestion = function(id, args) {
            const t = this._templates[id];
            if (!t) throw new Error(`Template ${id} not found`);
            return t.func({}, args || {});
        };
    }

    // 6. 確保工具箱存在
    G.utils = G.utils || {
        randInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
        pick: (arr) => arr[Math.floor(Math.random() * arr.length)],
        shuffle: (arr) => {
            let a = [...arr];
            for (let i = a.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [a[i], a[j]] = [a[j], a[i]];
            }
            return a;
        },
        generateNumericOptions: (ans) => [ans, ans+1, ans-1, ans*2].sort(() => Math.random() - 0.5)
    };

    console.log("🔧 [Polyfill] Engine 修復完成，系統已準備就緒。");

})(typeof window !== 'undefined' ? window : global);
