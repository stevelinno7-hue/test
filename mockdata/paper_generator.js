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
        // 1. 科目白名單
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
        const targetKeywords = subjectWhitelist[subject.toLowerCase()] || [subject.toLowerCase()];
        const targetGrade = tags.find(t => allGrades.includes(t));

        console.log(`🔒 [PaperGen] 鎖定條件 -> 科目:${targetKeywords}, 年級:${targetGrade || "無限制"}`);

        // ==========================================
        // 3. 嚴格篩選
        // ==========================================
        const candidates = allIds.filter(id => {
            const tTags = templateTagMap[id] || [];

            // 條件一：科目必須匹配
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

        for (let i = 0; i < total; i++) {
            const tid = candidates[Math.floor(Math.random() * candidates.length)];
            try { 
                const q = G.generateQuestion(tid);
                if (q) questions.push(q);
            } catch (e) { 
                console.error(e); 
            }
        }

        return questions;
    }

    global.generatePaper = generatePaper;
    console.log("✅ Paper Generator v2.7 (Grade Locked) 已就緒");

})(window);
