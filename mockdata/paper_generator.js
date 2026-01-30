(function(global){
    'use strict';

    // ------------------------------------------------------------------
    //  Paper Generator V9.9.9 (Universal Adapter)
    //  修正：專門解決「題庫明明有，但系統卻說 0 題」的靈異現象
    //  功能：暴力清洗標籤格式 (字串/陣列/空白通吃) + 詳細診斷 Log
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

    // 自動初始化核心
    if (!window.RigorousGenerator) {
        window.RigorousGenerator = { 
            _templates: {}, 
            registerTemplate: function(id, f, t){ 
                this._templates[id] = {func:f, tags:t, subject: f.subject || 'misc'}; 
            } 
        };
    }

    function normalizeTags(raw) {
        if (!raw) return [];
        // 如果是字串 (例如 "math, grade7")，切開變成陣列
        if (typeof raw === 'string') {
            return raw.split(/[,，\s]+/).map(t => t.trim().toLowerCase()).filter(Boolean);
        }
        // 如果是陣列，轉小寫並去空白
        if (Array.isArray(raw)) {
            return raw.map(t => String(t).trim().toLowerCase()).filter(Boolean);
        }
        return [];
    }

    function generatePaper(config) {
        let G = window.RigorousGenerator;
        if (!G) G = window.RigorousGenerator = { _templates: {} };
        if (!G.getTemplateIds) G.getTemplateIds = () => Object.keys(G._templates || {});

        const subject = (config.subject || 'math').toLowerCase();
        
        // 1. 清洗使用者請求的標籤
        const requestTags = normalizeTags(config.tags);

        console.log(`🔒 [Gen V9.9.9] 萬能轉接模式 | 科目: ${subject}`);
        console.log(`🎯 您請求的標籤 (已清洗):`, requestTags);

        // 2. 收集所有題目來源
        const repos = [
            window.__MATH_REPO__, window.__PHYSICS_REPO__, window.__CHEMISTRY_REPO__, 
            window.__BIOLOGY_REPO__, window.__EARTH_SCI_REPO__, window.__CHINESE_REPO__,
            window.__ENGLISH_REPO__, window.__HISTORY_REPO__, window.__CIVICS_REPO__, window.__GEOGRAPHY_REPO__
        ];

        let candidates = [];
        let debugTagPool = new Set(); // 診斷用：收集系統到底看到了什麼標籤

        repos.forEach(repo => {
            if(!repo) return;
            Object.keys(repo).forEach(tid => {
                const t = repo[tid];
                if (!t) return;
                
               
            // --- A. 科目檢查邏輯 (理化聯集 vs 社會精準) ---
const tSubject = String(t.subject || "").toLowerCase().trim();
let isSubjectMatch = false;

// 1. 理化聯集池 (因為理化題可能標註為 physics 或 chemistry)
const sciencePool = ['physics', 'chemistry', 'science', '理化', '物理', '化學', '自然'];

if (subject === 'science') {
    // 理化維持聯集：只要題目屬於理化池，或標籤有理化關鍵字就放行
    if (sciencePool.some(s => tSubject.includes(s))) {
        isSubjectMatch = true;
    } else {
        const rawTagsForSub = normalizeTags(t.tags || t.meta || []);
        if (rawTagsForSub.some(tag => ['理化', '化學', '物理'].includes(tag))) isSubjectMatch = true;
    }
} 
// 2. 社會科與其他科目：採用精準比對，不再使用聯集池
else if (tSubject.includes(subject) || subject.includes(tSubject)) {
    isSubjectMatch = true;
}

if (!isSubjectMatch) return;
                // --- B. 標籤暴力比對 ---
                let score = 0;
                // 這裡做這件事：把題庫裡各種怪異格式的 tags 全部洗成乾淨的陣列
                const rawTags = t.tags || t.meta || (t.func && t.func.tags) || [];
                const metaTags = normalizeTags(rawTags).concat([tSubject]);

                // (診斷用) 將這個題目的標籤加入清單
                metaTags.forEach(mt => debugTagPool.add(mt));

                if (requestTags.length === 0) {
                    score = 1; // 沒選標籤 = 全冊
                } else {
                    let hitCount = 0;
                    requestTags.forEach(rt => {
                        // 雙向寬鬆比對 (只要包含就算對)
                        if (metaTags.some(mt => mt.includes(rt) || rt.includes(mt))) {
                            hitCount++;
                        }
                    });
                    
                    if (hitCount > 0) {
                        score = 10 + hitCount;
                    } else {
                        score = 0; 
                    }
                }

                // --- C. 加入候選 ---
                if (score > 0) {
                    candidates.push({ 
                        tid: tid, 
                        score: score + Math.random(), 
                        func: t.func,
                        debugTags: metaTags // 讓 Log 印出來看
                    });
                }
            });
        });

        // 3. 排序
        candidates.sort((a, b) => b.score - a.score);

        console.log(`📊 篩選結果: 找到 ${candidates.length} 題符合條件`);
        
        // 4. 診斷報告 (如果找不到題目，告訴使用者系統到底看到了什麼)
        if (candidates.length === 0) {
            console.error("❌ 依然找不到題目！");
            console.warn("🧐 系統在題庫中只看到以下標籤 (請檢查是否有對應的關鍵字):");
            console.warn(Array.from(debugTagPool).join(", "));
            
            // 這裡不再亂抓，直接回傳空，但請務必看上面的 Log
            return [];
        } else {
            // 如果有找到，印出第一題的標籤證明沒抓錯
            console.log("✅ 成功抓取！第一題的標籤是:", candidates[0].debugTags);
        }

        // 5. 取出題目
        const total = config.total || 10;
        return candidates.slice(0, total).map(c => c.func());
    }

    window.generatePaper = generatePaper;
    console.log("✅ Paper Generator V9.9.9 (Universal Adapter) 已載入 - 標籤強力匹配版");

})(window);
