(function (global) {
    'use strict';

    const log  = (...a) => console.log("📄 [PaperGen]", ...a);
    const warn = (...a) => console.warn("⚠️ [PaperGen]", ...a);
    const err  = (...a) => console.error("❌ [PaperGen]", ...a);

    function generatePaper(params) {
        const {
            subject,
            grade,
            count = 10,
            templatePrefix
        } = params || {};

        const G = global.RigorousGenerator;

        if (!G || !G.templates || !G.generateFromTemplate) {
            err("Generator 尚未就緒");
            return [];
        }

        if (!subject || !grade) {
            err("缺少 subject 或 grade", params);
            return [];
        }

        log("generatePaper()", params);

        const templates = Object.keys(G.templates).filter(name => {
            if (templatePrefix && !name.startsWith(templatePrefix)) return false;
            return name.includes(grade);
        });

        if (templates.length === 0) {
            err("找不到任何 template", { grade, subject });
            return [];
        }

        const paper = [];
        const usedStems = new Set();

        let attempts = 0;
        const MAX_ATTEMPTS = count * 20;

        // ✅ 這個 while 是你原本少掉的
        while (paper.length < count && attempts < MAX_ATTEMPTS) {
            attempts++;

            const tplName = templates[Math.floor(Math.random() * templates.length)];
            let q;

            try {
                q = G.generateFromTemplate(tplName);
            } catch (e) {
                warn("template 失敗", tplName, e);
                continue;
            }

            if (!q || typeof q.question !== 'string') continue;

            const stem = q.question.trim();
            if (usedStems.has(stem)) {
                continue; // 🚫 題幹重複
            }

            usedStems.add(stem);

            paper.push({
                id: paper.length + 1,
                ...q
            });
        }

        if (paper.length < count) {
            warn(`題目不足，只能出 ${paper.length} 題`);
        }

        log(`完成出題 ${paper.length}/${count}`);
        return paper;
    }

    global.PaperGenerator = {
        generatePaper
    };
    // 🔔 相容舊系統 / exam.html 偵測用
    global.paperGenerator = global.PaperGenerator;
    global.PAPER_GENERATOR_READY = true;
    
    // 如果 exam 有監聽事件（保險）
    window.dispatchEvent(new Event("PaperGeneratorReady"));

    log("🔥 PAPER GEN VERSION 2025-01-SAFE（NO DUP STEM）已載入");

})(window);
