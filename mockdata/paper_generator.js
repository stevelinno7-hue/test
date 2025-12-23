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
        // 1. 科目白名單 (修正版：去除寬鬆標籤)
        // ==========================================
        const subjectWhitelist = {
            // --- 數學 ---
            'math': ['math', '數學'],

            // --- 自然科 (移除 '自然' 這個大標籤，避免混題) ---
            'physics': ['physics', '物理', '理化'],       // 國中理化包含物理
            'chemistry': ['chemistry', '化學', '理化'],    // 國中理化包含化學
            'biology': ['biology', '生物'],               // 移除 '自然'
            'earth': ['earth', '地科', '地球科學'],        // 移除 '自然'
            
            // 如果你想出「自然大卷」(全科)，可以多加這個選項：
            'science': ['自然', '理化', '生物', '地科'],

            // --- 語文 ---
            'chinese': ['chinese', '國文', '語文'],
            'english': ['english', '英文', '英語'],

            // --- 社會科 (移除 '社會' 這個大標籤，避免混題) ---
            'history': ['history', '歷史'],               // 移除 '社會'
            'geography': ['geography', '地理'],           // 移除 '社會'
            'civics': ['civics', '公民'],                 // 移除 '社會'

            // 如果你想出「社會大卷」(全科)，可以多加這個選項：
            'social': ['社會', '歷史', '地理', '公民']
        };

        // 年級白名單對照
        const gradeMap = {
            "國七": ["國七", "七年級", "7年級"],
            "國八": ["國八", "八年級", "8年級"],
            "國九": ["國九", "九年級", "9年級"],
            "高一": ["高一", "10年級"],
            "高二": ["高二", "11年級"],
            "高三": ["高三", "12年級"]
        };

        const allGrades = Object.keys(gradeMap);

        // ==========================================
        // 2. 解析需求
        // ==========================================
        // 轉小寫並查找，找不到就用傳入的 subject 當作關鍵字
        const subKey = subject.toLowerCase();
        const targetKeywords = subjectWhitelist[subKey] || [subKey];
        
        const targetGrade = tags.find(t => allGrades.includes(t));

        console.log(`🔒 [PaperGen] 鎖定條件 -> 科目關鍵字:[${targetKeywords}], 年級:${targetGrade || "無限制"}`);

        // ==========================================
        // 3. 嚴格篩選
        // ==========================================
        const candidates = allIds.filter(id => {
            const tTags = templateTagMap[id] || [];

            // 條件一：科目必須匹配 (只要對中一個關鍵字即可)
            // 因為現在關鍵字很精準(例如只有'地理')，所以不會對到有'社會'標籤的歷史題
            const isCorrectSubject = tTags.some(tag => 
                targetKeywords.some(k => tag.toLowerCase().includes(k))
            );
            if (!isCorrectSubject) return false;

            // 條件二：年級必須匹配
            if (targetGrade) {
                const allowedTags = gradeMap[targetGrade];
                const hasGrade = tTags.some(tag => allowedTags.includes(tag));
                if (!hasGrade) return false;
            }

            return true;
        });

        // ==========================================
        // 4. 生成題目
        // ==========================================
        if (candidates.length === 0) {
            console.warn(`[PaperGen] 找不到符合 [${subject}] + [${targetGrade}] 的題目。`);
            return [];
        }

        // 避免無窮迴圈或報錯，如果題目庫不夠，就只跑題目庫的數量
        const loopCount = Math.min(total, candidates.length * 5); // 允許重複抽嘗試
        let generatedCount = 0;

        for (let i = 0; i < loopCount; i++) {
            if (generatedCount >= total) break;

            const tid = candidates[Math.floor(Math.random() * candidates.length)];
            try { 
                const q = G.generateQuestion(tid);
                if (q) {
                    questions.push(q);
                    generatedCount++;
                }
            } catch (e) { 
                console.error(e); 
            }
        }

        return questions;
    }

    global.generatePaper = generatePaper;
    console.log("✅ Paper Generator v2.8 (Strict Subject Mode) 已就緒");

})(window);
