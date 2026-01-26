(function(global){
    'use strict';
    console.log("🧪 [Chemistry V9.0] 化學核心題庫 (含動態濃度/pH) 啟動...");

    window.__CHEMISTRY_REPO__ = window.__CHEMISTRY_REPO__ || {};

    const Utils = {
        shuffle: (arr) => arr.sort(() => Math.random() - 0.5),
        rnd: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
    };

    // =================================================================
    // 工廠 A: 分子量計算 - 自動生成 15 題
    // =================================================================
    const atoms = [
        {s:'H', w:1}, {s:'C', w:12}, {s:'N', w:14}, {s:'O', w:16}, 
        {s:'Na', w:23}, {s:'S', w:32}, {s:'Cl', w:35.5}, {s:'Ca', w:40}
    ];
    
    for(let i=0; i<15; i++) {
        // 隨機組合兩個原子 X2Y3 之類
        const a1 = atoms[Utils.rnd(0, atoms.length-1)];
        const a2 = atoms[Utils.rnd(0, atoms.length-1)];
        const n1 = Utils.rnd(1, 3);
        const n2 = Utils.rnd(1, 4);
        
        const mw = (a1.w * n1) + (a2.w * n2);
        const formula = `${a1.s}${n1 > 1 ? n1 : ''}${a2.s}${n2 > 1 ? n2 : ''}`;
        
        const id = `chem_mw_${i}`;
        const tags = ["chemistry", "化學", "分子量", "國八"];

        const func = () => {
            const wr = [mw+10, mw*2, Math.abs(mw-5)];
            const opts = Utils.shuffle([mw, ...wr]);
            return {
                question: `【分子量】已知原子量：${a1.s}=${a1.w}, ${a2.s}=${a2.w}。求分子 ${formula} 的分子量？`,
                options: opts,
                answer: opts.indexOf(mw),
                explanation: [
                    `計算：(${a1.w} × ${n1}) + (${a2.w} × ${n2}) = ${mw}`,
                    `

[Image of chemical molecule structure]
`
                ],
                subject: "chemistry", tags: tags
            };
        };
        window.__CHEMISTRY_REPO__[id] = { func, tags, subject: "chemistry" };
    }

    // =================================================================
    // 工廠 B: 濃度與 pH 值 - 自動生成 15 題
    // =================================================================
    for(let i=0; i<15; i++) {
        const ph = Utils.rnd(1, 13);
        const type = ph < 7 ? "酸性" : (ph > 7 ? "鹼性" : "中性");
        const id = `chem_ph_${i}`;
        const tags = ["chemistry", "化學", "酸鹼", "國八"];

        const func = () => {
            const opts = Utils.shuffle(["酸性", "中性", "鹼性", "無法判斷"]);
            return {
                question: `【酸鹼】某水溶液測得 pH 值為 ${ph}，試問其性質為何？`,
                options: opts,
                answer: opts.indexOf(type),
                explanation: [
                    `pH < 7 為酸性，pH = 7 為中性，pH > 7 為鹼性`,
                    `

[Image of pH scale examples]
`
                ],
                subject: "chemistry", tags: tags
            };
        };
        window.__CHEMISTRY_REPO__[id] = { func, tags, subject: "chemistry" };
    }

    // =================================================================
    // 工廠 C: 元素與反應概念 - 20 題
    // =================================================================
    const concepts = [
        {q:"原子核中不帶電的粒子是？", a:"中子", o:["質子","電子","離子"], t:"原子結構"},
        {q:"空氣中含量最多的氣體是？", a:"氮氣", o:["氧氣","氬氣","二氧化碳"], t:"氣體"},
        {q:"燃燒反應屬於哪一種類型？", a:"氧化反應", o:["還原反應","中和反應","物理變化"], t:"反應"},
        {q:"將鹽酸與氫氧化鈉混合，會產生？", a:"鹽類與水", o:["酸氣","沉澱物","氫氣"], t:"酸鹼中和"},
        {q:"下列何者屬於有機化合物？", a:"酒精 (C2H5OH)", o:["食鹽 (NaCl)","水 (H2O)","硫酸 (H2SO4)"], t:"有機化學"},
        {q:"乾冰昇華是什麼變化？", a:"物理變化", o:["化學變化","核反應","燃燒"], t:"物質變化"},
        {q:"肥皂去汙的原理是？", a:"親油端吸油，親水端拉入水中", o:["酸鹼中和","氧化還原","產生酵素"], t:"生活化學"}
    ];

    concepts.forEach((item, idx) => {
        const id = `chem_con_${idx}`;
        const tags = ["chemistry", "化學", item.t, "國八"];
        const func = () => {
            const opts = Utils.shuffle([item.a, ...item.o]);
            return {
                question: `【${item.t}】${item.q}`,
                options: opts,
                answer: opts.indexOf(item.a),
                explanation: [`正確答案：${item.a}`, ``],
                subject: "chemistry", tags: tags
            };
        };
        window.__CHEMISTRY_REPO__[id] = { func, tags, subject: "chemistry" };
    });

})(window);
