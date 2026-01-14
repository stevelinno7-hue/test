(function(global){
    'use strict';

    // 擴充 Array 方法 (洗牌用)
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
        
        // 確保 getTemplateIds 存在
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

        // 定義年級互斥清單
        const allGrades = ["國七", "國八", "國九", "高一", "高二", "高三", "七年級", "八年級", "九年級"];
        const requestedGrades = requestTags.filter(t => allGrades.includes(t));
        
        // 建立黑名單：如果我選國八，那國七、國九就是黑名單
        const forbiddenTags = requestedGrades.length > 0 
            ? allGrades.filter(g => !requestedGrades.includes(g)) 
            : [];

        console.log(`🔒 [PaperGen] 鎖定 -> 科目:[${subject}] | 標籤:[${requestTags}]`);

        // 1. 篩選符合條件的模板
        let validTemplates = allTemplateIds.filter(tid => {
            const meta = G._templates[tid].meta || [];
            
            // A. 科目檢查 (必須符合)
            const subjectMatch = meta.some(tag => tag === subject || tag.includes(subject));
            if (!subjectMatch) return false;

            // B. 嚴格年級過濾 (絕不跨年級)
            const hasForbiddenGrade = meta.some(tag => forbiddenTags.includes(tag));
            if (hasForbiddenGrade) return false;

            // C. 標籤加分 (必須至少命中一個非科目標籤)
            // 例如：如果是化學，必須命中 "原子" 或 "國八" 至少一個
            let score = 0;
            requestTags.forEach(reqTag => { 
                if (meta.includes(reqTag)) score++; 
            });
            G._templates[tid]._tempScore = score;

            // 如果請求中有指定細項(如"原子")，但模板只中了科目，則剔除
            // 除非真的找不到題，否則優先使用高分模板
            if (requestTags.length > 1 && score <= 1) return false; 

            return true;
        });

        // 2. 排序：優先使用命中最多標籤的模板
        validTemplates.sort((a, b) => G._templates[b]._tempScore - G._templates[a]._tempScore);

        // ★★★ 關鍵修正：只要有模板就好，不要求數量 >= total ★★★
        if (validTemplates.length === 0) {
            console.warn("⚠️ 找不到精確匹配的模板，嘗試強力放寬條件...");
            
            // 備案：只篩選 科目 + 年級 (忽略單元細節)
            validTemplates = allTemplateIds.filter(tid => {
                const meta = G._templates[tid].meta || [];
                const isSubject = meta.includes(subject);
                // 只要符合科目，且不包含黑名單年級即可
                const isForbidden = meta.some(tag => forbiddenTags.includes(tag));
                return isSubject && !isForbidden;
            });
        }

        console.log(`📊 最終可用模板數: ${validTemplates.length} (將重複使用以產生 ${total} 題)`);

        // 3. 生成題目
        const paper = [];
        validTemplates.shuffle(); // 打亂順序
        
        let count = 0;
        let failures = 0;

        // 循環取題直到滿額
        while(count < total && validTemplates.length > 0) {
            // 使用餘數運算來循環使用模板 (Round Robin)
            const tid = validTemplates[count % validTemplates.length];
            
            try {
                const q = G.generateQuestion(tid, { tags: requestTags });
                if (q) { 
                    paper.push(q); 
                    count++; 
                    failures = 0; // 重置失敗計數
                } else {
                    failures++;
                }
            } catch (e) {
                console.error(`Error generating ${tid}:`, e);
                // 如果這題壞了，就從清單移除
                const indexToRemove = validTemplates.indexOf(tid);
                if (indexToRemove > -1) validTemplates.splice(indexToRemove, 1);
            }

            // 防無窮迴圈
            if (failures > 20) {
                console.error("連續生成失敗，強制中止");
                break;
            }
        }

        return paper;
    }

    // 匯出到全域
    window.generatePaper = generatePaper;
    console.log("✅ Paper Generator v6.0 (Loop Fix) 已就緒");

})(window);
