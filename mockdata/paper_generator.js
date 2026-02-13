(function(global){
    'use strict';

    // 1. 基礎工具：洗牌
    if (!Array.prototype.shuffle) {
        Array.prototype.shuffle = function() {
            for (let i = this.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this[i], this[j]] = [this[j], this[i]];
            }
            return this;
        };
    }

    // 2. 標籤清洗與同義詞擴充 (確保國九/九年級/Grade9 互通)
    function normalizeTags(raw) {
        if (!raw) return [];
        let tags = Array.isArray(raw) ? raw : String(raw).split(/[,，\s]+/).filter(Boolean);
        tags = tags.map(t => String(t).trim().toLowerCase());

        const expanded = new Set();
        const map = {
            '國七': ['國七', '七年級', 'grade7', 'j1'],
            '國八': ['國八', '八年級', 'grade8', 'j2'],
            '國九': ['國九', '九年級', 'grade9', 'j3'],
            '高一': ['高一', '十年級', 'grade10', 's1'],
            '高二': ['高二', '十一年級', 'grade11', 's2'],
            '高三': ['高三', '十二年級', 'grade12', 's3']
        };

        tags.forEach(t => {
            expanded.add(t);
            for (let key in map) {
                if (map[key].includes(t)) map[key].forEach(val => expanded.add(val));
            }
        });
        return [...expanded];
    }

    // 3. 出題核心
    function generatePaper(config) {
        const targetSubject = (config.subject || 'math').toLowerCase();
        const requestTags = normalizeTags(config.tags || []);
        
        // 蒐集所有全域題庫
        const repos = [
            window.__MATH_REPO__, window.__EARTH_SCI_REPO__, window.__PHYSICS_REPO__,
            window.__BIOLOGY_REPO__, window.__CHEMISTRY_REPO__, window.__HISTORY_REPO__
        ].filter(Boolean);

        let candidates = [];

        repos.forEach(repo => {
            Object.values(repo).forEach(item => {
                const itemSubject = String(item.subject || "").toLowerCase();
                const itemTags = normalizeTags(item.tags || item.meta || []);
                
                // 科目比對 (支援 science 包含理化地科)
                let isMatch = (itemSubject === targetSubject);
                if (targetSubject === 'science' && ['physics','chemistry','earth_science','理化','地科'].includes(itemSubject)) {
                    isMatch = true;
                }

                if (!isMatch) return;

                // 評分邏輯
                let score = 0;
                if (requestTags.length === 0) {
                    score = 1; // 沒設標籤就隨機取
                } else {
                    const hits = requestTags.filter(rt => itemTags.includes(rt)).length;
                    if (hits > 0) score = 10 + hits;
                }

                if (score > 0) {
                    candidates.push({ ...item, _score: score + Math.random() });
                }
            });
        });

        // 排序並取題
        candidates.sort((a, b) => b._score - a._score);
        const selected = candidates.slice(0, config.total || 10);

        // --- 重要：格式化輸出以符合 exam.html 的資料格式 ---
        return selected.map(item => {
            if (item.type === 'group') {
                // 回傳題組格式，exam.html 的 flattenExamData 會負責拆解它
                return {
                    type: 'group',
                    context: item.context,
                    concept: item.concept || "綜合題組",
                    questions: item.questions.map(q => ({
                        question: q.q,
                        options: [q.a, ...q.o].shuffle(),
                        answerKey: q.a, // 暫存正確文字，供後續 indexOf 計算
                        concept: q.concept || item.concept,
                        image: q.image || null
                    }))
                };
            } else {
                // 單題：直接執行 func() 取得題目內容
                const data = item.func();
                return {
                    type: 'normal',
                    question: data.question,
                    options: data.options,
                    answer: data.answer,
                    concept: itemTags[0] || "一般題型",
                    image: data.image || null
                };
            }
        });
    }

    window.generatePaper = generatePaper;
    console.log("🚀 Paper Generator V11.1 已就緒 (完全適配 exam.html)");
})(window);
