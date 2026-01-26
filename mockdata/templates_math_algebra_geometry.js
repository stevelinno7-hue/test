(function(global){
    'use strict';

    if (!window.__MATH_REPO__) window.__MATH_REPO__ = {};
    console.log("🚀 [Math Core] 數學題庫 (算式優化版) 啟動...");

    const Utils = {
        rnd: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
        pick: (arr) => arr[Math.floor(Math.random() * arr.length)],
        genOptions: (ans) => {
            let opts = new Set([ans]);
            while(opts.size < 4) {
                let offset = Utils.rnd(1, 10);
                opts.add(Math.random() > 0.5 ? ans + offset : ans - offset);
            }
            return Array.from(opts).sort(() => Math.random() - 0.5);
        },
        // ★ 新增：人類算式美化器 (把 + -5 變成 - 5)
        formatOp: (val) => val < 0 ? `- ${Math.abs(val)}` : `+ ${val}`
    };

    const generators = [
        {
            id: "math_int_ops",
            tags: ["math", "數學", "國七", "整數", "四則運算"],
            generate: () => {
                // 產生更自然的算式
                const a = Utils.rnd(-15, 15);
                const b = Utils.rnd(-15, 15);
                const c = Utils.rnd(-10, 10);
                
                // 邏輯：計算 a * b + c (先乘除後加減)
                // 優化顯示：如果 b 或 c 是負數，用括號或直接變號
                const ans = a * b + c;
                
                // 顯示邏輯：比如 -5 * 3 - 2
                // b < 0 時加括號，c 直接用 formatOp 處理
                const bStr = b < 0 ? `(${b})` : `${b}`; 
                const cStr = Utils.formatOp(c);

                return {
                    question: `計算： $$ ${a} \\times ${bStr} ${cStr} = ? $$`,
                    options: Utils.genOptions(ans),
                    correctValue: ans,
                    concept: "整數四則運算",
                    explanation: [`先乘除，後加減。`, `$$ ${a} \\times ${bStr} = ${a*b} $$`, `$$ ${a*b} ${cStr} = ${ans} $$`]
                };
            }
        },
        {
            id: "math_linear_eq",
            tags: ["math", "數學", "國七", "一元一次方程式"],
            generate: () => {
                const x = Utils.rnd(2, 9);
                const a = Utils.rnd(2, 5);
                const b = Utils.rnd(-10, 10);
                const result = a * x + b;
                
                const bStr = Utils.formatOp(b);

                return {
                    question: `解方程式： $$ ${a}x ${bStr} = ${result} $$`,
                    options: Utils.genOptions(x),
                    correctValue: x,
                    concept: "移項法則",
                    explanation: [`先處理加減，再處理乘除。`, `$$ ${a}x = ${result} - (${b}) $$`, `$$ x = ${x} $$`]
                };
            }
        },
        {
            id: "math_ratio",
            tags: ["math", "數學", "國七", "比與比例式"],
            generate: () => {
                const x = Utils.rnd(2, 10);
                const m = Utils.rnd(2, 5);
                // 題目形如： 3 : 5 = 6 : x
                const a = Utils.rnd(2, 9);
                const b = Utils.rnd(3, 11);
                const c = a * m;
                const ans = b * m;

                return {
                    question: `若 $$ ${a} : ${b} = ${c} : x $$，則 $$ x = ? $$`,
                    options: Utils.genOptions(ans),
                    correctValue: ans,
                    concept: "內項乘積=外項乘積",
                    explanation: [`比例式性質：內項相乘等於外項相乘。`, `$$ ${a} \\cdot x = ${b} \\cdot ${c} $$`, `$$ x = ${ans} $$`]
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
                    return { ...d, answer: d.options.indexOf(d.correctValue), subject: "math", tags: gen.tags };
                },
                tags: gen.tags,
                subject: "math"
            };
        }
    });

})(window);
