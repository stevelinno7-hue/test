(function(global){
    'use strict';

    // ==============================
    // Paper Generator V11.5 (Final Custom Adapter)
    // 支援：{ q, a, o } 格式、題組子題目索引計算、圖片支援
    // ==============================

    if (!Array.prototype.shuffle) {
        Array.prototype.shuffle = function() {
            let arr = this.slice(); // 複製一份不破壞原陣列
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        };
    }

    function normalizeTags(raw) {
        if (!raw) return [];
        let tags = Array.isArray(raw) ? raw : String(raw).split(/[,，\s]+/).filter(Boolean);
        return tags.map(t => String(t).trim().toLowerCase());
    }

    function generatePaper(config) {
        const subject = (config.subject || 'math').toLowerCase();
        const requestTags = normalizeTags(config.tags || []);
        
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

                const tSubject = String(t.subject || "").toLowerCase();
                // 科目模糊比對
                let isMatch = (tSubject.includes(subject) || subject.includes(tSubject));
                if (!isMatch) return;

                const itemTags = normalizeTags(t.tags || t.meta || []);
                let score = 0;
                if (requestTags.length === 0) score = 1;
                else {
                    const hitCount = requestTags.filter(rt => itemTags.includes(rt)).length;
                    if (hitCount > 0) score = 10 + hitCount;
                }

                if (score > 0) {
                    candidates.push({
                        tid: tid,
                        score: score + Math.random(),
                        isGroup: (t.type === "group"),
                        rawData: t
                    });
                }
            });
        });

        candidates.sort((a, b) => b.score - a.score);
        const selected = candidates.slice(0, config.total || 10);

        return selected.map(c => {
            const t = c.rawData;
            if (c.isGroup) {
                // --- 題組處理邏輯 ---
                return {
                    type: 'group',
                    context: t.context, // 保留您的 HTML 區塊
                    concept: t.concept || "閱讀題組",
                    questions: t.questions.map(subQ => {
                        // 1. 合併正確答案 a 與 錯誤選項 o
                        // 2. 打散選項
                        const shuffledOptions = [subQ.a, ...subQ.o].shuffle();
                        return {
                            question: subQ.q,
                            options: shuffledOptions,
                            // 3. 找出正確答案在打散後的位置 (這才是 exam.html 要的 answer)
                            answer: shuffledOptions.indexOf(subQ.a),
                            concept: subQ.t ? subQ.t[0] : "子題目",
                            image: subQ.image || null
                        };
                    })
                };
            } else {
                // --- 單題處理邏輯 (呼叫 func) ---
                const data = t.func();
                return {
                    type: 'normal',
                    question: data.question,
                    options: data.options,
                    answer: data.answer,
                    concept: (t.tags && t.tags[0]) || "一般題型",
                    image: data.image || null
                };
            }
        });
    }

    global.generatePaper = generatePaper;
    console.log("✅ Paper Generator V11.5 已針對自定義格式優化完成");

})(window);
