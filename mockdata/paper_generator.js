(function(global){
    'use strict';

    // ------------------------------------------------------------------
    //  Paper Generator V9.9.8 (Strict Lockdown)
    //  修正：徹底移除「找不到題目時自動全科出題」的保底機制。
    //  效果：選什麼單元就只出什麼單元，寧可空白也不亂跳。
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

    // 2. 自動初始化核心
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
        if (!G) G = window.RigorousGenerator = { _templates: {} };
        if (!G.getTemplateIds) G.getTemplateIds = () => Object.keys(G._templates || {});

        const subject = (config.subject || 'math').toLowerCase();
        
        // 處理標籤：轉小寫，過濾無效值
        const requestTags = (Array.isArray(config.tags) ? config.tags : [config.tags])
                            .map(t => String(t || '').toLowerCase())
                            .filter(t => t !== '' && t !== 'undefined' && t !== 'null' && t !== 'all');

        console.log(`🔒 [Gen V9.9.8] 嚴格鎖定模式 | 科目: ${subject} | 指定單元:`, requestTags);

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

                // --- B. 標籤嚴格篩選 ---
                let score = 0;
                const meta = (t.tags || []).map(x => String(x).toLowerCase());

                if (requestTags.length === 0) {
                    // 如果沒選單元，代表「全冊」，這時才允許全部通過
                    score = 1; 
                } else {
                    // 如果有選單元，必須命中才算分
                    let hitCount = 0;
                    requestTags.forEach(rt => {
                        // 雙向模糊比對：例如選「數與量」，標籤「數與量(一)」也算中
                        if (meta.some(m => m.includes(rt) || rt.includes(m))) {
                            hitCount++;
                        }
                    });
                    
                    if (hitCount > 0) {
                        score = 10 + hitCount;
                    } else {
                        score = 0; // ★★★ 沒命中就是 0 分，絕對不錄取 ★★★
                    }
                }

                // --- C. 加入候選 (包含隨機洗牌權重) ---
                if (score > 0) {
                    candidates.push({ 
                        tid: tid, 
                        score: score + Math.random(), // 這裡保留隨機性，是為了「同單元內」題目不要都在前幾題
                        func: t.func,
                        debugTags: t.tags
                    });
                }
            });
        });

        // 4. 排序
        candidates.sort((a, b) => b.score - a.score);

        console.log(`📊 篩選結果: 找到 ${candidates.length} 題符合條件`);
        
        // 5. ★★★ 關鍵修改：移除保底機制 ★★★
        if (candidates.length === 0) {
            console.error("❌ 找不到符合標籤的題目。");
            console.error("  - 您請求的標籤:", requestTags);
            console.error("  - 系統拒絕亂出其他單元題目，將回傳空試卷。");
            return []; // 直接回傳空陣列，讓 UI 顯示「無題目」，而不是亂抓
        }

        // 6. 取出題目
        const total = config.total || 10;
        const finalSelection = candidates.slice(0, total);
        
        // Debug: 檢查第一題是不是真的符合
        if (finalSelection.length > 0) {
            console.log("✅ 確認第一題標籤:", finalSelection[0].debugTags);
        }

        return finalSelection.map(c => c.func());
    }

    window.generatePaper = generatePaper;
    console.log("✅ Paper Generator V9.9.8 (Strict Lockdown) 已載入 - 絕對不亂跳單元");

})(window);
