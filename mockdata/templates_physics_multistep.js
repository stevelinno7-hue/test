(function(global){
    'use strict';

    // 1. 重點：這裡必須是 __PHYSICS_REPO__，對應系統的 subject=physics
    // 如果這裡用 __SCIENCE_REPO__，系統會找不到
    if (!window.__PHYSICS_REPO__) window.__PHYSICS_REPO__ = {};
    
    console.log("🚀 [Physics Core] 物理科精準對齊版 (含測量/密度/運動學) 啟動...");

    const Utils = {
        rnd: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
        pick: (arr) => arr[Math.floor(Math.random() * arr.length)],
        genOptions: (ans) => {
            let opts = new Set([ans]);
            while(opts.size < 4) {
                // 產生合理的干擾選項
                let v = ans + Utils.rnd(-5, 5);
                if(v <= 0) v = 0.5; // 物理量通常不為負
                opts.add(parseFloat(v.toFixed(2))); // 保持兩位小數
            }
            return Array.from(opts).sort(() => Math.random() - 0.5);
        }
    };

    const generators = [
        // ==========================================
        // 🎯 對應你的截圖：[單元 1：基本測量]
        // 系統搜尋標籤：理化, 物理, 測量, 密度, 國八
        // ==========================================
        {
            id: "phy_density_basic",
            // ★ 關鍵：這裡的 tags 必須包含系統搜尋的關鍵字
            tags: ["理化", "物理", "測量", "密度", "國八", "基本測量"], 
            generate: () => {
                // 設計：D = M / V
                // 為了好算，我們設 D 和 V 為整數，反推 M
                const densities = [0.5, 0.8, 1, 2, 8, 13.6]; // 常見密度
                const D = Utils.pick(densities);
                const V = Utils.rnd(10, 50);
                const M = Math.round(D * V * 10) / 10; // 避免精確度問題

                return {
                    // 純文字風格，不使用 LaTeX
                    question: `【基本測量】某金屬塊的體積為 ${V} cm3 (立方公分)，質量為 ${M} g，請問其密度為多少 g/cm3？`,
                    options: Utils.genOptions(D),
                    correctValue: D,
                    concept: "密度公式",
                    explanation: [
                        `公式：密度 = 質量 ÷ 體積`,
                        `計算：${M} ÷ ${V} = ${D}`
                    ]
                };
            }
        },
        {
            id: "phy_mass_measure",
            tags: ["理化", "物理", "測量", "質量", "天平", "國八"],
            generate: () => {
                const rightWeights = Utils.rnd(20, 50); // 右盤砝碼
                const riderPos = Utils.rnd(1, 9) * 0.1; // 騎碼位置 (例如 0.3g)
                const total = rightWeights + riderPos;

                return {
                    question: `【質量測量】使用上皿天平測量物體，右盤砝碼總重 ${rightWeights} g，騎碼在 ${riderPos} g 的刻度線上，請問物體質量為何？`,
                    options: Utils.genOptions(total),
                    correctValue: total,
                    concept: "天平使用",
                    explanation: [
                        `物體質量 = 砝碼總重 + 騎碼讀數`,
                        `計算：${rightWeights} + ${riderPos} = ${total} (g)`
                    ]
                };
            }
        },
        // ==========================================
        // 🚀 其他物理單元 (運動學、力學) - 為未來準備
        // ==========================================
        {
            id: "phy_motion_v",
            tags: ["理化", "物理", "運動學", "速度", "國九"],
            generate: () => {
                const v = Utils.rnd(10, 30);
                const t = Utils.rnd(5, 10);
                const d = v * t;
                
                return {
                    question: `【運動學】小明騎車速度為 ${v} m/s，行駛了 ${t} 秒，請問移動距離為多少公尺？`,
                    options: Utils.genOptions(d),
                    correctValue: d,
                    concept: "等速度運動",
                    explanation: [
                        `距離 = 速度 × 時間`,
                        `計算：${v} × ${t} = ${d} (m)`
                    ]
                };
            }
        }
    ];

    // 註冊工廠
    generators.forEach(gen => {
        // 為了讓題目夠多，每個生成器產生 5 種變體
        for(let i=0; i<5; i++) {
            const uniqueId = `${gen.id}_var${i}`;
            // ★ 關鍵：這裡要把題目註冊進 __PHYSICS_REPO__
            window.__PHYSICS_REPO__[uniqueId] = {
                func: () => {
                    const data = gen.generate();
                    // 自動計算正確答案的索引 (0~3)
                    const ansIndex = data.options.indexOf(data.correctValue);
                    return {
                        ...data,
                        answer: ansIndex,
                        subject: "physics", // ★ 這裡必須是 physics，才能通過篩選
                        tags: gen.tags
                    };
                },
                tags: gen.tags,
                subject: "physics"
            };
        }
    });

})(window);
