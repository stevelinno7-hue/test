(function(global){
    'use strict';

    if (!window.__SCIENCE_REPO__) window.__SCIENCE_REPO__ = {};
    console.log("🚀 [Science Core] 理化題庫 (自然閱讀版) 啟動...");

    const Utils = {
        rnd: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
        genOptions: (ans) => {
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
        // 1. 速度運動 (修正重點：拿掉 latex，直接顯示 31 m/s)
        {
            id: "sci_motion_v",
            tags: ["science", "理化", "自然", "國九", "運動學", "直線運動"],
            generate: () => {
                const v = Utils.rnd(10, 40); 
                const t = Utils.rnd(5, 20);  
                const d = v * t;             
                
                return {
                    // ★ 修改這裡：直接寫變數，不要加 $$
                    question: `【運動學】一輛跑車以 ${v} m/s 的速度維持等速行駛 ${t} 秒，請問它移動了多少距離？`,
                    options: Utils.genOptions(d),
                    correctValue: d,
                    concept: "等速度運動",
                    // 解詳可以保留算式，但把單位變成中文或純英文，比較好讀
                    explanation: [
                        `公式：距離 = 速度 × 時間`,
                        `計算：${v} × ${t} = ${d} (公尺)`
                    ]
                };
            }
        },
        // 2. 密度計算
        {
            id: "sci_density",
            tags: ["science", "理化", "自然", "國八", "密度"],
            generate: () => {
                const densities = [1, 2, 5, 8, 10];
                const D = densities[Utils.rnd(0, densities.length - 1)];
                const V = Utils.rnd(10, 50); 
                const M = D * V; 
                
                return {
                    // ★ 修改這裡：cm3 直接寫，或者用中文「立方公分」最親民
                    question: `【密度】某物體體積為 ${V} cm3 (立方公分)，質量為 ${M} g，求其密度？`,
                    options: Utils.genOptions(D),
                    correctValue: D,
                    concept: "密度公式",
                    explanation: [
                        `密度 = 質量 ÷ 體積`,
                        `計算：${M} ÷ ${V} = ${D} (g/cm3)`
                    ]
                };
            }
        },
        // 3. 歐姆定律
        {
            id: "sci_ohm",
            tags: ["science", "理化", "自然", "國九", "電學", "歐姆定律"],
            generate: () => {
                const I = Utils.rnd(1, 10); 
                const R = Utils.rnd(5, 20); 
                const V = I * R;            

                return {
                    // ★ 修改這裡：單位直接寫英文 A, V, Ω
                    question: `【電學】某電路中，流經 ${R} Ω 電阻的電流為 ${I} A，請問電阻兩端電壓為多少 V？`,
                    options: Utils.genOptions(V),
                    correctValue: V,
                    concept: "歐姆定律",
                    explanation: [
                        `電壓 = 電流 × 電阻`,
                        `計算：${I} × ${R} = ${V} (V)`
                    ]
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
                    return { 
                        ...d, 
                        answer: d.options.indexOf(d.correctValue), 
                        subject: "science", 
                        tags: gen.tags 
                    };
                },
                tags: gen.tags,
                subject: "science"
            };
        }
    });

})(window);
