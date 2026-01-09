(function(global){
    'use strict';

    function init() {
        const G = global.RigorousGenerator || (window.global && window.global.RigorousGenerator);
        if (!G || !G.registerTemplate) { setTimeout(init, 100); return; }
        const { randInt, shuffle, generateNumericOptions } = G.utils;

        // Helper functions
        function gcd(a,b){ a=Math.abs(a); b=Math.abs(b); while(b){ let t=a%b; a=b; b=t; } return a; }

        // ==========================================
        // 數學科核心資料庫 (Math Core Database)
        // ==========================================
        const mathDB = [
            // [國七]
            { t: "整數運算", q: (a,b)=>`若甲數 = ${a}，乙數 = ${-b}，試求 甲 - 2 × 乙 之值為何？`, a: (a,b)=>a - 2*(-b), tag:["國七","整數"] },
            { t: "數線與絕對值", q: (a,b)=>`數線上兩點 A(${a})、B(${-b})，試求 A、B 兩點間的距離。`, a: (a,b)=>Math.abs(a - (-b)), tag:["國七","數線"] },
            { t: "指數律", q: (a,b)=>`計算 (${a}²)³ × ${a}⁴ ÷ ${a}⁵ 之值為何？`, a: (a,b)=>Math.pow(a, 5), tag:["國七","指數"] },
            { t: "科學記號", q: (a,b)=>`將 ${a}0000 寫成科學記號 a × 10ⁿ，求 n`, a: (a,b)=>4, tag:["國七","數與式"] },
            { t: "因數倍數", q: (a,b)=>`求 ${a*6} 與 ${a*8} 的最大公因數`, a: (a,b)=>a*2, tag:["國七","因數"] },
            { t: "一元一次", q: (a,b)=>`若 x 的方程式 ${a}x + ${b} = ${3*a}x - ${b}，則 x = ?`, a: (a,b)=>b/a, tag:["國七","方程式"] },
            { t: "二元一次", q: (a,b)=>`已知 x=${a}, y=${b} 是方程式 mx - y = 0 的一組解，試求 m 之值。`, a: (a,b)=>b/a, tag:["國七","聯立"] },
            { t: "直角坐標", q: (a,b)=>`點 P(${a}, ${b}) 到 x 軸的距離`, a: (a,b)=>Math.abs(b), tag:["國七","坐標"] },
            { t: "比與比例", q: (a,b)=>`若 x : ${a} = ${b} : 2，求 x`, a: (a,b)=>a*b/2, tag:["國七","比例"] },
            { t: "分數加減", q: (a,b)=>`計算 ${a}/${b} + ${b}/${a} 的值（以小數表示）`, a: (a,b)=>(a/b + b/a), tag:["國七","分數"] },
            { t: "百分率應用", q: (a,b)=>`某商品原價 ${a*100} 元，打 ${b} 折（即 ${b*10}% off），折後價為多少？`, a: (a,b)=>a*100 * (b/10), tag:["國七","百分率"] },
            { t: "簡單代數", q: (a,b)=>`若 3x + 5 = ${3*a+5}, 求 x`, a: (a,b)=>a, tag:["國七","方程式"] },
            { t: "最小公倍數", q: (a,b)=>`求 ${a} 與 ${b} 的最小公倍數`, a: (a,b)=> (a*b)/gcd(a,b), tag:["國七","倍數"] },

            // [國八]
            { t: "乘法公式", q: (a,b)=>`展開 (${a}x + 1)² 的常數項`, a: (a,b)=>1, tag:["國八","多項式"] },
            { t: "多項式運算", q: (a,b)=>`多項式 A = ${a}x² - 5x，B = x² + ${b}x，求 A + B 的 x 項係數。`, a: (a,b)=> -5+b, tag:["國八","多項式"] },
            { t: "根號運算", q: (a,b)=>`計算 √${a*a} + √${b*b} - √${(a+b)*(a+b)} 之值。`, a: (a,b)=>0, tag:["國八","方根"] },
            { t: "畢氏定理", q: (a,b)=>`直角三角形中，兩股長分別為 ${3*a}、${4*a}，試求斜邊長度。`, a: (a,b)=>5*a, tag:["國八","幾何"] },
            { t: "因式分解", q: (a,b)=>`x² + ${a+b}x + ${a*b} 因式分解為 (x+m)(x+n)，求 m+n`, a: (a,b)=>a+b, tag:["國八","因式分解"] },
            { t: "一元二次", q: (a,b)=>`方程式 x² - ${a*2}x = 0 的正根`, a: (a,b)=>a*2, tag:["國八","方程式"] },
            { t: "等差數列", q: (a,b)=>`一等差數列首項為 ${a}，公差為 ${b}，試求第 10 項之值。`, a: (a,b)=>a + 9*b, tag:["國八","數列"] },
            { t: "多邊形內角", q: (a,b)=>`正 ${a+2} 邊形的內角和度數`, a: (a,b)=>(a)*180, tag:["國八","幾何"] },
            { t: "平方差", q: (a,b)=>`計算 (${a}+${b})(${a}-${b}) 的值`, a: (a,b)=>a*a - b*b, tag:["國八","恆等式"] },
            { t: "根號簡化", q: (a,b)=>`化簡 √${a*a*b*b} 的結果`, a: (a,b)=>Math.abs(a*b), tag:["國八","方根"] },

            // [國九]
            { t: "相似形", q: (a,b)=>`兩相似三角形的對應邊長比為 1 : ${a}，則其面積比為何？`, a: (a,b)=>a*a, tag:["國九","幾何"] },
            { t: "圓形性質", q: (a,b)=>`一圓的半徑為 ${a}，若扇形的圓心角為 60度，則該扇形面積為何？(π以3計算)`, a: (a,b)=>a*a*3/6, tag:["國九","圓"] },
            { t: "圓周角", q: (a,b)=>`圓周角 40度，其對應的圓心角幾度?`, a: (a,b)=>80, tag:["國九","圓"] },
            { t: "二次函數", q: (a,b)=>`關於二次函數 y = (x - ${a})² + ${b} 的圖形，下列敘述何者正確？`, a: (a,b)=>`頂點坐標為 (${a}, ${b})`, type:'text', opts:(a,b)=>[ `頂點坐標為 (${a}, ${b})`,`開口向下`,`對稱軸為 x = -${a}`,`通過原點`], tag:["國九","二次函數"] },
            { t: "機率", q: (a,b)=>`投擲一顆公正骰子，出現點數小於 ${a} (含) 的機率為何？(假設 ${a} < 7)`, a: (a,b)=>`${a}/6`, type:'text', opts:(a)=>[ `${a}/6`, `${7-a}/6`, `1/6`, `1/2`], tag:["國九","機率"] }, // Changed type to text for easier handling
            { t: "統計", q: (a,b)=>`數據 1, 2, 3, ${a+3}, ${b+3} 的中位數 (已排序) 為何？`, a: (a,b)=>3, tag:["國九","統計"] },
            { t: "直角三角形", q: (a,b)=>`直角三角形兩直角邊 ${a} 與 ${b}，面積為何？`, a: (a,b)=>0.5*a*b, tag:["國九","幾何"] },

            // [高一]
            { t: "餘式定理", q: (a,b)=>`設 f(x) = x³ + ${a}x + ${b}，試求 f(x) 除以 (x-1) 的餘式。`, a: (a,b)=>1+a+b, tag:["高一","多項式"] },
            { t: "直線斜率", q: (a,b)=>`坐標平面上，通過點 (${a}, 0) 與 (0, ${b}) 的直線斜率為何？`, a: (a,b)=> -b/a, tag:["高一","直線"] },
            { t: "指數運算", q: (a,b)=>`化簡 2^${a} × 4^${b} 為 2 的幾次方？`, a: (a,b)=>a+2*b, tag:["高一","指數"] },
            { t: "對數律", q: (a,b)=>`試求 log₂${Math.pow(2, a)} + log₃${Math.pow(3, b)} 之值。`, a: (a,b)=>a+b, tag:["高一","對數"] },
            { t: "函數映射", q: (a,b)=>`函數 f(x)=2x+${a}，求 f(${b})`, a: (a,b)=>2*b+a, tag:["高一","函數"] },
            { t: "二次函數頂點", q: (a,b)=>`y = x² + ${2*a}x + ${b} 的頂點 x 座標為何？`, a: (a,b)=> -a, tag:["高一","二次函數"] },

            // [高二]
            { t: "三角函數", q: (a,b)=>`試求 sin(30°) + cos(60°) + tan(45°) 之值。`, a: (a,b)=>2, tag:["高二","三角"] },
            { t: "平面向量", q: (a,b)=>`設向量 u = (${a}, 1)，v = (1, ${b})，試求內積 u・v 之值。`, a: (a,b)=>a+b, tag:["高二","向量"] },
            { t: "空間坐標", q: (a,b)=>`空間中一點 P(${a}, ${b}, 5) 到 xy 平面的距離為何？`, a: (a,b)=>5, tag:["高二","空間"] },
            { t: "矩陣運算", q: (a,b)=>`若矩陣 A = [[1, 0], [0, 1]]，則 ${a}A 的行列式值為何？`, a: (a,b)=>a*a, tag:["高二","矩陣"] },
            { t: "向量長度", q: (a,b)=>`向量 ( ${3*a}, ${4*a} ) 的長度為何？`, a: (a,b)=>5*a, tag:["高二","向量"] },

            // [高三]
            { t: "極限", q: (a,b)=>`試求 lim(n→∞) (${a}n + 1) / n 之極限值。`, a: (a,b)=>a, tag:["高三","極限"] },
            { t: "微分", q: (a,b)=>`設函數 f(x) = x²，試求 f'(${a}) 之值。`, a: (a,b)=>2*a, tag:["高三","微分"] },
            { t: "積分", q: (a,b)=>`試求定積分 ∫(0 to ${a}) 2x dx 之值。`, a: (a,b)=>a*a, tag:["高三","積分"] },
            { t: "期望值", q: (a,b)=>`擲一骰子，出現 n 點可得 ${a}n 元，期望值為何？`, a: (a,b)=>a*3.5, tag:["高三","機率"] },
            { t: "導數應用", q: (a,b)=>`函數 y=x³ 在 x=${a} 處切線斜率為何？`, a: (a,b)=>3*a*a, tag:["高三","微分"] }
        ];

        // 註冊邏輯
        const grades = ["國七", "國八", "國九", "高一", "高二", "高三"];

        grades.forEach(grade => {
            const pool = mathDB.filter(q => q.tag[0] === grade);
            
            pool.forEach((p, idx) => {
                const templateId = `math_${grade}_${idx}`;
                
                G.registerTemplate(templateId, (ctx, rnd) => {
                    const v1 = randInt(2, 9);
                    const v2 = randInt(2, 9);
                    let ans = p.a(v1, v2);
                    let opts;

                    if (p.type === 'text') {
                        // 文字選項
                        const op = typeof p.opts === 'function' ? p.opts(v1, v2) : p.opts;
                        opts = shuffle(op);
                        // ans is already the correct string from p.a()
                    } else if (p.type === 'fraction') {
                        // 分數選項 (Special case handled as text in this fix for simplicity)
                        // In the DB above, I changed fraction type questions to return string answers directly to simplify
                        const op = typeof p.opts === 'function' ? p.opts(v1) : p.opts;
                        opts = shuffle(op);
                    } else {
                        // 數值題自動生成誘答
                        const isInt = Number.isInteger(ans);
                        opts = shuffle(generateNumericOptions(ans, isInt ? 'int' : 'float'));
                    }

                    return {
                        question: `【數學】${p.q(v1, v2)}`,
                        options: opts,
                        answer: opts.indexOf(ans),
                        concept: p.t,
                        explanation: [`正確答案：${ans}`]
                    };
                }, ["math", "數學", grade, p.tag[1]]); 
            });
        });

        console.log("✅ 數學題庫 (分年級鎖定版) 已載入完成。");
    }

    init();

})(window);
