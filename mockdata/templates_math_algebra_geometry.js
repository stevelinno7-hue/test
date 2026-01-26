(function(global){
    'use strict';

    if (!window.__MATH_REPO__) window.__MATH_REPO__ = {};
    console.log("🚀 [Math Core] 數學題庫 (純文字自然版) 啟動...");

    const Utils = {
        rnd: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
        
        genOptions: (ans) => {
            let opts = new Set([ans]);
            while(opts.size < 4) {
                let offset = Utils.rnd(1, 10);
                let val = Math.random() > 0.5 ? ans + offset : ans - offset;
                opts.add(val);
            }
            return Array.from(opts).sort(() => Math.random() - 0.5);
        },

        // 人類算式翻譯機：把負數變成 "- 10"，正數變成 "+ 10"
        formatOp: (val) => {
            if (val < 0) return `- ${Math.abs(val)}`; 
            return `+ ${val}`;
        }
    };

    const generators = [
        // 1. 整數四則運算
        {
            id: "math_int_ops",
            tags: ["math", "數學", "國七", "整數", "四則運算"],
            generate: () => {
                const a = Utils.rnd(-9, 9);
                const b = Utils.rnd(2, 9);
                const c = Utils.rnd(-10, 10);
                const ans = a * b + c;

                // 翻譯成人類語法 (例如 "- 5")
                const cStr = Utils.formatOp(c); 

                return {
                    // ★ 修改：拿掉 $$，換成一般符號
                    question: `【整數】計算 ${a} × ${b} ${cStr} = ?`,
                    options: Utils.genOptions(ans),
                    correctValue: ans,
                    concept: "整數四則運算",
                    explanation: [
                        `先乘除，後加減。`,
                        `步驟一：${a} × ${b} = ${a*b}`,
                        `步驟二：${a*b} ${cStr} = ${ans}`
                    ]
                };
            }
        },
        // 2. 一元一次方程式
        {
            id: "math_linear_eq",
            tags: ["math", "數學", "國七", "一元一次方程式"],
            generate: () => {
                const x = Utils.rnd(2, 9);
                const a = Utils.rnd(2, 5);
                const b = Utils.rnd(-10, 10);
                const c = a * x + b;
                
                const bStr = Utils.formatOp(b);

                return {
                    // ★ 修改：拿掉 $$，直接顯示文字
                    question: `【代數】解方程式： ${a}x ${bStr} = ${c} ，求 x = ?`,
                    options: Utils.genOptions(x),
                    correctValue: x,
                    concept: "移項法則",
                    explanation: [
                        `方程式：${a}x ${bStr} = ${c}`,
                        `移項：${a}x = ${c} - (${b})`,
                        `計算：${a}x = ${c - b}`,
                        `答案：x = ${x}`
                    ]
                };
            }
        },
        // 3. 比例式
        {
            id: "math_ratio",
            tags: ["math", "數學", "國七", "比與比例式"],
            generate: () => {
                const m = Utils.rnd(2, 5);
                const a = Utils.rnd(2, 9);
                const b = Utils.rnd(3, 11);
                
                const term1 = a;
                const term2 = b;
                const term3 = a * m;
                const ans = b * m;

                return {
                    // ★ 修改：拿掉 $$，冒號直接用鍵盤打的 :
                    question: `【比例】若 ${term1} : ${term2} = ${term3} : x ，求 x 之值？`,
                    options: Utils.genOptions(ans),
                    correctValue: ans,
                    concept: "內項乘積=外項乘積",
                    explanation: [
                        `口訣：內項相乘 = 外項相乘`,
                        `計算：${term2} × ${term3} = ${term1} × x`,
                        `答案：x = ${ans}`
                    ]
                };
            }
        }
    ];

    generators.forEach(gen => {
        for(let i=0; i<5; i++) {
            const uId = `${gen.id}_${i}`;
            window.__MATH_REPO__[uId] = {
                func: () => {
                    const d = gen.generate();
                    return { 
                        ...d, 
                        answer: d.options.indexOf(d.correctValue), 
                        subject: "math", 
                        tags: gen.tags 
                    };
                },
                tags: gen.tags,
                subject: "math"
            };
        }
    });

})(window);
