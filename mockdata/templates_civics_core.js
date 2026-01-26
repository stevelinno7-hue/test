(function(global){
    'use strict';
    console.log("⚖️ [Civics V9.0] 公民核心題庫 (法律/經濟/政治) 啟動...");

    window.__CIVICS_REPO__ = window.__CIVICS_REPO__ || {};

    const Utils = {
        shuffle: (arr) => arr.sort(() => Math.random() - 0.5),
        rnd: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
    };

    // =================================================================
    // 工廠 A: 法律年齡自動生成 (10 題)
    // =================================================================
    // 根據台灣現行法律 (民法18歲成年, 刑法18歲完全責任)
    const lawAges = [
        {age: 18, type: "民法", status: "完全行為能力人", desc: "可獨立簽訂契約、結婚"},
        {age: 7, type: "民法", status: "無行為能力人 (7歲以下)", desc: "需由法定代理人代為意思表示"},
        {age: 14, type: "刑法", status: "無責任能力人 (14歲以下)", desc: "不罰 (但得施以保安處分)"},
        {age: 18, type: "刑法", status: "完全責任能力人", desc: "需負完全刑事責任"},
        {age: 80, type: "刑法", status: "得減輕其刑", desc: "滿80歲人之行為，得減輕其刑"}
    ];

    for(let i=0; i<10; i++) {
        const law = lawAges[i % lawAges.length];
        const id = `civ_law_${i}`;
        const tags = ["civics", "公民", "法律", "國八"];

        const func = () => {
            const opts = Utils.shuffle(["完全行為能力", "限制行為能力", "無行為能力", "完全責任能力", "無責任能力"]);
            // 確保正確答案在選項中
            if(!opts.includes(law.status.split(" ")[0])) opts[0] = law.status.split(" ")[0];
            
            return {
                question: `【法律】依據我國《${law.type}》，年齡為 ${law.age} 歲者，在法律上的狀態通常為？`,
                options: opts,
                answer: opts.indexOf(law.status.split(" ")[0]) >= 0 ? opts.indexOf(law.status.split(" ")[0]) : 0, // 簡化處理
                explanation: [
                    `依據《${law.type}》，${law.status}。`,
                    `說明：${law.desc}`,
                    ``
                ],
                subject: "civics", tags: tags
            };
        };
        // 修正上面的 answer 邏輯，直接用正確字串匹配
        func.gen = () => { // 重新封裝一個乾淨的
           const correct = law.status.split(" ")[0]; // 取短名
           const others = ["完全行為能力人", "限制行為能力人", "無行為能力人", "無責任能力人", "得減輕其刑"].filter(x=>!x.includes(correct));
           const opts = Utils.shuffle([law.status, ...others.slice(0,3)]);
           return {
               question: `【法律】依據我國《${law.type}》，${law.age} 歲通常被視為？`,
               options: opts,
               answer: opts.indexOf(law.status),
               explanation: [`說明：${law.desc}`, `

[Image of justice scale]
`],
               subject: "civics", tags: tags
           };
        };
        window.__CIVICS_REPO__[id] = { func: func.gen, tags, subject: "civics" };
    }

    // =================================================================
    // 工廠 B: 經濟學供需法則 (15 題)
    // =================================================================
    const scenarios = [
        {event: "颱風來襲，蔬菜受損", curve: "供給減少", price: "上漲", qty: "減少"},
        {event: "手機技術突破，生產成本下降", curve: "供給增加", price: "下跌", qty: "增加"},
        {event: "夏天到了，冰品大受歡迎", curve: "需求增加", price: "上漲", qty: "增加"},
        {event: "新聞報導某產品致癌", curve: "需求減少", price: "下跌", qty: "減少"},
        {event: "政府發放消費券", curve: "需求增加", price: "上漲", qty: "增加"}
    ];

    for(let i=0; i<15; i++) {
        const s = scenarios[i % scenarios.length];
        const id = `civ_econ_${i}`;
        const tags = ["civics", "公民", "經濟", "國九"];

        const func = () => {
            const qType = Math.random() > 0.5 ? "price" : "curve";
            let qText, ans, opts;
            
            if (qType === "price") {
                qText = `「${s.event}」，依據供需法則，該商品的市場價格與交易量會如何變化？`;
                ans = `價格${s.price}，數量${s.qty}`;
                opts = Utils.shuffle(["價格上漲，數量增加", "價格下跌，數量增加", "價格上漲，數量減少", "價格下跌，數量減少"]);
            } else {
                qText = `「${s.event}」，這會造成供需圖上的哪種變動？`;
                ans = s.curve;
                opts = Utils.shuffle(["供給增加", "供給減少", "需求增加", "需求減少"]);
            }
            
            return {
                question: `【經濟】${qText}`,
                options: opts,
                answer: opts.indexOf(ans),
                explanation: [
                    `分析：${s.event} 會導致 ${s.curve}。`,
                    `結果：市場均衡點移動，${ans}。`,
                    `

[Image of supply and demand curve shift]
`
                ],
                subject: "civics", tags: tags
            };
        };
        window.__CIVICS_REPO__[id] = { func, tags, subject: "civics" };
    }

    // =================================================================
    // 工廠 C: 政府體制 (五權分立) (15 題)
    // =================================================================
    const govs = [
        {name: "立法院", power: "制定法律、審查預算", check: "對行政院提出不信任案"},
        {name: "行政院", power: "執行政策、編列預算", check: "對立法院決議提覆議"},
        {name: "司法院", power: "解釋憲法、審判", check: "宣告法律違憲"},
        {name: "監察院", power: "彈劾、糾舉、審計", check: "監督公務人員"},
        {name: "考試院", power: "公務員考試、任用", check: "管理公務人力"}
    ];

    govs.forEach((g, idx) => {
        const id = `civ_gov_${idx}`;
        const tags = ["civics", "公民", "政治", "國八"];
        window.__CIVICS_REPO__[id] = {
            func: () => {
                const wr = Utils.shuffle(govs.filter(x => x.name !== g.name)).slice(0, 3).map(x => x.name);
                const opts = Utils.shuffle([g.name, ...wr]);
                return {
                    question: `【政治】在我國政府體制中，負責「${g.power}」的機關是？`,
                    options: opts,
                    answer: opts.indexOf(g.name),
                    explanation: [`${g.name} 的職權包括：${g.power}。`, ``],
                    subject: "civics", tags: tags
                };
            }, tags: tags, subject: "civics"
        };
        
        // 變體：制衡
        const id2 = `civ_gov_check_${idx}`;
        window.__CIVICS_REPO__[id2] = {
            func: () => {
                const wr = Utils.shuffle(govs.filter(x => x.check !== g.check)).slice(0, 3).map(x => x.check);
                const opts = Utils.shuffle([g.check, ...wr]);
                return {
                    question: `【政治】${g.name} 可以透過下列何種方式制衡其他權力？`,
                    options: opts,
                    answer: opts.indexOf(g.check),
                    explanation: [`${g.name} 可行使 ${g.check}。`, `

[Image of checks and balances diagram]
`],
                    subject: "civics", tags: tags
                };
            }, tags: tags, subject: "civics"
        };
    });

})(window);
