// mockdata/paper_generator.js
(function (global) {
    'use strict';

    console.log("📄 [PaperGen] Rigorous 相容版初始化");

    function generatePaper(config) {
        const G = global.RigorousGenerator;
        if (!G || !G.templates) {
            console.error("❌ RigorousGenerator 尚未就緒");
            return [];
        }

        const total = config.total || 10;
        const tags = config.tags || [];

        // 找出符合 tag 的 templates
        const templates = Object.values(G.templates).filter(tpl => {
            if (!Array.isArray(tpl.tags)) return false;
            return tags.some(tag => tpl.tags.includes(tag));
        });

        if (!templates.length) {
            console.warn("⚠️ 無可用模板", tags);
            return [];
        }

        const paper = [];
        const usedStems = new Set();
        let attempts = 0;
        const MAX_ATTEMPTS = total * 10;

        while (paper.length < total && attempts < MAX_ATTEMPTS) {
            attempts++;

            const tpl = templates[Math.floor(Math.random() * templates.length)];
            let q;

            try {
                q = tpl.generator();
            } catch (e) {
                console.warn("⚠️ 模板錯誤", tpl.name, e);
                continue;
            }

            if (!q || typeof q.question !== 'string') continue;

            const stem = q.question.trim();
            if (usedStems.has(stem)) continue; // 🚫 題幹不重複

            usedStems.add(stem);
            paper.push({
                id: paper.length + 1,
                ...q
            });
        }

        if (paper.length < total) {
            console.warn(`⚠️ 題目不足，只能出 ${paper.length} 題`);
        }

        console.log(`✅ 出題完成 ${paper.length}/${total}`);
        return paper;
    }

    // ⭐ 關鍵：正確掛到 window，給 exam.html 用
    global.generatePaper = generatePaper;

    console.log("🔥 PAPER GEN VERSION 2025-01-RIGOROUS READY");

})(window);
