(function(global){
    'use strict';

    // 負責從題庫中挑選符合條件的題目
    function generatePaper(config) {
        const G = global.RigorousGenerator;
        
        // 防呆 1: 引擎不存在
        if (!G) { 
            console.error("❌ PaperGen Error: Engine not found"); 
            return []; 
        }

        const { subject, total, tags } = config;
        let questions = [];
        
        // 防呆 2: 模板列表不存在 (這是你之前報錯的原因)
        const templateMap = G._templates || {}; 
        const templateTagMap = G._templateTags || {};

        // 1. 搜尋符合標籤的模板 ID
        const candidates = Object.keys(templateMap).filter(id => {
            const tTags = templateTagMap[id] || [];
            
            // A. 檢查科目 (寬鬆比對，不分大小寫)
            const hasSubject = tTags.some(t => t.toLowerCase().includes(subject.toLowerCase()));
            
            // B. 檢查年級/標籤 (必須包含請求標籤中的至少一個)
            const hasGrade = tags.some(reqTag => tTags.includes(reqTag));
            
            return hasSubject && hasGrade;
        });

        if (candidates.length === 0) {
            console.warn(`[PaperGen] 找不到 [${subject}] 且符合 [${tags}] 的題目。目前可用模板數: ${Object.keys(templateMap).length}`);
            return [];
        }

        // 2. 隨機選題生成
        for (let i = 0; i < total; i++) {
            // 隨機選一個模板
            const tid = candidates[Math.floor(Math.random() * candidates.length)];
            // 生成題目
            try {
                const q = G.generateQuestion(tid);
                if (q) questions.push(q);
            } catch (e) {
                console.error(`模板 ${tid} 生成失敗:`, e);
            }
        }

        return questions;
    }

    // 掛載到全域
    global.generatePaper = generatePaper;
    console.log("✅ Paper Generator v2.1 (Safe Mode) 已就緒");

})(window);
