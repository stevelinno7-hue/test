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
        // 1. 定義對照表 (白名單)
        // ==========================================
        const subjectWhitelist = {
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

        const allGrades = ["國七", "國八", "國九", "高一", "高二", "高三", "七年級", "八年級", "九年級"];

        // ==========================================
        // 2. 解析需求
        // ==========================================
        const targetKeywords = subjectWhitelist[subject.toLowerCase()] || [subject.toLowerCase()];
        const targetGrade = tags.find(t => allGrades.includes(t));

        console.log(`🔒 [PaperGen] 鎖定條件 -> 科目:[${targetKeywords}], 年級:${targetGrade || "無限制"}`);

        // ==========================================
        // 3. 嚴格篩選 (Strict Filter Only)
        // ==========================================
        const candidates = allIds.filter(id => {
            const tTags = templateTagMap[id] || [];
            
            // 條件一：檢查科目 (必須符合)
            const isCorrectSubject = tTags.some(tag => 
                targetKeywords.some(k => tag.toLowerCase().includes(k))
            );
            if (!isCorrectSubject) return false;

            // 條件二：檢查年級 (強制鎖定)
            // 如果有指定年級，題目必須包含該年級標籤，否則直接剔除
            if (targetGrade) {
                if (!tTags.includes(targetGrade)) return false;
            }

            return true;
        });

        // ==========================================
        // 4. 生成題目
        // ==========================================
        // 如果找不到嚴格符合的題目，直接回傳空陣列
        // 讓前端顯示載入中或錯誤，而不是亂抓其他年級的題目充數
        if (candidates.length === 0) {
            console.warn(`[PaperGen] 找不到符合 [${subject}] + [${targetGrade}] 的題目。停止生成，避免跨年級錯誤。`);
            return [];
        }

        // 隨機選題
        for (let i = 0; i < total; i++) {
            const tid = candidates[Math.floor(Math.random() * candidates.length)];
            
            try { 
                // 傳入 tags 讓模板知道現在的上下文 (雖然 strict filter 已經篩過了，但傳入 ctx 是好習慣)
                const q = G.generateQuestion(tid, { tags: tags });
                if (q) questions.push(q);
            } catch (e) { 
                console.error(`題目生成失敗 (${tid}):`, e); 
            }
        }

        return questions;
    }

    global.generatePaper = generatePaper;
    console.log("✅ Paper Generator v3.2 (Strict No-Fallback) 已就緒");

})(window);
