(function(global){
    'use strict';

    // 擴充 Array 方法 (洗牌)
    if (!Array.prototype.shuffle) {
        Array.prototype.shuffle = function() {
            for (let i = this.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this[i], this[j]] = [this[j], this[i]];
            }
            return this;
        };
    }

    function generatePaper(config) {
        const G = global.RigorousGenerator || (window.global && window.global.RigorousGenerator) || window.GeneratorEngine;
        
        if (!G) { console.error("❌ [PaperGen] Engine missing"); return []; }
        
        // 確保能取得 ID 列表
        if (typeof G.getTemplateIds !== 'function') {
            if (G._templates) {
                G.getTemplateIds = () => Object.keys(G._templates); 
            } else {
                console.error("❌ [PaperGen] G.getTemplateIds missing"); return [];
            }
        }

        // 參數正規化
        const subject = (config.subject || 'math').toLowerCase();
        const requestTags = (Array.isArray(config.tags) ? config.tags : [config.tags])
                            .map(t => String(t).toLowerCase());
        
        const allTemplateIds = G.getTemplateIds();

        console.log(`🔒 [PaperGen V6.3] 請求 -> 科目:[${subject}] | 標籤:[${requestTags}]`);
        console.log(`📚 引擎內總模板數: ${allTemplateIds.length}`); // ★ 確認引擎是不是空的

        // 定義 ID 對應規則 (若標籤失效，用 ID 猜科目)
        const idMap = {
            'chinese': ['chi_', 'chinese', '國文', '語文'],
            'math': ['math', 'alg', 'geo'],
            'physics': ['phy'],
            'chemistry': ['chem'],
            'biology': ['bio'],
            'history': ['his'],
            'geography': ['geo_'],
            'civics': ['civ']
        };

        const subjectKeywords = idMap[subject] || [subject];

        // 1. 篩選邏輯
        let validTemplates = allTemplateIds.filter(tid => {
            const t = G._templates[tid];
            const tidLower = tid.toLowerCase();

            // --- 策略 A: 屬性檢查 (標準做法) ---
            // 嘗試抓取所有可能的屬性位置
            const rawTags = t.tags || t.meta || (t.func && t.func.tags) || [];
            const injectedSubject = t.subject || (t.func && t.func.subject) || "";
            
            const metaPool = (Array.isArray(rawTags) ? rawTags : [rawTags])
                             .concat([injectedSubject])
                             .map(x => String(x).toLowerCase());

            const metaSubjectMatch = metaPool.some(tag => tag === subject || tag.includes(subject));
            
            // --- 策略 B: ID 字串檢查 (終極保險) ---
            // 檢查 ID 是否包含 'chi_', '國七', '成語' 等關鍵字
            const idSubjectMatch = subjectKeywords.some(kw => tidLower.includes(kw));
            
            // 只要 A 或 B 命中一個，就算科目符合
            if (!metaSubjectMatch && !idSubjectMatch) return false;

            // --- 標籤過濾 ---
            // 檢查請求的標籤 (如 '成語') 是否出現在 ID 或 Meta 中
            let score = 0;
            requestTags.forEach(reqTag => {
                // 命中 Meta (+1)
                if (metaPool.includes(reqTag)) score++;
                // 命中 ID 字串 (+1) (例如 tid: 'chi_國七_成語' 包含 '成語')
                if (tidLower.includes(reqTag)) score++;
            });

            t._tempScore = score;

            // 如果有指定細項標籤(如成語)，但分數為0 (完全沒命中特徵)，則排除
            // (除非只有請求科目，那只要科目對了就行)
            if (requestTags.length > 1 && score === 0) return false;

            return true;
        });

        // 2. 排序
        validTemplates.sort((a, b) => G._templates[b]._tempScore - G._templates[a]._tempScore);

        console.log(`📊 匹配結果: ${validTemplates.length} 題 (ID與標籤混合檢索)`);

        // 3. 生成題目
        const paper = [];
        const total = config.total || 10;
        validTemplates.shuffle();
        
        let count = 0;
        let attempts = 0;
        const maxAttempts = total * 3; // 增加嘗試次數

        while(count < total && validTemplates.length > 0 && attempts < maxAttempts) {
            // 循環使用模板
            const tid = validTemplates[count % validTemplates.length];
            attempts++;
            
            try {
                // 傳入 tags 讓 generator 知道要產生什麼變體
                const q = G.generateQuestion(tid, { tags: requestTags });
                
                if (q) {
                    // 雙重確認：有些舊模板回傳 null
                    paper.push(q);
                    count++;
                }
            } catch (e) {
                console.warn(`[Skip] Template ${tid} error:`, e.message);
                // 壞掉的模板從列表中移除
                const index = validTemplates.indexOf(tid);
                if (index > -1) validTemplates.splice(index, 1);
            }
        }

        if (paper.length === 0 && allTemplateIds.length > 0) {
            console.error("❌ 無法生成任何題目，請檢查模板函數是否回傳了 null 或 undefined");
        }

        return paper;
    }

    window.generatePaper = generatePaper;
    console.log("✅ Paper Generator V6.3 (ID-Based Fallback) 已就緒");

})(window);
