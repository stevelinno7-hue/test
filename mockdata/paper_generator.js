(function(global){
    'use strict';

    // ------------------------------------------------------------------
    //  Paper Generator V6.4 (Singleton Lock)
    //  專注於單一可信賴的引擎來源 (RigorousGenerator)
    // ------------------------------------------------------------------

    // 擴充 Array 方法 (洗牌)
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
        // ★ V6.4 關鍵：只相信 RigorousGenerator
        // 因為 Chinese V7.7 已經保證會建立這個物件
        const G = window.RigorousGenerator || global.RigorousGenerator;
        
        if (!G) { 
            console.error("❌ [PaperGen] 嚴重錯誤：找不到 window.RigorousGenerator！請檢查 mockdata 載入順序。"); 
            return []; 
        }
        
        // 確保能取得 ID 列表
        if (typeof G.getTemplateIds !== 'function') {
            if (G._templates) {
                G.getTemplateIds = () => Object.keys(G._templates); 
            } else {
                console.error("❌ [PaperGen] 引擎結構損毀 (缺少 _templates)"); 
                return [];
            }
        }

        // 參數正規化
        const subject = (config.subject || 'math').toLowerCase();
        const requestTags = (Array.isArray(config.tags) ? config.tags : [config.tags])
                            .map(t => String(t).toLowerCase());
        
        const allTemplateIds = G.getTemplateIds();

        console.log(`🔒 [PaperGen V6.4] 請求 -> 科目:[${subject}] | 標籤:[${requestTags}]`);
        console.log(`📚 引擎內總模板數: ${allTemplateIds.length}`); // 這裡如果不為 0，就成功了！

        // 1. 篩選邏輯 (V6.3 的 ID 混合檢索策略)
        const idMap = { 'chinese': ['chi_', 'chinese', '國文', '語文'] }; // 簡化版
        const subjectKeywords = idMap[subject] || [subject];

        let validTemplates = allTemplateIds.filter(tid => {
            const t = G._templates[tid];
            const tidLower = tid.toLowerCase();

            // 抓取屬性
            const rawTags = t.tags || t.meta || (t.func && t.func.tags) || [];
            const injectedSubject = t.subject || (t.func && t.func.subject) || "";
            
            const metaPool = (Array.isArray(rawTags) ? rawTags : [rawTags])
                             .concat([injectedSubject])
                             .map(x => String(x).toLowerCase());

            // A. 科目判定 (Meta 或 ID)
            const metaSubjectMatch = metaPool.some(tag => tag === subject || tag.includes(subject));
            const idSubjectMatch = subjectKeywords.some(kw => tidLower.includes(kw));
            
            if (!metaSubjectMatch && !idSubjectMatch) return false;

            // B. 標籤判定
            let score = 0;
            requestTags.forEach(reqTag => {
                if (metaPool.includes(reqTag)) score++;
                if (tidLower.includes(reqTag)) score++;
            });

            t._tempScore = score;
            if (requestTags.length > 1 && score === 0) return false;

            return true;
        });

        // 2. 排序
        validTemplates.sort((a, b) => G._templates[b]._tempScore - G._templates[a]._tempScore);

        console.log(`📊 匹配結果: ${validTemplates.length} 題`);

        // 3. 生成題目
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
                const q = G.generateQuestion(tid, { tags: requestTags });
                if (q) { paper.push(q); count++; }
            } catch (e) {
                console.warn(`[Skip] ${tid} error:`, e.message);
            }
        }

        return paper;
    }

    window.generatePaper = generatePaper;
    console.log("✅ Paper Generator V6.4 (Singleton Lock) 已就緒");

})(window);
