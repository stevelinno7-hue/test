(function(global){
    'use strict';

    function init() {
        const G = global.RigorousGenerator || (window.global && window.global.RigorousGenerator);
        if (!G || !G.registerTemplate) { setTimeout(init, 100); return; }
        const { randInt, pick, shuffle } = G.utils;

        // Helper: Euclidean Algorithm for GCD
        const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);

        // Helper: Fraction Formatter
        const toFrac = (n, d) => {
            if (d === 0) return "undefined";
            if (n === 0) return "0";
            const common = Math.abs(gcd(n, d));
            n /= common; d /= common;
            if (d < 0) { n = -n; d = -d; } 
            return d === 1 ? `${n}` : `${n}/${d}`;
        };

        // Helper: Decimal Fixer
        const fix = (n) => parseFloat(n.toFixed(2));

        // Advanced Distractor Generator (Smart Mistakes)
        function generateSmartOptions(ans, type, context) {
            let correct = ans;
            let distractors = new Set();
            
            // Generate logical mistakes based on context
            if (context === 'sign') { // Sign errors
                distractors.add(-correct);
                distractors.add(Math.abs(correct));
            } else if (context === 'reciprocal') { // Flip numerator/denominator
                if (typeof correct === 'string' && correct.includes('/')) {
                    let parts = correct.split('/');
                    distractors.add(`${parts[1]}/${parts[0]}`);
                }
            } else if (context === 'arithmetic') { // Off by small amounts
                distractors.add(correct + 1);
                distractors.add(correct - 1);
                distractors.add(correct * 2);
                distractors.add(correct / 2);
            }

            // Fill remaining spots with random but plausible values
            while (distractors.size < 3) {
                let fake;
                if (typeof correct === 'number') {
                    fake = fix(correct + randInt(-5, 5) * (Math.random() > 0.5 ? 1 : 0.5));
                } else {
                    // String/Fraction fallback
                    fake = toFrac(randInt(1,10), randInt(1,10));
                }
                if (fake != correct) distractors.add(fake);
            }

            let opts = Array.from(distractors).slice(0, 3);
            opts.push(correct);
            return shuffle(opts);
        }

        // ==========================================
        //  Advanced Math Database (Harder Problems)
        // ==========================================
        const mathDB = [

            // =========================

            // 國七 (Grade 7)

            // =========================

            { tag: ["國七","整數"], t:"整數加減", gen:()=>({a:randInt(10,99), b:randInt(10,99)}), q:(v)=>`${v.a} + (-${v.b}) = ?`, a:(v)=>v.a-v.b },

            { tag: ["國七","整數"], t:"整數乘法", gen:()=>({a:randInt(-20,-2), b:randInt(2,15)}), q:(v)=>`(${v.a}) × ${v.b} = ?`, a:(v)=>v.a*v.b },

            { tag: ["國七","整數"], t:"絕對值", gen:()=>({a:randInt(-50,-10)}), q:(v)=>`|${v.a}| + |${v.a+5}| = ?`, a:(v)=>Math.abs(v.a)+Math.abs(v.a+5) },

            { tag: ["國七","整數"], t:"指數運算", gen:()=>({b:randInt(2,5), e:randInt(2,4)}), q:(v)=>`(-${v.b})^${v.e} = ?`, a:(v)=>Math.pow(-v.b, v.e) },

            { tag: ["國七","整數"], t:"科學記號", gen:()=>({a:randInt(1,9), n:randInt(3,7)}), q:(v)=>`${v.a} × 10^${v.n} 展開後是幾位數？`, a:(v)=>v.n+1 },

            

            { tag: ["國七","分數"], t:"分數加法", gen:()=>({n1:1, d1:randInt(2,5), n2:1, d2:randInt(2,5)}), q:(v)=>`${v.n1}/${v.d1} + ${v.n2}/${v.d2} = ?`, a:(v)=>toFrac(v.n1*v.d2+v.n2*v.d1, v.d1*v.d2), isFrac:true },

            { tag: ["國七","分數"], t:"分數乘法", gen:()=>({n:randInt(1,5), d:randInt(2,8)}), q:(v)=>`(${v.n}/${v.d}) × (${v.d}/${v.n+1}) = ?`, a:(v)=>toFrac(v.n, v.n+1), isFrac:true },

            { tag: ["國七","分數"], t:"分數除法", gen:()=>({a:randInt(2,5), b:randInt(2,5)}), q:(v)=>`(${v.a}/${v.b}) ÷ (${v.a}/${v.b}) = ?`, a:(v)=>"1", isFrac:true },

            { tag: ["國七","分數"], t:"最簡分數", gen:()=>({k:randInt(2,5), n:randInt(1,10), d:randInt(11,20)}), q:(v)=>`${v.k*v.n}/${v.k*v.d} 化為最簡分數為何？`, a:(v)=>toFrac(v.n, v.d), isFrac:true },

            

            { tag: ["國七","一元一次"], t:"解方程式", gen:()=>({a:randInt(2,9), b:randInt(10,50)}), q:(v)=>`${v.a}x = ${v.b}，x = ?`, a:(v)=>toFrac(v.b, v.a), isFrac:true },

            { tag: ["國七","一元一次"], t:"移項法則", gen:()=>({a:randInt(2,5), b:randInt(1,9), c:randInt(10,20)}), q:(v)=>`${v.a}x + ${v.b} = ${v.c}，x = ?`, a:(v)=>toFrac(v.c-v.b, v.a), isFrac:true },

            { tag: ["國七","一元一次"], t:"分配律", gen:()=>({a:randInt(2,5)}), q:(v)=>`${v.a}(x + 2) = ${v.a*4}，x = ?`, a:(v)=>2 },

            

            { tag: ["國七","比例"], t:"比例式", gen:()=>({a:randInt(2,5), b:randInt(6,10)}), q:(v)=>`x : ${v.a} = ${v.b} : 1，x = ?`, a:(v)=>v.a*v.b },

            { tag: ["國七","比例"], t:"連比例", gen:()=>({a:2, b:3, c:4}), q:(v)=>`若 x:y:z = ${v.a}:${v.b}:${v.c}，且 x=${v.a*10}，則 z = ?`, a:(v)=>v.c*10 },

            { tag: ["國七","函數"], t:"函數值", gen:()=>({a:randInt(2,5), b:randInt(1,10), x:randInt(1,5)}), q:(v)=>`f(x) = ${v.a}x - ${v.b}，f(${v.x}) = ?`, a:(v)=>v.a*v.x - v.b },



            // =========================

            // 國八 (Grade 8)

            // =========================

            { tag: ["國八","乘法公式"], t:"和平方", gen:()=>({a:randInt(10,50)}), q:(v)=>`${v.a}² + 2×${v.a}×1 + 1 = ?`, a:(v)=>(v.a+1)**2 },

            { tag: ["國八","乘法公式"], t:"差平方", gen:()=>({a:randInt(20,50)}), q:(v)=>`${v.a}² - 2×${v.a}×2 + 4 = ?`, a:(v)=>(v.a-2)**2 },

            { tag: ["國八","乘法公式"], t:"平方差", gen:()=>({a:randInt(50,100)}), q:(v)=>`${v.a}² - ${v.a-1}² = ?`, a:(v)=>v.a*2-1 },

            

            { tag: ["國八","多項式"], t:"多項式加法", gen:()=>({a:randInt(2,5), b:randInt(2,5)}), q:(v)=>`(${v.a}x + 1) + (${v.b}x - 1) = ?`, a:(v)=>`${v.a+v.b}x`, type:'text', opts:(v)=>[ `${v.a+v.b}x`, `${v.a+v.b}x+2`, `${v.a*v.b}x`, `${v.a+v.b}` ] },

            { tag: ["國八","多項式"], t:"多項式乘法", gen:()=>({a:randInt(2,5)}), q:(v)=>`x(x + ${v.a}) = ?`, a:(v)=>`x^2 + ${v.a}x`, type:'text', opts:(v)=>[ `x^2 + ${v.a}x`, `x^2 + ${v.a}`, `2x + ${v.a}`, `x + ${v.a}x` ] },

            

            { tag: ["國八","根號"], t:"根號化簡", gen:()=>({a:randInt(2,9)}), q:(v)=>`√${v.a*v.a} = ?`, a:(v)=>v.a },

            { tag: ["國八","根號"], t:"根號加減", gen:()=>({a:randInt(2,5)}), q:(v)=>`3√${v.a} + 2√${v.a} = ?`, a:(v)=>`5√${v.a}`, type:'text', opts:(v)=>[ `5√${v.a}`, `6√${v.a}`, `√${v.a*5}`, `5` ] },

            { tag: ["國八","根號"], t:"畢氏定理", gen:()=>pick([{a:3,b:4,c:5},{a:5,b:12,c:13},{a:8,b:15,c:17},{a:6,b:8,c:10}]), q:(v)=>`直角三角形兩股 ${v.a}, ${v.b}，斜邊 = ?`, a:(v)=>v.c },

            

            { tag: ["國八","因式分解"], t:"提公因式", gen:()=>({a:randInt(2,5)}), q:(v)=>`${v.a}x² + ${v.a}x 因式分解為何？`, a:(v)=>`${v.a}x(x+1)`, type:'text', opts:(v)=>[ `${v.a}x(x+1)`, `${v.a}(x^2+x)`, `x(${v.a}x+${v.a})`, `${v.a}x(x-1)` ] },

            { tag: ["國八","因式分解"], t:"十字交乘", gen:()=>({a:2, b:3}), q:(v)=>`x² + 5x + 6 因式分解為何？`, a:(v)=>`(x+2)(x+3)`, type:'text', opts:(v)=>[ `(x+2)(x+3)`, `(x-2)(x-3)`, `(x+1)(x+6)`, `(x-1)(x-6)` ] },

            

            { tag: ["國八","一元二次"], t:"解方程式", gen:()=>({a:randInt(2,5)}), q:(v)=>`x² = ${v.a*v.a}，x = ?`, a:(v)=>`±${v.a}`, type:'text', opts:(v)=>[ `±${v.a}`, `${v.a}`, `-${v.a}`, `${v.a*v.a}` ] },

            { tag: ["國八","一元二次"], t:"公式解", gen:()=>({}), q:(v)=>`方程式 ax² + bx + c = 0 的判別式為何？`, a:(v)=>`b² - 4ac`, type:'text', opts:(v)=>[ `b² - 4ac`, `b² + 4ac`, `b - 4ac`, `2a` ] },

            

            { tag: ["國八","數列"], t:"等差數列", gen:()=>({a1:randInt(1,10), d:randInt(2,5)}), q:(v)=>`首項 ${v.a1}，公差 ${v.d}，第 10 項為何？`, a:(v)=>v.a1 + 9*v.d },

            { tag: ["國八","數列"], t:"等差級數", gen:()=>({n:10, a1:1, an:10}), q:(v)=>`1 + 2 + ... + 10 = ?`, a:(v)=>55 },

            { tag: ["國八","幾何"], t:"內角和", gen:()=>({n:randInt(4,8)}), q:(v)=>`${v.n} 邊形內角和為幾度？`, a:(v)=>(v.n-2)*180 },



            // =========================

            // 國九 (Grade 9)

            // =========================

            { tag: ["國九","幾何"], t:"相似形", gen:()=>({k:randInt(2,4)}), q:(v)=>`若 ΔABC ~ ΔDEF，邊長比 1:${v.k}，則面積比為何？`, a:(v)=>`1:${v.k*v.k}`, type:'text', opts:(v)=>[ `1:${v.k*v.k}`, `1:${v.k}`, `1:${v.k*2}`, `1:${v.k+2}` ] },

            { tag: ["國九","幾何"], t:"全等性質", gen:()=>({}), q:(v)=>`下列何者不是三角形全等性質？`, a:(v)=>`AAA`, type:'text', opts:(v)=>[ `AAA`, `SAS`, `SSS`, `AAS` ] },

            { tag: ["國九","圓"], t:"圓周長", gen:()=>({r:randInt(2,10)}), q:(v)=>`半徑 ${v.r} 的圓周長？`, a:(v)=>`2π×${v.r}`, type:'text', opts:(v)=>[ `${2*v.r}π`, `${v.r*v.r}π`, `${v.r}π`, `${4*v.r}π` ] },

            { tag: ["國九","圓"], t:"圓面積", gen:()=>({r:randInt(2,10)}), q:(v)=>`半徑 ${v.r} 的圓面積？`, a:(v)=>`${v.r*v.r}π`, type:'text', opts:(v)=>[ `${v.r*v.r}π`, `${2*v.r}π`, `${v.r}π`, `${v.r/2}π` ] },

            { tag: ["國九","圓"], t:"圓心角", gen:()=>({d:pick([30,45,60,90])}), q:(v)=>`弧度 ${v.d}° 對應的圓心角為何？`, a:(v)=>v.d },

            

            { tag: ["國九","二次函數"], t:"頂點", gen:()=>({h:randInt(1,5), k:randInt(1,5)}), q:(v)=>`y = (x - ${v.h})² + ${v.k} 的頂點？`, a:(v)=>`(${v.h}, ${v.k})`, type:'text', opts:(v)=>[ `(${v.h}, ${v.k})`, `(-${v.h}, ${v.k})`, `(${v.h}, -${v.k})`, `(0, 0)` ] },

            { tag: ["國九","二次函數"], t:"開口方向", gen:()=>({a:randInt(1,5)}), q:(v)=>`y = -${v.a}x² 的開口方向？`, a:(v)=>`向下`, type:'text', opts:(v)=>[ `向下`, `向上`, `向左`, `向右` ] },

            { tag: ["國九","二次函數"], t:"極值", gen:()=>({k:randInt(1,10)}), q:(v)=>`y = x² + ${v.k} 的最小值？`, a:(v)=>v.k },

            

            { tag: ["國九","機率"], t:"骰子", gen:()=>({}), q:(v)=>`擲一顆骰子，出現偶數的機率？`, a:(v)=>`1/2`, type:'text', opts:(v)=>[ `1/2`, `1/3`, `1/6`, `2/3` ] },

            { tag: ["國九","機率"], t:"硬幣", gen:()=>({}), q:(v)=>`投擲兩枚硬幣，一正一反的機率？`, a:(v)=>`1/2`, type:'text', opts:(v)=>[ `1/2`, `1/4`, `3/4`, `1/3` ] },

            { tag: ["國九","統計"], t:"中位數", gen:()=>({a:randInt(1,9)}), q:(v)=>`數據 1, 2, ${v.a+2}, 9, 10 的中位數？`, a:(v)=>v.a+2 },

            { tag: ["國九","統計"], t:"眾數", gen:()=>({a:randInt(1,9)}), q:(v)=>`數據 1, ${v.a}, 2, ${v.a}, 3 的眾數？`, a:(v)=>v.a },

            { tag: ["國九","統計"], t:"四分位數", gen:()=>({}), q:(v)=>`Q2 代表什麼？`, a:(v)=>`中位數`, type:'text', opts:(v)=>[ `中位數`, `平均數`, `眾數`, `最大值` ] },

            

            { tag: ["國九","立體"], t:"柱體體積", gen:()=>({a:randInt(2,5), h:randInt(2,5)}), q:(v)=>`底面積 ${v.a}，高 ${v.h} 的柱體體積？`, a:(v)=>v.a*v.h },

            { tag: ["國九","立體"], t:"錐體體積", gen:()=>({a:randInt(3,9), h:randInt(2,5)}), q:(v)=>`底面積 ${v.a}，高 ${v.h} 的錐體體積？`, a:(v)=>v.a*v.h/3 },



            // =========================

            // 高一 (Grade 10)

            // =========================

            { tag: ["高一","直線"], t:"斜率", gen:()=>({x:randInt(2,5), y:randInt(2,5)}), q:(v)=>`過原點與 (${v.x},${v.y}) 的直線斜率？`, a:(v)=>toFrac(v.y, v.x), isFrac:true },

            { tag: ["高一","直線"], t:"平行線", gen:()=>({m:randInt(2,5)}), q:(v)=>`與直線 y=${v.m}x+1 平行的斜率？`, a:(v)=>v.m },

            { tag: ["高一","直線"], t:"垂直線", gen:()=>({m:randInt(2,5)}), q:(v)=>`與直線 y=${v.m}x 垂直的斜率？`, a:(v)=>toFrac(-1, v.m), isFrac:true },

            { tag: ["高一","直線"], t:"截距", gen:()=>({b:randInt(2,9)}), q:(v)=>`直線 y=2x + ${v.b} 的 y 截距？`, a:(v)=>v.b },

            

            { tag: ["高一","多項式"], t:"餘式定理", gen:()=>({r:randInt(1,5)}), q:(v)=>`f(x) 除以 (x-1) 餘式為 ${v.r}，則 f(1)=?`, a:(v)=>v.r },

            { tag: ["高一","多項式"], t:"因式定理", gen:()=>({a:randInt(1,5)}), q:(v)=>`若 (x-${v.a}) 是 f(x) 的因式，則 f(${v.a})=?`, a:(v)=>0 },

            { tag: ["高一","多項式"], t:"除法原理", gen:()=>({}), q:(v)=>`被除式 = 除式 × 商式 + ?`, a:(v)=>`餘式`, type:'text', opts:(v)=>[ `餘式`, `因式`, `零`, `係數` ] },

            

            { tag: ["高一","指數"], t:"指數律", gen:()=>({n:randInt(2,5)}), q:(v)=>`(2^${v.n})^2 = 2的幾次方？`, a:(v)=>v.n*2 },

            { tag: ["高一","指數"], t:"負指數", gen:()=>({n:randInt(2,5)}), q:(v)=>`2^(-${v.n}) 等於？`, a:(v)=>toFrac(1, Math.pow(2,v.n)), isFrac:true },

            { tag: ["高一","對數"], t:"對數定義", gen:()=>({n:randInt(2,5)}), q:(v)=>`log₂(${Math.pow(2,v.n)}) = ?`, a:(v)=>v.n },

            { tag: ["高一","對數"], t:"對數律", gen:()=>({}), q:(v)=>`log A + log B = ?`, a:(v)=>`log(AB)`, type:'text', opts:(v)=>[ `log(AB)`, `log(A+B)`, `log(A/B)`, `log(A)+log(B)` ] },

            

            { tag: ["高一","不等式"], t:"一元二次", gen:()=>({}), q:(v)=>`x² < 0 的實數解？`, a:(v)=>`無解`, type:'text', opts:(v)=>[ `無解`, `0`, `全體實數`, `1` ] },

            { tag: ["高一","不等式"], t:"絕對值", gen:()=>({k:randInt(2,5)}), q:(v)=>`|x| < ${v.k} 的範圍？`, a:(v)=>`-${v.k} < x < ${v.k}`, type:'text', opts:(v)=>[ `-${v.k} < x < ${v.k}`, `x > ${v.k}`, `x < -${v.k}`, `無解` ] },

            { tag: ["高一","數據"], t:"標準差", gen:()=>({}), q:(v)=>`數據皆為 5，標準差為何？`, a:(v)=>0 },

            { tag: ["高一","數據"], t:"相關係數", gen:()=>({}), q:(v)=>`完全正相關的係數 r = ?`, a:(v)=>1 },



            // =========================

            // 高二 (Grade 11)

            // =========================

            { tag: ["高二","三角"], t:"正弦值", gen:()=>({}), q:(v)=>`sin(30°) = ?`, a:(v)=>`1/2`, type:'text', opts:(v)=>[ `1/2`, `√3/2`, `1`, `0` ] },

            { tag: ["高二","三角"], t:"餘弦值", gen:()=>({}), q:(v)=>`cos(0°) = ?`, a:(v)=>1 },

            { tag: ["高二","三角"], t:"正切值", gen:()=>({}), q:(v)=>`tan(45°) = ?`, a:(v)=>1 },

            { tag: ["高二","三角"], t:"廣義角", gen:()=>({}), q:(v)=>`sin(180°) = ?`, a:(v)=>0 },

            { tag: ["高二","三角"], t:"正弦定理", gen:()=>({}), q:(v)=>`a/sinA = ?`, a:(v)=>`2R`, type:'text', opts:(v)=>[ `2R`, `R`, `R²`, `abc` ] },

            { tag: ["高二","三角"], t:"餘弦定理", gen:()=>({}), q:(v)=>`c² = a² + b² - ?`, a:(v)=>`2ab cosC`, type:'text', opts:(v)=>[ `2ab cosC`, `2ab sinC`, `ab cosC`, `0` ] },

            

            { tag: ["高二","向量"], t:"向量加法", gen:()=>({x1:1, y1:2, x2:3, y2:4}), q:(v)=>`(${v.x1},${v.y1}) + (${v.x2},${v.y2}) = ?`, a:(v)=>`(${v.x1+v.x2}, ${v.y1+v.y2})`, type:'text', opts:(v)=>[ `(4, 6)`, `(2, 2)`, `(3, 8)`, `(0, 0)` ] },

            { tag: ["高二","向量"], t:"內積", gen:()=>({}), q:(v)=>`i · j (單位向量) = ?`, a:(v)=>0 },

            { tag: ["高二","向量"], t:"長度", gen:()=>({a:3, b:4}), q:(v)=>`向量 (3, 4) 的長度？`, a:(v)=>5 },

            { tag: ["高二","向量"], t:"柯西不等式", gen:()=>({}), q:(v)=>`|u||v| ≥ ?`, a:(v)=>`|u·v|`, type:'text', opts:(v)=>[ `|u·v|`, `u+v`, `0`, `1` ] },

            

            { tag: ["高二","矩陣"], t:"矩陣加法", gen:()=>({}), q:(v)=>`[1 2] + [3 4] = ?`, a:(v)=>`[4 6]`, type:'text', opts:(v)=>[ `[4 6]`, `[3 8]`, `[2 2]`, `[1 3]` ] },

            { tag: ["高二","矩陣"], t:"行列式", gen:()=>({a:randInt(1,5), d:randInt(1,5)}), q:(v)=>`| ${v.a} 0 |\n| 0 ${v.d} | = ?`, a:(v)=>v.a*v.d },

            { tag: ["高二","矩陣"], t:"單位方陣", gen:()=>({}), q:(v)=>`I₂ 的行列式值？`, a:(v)=>1 },

            { tag: ["高二","空間"], t:"距離", gen:()=>({z:randInt(3,9)}), q:(v)=>`點 (1, 2, ${v.z}) 到 xy 平面的距離？`, a:(v)=>v.z },

            { tag: ["高二","空間"], t:"平麵方程式", gen:()=>({}), q:(v)=>`z=0 代表什麼平面？`, a:(v)=>`xy平面`, type:'text', opts:(v)=>[ `xy平面`, `yz平面`, `xz平面`, `直線` ] },



            // =========================

            // 高三 (Grade 12)

            // =========================

            { tag: ["高三","極限"], t:"數列極限", gen:()=>({}), q:(v)=>`lim(n→∞) 1/n = ?`, a:(v)=>0 },

            { tag: ["高三","極限"], t:"無窮級數", gen:()=>({}), q:(v)=>`1 + 1/2 + 1/4 + ... = ?`, a:(v)=>2 },

            { tag: ["高三","極限"], t:"函數極限", gen:()=>({}), q:(v)=>`lim(x→2) x² = ?`, a:(v)=>4 },

            

            { tag: ["高三","微分"], t:"導函數", gen:()=>({n:randInt(2,5)}), q:(v)=>`x^${v.n} 的導數為？`, a:(v)=>`${v.n}x^${v.n-1}`, type:'text', opts:(v)=>[ `${v.n}x^${v.n-1}`, `x^${v.n-1}`, `0`, `1` ] },

            { tag: ["高三","微分"], t:"常數微分", gen:()=>({c:randInt(10,99)}), q:(v)=>`f(x)=${v.c}，f'(x)=?`, a:(v)=>0 },

            { tag: ["高三","微分"], t:"切線斜率", gen:()=>({}), q:(v)=>`y=x 在 x=1 的切線斜率？`, a:(v)=>1 },

            

            { tag: ["高三","積分"], t:"定積分", gen:()=>({b:randInt(2,5)}), q:(v)=>`∫(0 to ${v.b}) 1 dx = ?`, a:(v)=>v.b },

            { tag: ["高三","積分"], t:"不定積分", gen:()=>({n:randInt(2,5)}), q:(v)=>`∫ x^${v.n-1} dx = ?`, a:(v)=>`x^${v.n}/${v.n}`, type:'text', opts:(v)=>[ `x^${v.n}/${v.n}`, `x^${v.n}`, `x^${v.n-1}`, `0` ] },

            { tag: ["高三","積分"], t:"面積", gen:()=>({}), q:(v)=>`y=x, x=1, x軸 圍成的面積？`, a:(v)=>`1/2`, type:'text', opts:(v)=>[ `1/2`, `1`, `2`, `1/3` ] },

            

            { tag: ["高三","機率"], t:"期望值", gen:()=>({p:100}), q:(v)=>`中獎率 1/2，獎金 ${v.p} 元，期望值？`, a:(v)=>v.p/2 },

            { tag: ["高三","機率"], t:"獨立事件", gen:()=>({}), q:(v)=>`P(A∩B) = ? (若獨立)`, a:(v)=>`P(A)P(B)`, type:'text', opts:(v)=>[ `P(A)P(B)`, `P(A)+P(B)`, `0`, `1` ] },

            { tag: ["高三","統計"], t:"二項分布", gen:()=>({}), q:(v)=>`B(n, p) 的平均數？`, a:(v)=>`np`, type:'text', opts:(v)=>[ `np`, `npq`, `n`, `p` ] }

        ];
        // Registration Logic
        const grades = ["國七", "國八", "國九", "高一", "高二", "高三"];

        grades.forEach(grade => {
            const pool = mathDB.filter(q => q.tag[0] === grade);
            
            pool.forEach((p, idx) => {
                const templateId = `math_${grade}_${idx}`;
                
                G.registerTemplate(templateId, (ctx, rnd) => {
                    const vals = p.gen ? p.gen() : {};
                    let ans = p.a(vals);
                    let opts;

                    if (p.type === 'text') {
                        // Custom text options
                        opts = p.opts ? shuffle(p.opts(vals)) : shuffle([ans, "Error 1", "Error 2", "Error 3"]);
                    } else if (p.isFrac) {
                        // Smart Fraction Distractors (Reciprocals, Sign errors)
                        opts = generateSmartOptions(ans, 'fraction', 'reciprocal');
                    } else {
                        // Smart Numeric Distractors (Off-by-one, Sign errors)
                        opts = generateSmartOptions(ans, 'number', 'arithmetic');
                    }

                    return {
                        question: `【數學】${p.q(vals)}`,
                        options: opts,
                        answer: opts.indexOf(ans),
                        concept: p.t,
                        explanation: [`正確答案：${ans}`]
                    };
                }, ["math", "數學", grade, p.tag[1]]); 
            });
        });

        console.log(`✅ 數學題庫 (V7.0 進階難度版) 已載入，共 ${mathDB.length} 題型。`);
    }

    init();

})(window);
