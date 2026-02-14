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
        const totalTarget = config.total || 10; 
        
        // 科目對照表 (確保網址參數能對應到 Repo 內的 subject 欄位)
        const subjectAlias = {
            'science': 'physics', '理化': 'physics', '物理': 'physics', '化學': 'chemistry',
            'social': 'history', '歷史': 'history', 'history': 'history',
            '地科': 'earth_science', '地球科學': 'earth_science', 'biology': 'biology'
        };
        const mappedSub = subjectAlias[inputSub] || inputSub;

        // 準備分類池 (僅存放符合篩選條件的題目)
        let groupPool = [];  
        let normalPool = []; 

        const repos = [
            window.__MATH_REPO__, window.__PHYSICS_REPO__, window.__CHEMISTRY_REPO__,
            window.__BIOLOGY_REPO__, window.__EARTH_SCI_REPO__, window.__CHINESE_REPO__,
            window.__ENGLISH_REPO__, window.__HISTORY_REPO__, window.__CIVICS_REPO__, window.__GEOGRAPHY_REPO__
        ].filter(Boolean);

        // --- 核心篩選邏輯 ---
        repos.forEach(repo => {
            Object.keys(repo).forEach(tid => {
                const t = repo[tid];
                if (!t) return;

                const tSub = String(t.subject || "").toLowerCase();
                // 第一關：科目匹配
                let isMatch = (tSub === inputSub || tSub === mappedSub || tSub.includes(inputSub));
                if (!isMatch) return;

                // 第二關：標籤匹配 (嚴格區域鎖定)
                const itemTags = normalizeTags(t.tags || t.meta || []);
                let score = 0;
                if (requestTags.length === 0) {
                    score = 1; // 若沒選標籤，則包含該科目所有題目
                } else {
                    // 必須「命中」使用者要求的標籤之一
                    const hitCount = requestTags.filter(rt => itemTags.includes(rt)).length;
                    if (hitCount > 0) score = 10 + hitCount;
                }

                // 只有符合條件 (score > 0) 的題目才會進池子
                if (score > 0) {
                    const candidate = { tid, score: score + Math.random(), rawData: t };
                    if (t.type === 'group' || (t.questions && Array.isArray(t.questions))) {
                        groupPool.push(candidate);
                    } else {
                        normalPool.push(candidate);
                    }
                }
            });
        });

        // --- 比例與取題邏輯 ---
        // 1:2 比例計算
        let groupTarget = Math.floor(totalTarget / 3);
        let normalTarget = totalTarget - groupTarget;

        // 排序候選池
        groupPool.sort((a, b) => b.score - a.score);
        normalPool.sort((a, b) => b.score - a.score);

        // 💡 關鍵：嚴格取題，不足額不補位 (No Fallback)
        // 僅從符合該標籤池中選取，若池子只有 1 題，selected 就只有 1 題
        let selectedGroups = groupPool.slice(0, groupTarget);
        let selectedNormals = normalPool.slice(0, normalTarget);

        // 合併結果並打亂順序
        const finalSelection = [...selectedGroups, ...selectedNormals].shuffle();

        console.log(`🎯 嚴格篩選: 題組 ${selectedGroups.length} 題, 單題 ${selectedNormals.length} 題 (不符區域題目已排除)`);

        if (finalSelection.length === 0) {
            console.error("❌ 該範圍內找不到符合標籤的題目！");
            return [];
        }

        // --- 格式化渲染輸出 ---
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
    console.log("✅ Paper Generator V14.0 (嚴格區域鎖定 & 1:2 題組版) 已就緒");

})(window);
