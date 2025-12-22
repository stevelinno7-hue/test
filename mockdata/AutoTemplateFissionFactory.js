(function(global){
    'use strict';

    function initFactory() {
        // 1. 取得引擎實例 (優先嘗試全域變數)
        const G = global.RigorousGenerator || (window.global && window.global.RigorousGenerator);
        
        // 如果引擎還沒好，短暫等待後重試 (加快檢查頻率到 10ms)
        if (!G) { setTimeout(initFactory, 10); return; }

        console.log("🏭 [Factory] 裂變工廠啟動中...");

        // 2. 定義情境資料庫 (Context DB)
        const DB = {
            roles: ["AI工程師", "YouTuber", "外送員", "偵探", "太空人", "米其林主廚", "電競選手", "魔法師", "時空旅人", "富二代"],
            places: ["在便利商店", "在火星基地", "在古老圖書館", "在直播間", "在無人島", "在跨年晚會", "在異世界地牢", "在股市交易所"],
            formats: [
                { type: "news", tpl: (q)=>`【重大快訊】據最新報導指出：\n${q}\n專家表示這將對未來產生深遠影響。` },
                { type: "chat", tpl: (q)=>`A：「欸，考你一題，答對請你喝飲料。」\nB：「好啊，放馬過來。」\nA：「${q}」\nB：「呃...讓我想想...」` },
                { type: "diary", tpl: (q)=>`【生存日記 Day 42】\n今天在探索廢墟時，發現了一行神秘文字：\n「${q}」\n這一定是解開謎題的關鍵。` },
                { type: "guide", tpl: (q)=>`【攻略】新手村教學任務 (3/5)：\nNPC 村長問了你一個問題：\n${q}\n答對可獲得「新手的寶劍」。` },
                { type: "drama", tpl: (q)=>`【獨白】(主角望著星空，深吸一口氣)\n「${q}」\n這就是我一直以來在尋找的答案嗎？` },
                { type: "forum", tpl: (q)=>`[問卦] 有沒有這題的八卦？\n${q}\n在線等，急！` }
            ]
        };

        const CONTEXT_WRAPPERS = { 'standard': (q) => q };
        
        // 防呆：確保 utils 存在
        const pick = (G.utils && G.utils.pick) ? G.utils.pick : (arr) => arr[Math.floor(Math.random() * arr.length)];

        // 生成 30 種角色扮演情境
        for (let i = 0; i < 30; i++) {
            CONTEXT_WRAPPERS[`roleplay_${i}`] = (q) => {
                const r = pick(DB.roles);
                const p = pick(DB.places);
                return `【情境：${r}】\n你現在${p}，突然遇到一個難題：\n「${q}」\n身為專業的${r}，你該如何解決？`;
            };
        }
        // 生成格式情境
        DB.formats.forEach(fmt => { CONTEXT_WRAPPERS[fmt.type] = fmt.tpl; });

        // 3. 掛載裂變註冊功能 (這是核心！)
        G.autoFissionRegister = function(originalId, originalFunc, tags, rawRegister) {
            // A. 註冊原始版 (標籤: 基礎題)
            rawRegister.call(G, originalId, originalFunc, [...(tags||[]), "基礎題"]);

            // B. 註冊裂變版 (隨機挑選一種情境包裝)
            const keys = Object.keys(CONTEXT_WRAPPERS).filter(k => k !== 'standard');
            const key = pick(keys);
            const wrapper = CONTEXT_WRAPPERS[key];
            const fissionId = `${originalId}_fission_${key}`;

            const newFunc = function(ctx, rnd) {
                const data = originalFunc(ctx, rnd);
                // 只有當題目是字串時才包裝，避免破壞物件結構
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
            
            // 變體版多加 "素養題" 標籤
            rawRegister.call(G, fissionId, newFunc, [...(tags||[]), "素養題", "情境應用"]);
        };

        console.log(`✅ [Factory] 自動裂變工廠已就緒 (含 ${Object.keys(CONTEXT_WRAPPERS).length} 種情境)`);
    }

    // 立即啟動
    initFactory();

})(window);
