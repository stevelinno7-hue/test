(function(global){
    'use strict';

    // 1. 擴充陣列隨機排序功能
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

    // 2. 標籤正規化
    function normalizeTags(raw) {
        if (!raw) return [];
        let tags = Array.isArray(raw) ? raw : String(raw).split(/[,，\s]+/).filter(Boolean);
        return tags.map(t => String(t).trim().toLowerCase());
    }

    // 3. 核心生成邏輯
    function generatePaper(config) {
        const inputSubject = (config.subject || '').toLowerCase();
        const requestTags = normalizeTags(config.tags || []);
        
        // 💡 關鍵修正：科目對照表 (讓「理化」能對應到 「physics」)
        const subjectAlias = {
            '理化': 'physics',
            '物理': 'physics',
            '化學': 'chemistry',
            '地科': 'earth_science',
            '地球科學': 'earth_science',
            '生物': 'biology',
            '歷史': 'history',
            '地理': 'geography',
            '公民': 'civics',
            '數學': 'math',
            '英文': 'english',
            '國文': 'chinese'
        };
        const mappedSubject = subjectAlias[inputSubject] || inputSubject;

        // 收集所有已載入的倉庫
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

                // A. 科目匹配邏輯 (比對原始輸入或轉換後的 ID)
                const tSubject = String(t.subject || "").toLowerCase();
                let isMatch = (tSubject === inputSubject || tSubject === mappedSubject || 
                               tSubject.includes(inputSubject) || inputSubject.includes(tSubject));
                
                if (!isMatch) return;

                // B. 標籤與分數計算
                const itemTags = normalizeTags(t.tags || t.meta || []);
                let score = 0;
                
                if (requestTags.length === 0) {
                    score = 1; // 沒選標籤則全選
                } else {
                    const hitCount = requestTags.filter(rt => itemTags.includes(rt)).length;
                    if (hitCount > 0) score = 10 + hitCount; 
                }

                if (score > 0) {
                    candidates.push({
                        tid: tid,
                        score: score + Math.random(), // 加入亂數避免每次題目順序一樣
                        rawData: t
                    });
                }
            });
        });

        // 排序並取指定題數
        candidates.sort((a, b) => b.score - a.score);
        const selected = candidates.slice(0, config.total || 10);

        if (selected.length === 0) {
            console.warn("❌ 找不到符合條件的題目！請檢查科目與標籤設定。");
            return [];
        }

        // C. 格式化輸出 (相容 函數型、單題、題組)
        return selected.map(c => {
            const t = c.rawData;
            const isGroup = (t.type === 'group' || (t.questions && Array.isArray(t.questions)));

            if (isGroup) {
                // --- 處理題組 (Group) ---
                return {
                    type: 'group',
                    context: t.context || t.q || "請閱讀以下內容並回答問題：",
                    concept: t.concept || (t.tags ? t.tags[t.tags.length-1] : "閱讀題組"),
                    questions: t.questions.map(subQ => {
                        const opts = [subQ.a, ...(subQ.o || [])].shuffle();
                        return {
                            question: subQ.q,
                            options: opts,
                            answer: opts.indexOf(subQ.a),
                            concept: subQ.t ? subQ.t[subQ.t.length-1] : "子題"
                        };
                    })
                };
            } else {
                // --- 處理單題 (Normal / Func) ---
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
    console.log("✅ Paper Generator V12.0 (多學科優化版) 已載入");

})(window);
