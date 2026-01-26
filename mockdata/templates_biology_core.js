(function(global){
    'use strict';
    console.log("🧬 [Biology V9.0] 生物工廠：正在生產 50 道試題...");
    window.__BIOLOGY_REPO__ = window.__BIOLOGY_REPO__ || {};
    const U = { shuffle: (arr) => arr.sort(() => Math.random() - 0.5) };

    const db = [
        {q:"細胞能量工廠", a:"粒線體", c:"細胞"}, {q:"遺傳物質所在", a:"細胞核", c:"細胞"}, {q:"光合作用場所", a:"葉綠體", c:"細胞"},
        {q:"攜帶氧氣", a:"紅血球", c:"恆定"}, {q:"防禦疾病", a:"白血球", c:"恆定"}, {q:"凝血功能", a:"血小板", c:"恆定"},
        {q:"過濾尿液", a:"腎臟", c:"排泄"}, {q:"吸收養分", a:"小腸", c:"消化"}, {q:"分泌膽汁", a:"肝臟", c:"消化"},
        {q:"控制血糖(降)", a:"胰島素", c:"協調"}, {q:"應付緊急狀況", a:"腎上腺素", c:"協調"}, {q:"生長激素分泌", a:"腦垂腺", c:"協調"},
        {q:"顯性遺傳因子", a:"大寫字母", c:"遺傳"}, {q:"隱性遺傳因子", a:"小寫字母", c:"遺傳"}, {q:"人類染色體數", a:"46條", c:"遺傳"},
        {q:"天擇說提出", a:"達爾文", c:"演化"}, {q:"用進廢退說", a:"拉馬克", c:"演化"}, {q:"活化石", a:"銀杏", c:"演化"},
        {q:"生產者", a:"綠色植物", c:"生態"}, {q:"分解者", a:"細菌黴菌", c:"生態"}, {q:"初級消費者", a:"草食動物", c:"生態"},
        {q:"維管束", a:"輸導組織", c:"植物"}, {q:"氣孔", a:"保衛細胞控制", c:"植物"}, {q:"蒸散作用", a:"水分運輸動力", c:"植物"},
        {q:"生物圈範圍", a:"海平面上下1萬公尺", c:"生態"}
    ];

    db.forEach((item, idx) => {
        // Type A: 定義題
        const idA = `bio_a_${idx}`;
        const tA = ["biology", "生物", "國七", item.c];
        window.__BIOLOGY_REPO__[idA] = {
            func: () => {
                const wr = U.shuffle(db.filter(x=>x.a!==item.a)).slice(0,3).map(x=>x.a);
                const opts = U.shuffle([item.a, ...wr]);
                return { question: `【${item.c}】${item.q}是下列何者？`, options: opts, answer: opts.indexOf(item.a), explanation: [`${item.a}: ${item.q}`, ``], subject: "biology", tags: tA };
            }, tags: tA, subject: "biology"
        };

        // Type B: 配合題
        const idB = `bio_b_${idx}`;
        window.__BIOLOGY_REPO__[idB] = {
            func: () => {
                const wr = U.shuffle(db.filter(x=>x.q!==item.q)).slice(0,3).map(x=>x.q);
                const opts = U.shuffle([item.q, ...wr]);
                return { question: `【${item.c}】關於「${item.a}」的功能或描述，何者正確？`, options: opts, answer: opts.indexOf(item.q), explanation: [`${item.a}: ${item.q}`], subject: "biology", tags: tA };
            }, tags: tA, subject: "biology"
        };
    });
})(window);
