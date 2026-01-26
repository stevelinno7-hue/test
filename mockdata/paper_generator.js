(function(global){
    'use strict';

    // ------------------------------------------------------------------
    //  Paper Generator V6.5 (Repo Loader)
    //  支援從 __CHINESE_REPO__ 強制還原資料
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
        // 1. 取得或建立引擎
        let G = window.RigorousGenerator || global.RigorousGenerator;
        if (!G) {
            console.warn("⚠️ 引擎遺失，正在重建...");
            G = window.RigorousGenerator = { _templates: {}, registerTemplate: function(id, f, t){ this._templates[id] = {func:f, tags:t, subject: f.subject}; } };
        }
        
        // 確保 getTemplateIds 存在
        if (!G.getTemplateIds) G.getTemplateIds = () => Object.keys(G._templates || {});

        const subject = (config.subject || 'math').toLowerCase();
        
        // ★★★ V6.5 關鍵：檢查避難所並強制注入 ★★★
        if (subject === 'chinese' && window.__CHINESE_REPO__) {
            const currentIds = G.getTemplateIds();
            const repoIds = Object.keys(window.__CHINESE_REPO__);
            
            // 如果引擎裡沒有國文資料，就倒進去
            const hasChinese = currentIds.some(id => id.includes('chi_'));
            
            if (!hasChinese) {
                console.log(`🚑 [PaperGen] 偵測到引擎缺少國文資料，正在從避難所還原 ${repoIds.length} 筆模板...`);
                repoIds.forEach(id => {
                    const item = window.__CHINESE_REPO__[id];
                    // 手動寫入引擎
                    if (!G._templates) G._templates = {};
                    G._templates[id] = {
                        func: item.func,
                        tags: item.tags,
                        meta: item.tags,
                        subject: "chinese"
                    };
                });
            }
        }
        // ★★★ 注入結束 ★★★

        const requestTags = (Array.isArray(config.tags) ? config.tags : [config.tags])
                            .map(t => String(t).toLowerCase());
        const allTemplateIds = G.getTemplateIds();

        console.log(`🔒 [PaperGen V6.5] 請求 -> 科目:[${subject}] | 標籤:[${requestTags}]`);
        console.log(`📚 引擎內總模板數: ${allTemplateIds.length}`); 

        // ID 關鍵字映射
        const idMap = { 'chinese': ['chi_', 'chinese', '國文'] };
        const subjectKeywords = idMap[subject] || [subject];

        // 篩選
        let validTemplates = allTemplateIds.filter(tid => {
            const t = G._templates[tid];
            if (!t) return false; // 防呆

            const tidLower = tid.toLowerCase();
            
            // 屬性讀取
            const rawTags = t.tags || t.meta || (t.func && t.func.tags) || [];
            const injectedSubject = t.subject || (t.func && t.func.subject) || "";
            const metaPool = (Array.isArray(rawTags) ? rawTags : [rawTags])
                             .concat([injectedSubject])
                             .map(x => String(x).toLowerCase());

            // 科目檢查 (ID 或 Meta)
            const isSubjectMeta = metaPool.some(tag => tag === subject || tag.includes(subject));
            const isSubjectID = subjectKeywords.some(kw => tidLower.includes(kw));
            
            if (!isSubjectMeta && !isSubjectID) return false;

            // 標籤檢查
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
        const maxAttempts = total * 3;

        while(count < total && validTemplates.length > 0 && attempts < maxAttempts) {
            const tid = validTemplates[count % validTemplates.length];
            attempts++;
            try {
                // 如果沒有 generateQuestion 方法，手動執行
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
    console.log("✅ Paper Generator V6.5 (Repo Loader) 已就緒");

})(window);
