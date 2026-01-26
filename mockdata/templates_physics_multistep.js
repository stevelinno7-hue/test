(function(global){
    'use strict';

    // 1. ★★★ 這是最重要的一行 ★★★
    // 必須建立 __PHYSICS_REPO__，因為你的系統在找 subject="physics"
    if (!window.__PHYSICS_REPO__) window.__PHYSICS_REPO__ = {};
    
    console.log("🚀 [Physics Core] 物理科精準對齊版 (含測量/密度/運動學) 啟動...");

    const Utils = {
        rnd: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
        pick: (arr) => arr[Math.floor(Math.random() * arr.length)],
        // 選項產生器
        genOptions: (ans) => {
            let opts = new Set([ans]);
            while(opts.size < 4) {
                // 產生合理的干擾選項，並保持小數點整齊
                let v = ans + Utils.rnd(-5, 5);
                if(v <= 0) v = 0.5; 
                opts.add(Math.round(v * 10) / 10); 
            }
            return Array.from(opts).sort(() => Math.random() - 0.5);
        }
    };

    const generators = [
        // ==========================================
        // 🎯 題目一：密度計算 (完全對應你的 [單元 1：基本測量])
        // 標籤包含：理化, 物理, 測量, 密度, 國八
        // ==========================================
        {
            id: "phy_density_basic",
            // ★ 關鍵：這裡的 tags 必須全中系統搜尋的關鍵字
            tags: ["理化", "物理", "測量", "密度", "國八", "基本測量"], 
            generate: () => {
                // 設計題目：D = M / V
                // 為了不出現無限小數，我們設定好數字
                const densities = [0.5, 0.8, 1, 2.7, 7.8, 13.6]; // 常見密度(木頭/酒精/水/鋁/鐵/水銀)
                const D = Utils.pick(densities);
                const V = Utils.rnd(10, 50); // 體積
                const M = Math.round(D * V * 10) / 10; // 質量 (確保整除)

                return {
                    // ★ 純文字風格，不用 Latex
                    question: `【基本測量】某金屬塊的體積為 ${V} cm3 (立方公分)，質量為 ${M} g，請問其密度為多少 g/cm3？`,
                    options: Utils.genOptions(D),
                    correctValue: D,
                    concept: "密度公式",
                    explanation: [
                        `公式：密度 = 質量 ÷ 體積`,
                        `計算：${M} ÷ ${V} = ${D}`,
                        `答案：${D} g/cm3`
                    ]
                };
            }
        },
        // ==========================================
        // 🎯 題目二：天平測量 (也是基本測量單元)
        // ==========================================
        {
            id: "phy_mass_measure",
            tags: ["理化", "物理", "測量", "質量", "天平", "國八"],
            generate: () => {
                const rightWeights = Utils.rnd(20, 100); // 右盤砝碼
                const riderPos = Utils.rnd(1, 9) * 0.1; // 騎碼位置 (例如 0.3g)
                // JS浮點數運算修正
                const total = Math.round((rightWeights + riderPos) * 10) / 10;

                return {
                    question: `【質量測量】使用上皿天平測量物體，右盤砝碼總重 ${rightWeights} g，騎碼在 ${riderPos} g 的刻度線上，請問物體質量為何？`,
                    options: Utils.genOptions(total),
                    correctValue: total,
                    concept: "天平使用",
                    explanation: [
                        `物體質量 = 砝碼總重 + 騎碼讀數`,
                        `計算：${rightWeights} + ${riderPos} = ${total}`,
                        `答案：${total} g`
                    ]
                };
            }
        },
        // ==========================================
        // 🎯 題目三：量筒測量液體體積
        // ==========================================
        {
            id: "phy_volume_cylinder",
            tags: ["理化", "物理", "測量", "體積", "量筒", "國八"],
            generate: () => {
                const water = Utils.rnd(30, 50); // 原本的水
                const stone = Utils.rnd(10, 20); // 石頭體積
                const total = water + stone;

                return {
                    question: `【體積測量】量筒內原有 ${water} mL 的水，放入一顆石頭後完全沒入水中，水位上升至 ${total} mL，請問石頭體積為多少 cm3？`,
                    options: Utils.genOptions(stone),
                    correctValue: stone,
                    concept: "排水法",
                    explanation: [
                        `石頭體積 = 後來水位 - 原本水位`,
                        `計算：${total} - ${water} = ${stone}`,
                        `答案：${stone} cm3 (因為 1 mL = 1 cm3)`
                    ]
                };
            }
        }
    ];

    // 註冊題目
    generators.forEach(gen => {
        for(let i=0; i<5; i++) { // 每個題型產生 5 個變體，確保題目夠多
            const uniqueId = `${gen.id}_var${i}`;
            window.__PHYSICS_REPO__[uniqueId] = {
                func: () => {
                    const data = gen.generate();
                    const ansIndex = data.options.indexOf(data.correctValue);
                    return {
                        ...data,
                        answer: ansIndex,
                        subject: "physics", // ★ 這裡一定要是 physics
                        tags: gen.tags
                    };
                },
                tags: gen.tags,
                subject: "physics"
            };
        }
    });

})(window);
