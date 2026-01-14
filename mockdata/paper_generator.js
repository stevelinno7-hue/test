(function(global){
    'use strict';

    console.log("🔧 [Polyfill] 正在檢查與修復 Generator Engine...");

    // 1. 確保全域物件存在
    global.RigorousGenerator = global.RigorousGenerator || { _templates: {} };
    const G = global.RigorousGenerator;

    // 2. 確保模板儲存空間存在
    G._templates = G._templates || {};

    // 3. ★★★ 關鍵修復：補上 getTemplateIds 函式 ★★★
    // 您的 paper_generator.js 第 24 行就是因為找不到這個函式而當機的
    if (typeof G.getTemplateIds !== 'function') {
        G.getTemplateIds = function() {
            // 回傳所有已註冊模板的 ID 列表
            return Object.keys(this._templates);
        };
        console.log("🔧 [Polyfill] 已修復缺失的 getTemplateIds 功能");
    }

    // 4. 確保註冊函式存在
    if (typeof G.registerTemplate !== 'function') {
        G.registerTemplate = function(id, func, tags) {
            this._templates[id] = { 
                func: func, 
                tags: tags || [],
                meta: tags || [] // 為了相容性，同時存入 meta
            };
        };
    }

    // 5. 確保生成函式存在
    if (typeof G.generateQuestion !== 'function') {
        G.generateQuestion = function(id, args) {
            const t = this._templates[id];
            if (!t) {
                console.error(`Template ${id} not found`);
                return null;
            }
            // 執行生成邏輯
            return t.func({}, args || {});
        };
    }

    // 6. 確保工具箱存在 (避免 randInt 報錯)
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
        generateNumericOptions: (ans) => {
            const set = new Set([ans]);
            // 簡單生成 3 個誘答
            set.add(ans + 1);
            set.add(ans - 1);
            if(typeof ans === 'number') {
                set.add(ans * 2);
                set.add(Math.floor(ans / 2));
            } else {
                set.add("0");
            }
            return Array.from(set).sort(() => Math.random() - 0.5).slice(0, 4);
        }
    };

    console.log("🔧 [Polyfill] Engine 修復完成，系統已準備就緒。");

})(typeof window !== 'undefined' ? window : global);
