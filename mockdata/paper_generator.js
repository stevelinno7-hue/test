(function(global){
    'use strict';

    function generatePaper(config) {
        const G = global.RigorousGenerator;
        if (!G) { console.error("❌ PaperGen: Engine not found"); return []; }

        const { subject, total, tags } = config;
        let questions = [];
        
        // 讀取 Polyfill 確保的儲存空間
        const templateMap = G._templates || {}; 
        const templateTagMap = G._templateTags || {};
        const allIds = Object.keys(templateMap);

        // Debug: 印出目前的狀態
        console.log(`[PaperGen] 系統狀態檢查:
        - 總模板數: ${allIds.length}
        - 搜尋科目: ${subject}
        - 搜尋標籤: ${tags}`);

        if (allIds.length === 0) {
            console.warn(`[PaperGen] 警告：無可用模板。請確認 generator_engine_polyfill.js 已正確載入。`);
            return [];
        }

        // 搜尋符合標籤的模板 ID
        const candidates = allIds.filter(id => {
            const tTags = templateTagMap[id] || [];
            // 寬鬆比對：包含科目 OR 包含年級
            const matchSubject = tTags.some(t => t && t.toLowerCase().includes(subject.toLowerCase()));
            const matchGrade = tags.some(reqTag => tTags.includes(reqTag));
            
            // 特別處理：如果 tags 包含 'core' 或 '核心'，也算匹配
            const isCore = tags.includes('核心') || tags.includes('core');
            
            return matchSubject || (matchGrade && isCore); 
        });

        if (candidates.length === 0) {
            console.warn(`[PaperGen] 嚴格篩選無結果，啟動 Fallback 機制。`);
            // Fallback: 如果找不到，就隨機出該科目的題 (只對科目，忽略年級)
            const fallbackCandidates = allIds.filter(id => {
                const tTags = templateTagMap[id] || [];
                return tTags.some(t => t && t.toLowerCase().includes(subject.toLowerCase()));
            });
            
            if (fallbackCandidates.length > 0) {
                console.log(`[PaperGen] Fallback 成功：從 ${fallbackCandidates.length} 個同科題目中選取。`);
                for (let i = 0; i < total; i++) {
                    const tid = fallbackCandidates[Math.floor(Math.random() * fallbackCandidates.length)];
                    try { 
                        const q = G.generateQuestion(tid);
                        if(q) questions.push(q);
                    } catch(e) {}
                }
                return questions;
            }
            
            return [];
        }

        // 正常選題
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
