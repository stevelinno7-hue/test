(function(global){
    'use strict';

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
        // 取得生成引擎實例
        const G = global.RigorousGenerator || (window.global && window.global.RigorousGenerator) || window.GeneratorEngine;
        
        // 防呆：如果引擎缺件
        if (!G) { console.error("❌ Engine missing"); return []; }
        
        // 兼容性修復：確保 getTemplateIds 存在
        if (typeof G.getTemplateIds !== 'function') {
            if (G._templates) {
                G.getTemplateIds = () => Object.keys(G._templates); 
            } else {
                console.error("❌ G.getTemplateIds missing"); return [];
            }
        }

        const subject = (config.subject || 'math').toLowerCase(); // ★ 強制轉小寫
        const total = config.total || 10;
        const requestTags = (Array.isArray(config.tags) ? config.tags : [config.tags])
                            .map(t => String(t).toLowerCase()); // ★ Tag 也轉小寫比對
        const allTemplateIds = G.getTemplateIds();

        // 年級黑名單邏輯
        const allGrades = ["國七", "國八", "國九", "高一", "高二", "高三", "七年級", "八年級", "九年級"];
        const requestedGrades = requestTags.filter(t => allGrades.includes(t)); // 這裡其實也要考慮原始大小寫，但年級通常是中文
        const forbiddenTags = requestedGrades.length > 0 
            ? allGrades.filter(g => !requestedGrades.includes(g)) 
            : [];

        console.log(`🔒 [PaperGen V6.2] 鎖定 -> 科目:[${subject}] | 標籤:[${config.tags}]`);

        // 1. 篩選符合條件的模板
        let validTemplates = allTemplateIds.filter(tid => {
            const t = G._templates[tid];
            
            // ★★★ V6.2 核心修正：深度屬性掃描 (Deep Property Scan) ★★★
            // 同時讀取 tags, meta, 以及函數本體上的注入屬性 (V7.6 對應)
            const rawTags = t.tags || t.meta || (t.func && t.func.tags) || [];
            const injectedSubject = t.subject || (t.func && t.func.subject) || "";
            
            // 統一轉為小寫字串陣列以供比對
            const searchPool = (Array.isArray(rawTags) ? rawTags : [rawTags])
                               .concat([injectedSubject])
                               .map(x => String(x).toLowerCase());

            // A. 科目檢查 (忽略大小寫 + 模糊匹配)
            // 只要 searchPool 裡有包含 subject 字串 (如 'chinese' in ['chinese', '國七'])
            const subjectMatch = searchPool.some(tag => tag === subject || tag.includes(subject));
            
            if (!subjectMatch) return false;

            // B. 嚴格年級過濾
            const hasForbiddenGrade = searchPool.some(tag => forbiddenTags.includes(tag));
            if (hasForbiddenGrade) return false;

            // C. 標籤加分機制
            let score = 0;
            requestTags.forEach(reqTag => { 
                if (searchPool.includes(reqTag)) score++; 
            });
            t._tempScore = score;

            // 必須命中除了科目以外的至少一個標籤 (除非請求只包含科目)
            // 若請求標籤 > 1 (例如 [chinese, 成語])，但分數 <= 1 (只中 chinese)，則排除
            if (requestTags.length > 1 && score <= 1) return false; 

            return true;
        });

        // 2. 排序 (分數高的優先)
        validTemplates.sort((a, b) => G._templates[b]._tempScore - G._templates[a]._tempScore);

        // 3. 備案模式 (若找不到精確匹配，嘗試放寬)
        if (validTemplates.length === 0) {
            console.warn("⚠️ 找不到精確匹配的模板，嘗試強力放寬條件...");
            
            validTemplates = allTemplateIds.filter(tid => {
                const t = G._templates[tid];
                
                // 重複上面的深度掃描
                const rawTags = t.tags || t.meta || (t.func && t.func.tags) || [];
                const injectedSubject = t.subject || (t.func && t.func.subject) || "";
                
                const searchPool = (Array.isArray(rawTags) ? rawTags : [rawTags])
                                   .concat([injectedSubject])
                                   .map(x => String(x).toLowerCase());
                
                const isSubject = searchPool.includes(subject);
                const isForbidden = searchPool.some(tag => forbiddenTags.includes(tag));
                
                return isSubject && !isForbidden;
            });
        }

        console.log(`📊 最終可用模板數: ${validTemplates.length} (將重複使用以產生 ${total} 題)`);

        // 4. 生成題目
        const paper = [];
        validTemplates.shuffle();
        let count = 0;
        
        // 避免無窮迴圈
        const maxAttempts = total * 2; 
        let attempts = 0;

        while(count < total && validTemplates.length > 0 && attempts < maxAttempts) {
            const tid = validTemplates[count % validTemplates.length];
            attempts++;
            
            try {
                // 傳入原始 requestTags 給 generateQuestion
                const q = G.generateQuestion(tid, { tags: requestTags });
                if (q) { 
                    paper.push(q); 
                    count++; 
                }
            } catch (e) {
                console.error(`Error generating ${tid}:`, e);
                // 出錯的模板移除，避免再次使用
                validTemplates = validTemplates.filter(t => t !== tid);
            }
        }

        return paper;
    }

    window.generatePaper = generatePaper;
    console.log("✅ Paper Generator v6.2 (Deep Scan & Case-Insensitive) 已就緒");

})(window);
