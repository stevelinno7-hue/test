(function(global){
    'use strict';

    // ------------------------------------------------------------------
    //  Paper Generator V6.6 (Universal Omni-Loader)
    //  支援全科目避難所還原：Math, English, Science, Chinese
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
        // 1. 取得或建立主引擎
        let G = window.RigorousGenerator || global.RigorousGenerator;
        if (!G) {
            console.warn("⚠️ [PaperGen] 引擎主體遺失，執行緊急重建...");
            G = window.RigorousGenerator = { 
                _templates: {}, 
                registerTemplate: function(id, f, t){ 
                    this._templates[id] = {func:f, tags:t, subject: f.subject || 'misc'}; 
                } 
            };
        }
        if (!G.getTemplateIds) G.getTemplateIds = () => Object.keys(G._templates || {});

        const subject = (config.subject || 'math').toLowerCase();
        
        // ============================================================
        // ★ V6.6 核心升級：通用避難所掃描 (Universal Repo Scan)
        // ============================================================
        const repoMap = [
            { name: 'chinese', repo: window.__CHINESE_REPO__ },
            { name: 'math',    repo: window.__MATH_REPO__ },
            { name: 'english', repo: window.__ENGLISH_REPO__ },
            { name: 'physics', repo: window.__PHYSICS_REPO__ },
            { name: 'chemistry', repo: window.__CHEMISTRY_REPO__ },
            { name: 'biology', repo: window.__BIOLOGY_REPO__ },
            { name: 'history', repo: window.__HISTORY_REPO__ },
            { name: 'geography', repo: window.__GEOGRAPHY_REPO__ },
            { name: 'civics', repo: window.__CIVICS_REPO__ }
            
            
        ];

        repoMap.forEach(item => {
            if (item.repo) {
                const repoIds = Object.keys(item.repo);
                const currentIds = G.getTemplateIds();
                
                // 檢查是否需要還原 (簡單檢查：如果引擎裡找不到該科目的 ID)
                // 這裡採用更積極的策略：只要避難所有，就確保引擎裡也有
                let restoredCount = 0;
                repoIds.forEach(id => {
                    if (!G._templates[id]) {
                        const data = item.repo[id];
                        G._templates[id] = {
                            func: data.func,
                            tags: data.tags,
                            meta: data.tags,
                            subject: data.subject || item.name
                        };
                        restoredCount++;
                    }
                });
                
                if (restoredCount > 0) {
                    console.log(`🚑 [PaperGen] 已從 ${item.name} 避難所還原 ${restoredCount} 題。`);
                }
            }
        });
        // ============================================================

        const requestTags = (Array.isArray(config.tags) ? config.tags : [config.tags])
                            .map(t => String(t).toLowerCase());
        const allTemplateIds = G.getTemplateIds();

        console.log(`🔒 [PaperGen V6.6] 請求 -> 科目:[${subject}] | 標籤:[${requestTags}]`);
        console.log(`📚 引擎內總模板數: ${allTemplateIds.length}`); 

        // 搜尋關鍵字對映
        const idMap = {
            'chinese': ['chi_', 'chinese', '國文'],
            'math': ['math', 'alg', 'geo', '數學'],
            'english': ['eng', 'gram', 'vocab', '英文'],
            'physics': ['phy', '物理'],
            'chemistry': ['chem', '化學'],
            'biology': ['bio', '生物'],
            'history': ['his', '歷史']
        };
        const subjectKeywords = idMap[subject] || [subject];

        // 篩選邏輯
        let validTemplates = allTemplateIds.filter(tid => {
            const t = G._templates[tid];
            if (!t) return false;

            const tidLower = tid.toLowerCase();
            const rawTags = t.tags || t.meta || (t.func && t.func.tags) || [];
            const injectedSubject = t.subject || (t.func && t.func.subject) || "";
            
            const metaPool = (Array.isArray(rawTags) ? rawTags : [rawTags])
                             .concat([injectedSubject])
                             .map(x => String(x).toLowerCase());

            // A. 科目匹配 (Meta 或 ID)
            const isSubjectMeta = metaPool.some(tag => tag === subject || tag.includes(subject));
            const isSubjectID = subjectKeywords.some(kw => tidLower.includes(kw));
            
            if (!isSubjectMeta && !isSubjectID) return false;

            // B. 標籤匹配
            let score = 0;
            requestTags.forEach(reqTag => {
                if (metaPool.includes(reqTag)) score++;
                if (tidLower.includes(reqTag)) score++;
            });
            t._tempScore = score;

            if (requestTags.length > 1 && score === 0) return false;
            return true;
        });

        validTemplates.sort((a, b) => G._templates[b]._tempScore - G._templates[a]._tempScore);
        console.log(`📊 匹配結果: ${validTemplates.length} 題`);

        const paper = [];
        const total = config.total || 10;
        validTemplates.shuffle();
        let count = 0;
        let attempts = 0;
        const maxAttempts = total * 4; // 增加嘗試次數

        while(count < total && validTemplates.length > 0 && attempts < maxAttempts) {
            const tid = validTemplates[count % validTemplates.length];
            attempts++;
            try {
                let q = null;
                // 優先使用標準接口
                if (typeof G.generateQuestion === 'function') {
                    q = G.generateQuestion(tid, { tags: requestTags });
                } else {
                    // 降級直接呼叫
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
    console.log("✅ Paper Generator V6.6 (Universal Omni-Loader) 已就緒");

})(window);
