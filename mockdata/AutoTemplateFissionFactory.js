(function (global) {
    "use strict";

    function initFactory() {
        const G = global.RigorousGenerator || (window.global && window.global.RigorousGenerator);

        // 引擎未準備 → 快速重試
        if (!G) { setTimeout(initFactory, 10); return; }

        console.log("🏭 [Factory] Ultra 100-Context Fission Factory Loaded...");

        /******************************************************
         * 1. 情境資料庫
         ******************************************************/
        const DB = {
            roles: [
                "AI工程師","YouTuber","外送員","偵探","太空人","米其林主廚","電競選手",
                "魔法師","時空旅人","富二代","記者","黑客","配音員","小說家","科學家",
                "忍者","勇者","巫師","工程師","心理師","軍官","主播","導演","街頭藝人",
                "機器人技師","醫生","生存專家","考古學家","機師","主播主","占卜師","修道士",
                "保全","動物訓練師","大學生","CEO","畫家","程式少年","救生員","體育老師",
                "建築師","音樂製作人","DJ","特務","宇宙駕駛員","火箭技師","外星研究員"
            ],
            places: [
                "在便利商店","在火星基地","在古老圖書館","在直播間","在無人島","在跨年晚會",
                "在異世界地牢","在股市交易所","在叢林深處","在火山口附近","在月球表面",
                "在夢境世界","在超市收銀台","在機房裡","在雲端都市","在海底基地",
                "在末日避難所","在時光隧道內","在魔法森林中","在太空船駕駛艙",
                "在 VR 世界裡","在大雪山腳下","在廢棄醫院","在秘密實驗室",
                "在地鐵站月台","在巨大飛船甲板","在暴風雪中","在無限走廊","在天台邊緣"
            ],
            formats: [
                { type: "news",  tpl: q => `【重大快訊】最新消息剛進來：\n${q}\n相關單位已介入調查。` },
                { type: "chat",  tpl: q => `A：「欸來猜一題。」\nB：「好。」\nA：「${q}」\nB：「等我一下…」` },
                { type: "diary", tpl: q => `【日記】今天我看到一串奇怪的句子：\n「${q}」\n我覺得事情不單純。` },
                { type: "guide", tpl: q => `【任務教學】你遇到 NPC，他問：\n${q}\n答對可以獲得任務獎勵。` },
                { type: "drama", tpl: q => `（燈光暗下）主角低聲說：\n「${q}」\n命運開始轉動。` },
                { type: "forum", tpl: q => `[問卦] 有沒有這題的八卦？\n${q}\n求解，急。` }
            ]
        };

        /******************************************************
         * 2. 情境包裝器（超級強化版）
         ******************************************************/
        const pick = (G.utils && G.utils.pick)
            ? G.utils.pick
            : (arr) => arr[Math.floor(Math.random() * arr.length)];

        const WRAPPERS = {
            standard: q => q
        };

        // 🚀 **新增 100 種角色扮演情境**
        for (let i = 0; i < 100; i++) {
            WRAPPERS[`roleplay_${i}`] = (q) => {
                const r = pick(DB.roles);
                const p = pick(DB.places);
                return `【情境：${r}】\n你現在${p}，突然遇到一道題目：\n「${q}」\n身為${r}，你該怎麼應對？`;
            };
        }

        // 加入格式型情境
        DB.formats.forEach(fmt => WRAPPERS[fmt.type] = fmt.tpl);

        console.log(`🎨 [Factory] 已建立 ${Object.keys(WRAPPERS).length} 種情境包裝器！`);

        /******************************************************
         * 3. autoFissionRegister - 核心裂變邏輯
         ******************************************************/
        G.autoFissionRegister = function (originalId, originalFunc, tags = [], rawRegister) {

            // 原版題
            rawRegister.call(G, originalId, originalFunc, [...tags, "基礎題"]);

            // 裂變版
            const keys = Object.keys(WRAPPERS).filter(k => k !== "standard");
            const wrapperKey = pick(keys);
            const wrapper = WRAPPERS[wrapperKey];
            const fissionId = `${originalId}_fission_${wrapperKey}`;

            const fissionFunc = function (ctx, rnd) {
                const data = originalFunc(ctx, rnd);
                if (data && typeof data.question === "string") {
                    return {
                        ...data,
                        question: wrapper(data.question),
                        concept: (data.concept || "") + " (素養應用)",
                        templateId: fissionId
                    };
                }
                return data;
            };

            rawRegister.call(G, fissionId, fissionFunc, [...tags, "素養題", "情境應用"]);
        };

        console.log("✅ [Factory] Ultra Fission Factory Ready!");
    }

    initFactory();

})(window);
