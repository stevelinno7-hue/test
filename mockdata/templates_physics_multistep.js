(function(global){
    'use strict';

    function init() {
        const G = global.RigorousGenerator || (window.global && window.global.RigorousGenerator);
        if (!G || !G.registerTemplate) {
            setTimeout(init, 100);
            return;
        }

        const { randInt, shuffle, generateNumericOptions } = G.utils;

        // ==========================================
        // 物理計算題資料庫（國八 / 國九 / 高中）
        // ==========================================
        const phyDB = [

            // =====================
            // 【國八】
            // =====================
            { g:"國八", t:"波動公式",
              q:(f,l)=>`一連續週期波頻率為 ${f} Hz，波長為 ${l} m，求波速？`,
              a:(f,l)=>f*l, u:"m/s" },

            { g:"國八", t:"回聲測距",
              q:(v,t)=>`聲速 ${300+v*10} m/s，${t*2} 秒後聽到回聲，距離山壁多遠？`,
              a:(v,t)=>(300+v*10)*t, u:"m" },

            { g:"國八", t:"密度",
              q:(d,v)=>`體積 ${v} cm³，質量 ${d*v} g，密度為何？`,
              a:(d,v)=>d, u:"g/cm³" },

            { g:"國八", t:"虎克定律",
              q:(k,x)=>`彈力常數 ${k} gw/cm，伸長 ${x} cm，受力多少？`,
              a:(k,x)=>k*x, u:"gw" },

            { g:"國八", t:"熱量",
              q:(m,t)=>`水 ${m*100} g，升溫 ${t} ℃，吸收多少熱量？`,
              a:(m,t)=>m*100*t, u:"cal" },

            // =====================
            // 【國九】
            // =====================
            { g:"國九", t:"等速運動",
              q:(v,t)=>`物體以 ${v} m/s 行駛 ${t} 秒，位移為何？`,
              a:(v,t)=>v*t, u:"m" },

            { g:"國九", t:"牛頓第二定律",
              q:(m,a)=>`質量 ${m} kg，加速度 ${a} m/s²，合力為何？`,
              a:(m,a)=>m*a, u:"N" },

            { g:"國九", t:"作功",
              q:(f,d)=>`施力 ${f} N，移動 ${d} m，作功多少？`,
              a:(f,d)=>f*d, u:"J" },

            { g:"國九", t:"功率",
              q:(w,t)=>`${t} 秒內作功 ${w*10} J，功率多少？`,
              a:(w,t)=>parseFloat((w*10/t).toFixed(1)), u:"W" },

            { g:"國九", t:"歐姆定律",
              q:(i,r)=>`電流 ${i} A，電阻 ${r} Ω，電壓多少？`,
              a:(i,r)=>i*r, u:"V" },

            { g:"國九", t:"電能",
              q:(p,t)=>`${p*100} W 電器用 ${t} 小時，耗電幾度？`,
              a:(p,t)=>parseFloat((p*100*t/1000).toFixed(2)), u:"度" },

            // =====================
            // 【高中物理】
            // =====================
            { g:"高中", t:"等加速度運動",
              q:(v,a)=>`物體由靜止以加速度 ${a} m/s² 運動 ${v} 秒，位移為何？`,
              a:(v,a)=>0.5*a*v*v, u:"m" },

            { g:"高中", t:"動能",
              q:(m,v)=>`質量 ${m} kg，速度 ${v} m/s，動能為何？`,
              a:(m,v)=>0.5*m*v*v, u:"J" },

            { g:"高中", t:"位能差",
              q:(m,h)=>`質量 ${m} kg，上升 ${h} m，位能增加多少？(g=10)`,
              a:(m,h)=>m*10*h, u:"J" },

            { g:"高中", t:"功與能",
              q:(f,d)=>`施力 ${f} N 拉動物體 ${d} m，能量轉換多少？`,
              a:(f,d)=>f*d, u:"J" },

            { g:"高中", t:"電功率",
              q:(v,i)=>`電壓 ${v*10} V，電流 ${i} A，功率多少？`,
              a:(v,i)=>(v*10)*i, u:"W" }
        ];

        // ==========================================
        // 註冊模板
        // ==========================================
        phyDB.forEach((p, i) => {
            const id = `phy_all_${i}`;

            G.registerTemplate(id, () => {
                const v1 = randInt(2, 10);
                const v2 = randInt(2, 10);
                const ans = p.a(v1, v2);
                const opts = shuffle(
                    generateNumericOptions(ans, Number.isInteger(ans) ? 'int' : 'float')
                );

                return {
                    question: `【物理｜${p.g}】${p.q(v1, v2)}`,
                    options: opts,
                    answer: opts.indexOf(ans),
                    concept: p.t,
                    explanation: [
                        `年級：${p.g}`,
                        `觀念：${p.t}`,
                        `正確答案：${ans} ${p.u}`
                    ]
                };
            }, ["physics", "物理", "自然", "理化", p.g]);
        });

        console.log("✅ 國八＋國九＋高中 物理計算題已全部載入");
    }

    init();
})(window);
