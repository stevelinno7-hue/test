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

        // ==========================================
        // 1. 定義科目關鍵字 (白名單)
        // ==========================================
        const subjectWhitelist = {
            'math': ['math', '數學'],
            'physics': ['physics', '物理', '理化'],
            'chemistry': ['chemistry', '化學', '理化'],
            'biology': ['biology', '生物'],
            'earth': ['earth', '地科', '地球科學'],
            'chinese': ['chinese', '國文', '語文'],
            'english': ['english', '英文', '英語'],
            'history': ['history', '歷史'],
            'geography': ['geography', '地理'],
            'civics': ['civics', '公民']
        };

        // 取得當前科目允許的關鍵字 (例如 math -> ['math', '數學'])
        // 如果科目不在清單中 (如 social)，就寬鬆處理
        const targetKeywords = subjectWhitelist[subject.toLowerCase()] || [subject.toLowerCase()];

        console.log(`🔍 [PaperGen] 正在搜尋科目: ${subject} (關鍵字: ${targetKeywords})`);

        // ==========================================
        // 2. 嚴格篩選 (Strict Filter)
        // ==========================================
        const candidates = allIds.filter(id => {
            const tTags = templateTagMap[id] || [];
            
            // 【絕對條件】檢查科目標籤 (Must match Subject)
            // 題目的標籤陣列中，必須包含 targetKeywords 裡的至少一個字
            // 例如：題目標籤 ["math", "國七"] vs 關鍵字 ["math", "數學"] -> 符合
            // 例如：題目標籤 ["history", "國七"] vs 關鍵字 ["math", "數學"] -> 不符合
            const isCorrectSubject = tTags.some(tag => 
                targetKeywords.some(k => tag.toLowerCase().includes(k))
            );

            // ❌ 如果科目不對，直接剔除 (這行是防止大雜燴的關鍵！)
            if (!isCorrectSubject) return false;

            // 【次要條件】檢查年級/範圍
            // 如果 user 有指定 tags (如 '國七'), 則題目必須包含該 tag
            // 但為了避免篩太乾淨變成 0 題，我們允許只要科目對了，年級稍微寬鬆一點
            const hasMatchingTag = tags.some(reqTag => tTags.includes(reqTag));
            
            return hasMatchingTag;
        });

        if (candidates.length === 0) {
            console.warn(`[PaperGen] 找不到符合年級的 [${subject}] 題目。啟動同科備援。`);
            
            // Fallback: 只要科目對就好，不管年級了
            const fallbackCandidates = allIds.filter(id => {
                const tTags = templateTagMap[id] || [];
                return tTags.some(tag => targetKeywords.some(k => tag.toLowerCase().includes(k)));
            });

            if (fallbackCandidates.length > 0) {
                for (let i = 0; i < total; i++) {
                    const tid = fallbackCandidates[Math.floor(Math.random() * fallbackCandidates.length)];
                    try { questions.push(G.generateQuestion(tid)); } catch(e){}
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
    console.log("✅ Paper Generator v2.5 (Strict Filter) 已就緒");

})(window);
