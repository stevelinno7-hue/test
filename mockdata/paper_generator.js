(function(global){
    'use strict';

    // 擴充 Array 方法
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
        const G = global.RigorousGenerator || (window.global && window.global.RigorousGenerator);
        
        // 防呆：如果引擎缺件
        if (!G) { console.error("Engine missing"); return []; }
        if (typeof G.getTemplateIds !== 'function') {
            if (G._templates) {
                G.getTemplateIds = () => Object.keys(G._templates); 
            } else {
                console.error("G.getTemplateIds missing"); return [];
            }
        }

        const subject = config.subject || 'math';
        const total = config.total || 10;
        const requestTags = Array.isArray(config.tags) ? config.tags : [config.tags];
        const allTemplateIds = G.getTemplateIds();

        const allGrades = ["國七", "國八", "國九", "高一", "高二", "高三", "七年級", "八年級", "九年級"];
        const requestedGrades = requestTags.filter(t => allGrades.includes(t));
        const forbiddenTags = requestedGrades.length > 0 
            ? allGrades.filter(g => !requestedGrades.includes(g)) 
            : [];

        console.log(`🔒 [PaperGen] 鎖定 -> 科目:[${subject}] | 標籤:[${requestTags}]`);

        // ★★★ 偵錯：印出第一筆模板的結構，確認標籤存在哪裡 ★★★
        if (allTemplateIds.length > 0) {
            const firstT = G._templates[allTemplateIds[0]];
            // console.log("🔍 模板結構檢查:", firstT); // 若有需要可解除註解
        }

        // 1. 篩選符合條件的模板
        let validTemplates = allTemplateIds.filter(tid => {
            const t = G._templates[tid];
            // ★★★ 關鍵修正：同時讀取 tags 和 meta，確保不漏接 ★★★
            const meta = t.tags || t.meta || [];
            
            // A. 科目檢查 (寬鬆匹配)
            const subjectMatch = meta.some(tag => tag === subject || tag.includes(subject));
            if (!subjectMatch) return false;

            // B. 嚴格年級過濾
            const hasForbiddenGrade = meta.some(tag => forbiddenTags.includes(tag));
            if (hasForbiddenGrade) return false;

            // C. 標籤加分
            let score = 0;
            requestTags.forEach(reqTag => { 
                if (meta.includes(reqTag)) score++; 
            });
            G._templates[tid]._tempScore = score;

            // 必須命中除了科目以外的至少一個標籤 (除非請求只包含科目)
            if (requestTags.length > 1 && score <= 1) return false; 

            return true;
        });

        // 2. 排序
        validTemplates.sort((a, b) => G._templates[b]._tempScore - G._templates[a]._tempScore);

        // 3. 備案模式
        if (validTemplates.length === 0) {
            console.warn("⚠️ 找不到精確匹配的模板，嘗試強力放寬條件...");
            
            validTemplates = allTemplateIds.filter(tid => {
                const t = G._templates[tid];
                // ★★★ 這裡也要修正：同時讀取 tags 和 meta ★★★
                const meta = t.tags || t.meta || [];
                
                const isSubject = meta.includes(subject);
                const isForbidden = meta.some(tag => forbiddenTags.includes(tag));
                return isSubject && !isForbidden;
            });
        }

        console.log(`📊 最終可用模板數: ${validTemplates.length} (將重複使用以產生 ${total} 題)`);

        // 4. 生成題目
        const paper = [];
        validTemplates.shuffle();
        let count = 0;
        
        while(count < total && validTemplates.length > 0) {
            const tid = validTemplates[count % validTemplates.length];
            try {
                const q = G.generateQuestion(tid, { tags: requestTags });
                if (q) { 
                    paper.push(q); 
                    count++; 
                }
            } catch (e) {
                console.error(`Error generating ${tid}:`, e);
                validTemplates = validTemplates.filter(t => t !== tid);
            }
        }

        return paper;
    }

    window.generatePaper = generatePaper;
    console.log("✅ Paper Generator v6.1 (Tags Compatibility) 已就緒");

})(window);
