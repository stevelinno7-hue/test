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
        // 1. 定義對照表 (移除廣義詞，確保科目隔離)
        // ==========================================
        const subjectWhitelist = {
            // 數學
            'math': ['math', '數學'],
            
            // 自然科：移除 '自然'、'理化'，避免物理化學混在一起
            'physics': ['physics', '物理'], 
            'chemistry': ['chemistry', '化學'],
            'biology': ['biology', '生物'],
            'earth': ['earth', '地科', '地球科學'],
            
            // 語文
            'chinese': ['chinese', '國文', '語文'],
            'english': ['english', '英文', '英語'],
            
            // 社會科：移除 '社會'，避免歷史地理公民混在一起
            'history': ['history', '歷史'],
            'geography': ['geography', '地理'],
            'civics': ['civics', '公民']
        };

        const allGrades = ["國七", "國八", "國九", "高一", "高二", "高三", "七年級", "八年級", "九年級"];

        // ==========================================
        // 2. 解析需求
        // ==========================================
        const targetKeywords = subjectWhitelist[subject.toLowerCase()] || [subject.toLowerCase()];
        const targetGrades = tags.filter(t => allGrades.includes(t));

        console.log(`🔒 [PaperGen] 鎖定條件 -> 科目:[${targetKeywords}], 年級:[${targetGrades.length > 0 ? targetGrades : "無限制"}]`);

        // ==========================================
        // 3. 嚴格篩選 (Strict Filter)
        // ==========================================
        const candidates = allIds.filter(id => {
            const tTags = templateTagMap[id] || [];
            
            // 條件一：檢查科目 (改用嚴格比對)
            // 題目的標籤必須 "完全等於" 白名單中的關鍵字之一
            // 例如：題目有 "歷史" tag，白名單有 "歷史"，Pass。
            // 例如：題目有 "社會" tag，白名單只有 "歷史"，Fail (成功擋下公民題)。
            const isCorrectSubject = tTags.some(tag => targetKeywords.includes(tag));
            if (!isCorrectSubject) return false;

            // 條件二：檢查年級 (強制鎖定)
            if (targetGrades.length > 0) {
                // 題目必須包含至少一個目標年級標籤
                const hasMatchingGrade = tTags.some(t => targetGrades.includes(t));
                if (!hasMatchingGrade) return false;
            }

            return true;
        });

        // ==========================================
        // 4. 生成題目
        // ==========================================
        if (candidates.length === 0) {
            console.warn(`[PaperGen] 找不到符合 [${subject}] + [${targetGrades}] 的題目。停止生成，避免跨科/跨年級錯誤。`);
            return [];
        }

        for (let i = 0; i < total; i++) {
            const tid = candidates[Math.floor(Math.random() * candidates.length)];
            
            try { 
                // 傳入 tags 讓模板知道上下文
                const q = G.generateQuestion(tid, { tags: tags });
                if (q) questions.push(q);
            } catch (e) { 
                console.error(`題目生成失敗 (${tid}):`, e); 
            }
        }

        return questions;
    }

    global.generatePaper = generatePaper;
    console.log("✅ Paper Generator v3.4 (Strict Isolation Mode) 已就緒");

})(window);
