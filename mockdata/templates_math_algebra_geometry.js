(function(global){
    'use strict';
    
    // 建立數學避難所
    if (!window.__MATH_REPO__) window.__MATH_REPO__ = {};

    console.log("🚀 [Math V8.0] 數學引擎啟動...");

    // ----------------------------------------------------------------
    // 題型 1: 一元一次方程式 (Algebra)
    // ----------------------------------------------------------------
    const algebraFunc = function(ctx, rnd) {
        // 生成 ax + b = c
        const a = Math.floor(rnd() * 8) + 2; // 2~9
        const x = Math.floor(rnd() * 10) + 1; // 答案
        const b = Math.floor(rnd() * 20) - 10; // -10 ~ 9
        const c = a * x + b;

        const bStr = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
        const qStr = `${a}x ${bStr} = ${c}`;
        
        // 產生選項
        const ans = x;
        const opts = new Set([ans]);
        while(opts.size < 4) {
            opts.add(ans + Math.floor(rnd() * 5) - 2); // 混淆項
        }

        const optArray = Array.from(opts).sort((a,b) => a - b); // 排序讓選項整齊

        return {
            question: `解方程式： $${qStr}$，則 $x$ 為何？`,
            options: optArray.map(n => `$${n}$`),
            answer: optArray.indexOf(ans),
            concept: "一元一次方程式",
            subject: "math",
            tags: ["math", "algebra", "國七"]
        };
    };
    // 刺青 & 存入避難所
    algebraFunc.subject = "math";
    algebraFunc.tags = ["math", "algebra", "國七"];
    window.__MATH_REPO__['math_alg_linear_eq_safe'] = { 
        func: algebraFunc, tags: algebraFunc.tags, subject: "math" 
    };

    // ----------------------------------------------------------------
    // 題型 2: 幾何面積 (Geometry)
    // ----------------------------------------------------------------
    const geoFunc = function(ctx, rnd) {
        const w = Math.floor(rnd() * 10) + 5;
        const h = Math.floor(rnd() * 10) + 5;
        const area = w * h;
        
        return {
            question: `一個長方形長為 ${w} 公分，寬為 ${h} 公分，求面積？`,
            options: [
                `${area} cm²`,
                `${2*(w+h)} cm²`, // 周長 (陷阱)
                `${area + 10} cm²`,
                `${area - 5} cm²`
            ].sort(() => 0.5 - rnd()),
            answer: 0, // 這裡簡化處理，實際要對應選項index
            concept: "幾何面積",
            subject: "math",
            tags: ["math", "geometry", "國七"]
        };
    };
    // 修正選項 index 邏輯
    const geoFuncWrapper = (ctx, rnd) => {
        const q = geoFunc(ctx, rnd);
        const correctVal = q.options[0]; // 原始的第一個是答案
        q.options.sort(() => 0.5 - Math.random()); // 洗牌
        q.answer = q.options.indexOf(correctVal); // 找回答案位置
        return q;
    };

    geoFuncWrapper.subject = "math";
    geoFuncWrapper.tags = ["math", "geometry", "國七"];
    window.__MATH_REPO__['math_geo_rect_area_safe'] = {
        func: geoFuncWrapper, tags: geoFuncWrapper.tags, subject: "math"
    };

    console.log(`🎉 數學題庫 (V8.0) 已存入避難所，共 ${Object.keys(window.__MATH_REPO__).length} 題。`);

})(window);
