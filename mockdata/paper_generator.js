(function(global){
    'use strict';

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

    function normalizeTags(raw) {
        if (!raw) return [];
        let tags = Array.isArray(raw) ? raw : String(raw).split(/[,，\s]+/).filter(Boolean);
        return tags.map(t => String(t).trim().toLowerCase());
    }

    function generatePaper(config) {
        const inputSub = (config.subject || '').toLowerCase();
        const requestTags = normalizeTags(config.tags || []);
        const totalTarget = config.total || 10; 
        
        const subjectAlias = {
            'science': 'physics', '理化': 'physics', '物理': 'physics', '化學': 'chemistry',
            'social': 'history', '歷史': 'history', '地科': 'earth_science', 'biology': 'biology'
        };
        const mappedSub = subjectAlias[inputSub] || inputSub;

        let qualifiedPool = []; 

        // 根據科目動態選擇 Repo，避免跨科目亂抓
        const repoMap = {
            'math': window.__MATH_REPO__,
            'physics': window.__PHYSICS_REPO__,
            'chemistry': window.__CHEMISTRY_REPO__,
            'biology': window.__BIOLOGY_REPO__,
            'earth_science': window.__EARTH_SCI_REPO__,
            'chinese': window.__CHINESE_REPO__,
            'english': window.__ENGLISH_REPO__,
            'history': window.__HISTORY_REPO__,
            'civics': window.__CIVICS_REPO__,
            'geography': window.__GEOGRAPHY_REPO__
        };

        // 只檢查目標科目 Repo，徹底防止單元亂跳
        const targetRepo = repoMap[mappedSub];
        if (!targetRepo) {
            console.error(`❌ 找不到科目 Repo: ${mappedSub}`);
            return [];
        }

        // --- 嚴格過濾邏輯 ---
        Object.keys(targetRepo).forEach(tid => {
            const t = targetRepo[tid];
            if (!t) return;

            const itemTags = normalizeTags(t.tags || t.meta || []);
            
            // 💡 關鍵：必須包含「所有」使用者要求的標籤 (AND 邏輯)
            // 這樣就不會因為標籤重疊而抓到隔壁單元的題目
            if (requestTags.length > 0) {
                const isStrictMatch = requestTags.every(rt => itemTags.includes(rt));
                if (!isStrictMatch) return; 
            }

            qualifiedPool.push(t);
        });

        // --- 隨機抽樣 ---
        const finalSelection = qualifiedPool.shuffle().slice(0, totalTarget);

        console.log(`🎯 精確鎖定：單元符合數 ${qualifiedPool.length} 題，隨機抽出 ${finalSelection.length} 題。`);

        if (finalSelection.length === 0) return [];

        return finalSelection.map(t => {
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
    console.log("✅ Paper Generator V17.0 (嚴格標籤交集版) 已就緒");

})(window);
