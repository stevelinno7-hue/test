(function(global){
    'use strict';

    // 這是負責「挑選題目」的核心邏輯
    function generatePaper(config) {
        const G = global.RigorousGenerator;
        if (!G) { console.error("Engine not found"); return []; }

        const { subject, total, tags } = config;
        let questions = [];
        
        // 1. 搜尋符合標籤的模板
        // 這裡做一個寬鬆匹配：只要題目標籤包含 config.tags 的其中一個關鍵字即可
        // (例如: 搜尋 "國七" 可以找到 ["國七", "數學"])
        const candidates = Object.keys(G._templates).filter(id => {
            const tTags = G._templateTags[id] || [];
            // 必須包含科目 (例如 'math') 且包含年級 (例如 '國七')
            const hasSubject = tTags.some(t => t.toLowerCase() === subject.toLowerCase() || t.includes(subject));
            const hasGrade = tags.some(reqTag => tTags.includes(reqTag));
            return hasSubject && hasGrade;
        });

        if (candidates.length === 0) {
            console.warn(`[PaperGen] 找不到 [${subject}] 的題目。標籤:`, tags);
            return [];
        }

        // 2. 隨機選題
        for (let i = 0; i < total; i++) {
            const tid = candidates[Math.floor(Math.random() * candidates.length)];
            const q = G.generateQuestion(tid);
            if (q) questions.push(q);
        }

        return questions;
    }

    // 掛載到全域
    global.generatePaper = generatePaper;
    console.log("✅ Paper Generator 已就緒");

})(window);
