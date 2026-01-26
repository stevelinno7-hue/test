(function(global){
    'use strict';

    // ------------------------------------------------------------------
    //  V7.8 避難所版 (Safe Harbor Repository)
    //  將資料備份至獨立變數，防止主引擎重置導致資料遺失
    // ------------------------------------------------------------------
    
    console.log("🚀 [Chinese V7.8] 啟動中...");

    // 1. 定義資料 (不依賴任何外部變數)
    const chiData = [
        // 1. 成語判讀
        { q: "白駒過隙", a: "形容時間過得很快", tag: ["國七","成語"] },
        { q: "指鹿為馬", a: "比喻混淆是非", tag: ["國七","成語"] },
        { q: "畫蛇添足", a: "比喻多此一舉", tag: ["國七","成語"] },
        { q: "杯弓蛇影", a: "比喻疑神疑鬼，自相驚擾", tag: ["國七","成語"] },
        { q: "班門弄斧", a: "在行家面前賣弄本事", tag: ["國七","成語"] },
        { q: "如火如荼", a: "形容氣勢旺盛或氣氛熱烈", tag: ["國八","成語"] },
        { q: "櫛風沐雨", a: "形容奔波勞碌，不避風雨", tag: ["國八","成語"] },
        { q: "韋編三絕", a: "形容讀書勤奮", tag: ["國八","成語"] },
        { q: "三令五申", a: "再三命令告誡", tag: ["國八","成語"] },
        { q: "破釜沈舟", a: "比喻做事果決，義無反顧", tag: ["國九","成語"] },
        { q: "臥薪嘗膽", a: "刻苦自勵，發憤圖強", tag: ["國九","成語"] },
        { q: "罄竹難書", a: "形容罪惡極多，無法寫盡", tag: ["國九","成語"] },
        
        // 2. 修辭
        { q: "白髮三千丈，緣愁似個長", a: "誇飾", tag: ["國八","修辭"] },
        { q: "感時花濺淚，恨別鳥驚心", a: "轉化(擬人)", tag: ["國八","修辭"] },
        { q: "那雪白的羽毛，像是天使的翅膀", a: "譬喻(明喻)", tag: ["國七","修辭"] },
        { q: "吱吱喳喳的麻雀", a: "摹寫(聽覺)", tag: ["國七","修辭"] },
        { q: "在天願作比翼鳥，在地願為連理枝", a: "對偶", tag: ["國九","修辭"] },
        
        // 3. 國學 & 古文
        { q: "而立之年", a: "30歲", tag: ["國七","年齡"] },
        { q: "不惑之年", a: "40歲", tag: ["國七","年齡"] },
        { q: "學而時習之，不亦說乎", a: "論語 (孔子弟子)", tag: ["國七","古文"] },
        { q: "三人行，必有我師焉", a: "論語 (強調學習)", tag: ["國七","古文"] },
        { q: "舉頭望明月，低頭思故鄉", a: "李白 (靜夜思)", tag: ["國七","唐詩"] },
        { q: "登鸛雀樓", a: "王之渙 (盛唐邊塞)", tag: ["國七","唐詩"] },
        { q: "背影", a: "朱自清 (父愛)", tag: ["國七","現代文"] },
        { q: "雅量", a: "宋晶宜 (包容尊重)", tag: ["國七","現代文"] }
    ];

    // 2. 建立備份倉庫 (這是關鍵！)
    if (!window.__CHINESE_REPO__) {
        window.__CHINESE_REPO__ = {};
    }

    // 3. 處理並儲存
    const combinations = new Set();
    chiData.forEach(item => {
        if(item.tag && item.tag.length >= 2) {
            combinations.add(`${item.tag[0].trim()}_${item.tag[1].trim()}`);
        }
    });

    combinations.forEach(combo => {
        const [grade, topic] = combo.split('_');
        const pool = chiData.filter(q => q.tag[0].trim() === grade && q.tag[1].trim() === topic);

        if (pool.length > 0) {
            const rawTags = ["chinese", "Chinese", "國文", "語文", topic, grade];
            const uniqueTags = [...new Set(rawTags)];
            
            // 定義生成函數
            const generatorFunc = (ctx, rnd) => {
                const item = pool[Math.floor(Math.random() * pool.length)];
                const others = chiData.filter(x => x.tag[1] === topic && x.q !== item.q);
                
                const wrongOpts = others.sort(() => 0.5 - Math.random()).slice(0, 3).map(x => x.a);
                while(wrongOpts.length < 3) wrongOpts.push("以上皆非");
                
                const opts = [item.a, ...wrongOpts].sort(() => 0.5 - Math.random());
                
                let qText = topic === "成語" ? `「${item.q}」的意思為何？` : `關於「${item.q}」，敘述何者正確？`;

                return {
                    question: `【${topic}】${qText}`,
                    options: opts,
                    answer: opts.indexOf(item.a),
                    concept: topic,
                    subject: "chinese",
                    tags: uniqueTags
                };
            };
            
            // 屬性刺青
            generatorFunc.subject = "chinese";
            generatorFunc.tags = uniqueTags;

            // ID
            const templateId = `chi_${grade}_${topic}_safe`;

            // ★ 存入安全避難所
            window.__CHINESE_REPO__[templateId] = {
                func: generatorFunc,
                tags: uniqueTags,
                subject: "chinese"
            };

            // ★ 嘗試存入主引擎 (如果存在)
            const G = window.RigorousGenerator;
            if (G && typeof G.registerTemplate === 'function') {
                G.registerTemplate(templateId, generatorFunc, uniqueTags);
            }
        }
    });

    console.log(`🎉 國文題庫 (V7.8) 已存入安全避難所 (__CHINESE_REPO__)，共 ${combinations.size} 組。`);

})(window);
