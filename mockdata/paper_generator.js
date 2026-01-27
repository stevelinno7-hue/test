(function(global){
    'use strict';

    // ------------------------------------------------------------------
    //  Paper Generator V9.9.3 (Random Shuffle Fix)
    //  修正：加入隨機權重，解決「分數相同時只出第一單元」的問題
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
            G = window.RigorousGenerator = { 
                _templates: {}, 
                registerTemplate: function(id, f, t){ 
                    this._templates[id] = {func:f, tags:t, subject: f.subject || 'misc'}; 
                } 
            };
        }
        if (!G.getTemplateIds) G.getTemplateIds = () => Object.keys(G._templates || {});

        const subject = (config.subject || 'math').toLowerCase();
        
        // 1. 全面掃描避難所
        const repoMap = [
            { name: 'chinese',   repo: window.__CHINESE_REPO__ },
            { name: 'math',      repo: window.__MATH_REPO__ },
            { name: 'english',   repo: window.__ENGLISH_REPO__ },
            { name: 'physics',   repo: window.__PHYSICS_REPO__ },
            { name: 'chemistry', repo: window.__CHEMISTRY_REPO__ },
            { 
                name: 'science', 
                repo: { 
                    ...(window.__PHYSICS_REPO__ || {}), 
                    ...(window.__CHEMISTRY_REPO__ || {}) 
                } 
            },
            { name: 'biology',   repo: window.__BIOLOGY_REPO__ },
            { name: 'history',   repo: window.__HISTORY_REPO__ },
            { name: 'geography', repo: window.__GEOGRAPHY_REPO__ },
            { name: 'earth',     repo: window.__EARTH_SCI_REPO__ },
            { name: 'civics',    repo: window.__CIVICS_REPO__ }
        ];

        repoMap.forEach(item => {
            if (item.repo) {
                const repoIds = Object.keys(item.repo);
                let restored = 0;
                repoIds.forEach(id => {
                    if (!G._templates[id]) {
                        const data = item.repo[id];
                        G._templates[id] = {
                            func: data.func,
                            tags: data.tags || [],
                            meta: data.tags || [],
                            subject: data.subject || item.name
                        };
                        restored++;
                    }
                });
                if(restored > 0 && item.name !== 'science') {
                    // console.log(`🚑 [Gen V9.9] 從 ${item.name} 還原 ${restored} 題`);
                }
            }
        });

        // 2. 關鍵字映射
        const idMap = {
            'chinese':   ['chi_', 'chinese', '國文'],
            'math':      ['math', 'alg', 'geo_', '數學'],
            'english':   ['eng', 'gram', 'vocab', '英文'],
            'physics':   ['phy', '物理', '理化'],
            'chemistry': ['chem', '化學', '理化'],
            'science':   ['phy', 'chem', '理化', '物理', '化學'],
            'biology':   ['bio', '生物'],
            'earth':     ['earth', '地科'],
            'history':   ['his', 'hist', '歷史'],
            'geography': ['geo_', 'geography', '地理'], 
            'civics':    ['civ', 'civics', '公民', '社會']
        };

        let subjectKeywords = idMap[subject] || [subject];
        if (subject === 'math') {
            subjectKeywords = subjectKeywords.filter(k => k !== 'geo_');
        }

        const requestTags = (Array.isArray(config.tags) ? config.tags : [config.tags])
                                    .map(t => String(t).toLowerCase());
        const allTemplateIds = G.getTemplateIds();

        console.log(`🔒 [Gen V9.9.3] 請求: 科目[${subject}] 標籤[${requestTags}]`);

        // 3. 篩選邏輯 (分數制 + 隨機擾動)
        let candidates = [];

        allTemplateIds.forEach(tid => {
            const t = G._templates[tid];
            if (!t) return;

            const tidLower = tid.toLowerCase();
            const rawTags = t.tags || t.meta || (t.func && t.func.tags) || [];
            const tSubject = (t.subject || (t.func && t.func.subject) || "").toLowerCase();
            
            const metaPool = (Array.isArray(rawTags) ? rawTags : [rawTags])
                             .concat([tSubject])
                             .map(x => String(x).toLowerCase());

            let score = 0;

            // 科目絕對過濾
            let isSubjectAllowed = false;
            if (subject === 'science') {
                if (tSubject === 'physics' || tSubject === 'chemistry' || tSubject === 'science') isSubjectAllowed = true;
            } else if (subject === 'earth') {
                 if (tSubject === 'earth' || tSubject === 'earth_science') isSubjectAllowed = true;
            } else {
                if (!tSubject || tSubject === 'misc' || tSubject === subject) isSubjectAllowed = true;
            }

            if (!isSubjectAllowed) return;

            // 分數計算
            const isIdMatch = subjectKeywords.some(kw => tidLower.includes(kw));
            if (isIdMatch) score += 1;

            requestTags.forEach(reqTag => {
                if (metaPool.some(mt => mt.includes(reqTag) || reqTag.includes(mt))) {
                    score += 10;
                }
            });

            // ★★★ 關鍵修正：加入隨機小數，打破同分僵局 ★★★
            // 這樣即使所有題目都是 1 分，也會因為隨機小數而重新洗牌
            score += Math.random(); 

            if (score > 0 || isSubjectAllowed) {
                candidates.push({ tid: tid, score: score });
            }
        });

        // 依照分數排序 (這時已經包含了隨機性)
        candidates.sort((a, b) => b.score - a.score);

        // 4. 強制保底 (Fallback)
        if (candidates.length === 0) {
            console.warn(`⚠️ [Gen V9.9] 標籤篩選結果為 0！啟動「同科目強制保底」...`);
            allTemplateIds.forEach(tid => {
                const t = G._templates[tid];
                const tSub = (t.subject || "").toLowerCase();
                
                let isMatch = (tSub === subject);
                if (subject === 'science') {
                    if (tSub === 'physics' || tSub === 'chemistry') isMatch = true;
                }
                if (subject === 'earth' && tSub === 'earth_science') isMatch = true;

                if (isMatch) {
                    // 保底也要隨機排序
                    candidates.push({ tid: tid, score: Math.random() });
                }
            });
            candidates.sort((a, b) => b.score - a.score);
        }

        console.log(`📊 最終候選: ${candidates.length} 題 (已隨機打亂)`);

        // 5. 生成考卷
        const paper = [];
        const total = config.total || 10;
        let count = 0;
        
        for (let i = 0; i < candidates.length && count < total; i++) {
            const tid = candidates[i].tid;
            try {
                let q = null;
                if (typeof G.generateQuestion === 'function') {
                    q = G.generateQuestion(tid, { tags: requestTags });
                } else {
                    const tmpl = G._templates[tid];
                    if (tmpl && tmpl.func) q = tmpl.func({}, Math.random);
                }
                if (q) { paper.push(q); count++; }
            } catch (e) {
                console.warn(`[Skip] ${tid} error:`, e);
            }
        }

        return paper;
    }

    window.generatePaper = generatePaper;
    console.log("✅ Paper Generator V9.9.3 (Shuffle Fix) 已修復同分題目排序問題");

})(window);
