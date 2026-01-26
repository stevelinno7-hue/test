(function(global){
    'use strict';
    console.log("🧪 [Chemistry V9.0] 化學工廠：正在生產 50 道動態試題...");
    window.__CHEMISTRY_REPO__ = window.__CHEMISTRY_REPO__ || {};
    const U = { rnd: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min, shuffle: (arr) => arr.sort(() => Math.random() - 0.5) };

    const elements = [{n:'碳',m:12,s:'C'},{n:'氧',m:16,s:'O'},{n:'氮',m:14,s:'N'},{n:'氫',m:1,s:'H'},{n:'鈉',m:23,s:'Na'}];

    // 1. 分子量計算
    for(let i=0; i<10; i++){
        const e1 = elements[i%elements.length], e2 = elements[(i+1)%elements.length];
        const mw = e1.m + e2.m;
        window.__CHEMISTRY_REPO__[`chem_0_${i}`] = {
            func: () => {
                const o = U.shuffle([mw, mw+10, mw*2, Math.abs(e1.m-e2.m)]);
                return { question: `【分子量】若 ${e1.n}=${e1.m}, ${e2.n}=${e2.m}，則 ${e1.s}${e2.s} 分子量？`, options: o, answer: o.indexOf(mw), explanation: [`${e1.m} + ${e2.m} = ${mw}`], subject: "chemistry", tags:["chemistry","國八"] };
            }, tags:["chemistry","國八"], subject:"chemistry"
        };
    }
    // 2. 濃度計算
    for(let i=0; i<10; i++){
        const solute = U.rnd(10,50), solvent = U.rnd(50,150), total = solute+solvent;
        const p = Math.round((solute/total)*100);
        window.__CHEMISTRY_REPO__[`chem_1_${i}`] = {
            func: () => {
                const o = U.shuffle([`${p}%`, `${p+10}%`, `${p-5}%`, "50%"]);
                return { question: `【濃度】溶質 ${solute}g 溶於水 ${solvent}g，重量百分濃度約？`, options: o, answer: o.indexOf(`${p}%`), explanation: [`溶質/溶液 total`], subject: "chemistry", tags:["chemistry","國八"] };
            }, tags:["chemistry","國八"], subject:"chemistry"
        };
    }
    // 3. pH值
    for(let i=0; i<10; i++){
        const ph = U.rnd(1,13);
        const ans = ph<7?"酸性":(ph>7?"鹼性":"中性");
        window.__CHEMISTRY_REPO__[`chem_2_${i}`] = {
            func: () => {
                const o = U.shuffle(["酸性","鹼性","中性","無法判斷"]);
                return { question: `【酸鹼】pH=${ph} 的溶液性質？`, options: o, answer: o.indexOf(ans), explanation: [`pH<7酸, >7鹼`, `

[Image of pH scale]
`], subject: "chemistry", tags:["chemistry","國八"] };
            }, tags:["chemistry","國八"], subject:"chemistry"
        };
    }
    // 4. 原子結構
    const parts = [{q:"帶正電",a:"質子"},{q:"不帶電",a:"中子"},{q:"帶負電",a:"電子"},{q:"決定原子序",a:"質子數"}];
    for(let i=0; i<10; i++){
        const p = parts[i%4];
        window.__CHEMISTRY_REPO__[`chem_3_${i}`] = {
            func: () => {
                const o = U.shuffle(["質子","中子","電子","夸克"]);
                return { question: `【原子】原子中${p.q}的粒子是？`, options: o, answer: o.indexOf(p.a), explanation: [`原子核含質子中子`], subject: "chemistry", tags:["chemistry","國八"] };
            }, tags:["chemistry","國八"], subject:"chemistry"
        };
    }
    // 5. 有機化學
    const orgs = [{n:"甲烷",f:"CH4"},{n:"乙醇",f:"C2H5OH"},{n:"乙酸",f:"CH3COOH"},{n:"葡萄糖",f:"C6H12O6"}];
    for(let i=0; i<10; i++){
        const item = orgs[i%4];
        window.__CHEMISTRY_REPO__[`chem_4_${i}`] = {
            func: () => {
                const o = U.shuffle(orgs.map(x=>x.f));
                return { question: `【有機】${item.n}的化學式為？`, options: o, answer: o.indexOf(item.f), explanation: [`記憶題`], subject: "chemistry", tags:["chemistry","國八"] };
            }, tags:["chemistry","國八"], subject:"chemistry"
        };
    }
})(window);
