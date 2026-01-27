(function(global){
    'use strict';
    window.__CHEMISTRY_REPO__ = window.__CHEMISTRY_REPO__ || {};

    const Utils = {
        shuffle: (arr) => arr.sort(() => Math.random() - 0.5),
        rnd: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
        pick: (arr) => arr[Utils.rnd(0, arr.length-1)]
    };

    // 簡單題型模板集（可擴充）
    const atomPool = [
        {s:'H', w:1}, {s:'C', w:12}, {s:'N', w:14}, {s:'O', w:16},
        {s:'Na', w:23}, {s:'S', w:32}, {s:'Cl', w:35.5}, {s:'Ca', w:40},
        {s:'K', w:39}, {s:'Mg', w:24}
    ];

    const phExamples = [1,2,3,4,5,6,7,8,9,10,11,12,13,14];
    const conceptPool = [
        {q:"原子核中不帶電的粒子是？", a:"中子", o:["質子","電子","離子"], t:"原子結構"},
        {q:"空氣中含量最多的氣體是？", a:"氮氣", o:["氧氣","氬氣","二氧化碳"], t:"氣體"},
        {q:"燃燒反應屬於哪一種類型？", a:"氧化反應", o:["還原反應","中和反應","物理變化"], t:"反應"},
        {q:"將鹽酸與氫氧化鈉混合，會產生？", a:"鹽類與水", o:["酸氣","沉澱物","氫氣"], t:"酸鹼中和"},
        {q:"下列何者屬於有機化合物？", a:"酒精 (C2H5OH)", o:["食鹽 (NaCl)","水 (H2O)","硫酸 (H2SO4)"], t:"有機化學"},
        {q:"乾冰昇華是什麼變化？", a:"物理變化", o:["化學變化","核反應","燃燒"], t:"物質變化"},
        {q:"肥皂去汙的原理是？", a:"親油端吸油，親水端拉入水中", o:["酸鹼中和","氧化還原","產生酵素"], t:"生活化學"}
    ];

    const stoichTemplates = [
        {q:"若 1 mol 的 A 與 2 mol 的 B 完全反應生成 1 mol 的 C，若有 3 mol A 與 4 mol B，限制試劑為何？", a:"B", o:["A","C","無限制試劑"], t:"化學計量"},
        {q:"1 mol 氣體在標準狀態（STP）體積約為多少？", a:"22.4 L", o:["11.2 L","44.8 L","1 L"], t:"氣體定律"},
        {q:"若 0.5 mol NaCl 溶於 0.5 L 水中，濃度為多少 mol/L？", a:"1.0 M", o:["0.5 M","0.25 M","2.0 M"], t:"濃度計算"}
    ];

    const gasLawTemplates = [
        {q:"玻意耳定律描述壓力與體積的關係為何？", a:"P 與 V 成反比", o:["P 與 V 成正比","P 與 T 成反比","V 與 T 無關"], t:"氣體定律"},
        {q:"查理定律指出在壓力不變下，氣體體積與何者成正比？", a:"絕對溫度 (K)", o:["壓力","摩爾數","分子量"], t:"氣體定律"}
    ];

    const titrationTemplates = [
        {q:"滴定曲線中等當點附近 pH 變化劇烈，等當點代表什麼？", a:"酸與鹼當量相等", o:["溶液中無離子","溶液完全中性化","溶液濃度為 1M"], t:"酸鹼滴定"},
        {q:"緩衝溶液的主要功能是？", a:"抵抗 pH 變化", o:["增加溶液導電度","降低溶液溫度","促進沉澱"], t:"緩衝溶液"}
    ];

    const redoxTemplates = [
        {q:"氧化數增加代表何種反應？", a:"被氧化", o:["被還原","中和反應","沉澱反應"], t:"氧化還原"},
        {q:"在氧化還原反應中，電子由何者流向何者？", a:"由還原劑流向氧化劑", o:["由氧化劑流向還原劑","由酸流向鹼","由陰極流向陽極"], t:"電化學"}
    ];

    const organicTemplates = [
        {q:"下列哪一個是羧酸的官能基？", a:"-COOH", o:["-OH","-NH2","-CHO"], t:"有機官能基"},
        {q:"烯類分子中含有哪種鍵？", a:"碳碳雙鍵", o:["碳碳三鍵","碳碳單鍵不存在","碳氫雙鍵"], t:"有機化學"}
    ];

    const labSafety = [
        {q:"實驗室中若遇到化學品濺到皮膚，第一步應該做什麼？", a:"用大量水沖洗", o:["用紙巾擦拭","立即用酒精消毒","等待老師處理"], t:"實驗安全"},
        {q:"使用 Bunsen 瓦斯時應注意什麼？", a:"確認無瓦斯外漏並點火後調整火焰", o:["直接用手觸摸火焰","將易燃物放在火源旁","關閉通風"], t:"實驗安全"}
    ];

    // 計算目前已有題目數（以 key 數量計）
    const existingKeys = Object.keys(window.__CHEMISTRY_REPO__);
    let currentCount = existingKeys.length;

    // 目標題數
    const TARGET = 150;
    let genIndex = 0;

    // 生成器函式：根據類型產生題目物件
    function makeMWQuestion(i) {
        const a1 = Utils.pick(atomPool);
        const a2 = Utils.pick(atomPool);
        const n1 = Utils.rnd(1,3);
        const n2 = Utils.rnd(1,4);
        const mw = (a1.w * n1) + (a2.w * n2);
        const formula = `${a1.s}${n1>1? n1:''}${a2.s}${n2>1? n2:''}`;
        const distractors = [Math.round(mw + Utils.rnd(2,12)), Math.round(Math.abs(mw - Utils.rnd(1,8))), Math.round(mw * (1 + (Utils.rnd(1,3)/10)))];
        const opts = Utils.shuffle([mw, ...distractors]);
        return {
            question: `【分子量】已知原子量：${a1.s}=${a1.w}, ${a2.s}=${a2.w}。求分子 ${formula} 的分子量？`,
            options: opts,
            answer: opts.indexOf(mw),
            explanation: [`計算：(${a1.w} × ${n1}) + (${a2.w} × ${n2}) = ${mw}`],
            subject: "chemistry",
            tags: ["chemistry","分子量","自動生成"]
        };
    }

    function makePHQuestion(ph) {
        const type = ph < 7 ? "酸性" : (ph > 7 ? "鹼性" : "中性");
        const opts = Utils.shuffle(["酸性","中性","鹼性","無法判斷"]);
        return {
            question: `【酸鹼】某水溶液測得 pH 值為 ${ph}，試問其性質為何？`,
            options: opts,
            answer: opts.indexOf(type),
            explanation: [`pH < 7 為酸性，pH = 7 為中性，pH > 7 為鹼性`],
            subject: "chemistry",
            tags: ["chemistry","酸鹼","自動生成"]
        };
    }

    function makeFromTemplate(tpl) {
        const opts = Utils.shuffle([tpl.a, ...tpl.o]);
        return {
            question: `【${tpl.t}】${tpl.q}`,
            options: opts,
            answer: opts.indexOf(tpl.a),
            explanation: [`正確答案：${tpl.a}`],
            subject: "chemistry",
            tags: ["chemistry", tpl.t, "自動生成"]
        };
    }

    // 主要生成迴圈：依序產生不同類型題目直到達標
    while (currentCount < TARGET) {
        const id = `chem_auto_${genIndex++}`;
        let payload;

        // 決定題型分布：多樣化比例
        const r = genIndex % 10;
        if (r === 0 || r === 1 || r === 2) {
            // 分子量題（約 30%）
            payload = makeMWQuestion(genIndex);
        } else if (r === 3 || r === 4) {
            // pH 題（約 20%）
            const ph = Utils.pick(phExamples);
            payload = makePHQuestion(ph);
        } else if (r === 5) {
            // 概念題（從 conceptPool）
            payload = makeFromTemplate(Utils.pick(conceptPool));
        } else if (r === 6) {
            // 計量/莫耳/氣體題
            payload = makeFromTemplate(Utils.pick(stoichTemplates));
        } else if (r === 7) {
            // 氣體定律或滴定
            payload = makeFromTemplate(Utils.pick(gasLawTemplates.concat(titrationTemplates)));
        } else if (r === 8) {
            // 氧化還原或有機
            payload = makeFromTemplate(Utils.pick(redoxTemplates.concat(organicTemplates)));
        } else {
            // 實驗安全或其他生活化學
            payload = makeFromTemplate(Utils.pick(labSafety));
        }

        // 封裝成 func 與 metadata，與既有格式一致
        window.__CHEMISTRY_REPO__[id] = {
            func: (() => {
                const p = payload;
                return () => p;
            })(),
            tags: payload.tags || ["chemistry","自動生成"],
            subject: "chemistry"
        };

        currentCount = Object.keys(window.__CHEMISTRY_REPO__).length;
    }

    console.log(`✅ 已自動生成題庫，總題數達到 ${Object.keys(window.__CHEMISTRY_REPO__).length} 題（目標 ${TARGET} 題）。`);
})(window);
