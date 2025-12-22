(function(global){
    'use strict';

    function initFactory() {
        const G = global.RigorousGenerator || (window.global && window.global.RigorousGenerator);
        
        // 1. 等待引擎就緒
        if (!G) { setTimeout(initFactory, 50); return; }

        // 2. 定義情境資料庫
        const DB = {
            roles: ["AI工程師", "YouTuber", "外送員", "偵探", "太空人", "主廚", "電競選手", "魔法師", "穿越者"],
            places: ["在便利商店", "在火星基地", "在古老圖書館", "在直播間", "在無人島", "在跨年晚會", "在異世界"],
            formats: [
                { type: "news", tpl: (q)=>`【快訊】據報導：\n${q}\n專家表示這將影響重大。` },
                { type: "chat", tpl: (q)=>`A：「考你一題：${q}」\nB：「這簡單...」` },
                { type: "diary", tpl: (q)=>`【日記】今天老師問了一個問題：\n${q}\n我該怎麼回答？` },
                { type: "guide", tpl: (q)=>`【攻略】新手教學：\n${q}\n學會這個就能通關！` },
                { type: "drama", tpl: (q)=>`【獨白】To be or not to be...\n${q}\n這就是問題所在。` }
            ]
        };

        const CONTEXT_WRAPPERS = { 'standard': (q) => q };
        const { pick } = G.utils;

        // 生成 30 種角色扮演情境
        for (let i = 0; i < 30; i++) {
            CONTEXT_WRAPPERS[`roleplay_${i}`] = (q) => {
                const r = pick(DB.roles);
                const p = pick(DB.places);
                return `【情境：${r}】\n你${p}，遇到一個難題：\n「${q}」\n身為專業的${r}，請選出正確答案。`;
            };
        }
        // 生成格式情境
        DB.formats.forEach(fmt => { CONTEXT_WRAPPERS[fmt.type] = fmt.tpl; });

        // 3. 掛載裂變註冊功能
        G.autoFissionRegister = function(originalId, originalFunc, tags, rawRegister) {
            // A. 註冊原始版 (標籤: 基礎)
            rawRegister.call(G, originalId, originalFunc, [...tags, "基礎題"]);

            // B. 註冊裂變版 (隨機挑選一種情境包裝)
            // 為了不讓題目爆炸，我們每次只生成一個變體
            const keys = Object.keys(CONTEXT_WRAPPERS).filter(k => k !== 'standard');
            const key = pick(keys);
            const wrapper = CONTEXT_WRAPPERS[key];
            const fissionId = `${originalId}_fission_${key}`;

            const newFunc = function(ctx, rnd) {
                const data = originalFunc(ctx, rnd);
                // 只有當題目是字串時才包裝
                if (data && typeof data.question === 'string') {
                    return {
                        ...data,
                        question: wrapper(data.question),
                        concept: `${data.concept || ''} (素養應用)`,
                        templateId: fissionId
                    };
                }
                return data;
            };
            // 變體版多加 "素養" 標籤
            rawRegister.call(G, fissionId, newFunc, [...tags, "素養題", "情境應用"]);
        };

        console.log(`✅ 自動裂變工廠已就緒 (含 ${Object.keys(CONTEXT_WRAPPERS).length} 種情境模組)`);
    }

    initFactory();

})(window);
