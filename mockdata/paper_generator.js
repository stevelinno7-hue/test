(function(global){
    'use strict';

    // ------------------------------------------------------------------
    //  Paper Generator V9.9.6 (Strict Mode)
    //  修正：「題目亂出」問題。
    //  特點：嚴格遵守標籤篩選，除非真的 0 題，否則不隨便塞其他單元。
    // ------------------------------------------------------------------

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
        let G = window.RigorousGenerator || global.RigorousGenerator;
        if (!G) {
            console.error("❌ 生成器核心未啟動");
            return [];
        }
        if (!G.getTemplateIds) G.getTemplateIds = () => Object.keys(G._templates || {});

        const subject = (config.subject || 'math').toLowerCase();
        // 將使用者的請求標籤轉小寫，並過濾掉空值
        const requestTags = (Array.isArray(config.tags) ? config.tags : [config.tags])
                            .map(t => String(t || '').toLowerCase())
                            .filter(t => t !== '' && t !== 'undefined' && t !== 'null');

        console.log(`🔒 [Gen V9.9.6] 精準模式啟動 | 科目: ${subject} | 篩選標籤:`, requestTags);

        // 1. 收集所有題目來源
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
                
                // --- A. 科目嚴格檢查 (Subject Guard) ---
                const tSubject = (t.subject || "").toLowerCase();
                let isSubjectMatch = false;

                // 特殊處理：理化 (Science) 包含 物理 (Physics) + 化學 (Chemistry)
                if (subject === 'science') {
                    if (['physics', 'chemistry', 'science'].includes(tSubject)) isSubjectMatch = true;
                } 
                // 特殊處理：社會 (Social) 包含 史地公
                else if (subject === 'social') {
                    if (['history', 'geography', 'civics', 'social'].includes(tSubject)) isSubjectMatch = true;
                }
                // 一般科目比對
                else if (tSubject === subject) {
                    isSubjectMatch = true;
                }

                if (!isSubjectMatch) return; // 科目不對直接踢掉

                // --- B. 標籤精準計分 (Tag Scoring) ---
                // 如果使用者沒有指定任何標籤 (requestTags 為空)，代表「全冊複習」，所有該科題目都給過。
                // 如果有指定標籤，則必須命中至少一個。
                
                let score = 0;
                const meta = (t.tags || []).map(x => String(x).toLowerCase());

                if (requestTags.length === 0) {
                    score = 1; // 沒選單元 = 全冊 = 全部符合
                } else {
                    // 檢查是否命中標籤
                    let hitCount = 0;
                    requestTags.forEach(rt => {
                        // 模糊比對：例如選 "國七"，題目標籤 "國七上" 也算中
                        if (meta.some(m => m.includes(rt) || rt.includes(m))) {
                            hitCount++;
                        }
                    });
                    
                    if (hitCount > 0) {
                        score = 10 + hitCount; // 命中越多分數越高
                    } else {
                        score = 0; // ★★★ 關鍵修改：沒命中標籤，分數就是 0 (直接淘汰)
                    }
                }

                // --- C. 嚴格篩選 ---
                // 只有當分數 > 0 (代表符合條件) 時，才加入候選名單
                if (score > 0) {
                    candidates.push({ 
                        tid: tid, 
                        score: score + Math.random(), // 加入隨機擾動，避免每次順序一樣
                        func: t.func
                    });
                }
            });
        });

        // 2. 排序 (高分優先)
        candidates.sort((a, b) => b.score - a.score);

        // 3. 檢查結果
        console.log(`📊 篩選結果: 找到 ${candidates.length} 題符合條件`);
        
        // 如果完全沒題目，這時才動用「最後手段」
        if (candidates.length === 0) {
            console.warn("⚠️ 找不到符合標籤的題目！系統將改為「全科出題」避免空白考卷...");
            return generatePaper({ ...config, tags: [] });
        }

        // 4. 取出前 N 題
        const total = config.total || 10;
        
        // ★★★ 最終確認：如果不夠 N 題，就只給現有的，絕對不亂補 ★★★
        const finalSelection = candidates.slice(0, total);
        
        return finalSelection.map(c => c.func());
    }

    window.generatePaper = generatePaper;
    console.log("✅ Paper Generator V9.9.6 (Strict Mode) 已載入 - 解決題目亂出問題");

})(window);
