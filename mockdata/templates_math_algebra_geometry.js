(function(global){
    'use strict';
    console.log("📐 [Math V9.0] 數學工廠：正在生產 50 道動態試題...");
    window.__MATH_REPO__ = window.__MATH_REPO__ || {};

    const U = {
        rnd: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
        shuffle: (arr) => arr.sort(() => Math.random() - 0.5)
    };

    // 工廠 1: 整數四則運算 (10題)
    for(let i=0; i<10; i++) {
        const a = U.rnd(-20, 20), b = U.rnd(2, 10), c = U.rnd(-10, 10);
        const ans = a * b + c;
        const id = `math_0_${i}`;
        const func = () => {
            const opts = U.shuffle([ans, ans+b, ans-c, -ans]);
            return {
                question: `【整數】計算 $${a} \\times ${b} + (${c}) = ?$`,
                options: opts, answer: opts.indexOf(ans),
                explanation: ["先乘除後加減", `計算過程：$${a*b} + (${c}) = ${ans}$`],
                subject: "math", tags: ["math", "數學", "整數", "國七"]
            };
        };
        window.__MATH_REPO__[id] = { func, tags: ["math", "國七"], subject: "math" };
    }

    // 工廠 2: 一元一次方程式 (10題)
    for(let i=0; i<10; i++) {
        const x = U.rnd(2, 12), a = U.rnd(2, 9), b = U.rnd(1, 20);
        const res = a * x + b;
        const id = `math_1_${i}`;
        const func = () => {
            const opts = U.shuffle([x, x+1, x-1, x*2]);
            return {
                question: `【方程式】解方程式 $${a}x + ${b} = ${res}$，則 $x=?$`,
                options: opts, answer: opts.indexOf(x),
                explanation: [`移項：$${a}x = ${res} - ${b}$`, `$${a}x = ${res-b}$`, `故 $x=${x}$`],
                subject: "math", tags: ["math", "數學", "方程式", "國七"]
            };
        };
        window.__MATH_REPO__[id] = { func, tags: ["math", "國七"], subject: "math" };
    }

    // 工廠 3: 畢氏定理 (10題)
    const pythagoreanTriples = [[3,4,5], [5,12,13], [6,8,10], [8,15,17], [9,12,15]];
    for(let i=0; i<10; i++) {
        const triple = pythagoreanTriples[i % pythagoreanTriples.length];
        const [a, b, c] = triple;
        const id = `math_2_${i}`;
        const func = () => {
            const opts = U.shuffle([c, c+1, c+2, a+b]);
            return {
                question: `【幾何】直角三角形兩股長為 ${a}, ${b}，求斜邊長？`,
                options: opts, answer: opts.indexOf(c),
                explanation: [`公式：$a^2 + b^2 = c^2$`, ``],
                subject: "math", tags: ["math", "數學", "畢氏定理", "國八"]
            };
        };
        window.__MATH_REPO__[id] = { func, tags: ["math", "國八"], subject: "math" };
    }

    // 工廠 4: 等差數列 (10題)
    for(let i=0; i<10; i++) {
        const a1 = U.rnd(1, 10), d = U.rnd(2, 5), n = 10;
        const an = a1 + (n-1)*d;
        const id = `math_3_${i}`;
        const func = () => {
            const opts = U.shuffle([an, an+d, an-d, an*2]);
            return {
                question: `【數列】等差數列首項 ${a1}，公差 ${d}，求第 ${n} 項？`,
                options: opts, answer: opts.indexOf(an),
                explanation: [`公式：$a_n = a_1 + (n-1)d$`, `$${a1} + 9 \\times ${d} = ${an}$`],
                subject: "math", tags: ["math", "數學", "數列", "國八"]
            };
        };
        window.__MATH_REPO__[id] = { func, tags: ["math", "國八"], subject: "math" };
    }

    // 工廠 5: 統計機率 (10題)
    for(let i=0; i<10; i++) {
        const total = U.rnd(10, 50);
        const target = U.rnd(1, total);
        const prob = Math.round((target/total)*100)/100;
        const id = `math_4_${i}`;
        const func = () => {
            const opts = U.shuffle([prob, prob+0.1, 1-prob, 0.5]);
            return {
                question: `【機率】箱中有 ${total} 顆球，其中紅球 ${target} 顆，抽中紅球機率為何？(取小數點後兩位)`,
                options: opts, answer: opts.indexOf(prob),
                explanation: [`機率 = 目標數 / 總數`, `$${target} / ${total} \\approx ${prob}$`],
                subject: "math", tags: ["math", "數學", "機率", "國九"]
            };
        };
        window.__MATH_REPO__[id] = { func, tags: ["math", "國九"], subject: "math" };
    }

})(window);
