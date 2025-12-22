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

        if (allIds.length === 0) {
            console.warn(`[PaperGen] 無可用模板，請稍後再試。`);
            return [];
        }

        // ==========================================
        // 關鍵修復：建立科目關鍵字對照表
        // ==========================================
        // 這能確保搜尋 'math' 時，也能找到標記為 '數學' 的題目
        const subjectKeywords = {
            'math': ['math', '數學'],
            'physics': ['physics', '物理', '理化', '自然'],
            'chemistry': ['chemistry', '化學', '理化', '自然'],
            'biology': ['biology', '生物', '自然'],
            'earth': ['earth', '地科', '地球科學', '自然'],
            'chinese': ['chinese', '國文', '語文'],
            'english': ['english', '英文', '英語'],
            'history': ['history', '歷史', '社會'],
            'geography': ['geography', '地理', '社會'],
            'civics': ['civics', '公民', '社會']
        };

        // 取得當前科目的所有合法關鍵字 (預設包含自己)
        const targetKeywords = subjectKeywords[subject.toLowerCase()] || [subject.toLowerCase()];

        // ==========================================
        // 嚴格篩選邏輯 (Strict Filtering)
        // ==========================================
        const candidates = allIds.filter(id => {
            const tTags = templateTagMap[id] || [];
            
            // 1. 【絕對條件】檢查科目 (Must match Subject)
            // 題目標籤中，必須包含至少一個該科目的關鍵字
            const isCorrectSubject = tTags.some(tag => 
                targetKeywords.some(k => tag.toLowerCase().includes(k))
            );

            // 如果科目不對，直接剔除 (這就是防止亂出的關鍵！)
            if (!isCorrectSubject) return false;

            // 2. 【次要條件】檢查標籤 (Match Tags)
            // 必須包含請求標籤中的至少一個 (例如 '國七' 或 '核心')
            const hasMatchingTag = tags.some(reqTag => tTags.includes(reqTag));
            
            return hasMatchingTag;
        });

        // Debug 訊息：讓你確認篩選結果
        // console.log(`[PaperGen] 科目:${subject} (關鍵字:${targetKeywords}) -> 找到 ${candidates.length} 題`);

        if (candidates.length === 0) {
            console.warn(`[PaperGen] 找不到 [${subject}] 的題目。啟動同科備援機制。`);
            
            // Fallback: 如果真的找不到符合年級的，至少找「同科目」的題目
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
    console.log("✅ Paper Generator v2.4 (Strict Filter) 已就緒");

})(window);
