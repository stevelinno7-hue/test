(function(global){
    'use strict';

    // ==============================
    // Paper Generator V11.2 (Exam.html Adapter)
    // 支援：題組保持完整、年級同義詞、多 repo 檢索
    // ==============================

    if (!Array.prototype.shuffle) {
        Array.prototype.shuffle = function() {
            for (let i = this.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this[i], this[j]] = [this[j], this[i]];
            }
            return this;
        };
    }

    // ===== 標籤清洗與同義詞擴充 =====
    function normalizeTags(raw) {
        if (!raw) return [];
        let tags = Array.isArray(raw) ? raw : String(raw).split(/[,，\s]+/).filter(Boolean);
        tags = tags.map(t => String(t).trim().toLowerCase());

        const expanded = new Set();
        const synonymMap = {
            '國七': ['國七', '七年級', 'grade7', 'j1'],
            '國八': ['國八', '八年級', 'grade8', 'j2'],
            '國九': ['國九', '九年級', 'grade9', 'j3'],
            '高一': ['高一', '十年級', 'grade10', 's1'],
            '高二': ['高二', '十一年級', 'grade11', 's2'],
            '高三': ['高三', '十二年級', 'grade12', 's3'],
            'junior': ['junior_high', '國中', 'junior', '国中'],
            'senior': ['high_school', 'senior_high', '高中', 'senior']
        };

        tags.forEach(t => {
            expanded.add(t);
            for (let key in synonymMap) {
                if (synonymMap[key].includes(t)) {
                    synonymMap[key].forEach(val => expanded.add(val));
                    // 國中/高中大範圍擴充
                    if (key === 'junior') ['國七','國八','國九'].forEach(g => expanded.add(g));
                    if (key === 'senior') ['高一','高二','高三'].forEach(g => expanded.add(g));
                }
            }
        });
        return [...expanded];
    }

    // ===== 出題核心 =====
    function generatePaper(config) {
        const subject = (config.subject || 'math').toLowerCase();
        const requestTags = normalizeTags(config.tags || []);
        
        const repos = [
            window.__MATH_REPO__, window.__PHYSICS_REPO__, window.__CHEMISTRY_REPO__,
            window.__BIOLOGY_REPO__, window.__EARTH_SCI_REPO__, window.__CHINESE_REPO__,
            window.__ENGLISH_REPO__, window.__HISTORY_REPO__, window.__CIVICS_REPO__, window.__GEOGRAPHY_REPO__
        ].filter(Boolean);

        let candidates = [];
        let debugTagPool = new Set();

        repos.forEach(repo => {
            Object.keys(repo).forEach(tid => {
                const t = repo[tid];
                if (!t) return;

                const tSubject = String(t.subject || "").toLowerCase().trim();
                const sciencePool = ['physics', 'chemistry', 'science', '理化', '物理', '化學', '自然', 'earth_science', '地科'];
                
                // 1. 科目比對邏輯
                let isMatch = (tSubject.includes(subject) || subject.includes(tSubject));
                if (subject === 'science' && sciencePool.some(s => tSubject.includes(s))) isMatch = true;
                
                if (!isMatch) return;

                // 2. 標籤與評分
                const itemTags = normalizeTags(t.tags || t.meta || []);
                itemTags.forEach(mt => debugTagPool.add(mt));

                let score = 0;
                if (requestTags.length === 0) {
                    score = 1;
                } else {
                    const hitCount = requestTags.filter(rt => itemTags.includes(rt)).length;
                    if (hitCount > 0) score = 10 + hitCount;
                }

                // 3. 收集候選 (區分單題與題組)
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

        // 排序
        candidates.sort((a, b) => b.score - a.score);
        const selected = candidates.slice(0, config.total || 10);

        // 4. 格式化輸出 (適配 exam.html 的平坦化函數)
        return selected.map(c => {
            const t = c.rawData;
            if (c.isGroup) {
                return {
                    type: 'group',
                    context: t.context,
                    concept: t.concept || "綜合題組",
                    questions: t.questions.map(q => ({
                        question: q.q,
                        options: [q.a, ...q.o].shuffle(),
                        answerKey: q.a, // 這裡存正確答案文字，讓 HTML 端去 indexOf
                        concept: q.t ? q.t[0] : (t.concept || "題組題"),
                        image: q.image || null
                    }))
                };
            } else {
                // 單題，直接執行 func() 並確保格式一致
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
    console.log("✅ Paper Generator V11.2 載入成功 (支援題組完整輸出)");

})(window);
