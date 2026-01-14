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

        // 1. 篩選符合條件的模板
        let validTemplates = allTemplateIds.filter(tid => {
            const meta = G._templates[tid].meta || [];
            
            // A. 科目檢查 (寬鬆匹配)
            const subjectMatch = meta.some(tag => tag === subject || tag.includes(subject));
            if (!subjectMatch) return false;

            // B. 嚴格年級過濾 (絕不跨年級)
            const hasForbiddenGrade = meta.some(tag => forbiddenTags.includes(tag));
            if (hasForbiddenGrade) return false;

            // C. 標籤加分 (必須至少命中一個非科目標籤，除非只求科目)
            let score = 0;
            requestTags.forEach(reqTag => { 
                if (meta.includes(reqTag)) score++; 
            });
            G._templates[tid]._tempScore = score;

            // 如果請求中有指定年級/單元，但模板完全沒命中任何標籤(除了科目)，則剔除
            // 這樣可以避免混入「沒標示年級」的通用舊題目
            if (requestTags.length > 1 && score <= 1) return false; 

            return true;
        });

        // 2. 排序：優先使用命中標籤最多的模板
        validTemplates.sort((a, b) => G._templates[b]._tempScore - G._templates[a]._tempScore);

        // ★★★ 修正點：移除 "validTemplates.length < total" 的檢查 ★★★
        // 只要有找到模板 (哪怕只有 1 個)，就足夠生成無限題目了
        if (validTemplates.length === 0) {
            console.warn("⚠️ 找不到精確匹配的模板，嘗試放寬條件 (只看年級與科目)...");
            
            // 備案：只篩選 科目 + 年級 (忽略單元細節)
            validTemplates = allTemplateIds.filter(tid => {
                const meta = G._templates[tid].meta || [];
                const isSubject = meta.includes(subject);
                const isCorrectGrade = meta.some(tag => requestedGrades.includes(tag));
                return isSubject && isCorrectGrade;
            });
        }

        console.log(`📊 最終可用模板數: ${validTemplates.length}`);

        // 3. 生成題目
        const paper = [];
        validTemplates.shuffle();
        let count = 0;
        
        // 循環取題直到滿額
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
                // 如果這題壞了，就從清單移除，避免卡死
                validTemplates = validTemplates.filter(t => t !== tid);
            }
        }

        return paper;
    }

    window.generatePaper = generatePaper;
    console.log("✅ Paper Generator v6.0 (Logic Fixed) 已就緒");

})(window);
