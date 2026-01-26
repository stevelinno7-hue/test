(function(global){
    'use strict';

    if (!window.__SCIENCE_REPO__) window.__SCIENCE_REPO__ = {};
    console.log("🚀 [Science Core] 理化題庫 (獨立版) 啟動...");

    const Utils = {
        rnd: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
        genOptions: (ans) => {
            // 理化選項通常會有小數點
            let opts = new Set([ans]);
            while(opts.size < 4) {
                let v = ans + Utils.rnd(-5, 5);
                if(v <= 0) v = 1; 
                opts.add(v);
            }
            return Array.from(opts).sort(() => Math.random() - 0.5);
        }
    };

    const generators = [
        {
            id: "sci_density",
            tags: ["science", "理化", "自然", "國八", "密度"],
            generate: () => {
                const M = Utils.rnd(20, 100);
                const V = Utils.rnd(5, 20);
                // 為了讓題目漂亮，我們反過來設計，確保整除或小數點漂亮
                // D = M/V
                const validD = [0.5, 0.8, 1.2, 2.5, 5, 8.9, 13.6]; // 常見物質密度
                const D = validD[Math.floor(Math.random()*validD.length)];
                const realM = D * 10; // 假設體積 10
                
                return {
                    question: `某金屬塊體積為 $10 cm^3$，質量為 $${realM} g$，請問其密度為何？`,
                    options: Utils.genOptions(D),
                    correctValue: D,
                    concept: "密度定義",
                    explanation: [`$$ D = \\frac{M}{V} $$`, `$$ D = \\frac{${realM}}{10} = ${D} g/cm^3 $$`]
                };
            }
        },
        {
            id: "sci_wave_speed",
            tags: ["science", "理化", "自然", "國八", "波動", "波速"],
            generate: () => {
                // v = f * lambda
                const f = Utils.rnd(2, 10); // 頻率
                const lambda = Utils.rnd(5, 20); // 波長
                const v = f * lambda;
                
                return {
                    question: `一繩波的頻率為 $${f} Hz$，波長為 $${lambda} cm$，求波速為多少 $cm/s$？`,
                    options: Utils.genOptions(v),
                    correctValue: v,
                    concept: "波速公式",
                    explanation: [`公式：波速 = 頻率 × 波長`, `$$ v = f \\times \\lambda $$`, `$$ v = ${f} \\times ${lambda} = ${v} $$`]
                };
            }
        },
        {
            id: "sci_ohm_law",
            tags: ["science", "理化", "自然", "國九", "歐姆定律", "電路"],
            generate: () => {
                // V = I * R
                const I = Utils.rnd(1, 5);
                const R = Utils.rnd(10, 50);
                const V = I * R;

                return {
                    question: `某電阻器電阻為 $${R} \\Omega$，流經電流為 $${I} A$，則兩端電壓為多少 $V$？`,
                    options: Utils.genOptions(V),
                    correctValue: V,
                    concept: "歐姆定律",
                    explanation: [`$$ V = I \\times R $$`, `$$ V = ${I} \\times ${R} = ${V} $$`]
                };
            }
        }
    ];

    generators.forEach(gen => {
        for(let i=0; i<5; i++) {
            const uId = `${gen.id}_${i}`;
            window.__SCIENCE_REPO__[uId] = {
                func: () => {
                    const d = gen.generate();
                    return { ...d, answer: d.options.indexOf(d.correctValue), subject: "science", tags: gen.tags };
                },
                tags: gen.tags,
                subject: "science"
            };
        }
    });

})(window);
