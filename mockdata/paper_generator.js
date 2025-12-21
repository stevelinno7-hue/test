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

        // 1️⃣ 找出可用 templates（允許題型重複）
        const templates = Object.keys(G.templates).filter(name => {
            if (templatePrefix && !name.startsWith(templatePrefix)) return false;
            return name.includes(grade);
        });

        if (templates.length === 0) {
            err("找不到任何 template", { grade, subject });
            return [];
        }

        log("可用 templates", templates);

        // 2️⃣ 出題（題幹不可重複）
        const paper = [];
        const usedStems = new Set();

        let attempts = 0;
        const MAX_ATTEMPTS = count * 20; // 防無限迴圈

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
                continue; // 🚫 題幹重複，直接跳過
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

    // 3️⃣ 對外掛載
    global.PaperGenerator = {
        generatePaper
    };

    log("🔥 PAPER GEN VERSION 2025-01-SAFE（NO FALLBACK / NO DUP STEM）已載入");

})(window);
