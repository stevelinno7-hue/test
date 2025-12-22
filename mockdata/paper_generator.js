(function(global){
    'use strict';
    function generatePaper(config) {
        const G = global.RigorousGenerator;
        if (!G) { console.error("❌ PaperGen: Engine not found"); return []; }

        const { subject, total, tags } = config;
        let questions = [];
        
        const templateMap = G._templates || {}; 
        const templateTagMap = G._templateTags || {};
        const allIds = Object.keys(templateMap);

        if (allIds.length === 0) {
            console.warn(`[PaperGen] 無可用模板。請確認 generator_engine_polyfill.js 已載入。`);
            return [];
        }

        // 搜尋符合標籤的模板 (寬鬆比對)
        const candidates = allIds.filter(id => {
            const tTags = templateTagMap[id] || [];
            const matchSubject = tTags.some(t => t && t.toLowerCase().includes(subject.toLowerCase()));
            const matchGrade = tags.some(reqTag => tTags.includes(reqTag));
            return matchSubject || matchGrade; 
        });

        if (candidates.length === 0) {
            console.warn(`[PaperGen] 找不到 [${subject}] 的題目。啟動 Fallback。`);
            // Fallback: 只要有題目就好
            const fallback = allIds.filter(id => {
                const tTags = templateTagMap[id] || [];
                return tTags.some(t => t && t.toLowerCase().includes(subject.toLowerCase()));
            });
            if(fallback.length > 0) {
                 for (let i = 0; i < total; i++) {
                    const tid = fallback[Math.floor(Math.random() * fallback.length)];
                    try { questions.push(G.generateQuestion(tid)); } catch(e){}
                }
                return questions;
            }
            return [];
        }

        for (let i = 0; i < total; i++) {
            const tid = candidates[Math.floor(Math.random() * candidates.length)];
            try { 
                const q = G.generateQuestion(tid);
                if (q) questions.push(q);
            } catch (e) { console.error(e); }
        }
        return questions;
    }
    global.generatePaper = generatePaper;
    console.log("✅ Paper Generator v2.3 (Polyfill Supported) 已就緒");
})(window);
