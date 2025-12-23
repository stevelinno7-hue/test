(function(global){
    'use strict';

    function init() {
        const G = global.RigorousGenerator || (window.global && window.global.RigorousGenerator);
        if (!G || !G.registerTemplate) { setTimeout(init, 100); return; }
        
        const { randInt, shuffle, generateNumericOptions } = G.utils;

        // 物理核心題庫
        const phyDB = [
            // [國八]
            { t: "密度測量", q: (m,v)=>`某金屬塊質量 ${m*10} g，體積 ${v} cm³，其密度為何？`, a: (m,v)=>parseFloat((m*10/v).toFixed(1)), u: "g/cm³", tag:["國八","測量"] },
            { t: "波動學", q: (f,l)=>`一週期波的頻率為 ${f} Hz，波長為 ${l} m，試求其波速。`, a: (f,l)=>f*l, u: "m/s", tag:["國八","波動"] },
            { t: "熱學", q: (m,t)=>`質量 ${m} kg 的水，溫度上升 ${t}°C，吸收熱量多少？(水比熱 1 kcal/kg°C)`, a: (m,t)=>m*t, u: "kcal", tag:["國八","熱學"] },

            // [國九]
            { t: "運動學", q: (v,t)=>`一車以速度 ${v} m/s 等速行駛 ${t} 秒，請問位移為多少？`, a: (v,t)=>v*t, u: "m", tag:["國九","運動"] },
            { t: "牛頓第二定律", q: (m,a)=>`質量 ${m} kg 的物體，受力產生 ${a} m/s² 的加速度，請問合力大小？`, a: (m,a)=>m*a, u: "N", tag:["國九","力學"] },
            { t: "功與能量", q: (f,d)=>`施水平力 ${f} N 推動木塊移動 ${d} m，請問作功多少？`, a: (f,d)=>f*d, u: "J", tag:["國九","能量"] },
            { t: "歐姆定律", q: (i,r)=>`一電阻器電阻為 ${r} Ω，通過電流為 ${i} A，兩端電壓為何？`, a: (i,r)=>i*r, u: "V", tag:["國九","電學"] },

            // [高中]
            { t: "動能", q: (m,v)=>`質量 ${m} kg 的物體以 ${v} m/s 速率運動，其動能為何？`, a: (m,v)=>0.5*m*v*v, u: "J", tag:["高一","能量"] },
            { t: "重力位能", q: (m,h)=>`質量 ${m} kg 的物體抬高 ${h} m (g=10)，其重力位能增加多少？`, a: (m,h)=>m*10*h, u: "J", tag:["高一","能量"] },
            { t: "萬有引力", q: (m,g)=>`質量 ${m} kg 的太空人，在重力加速度 g=2 m/s² 的星球表面，重量為何？`, a: (m,g)=>m*2, u: "N", tag:["高二","引力"] }
        ];

        // 分年級註冊
        const grades = ["國八", "國九", "高一", "高二", "高三"];

        grades.forEach(grade => {
            const pool = phyDB.filter(q => q.tag[0] === grade);
            
            pool.forEach((p, idx) => {
                const templateId = `phy_${grade}_${idx}`;
                
                G.registerTemplate(templateId, (ctx, rnd) => {
                    const v1 = randInt(2, 9);
                    const v2 = randInt(2, 9);
                    const ans = p.a(v1, v2);
                    
                    const isInt = Number.isInteger(ans);
                    const opts = shuffle(generateNumericOptions(ans, isInt ? 'int' : 'float'));

                    return {
                        question: `【物理】${p.q(v1, v2)}`,
                        options: opts,
                        answer: opts.indexOf(ans),
                        concept: p.t,
                        explanation: [`正確答案：${ans} ${p.u}`]
                    };
                }, ["physics", "物理", "理化", "自然", grade, p.tag[1]]);
            });
        });

        console.log("✅ 物理題庫 (完整修復版) 已載入完成。");
    }

    init();

})(window);
