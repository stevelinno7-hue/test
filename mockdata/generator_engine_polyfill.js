(function(global){
    'use strict';

    console.log("🔧 [Polyfill] 正在檢查與修復 Generator Engine...");

    // 模擬 Generator Engine (如果主程式未載入)
    if (!global.RigorousGenerator) {
        global.RigorousGenerator = {
            _templates: {},
            
            // 註冊模板
            registerTemplate: function(id, func, tags) {
                this._templates[id] = { 
                    func: func, 
                    tags: tags || [],
                    meta: tags || [] // 兼容舊版
                };
            },

            // ★★★ 關鍵修復：補上這個缺失的函式 ★★★
            getTemplateIds: function() {
                return Object.keys(this._templates);
            },

            // 生成題目
            generateQuestion: function(id, args) {
                const t = this._templates[id];
                if (!t) throw new Error(`Template ${id} not found`);
                return t.func({}, args || {}); // 傳入 args 以支援 tags 過濾
            }
        };
    } else {
        // 如果 Engine 已經存在，但也許版本過舊缺少此功能，這裏做補強
        if (!global.RigorousGenerator.getTemplateIds) {
            global.RigorousGenerator.getTemplateIds = function() {
                 return Object.keys(this._templates);
            };
        }
    }

    // 確保 utils 存在
    global.RigorousGenerator.utils = global.RigorousGenerator.utils || {
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
        generateNumericOptions: (ans, type) => {
            // 簡易版誘答生成
            return [ans, ans+1, ans-1, ans*2].sort(() => Math.random() - 0.5);
        }
    };

    console.log("🔧 [Polyfill] Engine 修復完成，題目儲存庫已就緒。");

})(typeof window !== 'undefined' ? window : global);
