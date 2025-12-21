// mockdata/paper_generator.js
(function () {
    console.log("📄 [PaperGen] 初始化中...");

    function generatePaper(config) {
        const { subject, total, tags } = config;

        const factory = window.AutoTemplateFissionFactory;
        if (!factory || !factory.ready) {
            throw new Error("AutoTemplateFissionFactory 尚未完成初始化");
        }

        const pool = factory.getTemplates(subject);

        if (!pool.length) {
            throw new Error(`題庫為空：${subject}`);
        }

        // 簡單洗牌
        const shuffled = [...pool].sort(() => Math.random() - 0.5);

        // 產題
        const questions = shuffled.slice(0, total).map((q, idx) => ({
            id: `${subject}_${Date.now()}_${idx}`,
            ...q
        }));

        return questions;
    }

    // 🔑 一定要掛 window
    window.generatePaper = generatePaper;

    console.log("🔥 PAPER GEN VERSION 2025-01-SAFE 已載入");
})();
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
