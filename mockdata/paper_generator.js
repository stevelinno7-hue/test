(function(global){
    'use strict';

    // 1. 陣列隨機工具
    if (!Array.prototype.shuffle) {
        Array.prototype.shuffle = function() {
            let arr = this.slice();
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        };
    }

    // 2. 標籤清洗
    function normalizeTags(raw) {
        if (!raw) return [];
        let tags = Array.isArray(raw) ? raw : String(raw).split(/[,，\s]+/).filter(Boolean);
        return tags.map(t => String(t).trim().toLowerCase());
    }

    // 3. 核心生成函數
    function generatePaper(config) {
        const inputSub = (config.subject || '').toLowerCase();
        const requestTags = normalizeTags(config.tags || []);
        
        // 💡 關鍵：科目對照表 (Alias)
        // 解決「理化」找不到「physics」的問題
       // 在 generatePaper 函數內部
const subjectAlias = {
    'science': 'physics',      // 👈 新增這一行，把網址傳來的 science 轉為 physics
    '理化': 'physics',
    '物理': 'physics',
    '化學': 'chemistry',
    '地科': 'earth_science',
    '地球科學': 'earth_science',
    '生物': 'biology',
    '歷史': 'history',
    '地理': 'geography',
    '公民': 'civics'
};
        const mappedSub = subjectAlias[inputSub] || inputSub;

        // 收集所有 Repo
        const repos = [
            window.__MATH_REPO__, window.__PHYSICS_REPO__, window.__CHEMISTRY_REPO__,
            window.__BIOLOGY_REPO__, window.__EARTH_SCI_REPO__, window.__CHINESE_REPO__,
            window.__ENGLISH_REPO__, window.__HISTORY_REPO__, window.__CIVICS_REPO__, window.__GEOGRAPHY_REPO__
        ].filter(Boolean);

        let candidates = [];

        repos.forEach(repo => {
            Object.keys(repo).forEach(tid => {
                const t = repo[tid];
                if (!t) return;

                // A. 改良後的科目過濾
                const tSub = String(t.subject || "").toLowerCase();
                let isMatch = (tSub === inputSub || tSub === mappedSub || 
                               tSub.includes(inputSub) || inputSub.includes(tSub));
                
                if (!isMatch) return;

                // B. 標籤計分
                const itemTags = normalizeTags(t.tags || t.meta || []);
                let score = 0;
                if (requestTags.length === 0) {
                    score = 1; 
                } else {
                    const hitCount = requestTags.filter(rt => itemTags.includes(rt)).length;
                    if (hitCount > 0) score = 10 + hitCount;
                }

                if (score > 0) {
                    candidates.push({
                        tid: tid,
                        score: score + Math.random(),
                        rawData: t
                    });
                }
            });
        });

        // 排序
        candidates.sort((a, b) => b.score - a.score);
        const selected = candidates.slice(0, config.total || 10);

        if (selected.length === 0) {
            console.error("❌ 找不到符合條件的題目！請檢查科目設定。");
            return [];
        }

        // C. 格式化輸出
        return selected.map(c => {
            const t = c.rawData;
            
            // 判斷是否為題組 (Group)
            const isGroup = (t.type === 'group' || (t.questions && Array.isArray(t.questions)));

            if (isGroup) {
                return {
                    type: 'group',
                    context: t.context || t.q || "請根據以下內容回答問題：",
                    concept: t.concept || (t.tags ? t.tags[t.tags.length - 1] : "閱讀題組"),
                    questions: t.questions.map(sq => {
                        const opts = [sq.a, ...(sq.o || [])].shuffle();
                        return {
                            question: sq.q,
                            options: opts,
                            answer: opts.indexOf(sq.a),
                            concept: sq.t ? sq.t[sq.t.length - 1] : "子題"
                        };
                    })
                };
            } else {
                // 一般題或函數題
                let data;
                if (typeof t.func === 'function') {
                    data = t.func();
                } else {
                    const opts = [t.a, ...(t.o || [])].shuffle();
                    data = {
                        question: t.q,
                        options: opts,
                        answer: opts.indexOf(t.a)
                    };
                }
                return {
                    type: 'normal',
                    question: data.question,
                    options: data.options,
                    answer: data.answer,
                    concept: (t.tags && t.tags.length > 0) ? t.tags[t.tags.length - 1] : "一般題型"
                };
            }
        });
    }

    global.generatePaper = generatePaper;
    console.log("✅ Paper Generator V12.0 (多科相容版) 已就緒");

})(window);
