(function(global){
    'use strict';
    
    console.log("🔧 [Polyfill] 正在檢查 Generator Engine...");

    // 1. 確保全域 G 物件存在
    if (!global.RigorousGenerator) {
        global.RigorousGenerator = {};
    }
    const G = global.RigorousGenerator;

    // 2. 強制建立標準儲存空間 (這是 PaperGen 讀取題目的地方)
    if (!G._templates) G._templates = {};
    if (!G._templateTags) G._templateTags = {};

    // 3. 確保工具函式存在 (防止因缺少 utils 而報錯)
    if (!G.utils) {
        G.utils = {
            pick: (arr) => arr && arr.length ? arr[Math.floor(Math.random() * arr.length)] : null,
            shuffle: (arr) => {
                let a = [...arr];
                for (let i = a.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [a[i], a[j]] = [a[j], a[i]];
                }
                return a;
            },
            randInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
            generateNumericOptions: (ans, type) => {
                const res = [ans];
                while(res.length < 4) {
                    let v = type === 'int' ? ans + Math.floor(Math.random()*5)-2 : ans * (1 + (Math.random()-0.5)*0.2);
                    v = type === 'int' ? v : parseFloat(v.toFixed(2));
                    if (!res.includes(v)) res.push(v);
                }
                return res;
            }
        };
    }

    // 4. 劫持註冊函式 (關鍵！)
    // 無論原本的 registerTemplate 做什麼，我們都強制備份一份到 _templates
    const originalRegister = G.registerTemplate;
    G.registerTemplate = function(id, func, tags) {
        // A. 存入我們的標準空間
        G._templates[id] = func;
        G._templateTags[id] = tags || [];
        
        // B. 嘗試呼叫原本的邏輯 (保持兼容)
        if (typeof originalRegister === 'function') {
            try { originalRegister(id, func, tags); } catch(e) {}
        }
    };

    // 5. 確保題目生成函式存在
    if (!G.generateQuestion) {
        G.generateQuestion = function(id, context, rng) {
            const tpl = G._templates[id];
            if (tpl) return tpl(context, rng || Math.random);
            return null;
        };
    }

    console.log("🔧 [Polyfill] Engine 修復完成，確保 _templates 可用。");

})(window);
