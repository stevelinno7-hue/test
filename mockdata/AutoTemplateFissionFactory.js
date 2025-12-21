(function(global){
    'use strict';

    // 定義啟動函式
    function initFactory() {
        const G = global.RigorousGenerator || (window.global && window.global.RigorousGenerator);
        
        // 1. 如果引擎還沒好，等待一下
        if (!G) {
            setTimeout(initFactory, 50);
            return;
        }

        // ==========================================
        //  1. 情境資料庫 (Context Database)
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
                { type: "news", tpl: (q)=>`【緊急快訊】據最新報導指出：\n${q}\n專家表示這將影響全球局勢。` },
                { type: "diary", tpl: (q)=>`【探險日記 Day 42】\n今天發生了奇怪的事：\n${q}\n我該怎麼辦？` },
                { type: "chat", tpl: (q)=>`A：「欸，考你一題。」\nB：「放馬過來。」\nA：「${q}」\nB：「這...」` },
                { type: "post", tpl: (q)=>`#急 #在線等 #求救\n${q}\n答對的請喝珍奶！🥤` },
                { type: "quest", tpl: (q)=>`【主線任務更新】\nNPC 給了你一個謎題：\n${q}\n解開後可獲得傳說裝備。` },
                { type: "video", tpl: (q)=>`【抖音挑戰】一分鐘內回答：\n「${q}」\n你就是天才！` }
            ]
        };

        const CONTEXT_WRAPPERS = { 'standard': (q) => q };
        const { pick } = G.utils;

        // 生成角色扮演情境
        for (let i = 0; i < 30; i++) {
            CONTEXT_WRAPPERS[`roleplay_${i}`] = (q) => {
                const r = pick(DB.roles);
                const p = pick(DB.places);
                return `【情境：${r}】\n你現在${p}，面對一個難題：\n「${q}」\n身為專業的${r}，你該如何解決？`;
            };
        }
        // 生成格式情境
        DB.formats.forEach(fmt => { CONTEXT_WRAPPERS[fmt.type] = fmt.tpl; });

        // ==========================================
        //  2. 掛載裂變功能 (Bootstrap 會呼叫這個)
        // ==========================================
        G.autoFissionRegister = function(originalId, originalFunc, tags, rawRegister) {
            // A. 註冊原始版本
            rawRegister.call(G, originalId, originalFunc, tags);

            // B. 註冊裂變版本 (隨機挑選一種情境)
            const wrapperKeys = Object.keys(CONTEXT_WRAPPERS).filter(k => k !== 'standard');
            const randomKey = pick(wrapperKeys);
            const wrapperFunc = CONTEXT_WRAPPERS[randomKey];
            const fissionId = `${originalId}_fission_${randomKey}`;
            
            const newFunc = function(ctx, rnd) {
                const baseData = originalFunc(ctx, rnd);
                if (baseData && typeof baseData.question === 'string') {
                    return {
                        ...baseData,
                        question: wrapperFunc(baseData.question),
                        concept: `${baseData.concept} (素養應用)`,
                        templateId: fissionId
                    };
                }
                return baseData;
            };
            rawRegister.call(G, fissionId, newFunc, [...tags, "素養題", "情境應用"]);
        };

        console.log(`✅ 自動裂變工廠已就緒：已生成 ${Object.keys(CONTEXT_WRAPPERS).length} 種情境模組。`);
    }

    // 立即啟動
    initFactory();

})(window);
