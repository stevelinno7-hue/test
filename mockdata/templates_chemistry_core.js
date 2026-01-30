(function(global){
    'use strict';
    window.__CHEMISTRY_REPO__ = window.__CHEMISTRY_REPO__ || {};

    const Utils = {
        shuffle: (arr) => [...arr].sort(() => Math.random() - 0.5),
        rnd: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
        pick: (arr) => arr[Utils.rnd(0, arr.length-1)]
    };

    // --- 擴充化學知識大數據庫 (The Chemical Matrix) ---
    const DB = {
        atoms: [
            {s:'H', w:1}, {s:'He', w:4}, {s:'Li', w:7}, {s:'Be', w:9}, {s:'B', w:11},
            {s:'C', w:12}, {s:'N', w:14}, {s:'O', w:16}, {s:'F', w:19}, {s:'Ne', w:20},
            {s:'Na', w:23}, {s:'Mg', w:24}, {s:'Al', w:27}, {s:'Si', w:28}, {s:'P', w:31},
            {s:'S', w:32}, {s:'Cl', w:35.5}, {s:'K', w:39}, {s:'Ca', w:40}, {s:'Fe', w:56},
            {s:'Cu', w:64}, {s:'Zn', w:65}, {s:'Ag', w:108}, {s:'I', w:127}, {s:'Au', w:197},
            {s:'Pb', w:207}, {s:'Hg', w:201}
        ],
        substances: [
            {n:"食鹽", f:"NaCl", ph:7, e:true, g:"國八", t:"鹽類"},
            {n:"鹽酸", f:"HCl", ph:1, e:true, g:"國八", t:"強酸"},
            {n:"氫氧化鈉", f:"NaOH", ph:14, e:true, g:"國八", t:"強鹼"},
            {n:"醋酸", f:"CH3COOH", ph:4, e:true, g:"國八", t:"有機酸"},
            {n:"酒精", f:"C2H5OH", ph:7, e:false, g:"國八", t:"醇類"},
            {n:"小蘇打", f:"NaHCO3", ph:9, e:true, g:"國八", t:"鹽類"},
            {n:"氨水", f:"NH3", ph:11, e:true, g:"國八", t:"弱鹼"},
            {n:"蔗糖", f:"C12H22O11", ph:7, e:false, g:"國八", t:"醣類"},
            {n:"硫酸", f:"H2SO4", ph:1, e:true, g:"國八", t:"強酸"},
            {n:"氫氧化鈣", f:"Ca(OH)2", ph:12, e:true, g:"國八", t:"強鹼"},
            {n:"葡萄糖", f:"C6H12O6", ph:7, e:false, g:"國八", t:"醣類"},
            {n:"氯化銨", f:"NH4Cl", ph:6, e:true, g:"國八", t:"鹽類"},
            {n:"過氧化氫", f:"H2O2", ph:6, e:false, g:"國八", t:"氧化劑"},
            {n:"碳酸鈣", f:"CaCO3", ph:8, e:true, g:"國八", t:"鹽類"}
        ],
        indicators: [
            {n:"石蕊試紙", a:"紅色", b:"藍色"},
            {n:"酚酞指示劑", a:"無色", b:"紅色"},
            {n:"廣用試劑", a:"紅橙色", b:"藍紫色"},
            {n:"甲基橙", a:"紅色", b:"黃色"},
            {n:"溴百里酚藍", a:"黃色", b:"藍色"}
        ],
        mixtures: [
            {q:"空氣", a:"均相混合物"}, {q:"泥沙水", a:"非均相混合物"},
            {q:"食鹽水", a:"溶液"}, {q:"黃金", a:"元素"}, {q:"純水", a:"化合物"},
            {q:"牛奶", a:"非均相混合物"}, {q:"合金鋼", a:"均相混合物"}, {q:"二氧化碳", a:"化合物"}
        ]
    };

    // --- 生成單一題目的函式（含原本 12 引擎 + 12 新引擎） ---
    function generateCase(i) {
        const engineType = i % 24; // 現在 24 大引擎循環（0..23）
        let p = { question: "", options: [], answer: 0, explanation: [], tags: ["理化", "化學", "自動生成"] };

        switch(engineType) {
            case 0: // 原子量題（變體）
                {
                    const a = Utils.pick(DB.atoms);
                    const n = Utils.rnd(2, 5);
                    const mw = a.w * n;
                    p.question = `【原子量】已知 ${a.s}=${a.w}，請問分子 ${a.s}${n} 的分子量為多少？`;
                    p.options = Utils.shuffle([mw, mw + n, Math.max(1, mw - 1), mw + Utils.rnd(2,5)]);
                    p.answer = p.options.indexOf(mw);
                    p.tags.push("國八", "分子量");
                }
                break;

            case 1: // 指示劑顏色
                {
                    const ind = Utils.pick(DB.indicators);
                    const sub = Utils.pick(DB.substances);
                    const correctColor = sub.ph < 7 ? ind.a : (sub.ph > 7 ? ind.b : "原色");
                    p.question = `【酸鹼】將 ${ind.n} 加入 ${sub.n} 溶液中，顏色應呈現？`;
                    p.options = Utils.shuffle([correctColor, "黑色", "黃色", "白色"]);
                    p.answer = p.options.indexOf(correctColor);
                    p.tags.push("國八", "指示劑");
                }
                break;

            case 2: // 電解質性質
                {
                    const eSub = Utils.pick(DB.substances);
                    const correctE = eSub.e ? "可導電，是電解質" : "不導電，非電解質";
                    p.question = `【電解質】關於「${eSub.n}」溶於水後的敘述，何者正確？`;
                    p.options = Utils.shuffle([correctE, "固態時可導電", "是混合物", "會產生爆炸"]);
                    p.answer = p.options.indexOf(correctE);
                    p.tags.push("國八", "電解質");
                }
                break;

            case 3: // 物質分類
                {
                    const mix = Utils.pick(DB.mixtures);
                    p.question = `【物質分類】「${mix.q}」在化學分類上屬於？`;
                    p.options = Utils.shuffle([mix.a, "原子", "中子", "電解質"]);
                    p.answer = p.options.indexOf(mix.a);
                    p.tags.push("國八", "物質性質");
                }
                break;

            case 4: // 化學平衡
                {
                    const factor = Utils.pick(["升高溫度", "增加反應物濃度", "減少產物", "加入催化劑"]);
                    const result = factor === "加入催化劑" ? "不移動平衡" : "向正反應方向移動";
                    p.question = `【化學平衡】在一平衡系統中，若「${factor}」，平衡將如何移動？`;
                    p.options = Utils.shuffle([result, "向逆反應方向移動", "反應停止", "顏色變深"]);
                    p.answer = p.options.indexOf(result);
                    p.tags.push("國八", "化學平衡");
                }
                break;

            case 5: // 有機官能基辨識
                {
                    const oSub = Utils.pick(DB.substances.filter(x => x.g === "國九" || x.t));
                    p.question = `【有機化學】「${oSub.n} (${oSub.f})」屬於哪一類？`;
                    p.options = Utils.shuffle([oSub.t || "有機化合物", "烴類", "聚合物", "無機酸"]);
                    p.answer = p.options.indexOf(oSub.t || "有機化合物");
                    p.tags.push("國八", "有機化合物");
                }
                break;

            case 6: // 莫耳濃度計算
                {
                    const m = Utils.rnd(1, 5), v = Utils.rnd(1, 5);
                    const conc = (m / v).toFixed(2);
                    p.question = `【莫耳濃度】將 ${m} mol 溶質溶於 ${v} L 溶液中，莫耳濃度為多少 M？`;
                    p.options = Utils.shuffle([conc + " M", (m*v) + " M", (m+v) + " M", "10 M"]);
                    p.answer = p.options.indexOf(conc + " M");
                    p.tags.push("國八", "濃度計算");
                }
                break;

            case 7: // 氧化還原活性比較
                {
                    const act = Utils.pick([{m:"鉀", l:"高"}, {m:"金", l:"低"}, {m:"碳", l:"常用還原劑"}]);
                    p.question = `【氧化還原】關於元素「${act.m}」的活性敘述何者正確？`;
                    p.options = Utils.shuffle(["對氧活性極" + act.l, "活性適中", "不具氧化性", "是唯一的液態金屬"]);
                    p.answer = p.options.indexOf("對氧活性極" + act.l);
                    p.tags.push("國八", "活性");
                }
                break;

            case 8: // 原子結構粒子
                {
                    const part = Utils.pick([{p:"質子", f:"決定原子序"}, {p:"電子", f:"決定化學性質"}, {p:"中子", f:"不帶電"}]);
                    p.question = `【原子結構】原子中哪種粒子「${part.f}」？`;
                    p.options = Utils.shuffle([part.p, "原子核", "夸克", "離子"]);
                    p.answer = p.options.indexOf(part.p);
                    p.tags.push("國八", "原子結構");
                }
                break;

            case 9: // 生活化學 - 皂化與酯化
                {
                    const react = Utils.pick([{n:"酯化", a:"酸+醇"}, {n:"皂化", a:"油脂+鹼"}]);
                    p.question = `【生活化學】關於「${react.n}反應」的原料敘述何者正確？`;
                    p.options = Utils.shuffle([react.a, "酸+鹼", "鹽+水", "糖+醇"]);
                    p.answer = p.options.indexOf(react.a);
                    p.tags.push("國八", "有機反應");
                }
                break;

            case 10: // 氣體製備現象
                {
                    const gas = Utils.pick([{n:"二氧化碳", a:"澄清石灰水變混濁"}, {n:"氧氣", a:"使線香復燃"}]);
                    p.question = `【氣體】檢驗實驗室製得的「${gas.n}」，正確現象為？`;
                    p.options = Utils.shuffle([gas.a, "產生爆鳴聲", "顏色變紅", "味道刺鼻"]);
                    p.answer = p.options.indexOf(gas.a);
                    p.tags.push("國八", "氣體");
                }
                break;

            case 11: // 實驗安全
                {
                    p.question = `【實驗安全】關於濃硫酸稀釋的敘述，何者正確？`;
                    p.options = Utils.shuffle(["酸緩慢加入水中", "水快速加入酸中", "兩者隨便混合", "戴上手套就不必加水"]);
                    p.answer = p.options.indexOf("酸緩慢加入水中");
                    p.tags.push("國八", "實驗安全");
                }
                break;

            // --- 新增引擎 12-23（共 12 類新題型） ---
            case 12: // 化學方程式配平（簡單）
                {
                    const eqs = [
                        {q:"H2 + O2 → H2O", a:"2H2 + O2 → 2H2O"},
                        {q:"N2 + H2 → NH3", a:"N2 + 3H2 → 2NH3"},
                        {q:"C + O2 → CO2", a:"C + O2 → CO2"}
                    ];
                    const sel = Utils.pick(eqs);
                    p.question = `【配平】配平下列反應：${sel.q}，哪一個為正確配平式？`;
                    p.options = Utils.shuffle([sel.a, "H2 + O2 → 2H2O", "2H2 + O2 → H2O", "無法配平"]);
                    p.answer = p.options.indexOf(sel.a);
                    p.tags.push("國八", "配平");
                }
                break;

            case 13: // 氣體用途判斷
                {
                    const gasUses = [
                        {n:"氧氣", a:"助燃"}, {n:"氮氣", a:"惰性保護"}, {n:"二氧化碳", a:"滅火或製造碳酸飲料"}
                    ];
                    const sel = Utils.pick(gasUses);
                    p.question = `【氣體用途】下列哪一項是「${sel.n}」的常見用途？`;
                    p.options = Utils.shuffle([sel.a, "作為溶劑", "作為酸化劑", "作為催化劑"]);
                    p.answer = p.options.indexOf(sel.a);
                    p.tags.push("國八", "氣體用途");
                }
                break;

            case 14: // 日常化學應用
                {
                    const daily = Utils.pick([
                        {q:"小蘇打在烘焙中的作用？", a:"釋放 CO2 使麵糰膨鬆"},
                        {q:"漂白水主要成分？", a:"次氯酸鹽（含氯化合物）"},
                        {q:"洗碗精的主要功能？", a:"去油、乳化"}
                    ]);
                    p.question = `【生活化學】${daily.q}`;
                    p.options = Utils.shuffle([daily.a, "增加甜味", "降低 pH", "使顏色變深"]);
                    p.answer = p.options.indexOf(daily.a);
                    p.tags.push("國八", "生活化學");
                }
                break;

            case 15: // 酸鹼中和產物
                {
                    const pair = Utils.pick([
                        {a:"HCl", b:"NaOH", prod:"NaCl + H2O"},
                        {a:"H2SO4", b:"KOH", prod:"K2SO4 + H2O"}
                    ]);
                    p.question = `【中和反應】${pair.a} 與 ${pair.b} 中和後主要生成物為何？`;
                    p.options = Utils.shuffle([pair.prod, "CO2 + H2O", "H2 + O2", "無反應"]);
                    p.answer = p.options.indexOf(pair.prod);
                    p.tags.push("國八", "中和");
                }
                break;

            case 16: // 酸鹼強弱判斷（pH 題）
                {
                    const s = Utils.pick(DB.substances);
                    const desc = s.ph <= 2 ? "強酸" : (s.ph >= 12 ? "強鹼" : (s.ph > 7 ? "弱鹼或中性偏鹼" : (s.ph < 7 ? "弱酸或中性偏酸" : "中性")));
                    p.question = `【pH 判斷】${s.n} 的 pH 約為 ${s.ph}，可判定為？`;
                    p.options = Utils.shuffle([desc, "鹽類", "氧化劑", "還原劑"]);
                    p.answer = p.options.indexOf(desc);
                    p.tags.push("國八", "酸鹼");
                }
                break;

            case 17: // 溶解度與沉澱
                {
                    const combos = [
                        {a:"AgNO3", b:"NaCl", res:"生成白色沉澱 AgCl"},
                        {a:"BaCl2", b:"Na2SO4", res:"生成白色沉澱 BaSO4"}
                    ];
                    const sel = Utils.pick(combos);
                    p.question = `【沉澱反應】將 ${sel.a} 與 ${sel.b} 混合，會發生何事？`;
                    p.options = Utils.shuffle([sel.res, "生成氣體", "溶液變藍", "溶液變酸"]);
                    p.answer = p.options.indexOf(sel.res);
                    p.tags.push("國八", "沉澱");
                }
                break;

            case 18: // 能量與反應速率（簡單判斷）
                {
                    const cond = Utils.pick(["升高溫度", "增加催化劑", "降低濃度"]);
                    const res = cond === "降低濃度" ? "速率下降" : "速率上升";
                    p.question = `【反應速率】若${cond}，反應速率會如何變化？`;
                    p.options = Utils.shuffle([res, "速率不變", "反應停止", "生成新物質"]);
                    p.answer = p.options.indexOf(res);
                    p.tags.push("國八", "反應速率");
                }
                break;

            case 19: // 同位素與原子量（判斷題）
                {
                    p.question = `【同位素】若某元素有質量數 12 與 13 的同位素，哪一項敘述正確？`;
                    p.options = Utils.shuffle(["質子數相同，中子數不同", "質子數不同，中子數相同", "電子數不同，質子數不同", "原子序不同"]);
                    p.answer = p.options.indexOf("質子數相同，中子數不同");
                    p.tags.push("國八", "同位素");
                }
                break;

            case 20: // 電子排布（基礎）
                {
                    const el = Utils.pick([{s:"H", e:"1s1"}, {s:"He", e:"1s2"}, {s:"O", e:"1s2 2s2 2p4"}]);
                    p.question = `【電子排布】元素 ${el.s} 的基態電子排布為何？`;
                    p.options = Utils.shuffle([el.e, "1s2 2s2", "2s2 2p6", "無電子"]);
                    p.answer = p.options.indexOf(el.e);
                    p.tags.push("國八", "電子排布");
                }
                break;

            case 21: // 酸鹼指示劑範圍（判斷）
                {
                    const ind2 = Utils.pick(DB.indicators);
                    p.question = `【指示劑範圍】若某溶液使 ${ind2.n} 由 ${ind2.a} 變為 ${ind2.b}，此溶液可能是？`;
                    p.options = Utils.shuffle(["酸性", "鹼性", "中性", "氧化性"]);
                    // 若 a->b 是酸變色到鹼色，判斷依 a/b 常識：簡化處理：若 a 為紅色且 b 為藍色，酸性->鹼性，則溶液為鹼性
                    const guess = (ind2.a === "紅色" && ind2.b === "藍色") ? "鹼性" : "酸性";
                    p.answer = p.options.indexOf(guess);
                    p.tags.push("國八", "指示劑");
                }
                break;

            case 22: // 聚合物與單體（基礎）
                {
                    const poly = Utils.pick([{m:"乙烯", p:"聚乙烯"}, {m:"丙烯腈", p:"聚丙烯腈"}]);
                    p.question = `【高分子】下列哪一項是由單體 ${poly.m} 聚合而成？`;
                    p.options = Utils.shuffle([poly.p, "聚苯乙烯", "蛋白質", "澱粉"]);
                    p.answer = p.options.indexOf(poly.p);
                    p.tags.push("國八", "高分子");
                }
                break;

            case 23: // 化學史或發現（簡單常識）
                {
                    p.question = `【化學史】下列哪一項與化學家或化學發現有關？`;
                    p.options = Utils.shuffle(["拉瓦節發現氧氣", "牛頓發現萬有引力", "愛因斯坦發明電池", "哥白尼發現細胞"]);
                    p.answer = p.options.indexOf("拉瓦節發現氧氣");
                    p.tags.push("國八", "化學史");
                }
                break;

            default:
                p.question = "錯誤：未定義的引擎";
                p.options = ["錯誤"];
                p.answer = 0;
                break;
        }

        return p;
    }

    // --- 註冊到全域變數 ---
    const TOTAL_CASES = 400; 
    for(let i=0; i < TOTAL_CASES; i++) {
        const id = `chem_${i}`;
        const payload = generateCase(i);
        
        // ✨ 關鍵：這裡標註 subject 為 chemistry
        window.__CHEMISTRY_REPO__[id] = {
            func: () => payload, // 簡化寫法
            tags: payload.tags,
            subject: "chemistry", // 這是讓產生器識別的關鍵
            difficulty: "medium"
        };
    }
    
    console.log(`✅ 化學題庫載入完成：共 ${TOTAL_CASES} 題`);

})(window);
