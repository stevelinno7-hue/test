(function(global){
    'use strict';

    if (!Array.prototype.shuffle) {
        Array.prototype.shuffle = function() {
            for (let i = this.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this[i], this[j]] = [this[j], this[i]];
            }
            return this;
        };
    }

    function generatePaper(config) {
        const G = global.RigorousGenerator || (window.global && window.global.RigorousGenerator);
        
        // ★★★ 防呆修正：如果引擎缺件，嘗試修復或返回空 ★★★
        if (!G) { console.error("Engine missing"); return []; }
        if (typeof G.getTemplateIds !== 'function') {
            if (G._templates) {
                G.getTemplateIds = () => Object.keys(G._templates); // 臨時修復
            } else {
                console.error("G.getTemplateIds missing"); return [];
            }
        }

        const subject = config.subject || 'math';
        const total = config.total || 10;
        const requestTags = Array.isArray(config.tags) ? config.tags : [config.tags];
        const allTemplateIds = G.getTemplateIds();

        const allGrades = ["國七", "國八", "國九", "高一", "高二", "高三", "七年級", "八年級", "九年級"];
        const requestedGrades = requestTags.filter(t => allGrades.includes(t));
        const forbiddenTags = requestedGrades.length > 0 
            ? allGrades.filter(g => !requestedGrades.includes(g)) 
            : [];

        console.log(`🔒 [PaperGen] 鎖定 -> 科目:[${subject}] | 排除年級:${forbiddenTags}`);

        let validTemplates = allTemplateIds.filter(tid => {
            const meta = G._templates[tid].meta || [];
            const subjectMatch = meta.some(tag => tag === subject || tag.includes(subject));
            if (!subjectMatch) return false;

            const hasForbiddenGrade = meta.some(tag => forbiddenTags.includes(tag));
            if (hasForbiddenGrade) return false;

            let score = 0;
            requestTags.forEach(reqTag => { if (meta.includes(reqTag)) score++; });
            G._templates[tid]._tempScore = score;
            return true;
        });

        validTemplates.sort((a, b) => G._templates[b]._tempScore - G._templates[a]._tempScore);

        if (validTemplates.length < total && requestedGrades.length > 0) {
            console.warn("⚠️ 題目不足，放寬條件...");
            validTemplates = allTemplateIds.filter(tid => {
                const meta = G._templates[tid].meta || [];
                const isSubject = meta.includes(subject);
                const isCorrectGrade = meta.some(tag => requestedGrades.includes(tag));
                return isSubject && isCorrectGrade;
            });
        }

        const paper = [];
        validTemplates.shuffle();
        let count = 0;
        
        while(count < total && validTemplates.length > 0) {
            const tid = validTemplates[count % validTemplates.length];
            try {
                const q = G.generateQuestion(tid, { tags: requestTags });
                if (q) { paper.push(q); count++; }
            } catch (e) {
                console.error(`Error generating ${tid}:`, e);
                validTemplates = validTemplates.filter(t => t !== tid);
            }
        }
        return paper;
    }

    window.generatePaper = generatePaper;
    console.log("✅ Paper Generator v5.1 (Self-Repair) 已就緒");

})(window);
