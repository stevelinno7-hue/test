(function(global){
    'use strict';

    // ------------------------------------------------------------------
    //  Paper Generator V9.9.7 (Strict + Auto-Init Fix)
    //  修正：V9.9.6 因移除初始化導致的「核心未啟動」錯誤
    //  保留：精準標籤篩選功能 (解決亂出題)
    // ------------------------------------------------------------------

    // 1. 確保 Shuffle 功能存在
    if (!Array.prototype.shuffle) {
        Array.prototype.shuffle = function() {
            for (let i = this.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this[i], this[j]] = [this[j], this[i]];
            }
            return this;
        };
    }

    // 2. ★★★ 關鍵修正：自動初始化核心物件 ★★★
    // 這段代碼在 V9.9.6 被我不小心移除了，現在加回來
    if (!window.RigorousGenerator) {
        window.RigorousGenerator = { 
            _templates: {}, 
            registerTemplate: function(id, f, t){ 
                this._templates[id] = {func:f, tags:t, subject: f.subject || 'misc'}; 
            } 
        };
    }

    function generatePaper(config) {
        let G = window.RigorousGenerator;
        
        // 雙重保險：如果 G 還是空的，就現場造一個
        if (!G) {
             G = window.RigorousGenerator = { _templates: {} };
        }
        if (!G.getTemplateIds) G.getTemplateIds = () => Object.keys(G._templates || {});

        const subject = (config.subject || 'math').toLowerCase();
        
        // 處理標籤：轉小寫並過濾空值
        const requestTags = (Array.isArray(config.tags) ? config.tags : [config.tags])
                            .map(t => String(t || '').toLowerCase())
                            .filter(t => t !== '' && t !== 'undefined' && t !== 'null');

        console.log(`🔒 [Gen V9.9.7] 精準模式 | 科目: ${subject} | 標籤:`, requestTags);

        // 3. 收集所有題目來源
        const repos = [
            window.__MATH_REPO__, window.__PHYSICS_REPO__, window.__CHEMISTRY_REPO__, 
            window.__BIOLOGY_REPO__, window.__EARTH_SCI_REPO__, window.__CHINESE_REPO__,
            window.__ENGLISH_REPO__, window.__HISTORY_REPO__, window.__CIVICS_REPO__, window.__GEOGRAPHY_REPO__
        ];

        let candidates = [];

        repos.forEach(repo => {
            if(!repo) return;
            Object.keys(repo).forEach(tid => {
                const t = repo[tid];
                if (!t) return;
                
                // --- A. 科目嚴格檢查 ---
                const tSubject = (t.subject || "").toLowerCase();
                let isSubjectMatch = false;

                if (subject === 'science') {
                    if (['physics', 'chemistry', 'science'].includes(tSubject)) isSubjectMatch = true;
                } else if (subject === 'social') {
                    if (['history', 'geography', 'civics', 'social'].includes(tSubject)) isSubjectMatch = true;
                } else if (tSubject === subject) {
                    isSubjectMatch = true;
                }

                if (!isSubjectMatch) return;

                // --- B. 標籤精準計分 ---
                let score = 0;
                const meta = (t.tags || []).map(x => String(x).toLowerCase());

                if (requestTags.length === 0) {
                    score = 1; // 沒選單元 = 全冊
                } else {
                    let hitCount = 0;
                    requestTags.forEach(rt => {
                        if (meta.some(m => m.includes(rt) || rt.includes(m))) {
                            hitCount++;
                        }
                    });
                    
                    if (hitCount > 0) {
                        score = 10 + hitCount;
                    } else {
                        score = 0; // 沒命中標籤，直接淘汰
                    }
                }

                // --- C. 加入候選 ---
                if (score > 0) {
                    candidates.push({ 
                        tid: tid, 
                        score: score + Math.random(), // 隨機權重防止死板排序
                        func: t.func
                    });
                }
            });
        });

        // 4. 排序
        candidates.sort((a, b) => b.score - a.score);

        console.log(`📊 篩選結果: 找到 ${candidates.length} 題符合條件`);
        
        // 5. 如果沒題目，改為全科搜尋 (避免交白卷)
        if (candidates.length === 0) {
            console.warn("⚠️ 找不到符合標籤的題目！系統將自動改為「全科出題」...");
            // 遞迴呼叫自己，但清空標籤
            return generatePaper({ ...config, tags: [] });
        }

        // 6. 取出題目
        const total = config.total || 10;
        const finalSelection = candidates.slice(0, total);
        
        return finalSelection.map(c => c.func());
    }

    window.generatePaper = generatePaper;
    console.log("✅ Paper Generator V9.9.7 (Auto-Init Fix) 已修復啟動錯誤");

})(window);
