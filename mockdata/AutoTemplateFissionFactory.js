(function (global) {
    'use strict';

    function initFactory() {
        const G = global.RigorousGenerator || (window.global && window.global.RigorousGenerator);

        if (!G || !G.registerTemplate || !G.utils) {
            setTimeout(initFactory, 50);
            return;
        }

        const { pick } = G.utils;

        // ==========================================
        // 1️⃣ 情境資料庫
        // ==========================================
        const DB = {
            roles: [
                "AI工程師", "全端工程師", "電競選手", "YouTuber", "外送員",
                "急診室醫生", "FBI探員", "黑客", "火星太空人", "時空旅人",
                "魔法學徒", "煉金術士", "馴龍高手", "深海潛水員", "忍者",
                "海盜船長", "殭屍倖存者", "考古學家", "私家偵探", "米其林主廚"
            ],
            places: [
                "在全聯福利中心", "在 101 大樓頂端", "在撒哈拉沙漠", "在 IKEA 迷宮",
                "在核電廠控制室", "在百慕達三角洲", "在霍格華茲", "在海底兩萬哩",
                "在喪屍圍城的賣場", "在時光機裡", "在直播間", "在黑洞邊緣",
                "在金字塔密室", "在古羅馬競技場", "在元宇宙", "在召喚峽谷"
            ],
            formats: [
                q => `【緊急快訊】\n${q}\n專家警告：後果不堪設想。`,
                q => `【探險日記】\n今天遇到難題：\n${q}`,
                q => `A：「我問你。」\nB：「說。」\nA：「${q}」`,
                q => `#急 #求救\n${q}\n在線等！`,
                q => `【主線任務】\nNPC 給你謎題：\n${q}`,
                q => `【短影音挑戰】\n30 秒內回答：\n「${q}」`
            ]
        };

        // ==========================================
        // 2️⃣ 情境包裝器
        // ==========================================
        const CONTEXT_WRAPPERS = [];

        // roleplay 類
        for (let i = 0; i < 20; i++) {
            CONTEXT_WRAPPERS.push((q) => {
                const r = pick(DB.roles);
                const p = pick(DB.places);
                return `【情境：${r}】\n你現在${p}，面臨問題：\n「${q}」\n請做出判斷。`;
            });
        }

        // format 類
        DB.formats.forEach(fn => CONTEXT_WRAPPERS.push(fn));

        // ==========================================
        // 3️⃣ 攔截 registerTemplate（關鍵）
        // ==========================================
        const rawRegister = G.registerTemplate.bind(G);

        G.registerTemplate = function (id, fn, tags) {
            // A. 原始模板照常註冊
            rawRegister(id, fn, tags);

            // B. 裂變版本
            const wrapper = pick(CONTEXT_WRAPPERS);
            if (!wrapper) return;

            const fissionId = `${id}__fission`;

            const fissionFn = function (ctx, rnd) {
                const base = fn(ctx, rnd);
                if (!base || typeof base.question !== 'string') return base;

                return {
                    ...base,
                    question: wrapper(base.question),
                    concept: base.concept ? `${base.concept}（素養應用）` : "素養應用",
                    templateId: fissionId
                };
            };

            rawRegister(
                fissionId,
                fissionFn,
                [...(tags || []), "素養題", "情境應用"]
            );
        };

        console.log(
            `✅ 自動裂變工廠已啟動：${CONTEXT_WRAPPERS.length} 種情境可用`
        );
    }

    initFactory();

})(window);
