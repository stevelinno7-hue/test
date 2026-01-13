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

    // 核心生成器
    function generatePaper(config) {
        const G = global.RigorousGenerator || (window.global && window.global.RigorousGenerator);
        if (!G) { console.error("Generator Engine 未載入"); return []; }

        const subject = config.subject || 'math';
        const total = config.total || 10;
        // 確保 tags 是陣列
        const requestTags = Array.isArray(config.tags) ? config.tags : [config.tags];

        // 1. 取得所有已註冊的模板 ID
        const allTemplateIds = G.getTemplateIds();

        // 2. 定義年級互斥清單 (Grade Exclusion List)
        const allGrades = ["國七", "國八", "國九", "高一", "高二", "高三", "七年級", "八年級", "九年級"];
        
        // 找出本次請求中包含的年級標籤
        const requestedGrades = requestTags.filter(t => allGrades.includes(t));
        
        // 如果請求中有指定年級 (例如 "國七")，則建立「黑名單」
        // 黑名單 = 所有年級 - 請求的年級 (即：除了國七以外的所有年級)
        const forbiddenTags = requestedGrades.length > 0 
            ? allGrades.filter(g => !requestedGrades.includes(g)) 
            : [];

        console.log(`🔒 [PaperGen] 鎖定 -> 科目:[${subject}] | 指定年級:${requestedGrades} | 排除年級:${forbiddenTags}`);

        // 3. 篩選符合條件的模板
        let validTemplates = allTemplateIds.filter(tid => {
            const meta = G._templates[tid].meta || [];
            
            // A. 科目檢查 (必須符合)
            // 檢查 meta 中是否有該科目代碼 (math, civics...) 或中文名稱
            const subjectMatch = meta.some(tag => tag === subject || tag.includes(subject));
            if (!subjectMatch) return false;

            // B. ★★★ 嚴格年級過濾 (Grade Guard) ★★★
            // 如果模板包含「黑名單」中的年級，直接剔除！
            // 例如：請求 "國七"，若模板有 "國九"，直接 false
            const hasForbiddenGrade = meta.some(tag => forbiddenTags.includes(tag));
            if (hasForbiddenGrade) return false;

            // C. 標籤加分機制 (用於排序)
            // 計算這個模板命中了幾個請求標籤
            let score = 0;
            requestTags.forEach(reqTag => {
                if (meta.includes(reqTag)) score++;
            });
            
            // 暫存分數以便排序
            G._templates[tid]._tempScore = score;

            // 至少要命中科目，且不能被黑名單排除
            return true;
        });

        // 4. 排序：優先使用命中標籤最多的模板 (例如命中 "國七"+"社會" 優於只命中 "國七")
        validTemplates.sort((a, b) => G._templates[b]._tempScore - G._templates[a]._tempScore);

        // 如果篩選後沒題目，且有指定年級，嘗試放寬標籤 (但絕不放寬年級！)
        if (validTemplates.length < total && requestedGrades.length > 0) {
            console.warn("⚠️ 符合特定單元的題目不足，嘗試抓取該年級所有題目...");
            // 重新抓取：只要是該科目 + 該年級即可 (忽略單元細項)
            validTemplates = allTemplateIds.filter(tid => {
                const meta = G._templates[tid].meta || [];
                const isSubject = meta.includes(subject);
                const isCorrectGrade = meta.some(tag => requestedGrades.includes(tag));
                const isForbidden = meta.some(tag => forbiddenTags.includes(tag));
                return isSubject && isCorrectGrade && !isForbidden;
            });
        }

        // 5. 生成題目
        const paper = [];
        // 隨機從篩選後的池子中選題 (加權隨機或簡單隨機)
        // 這裡使用簡單隨機，但優先取高分群
        
        // 為了避免題目重複，我們先打亂順序
        validTemplates.shuffle();

        let count = 0;
        // 循環選題直到滿額
        while(count < total && validTemplates.length > 0) {
            // 輪詢取題
            const tid = validTemplates[count % validTemplates.length];
            try {
                // 傳入 tags 讓工廠 (Fission Factory) 可以做進一步處理
                const q = G.generateQuestion(tid, { tags: requestTags });
                if (q) {
                    paper.push(q);
                    count++;
                }
            } catch (e) {
                console.error(`Error generating ${tid}:`, e);
                // 出錯則移除該模板
                validTemplates = validTemplates.filter(t => t !== tid);
            }
        }

        return paper;
    }

    // 匯出到全域
    window.generatePaper = generatePaper;
    console.log("✅ Paper Generator v5.0 (Strict Grade Guard) 已就緒");

})(window);
