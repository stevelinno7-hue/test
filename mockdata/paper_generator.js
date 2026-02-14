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
        const totalTarget = config.total || 10; // 總題數
        
        // 科目對照表
        const subjectAlias = {
            'science': 'physics', '理化': 'physics', '物理': 'physics', '化學': 'chemistry',
            'social': 'history', '歷史': 'history', 'history': 'history',
            '地科': 'earth_science', '地球科學': 'earth_science', 'biology': 'biology'
        };
        const mappedSub = subjectAlias[inputSub] || inputSub;

        // 準備分類池
        let groupPool = [];  // 題組池
        let normalPool = []; // 單題池

        const repos = [
            window.__MATH_REPO__, window.__PHYSICS_REPO__, window.__CHEMISTRY_REPO__,
            window.__BIOLOGY_REPO__, window.__EARTH_SCI_REPO__, window.__CHINESE_REPO__,
            window.__ENGLISH_REPO__, window.__HISTORY_REPO__, window.__CIVICS_REPO__, window.__GEOGRAPHY_REPO__
        ].filter(Boolean);

        repos.forEach(repo => {
            Object.keys(repo).forEach(tid => {
                const t = repo[tid];
                if (!t) return;

                const tSub = String(t.subject || "").toLowerCase();
                let isMatch = (tSub === inputSub || tSub === mappedSub || tSub.includes(inputSub));
                if (!isMatch) return;

                const itemTags = normalizeTags(t.tags || t.meta || []);
                let score = 0;
                if (requestTags.length === 0) {
                    score = 1;
                } else {
                    const hitCount = requestTags.filter(rt => itemTags.includes(rt)).length;
                    if (hitCount > 0) score = 10 + hitCount;
                }

                if (score > 0) {
                    const candidate = { tid, score: score + Math.random(), rawData: t };
                    // 💡 判斷是否為題組並分池
                    if (t.type === 'group' || (t.questions && Array.isArray(t.questions))) {
                        groupPool.push(candidate);
                    } else {
                        normalPool.push(candidate);
                    }
                }
            });
        });

        // 4. 計算 1:2 比例
        // 題組數 = 總數 / 3 (無條件捨去)，剩餘為單題
        let groupTarget = Math.floor(totalTarget / 3);
        let normalTarget = totalTarget - groupTarget;

        // 排序
        groupPool.sort((a, b) => b.score - a.score);
        normalPool.sort((a, b) => b.score - a.score);

        // 取題 (如果題組不夠，會由單題補足)
        let selectedGroups = groupPool.slice(0, groupTarget);
        let selectedNormals = normalPool.slice(0, normalTarget);

        // 補全機制：如果題組不夠 1/3，多抓單題補滿總題數
        if (selectedGroups.length < groupTarget) {
            const diff = groupTarget - selectedGroups.length;
            selectedNormals = normalPool.slice(0, normalTarget + diff);
        }

        // 合併並隨機打亂考卷順序
        const finalSelection = [...selectedGroups, ...selectedNormals].shuffle();

        if (finalSelection.length === 0) {
            console.error("❌ 找不到題目！");
            return [];
        }

        // 5. 格式化輸出
        return finalSelection.map(c => {
            const t = c.rawData;
            const isGroup = (t.type === 'group' || t.questions);

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
                let data;
                if (typeof t.func === 'function') {
                    data = t.func();
                } else {
                    const opts = [t.a, ...(t.o || [])].shuffle();
                    data = { question: t.q, options: opts, answer: opts.indexOf(t.a) };
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
    console.log("✅ Paper Generator V13.0 (1:2 題組比例版) 已就緒");

})(window);
