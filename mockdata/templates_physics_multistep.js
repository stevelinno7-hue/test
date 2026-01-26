(function(global){
    'use strict';
    console.log("⚛️ [Physics V9.0] 物理核心題庫 (含自動演算工廠) 啟動...");

    // 1. 建立物理避難所
    window.__PHYSICS_REPO__ = window.__PHYSICS_REPO__ || {};

    const Utils = {
        shuffle: (arr) => arr.sort(() => Math.random() - 0.5),
        rnd: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
    };

    // =================================================================
    // 工廠 A: 運動學 (v = d / t) - 自動生成 15 題
    // =================================================================
    for(let i=0; i<15; i++) {
        const v = Utils.rnd(10, 60); // 速度
        const t = Utils.rnd(5, 20);  // 時間
        const d = v * t;             // 距離
        const id = `phy_motion_${i}`;
        const tags = ["physics", "物理", "運動學", "國九"];

        const func = () => {
            const wr = [d+10, d*2, v+t].map(x => `${x} m`);
            const ans = `${d} m`;
            const opts = Utils.shuffle([ans, ...wr]);
            return {
                question: `【運動學】一輛跑車以 $${v} m/s$ 的速度維持等速行駛 $${t} s$，請問它移動了多少距離？`,
                options: opts,
                answer: opts.indexOf(ans),
                explanation: [
                    `公式：$位移 = 速度 \\times 時間$`,
                    `計算：$${v} \\times ${t} = ${d}$`,
                    `

[Image of velocity time graph]
`
                ],
                subject: "physics", tags: tags
            };
        };
        window.__PHYSICS_REPO__[id] = { func, tags, subject: "physics" };
    }

    // =================================================================
    // 工廠 B: 牛頓第二定律 (F = ma) - 自動生成 15 題
    // =================================================================
    for(let i=0; i<15; i++) {
        const m = Utils.rnd(2, 20);  // 質量 kg
        const a = Utils.rnd(2, 10);  // 加速度 m/s^2
        const f = m * a;             // 力 N
        const id = `phy_force_${i}`;
        const tags = ["physics", "物理", "力學", "國九"];

        const func = () => {
            const wr = [f+5, m+a, f*10].map(x => `${x} N`);
            const ans = `${f} N`;
            const opts = Utils.shuffle([ans, ...wr]);
            return {
                question: `【力學】質量 $${m} kg$ 的物體，受力後產生 $${a} m/s^2$ 的加速度，求該物體所受合力？`,
                options: opts,
                answer: opts.indexOf(ans),
                explanation: [
                    `牛頓第二定律：$F = ma$`,
                    `計算：$${m} \\times ${a} = ${f} N$`,
                    `

[Image of newton second law diagram]
`
                ],
                subject: "physics", tags: tags
            };
        };
        window.__PHYSICS_REPO__[id] = { func, tags, subject: "physics" };
    }

    // =================================================================
    // 工廠 C: 電學 (V = IR) - 自動生成 10 題
    // =================================================================
    for(let i=0; i<10; i++) {
        const I = Utils.rnd(1, 10);
        const R = Utils.rnd(10, 100);
        const V = I * R;
        const id = `phy_elec_${i}`;
        const tags = ["physics", "物理", "電學", "國九"];

        const func = () => {
            const wr = [V+10, R+I, V*2].map(x => `${x} V`);
            const ans = `${V} V`;
            const opts = Utils.shuffle([ans, ...wr]);
            return {
                question: `【電學】一電路中，通過電阻的電流為 $${I} A$，電阻值為 $${R} \\Omega$，求電壓降？`,
                options: opts,
                answer: opts.indexOf(ans),
                explanation: [
                    `歐姆定律：$V = I \\times R$`,
                    `計算：$${I} \\times ${R} = ${V} V$`,
                    ``
                ],
                subject: "physics", tags: tags
            };
        };
        window.__PHYSICS_REPO__[id] = { func, tags, subject: "physics" };
    }

    // =================================================================
    // 工廠 D: 概念題 (波動、能量、熱學) - 10 題
    // =================================================================
    const concepts = [
        {q:"聲音在下列何種介質中傳播最快？", a:"鋼鐵 (固體)", o:["水 (液體)","空氣 (氣體)","真空"], t:"波動"},
        {q:"下列何者不是熱的傳播方式？", a:"折射", o:["傳導","對流","輻射"], t:"熱學"},
        {q:"動能的大小與下列何者成正比？", a:"速度的平方", o:["高度","時間","重力加速度"], t:"能量"},
        {q:"凸透鏡成像中，物體在兩倍焦距外，會產生？", a:"縮小倒立實像", o:["放大倒立實像","放大正立虛像","相等倒立實像"], t:"光學"},
        {q:"摩擦力做功通常會轉換為何種能量形式？", a:"熱能", o:["位能","動能","化學能"], t:"能量"}
    ];

    concepts.forEach((item, idx) => {
        const id = `phy_con_${idx}`;
        const tags = ["physics", "物理", item.t, "國八"];
        const func = () => {
            const opts = Utils.shuffle([item.a, ...item.o]);
            return {
                question: `【${item.t}】${item.q}`,
                options: opts,
                answer: opts.indexOf(item.a),
                explanation: [`正確答案：${item.a}`, ``],
                subject: "physics", tags: tags
            };
        };
        window.__PHYSICS_REPO__[id] = { func, tags, subject: "physics" };
    });

})(window);
