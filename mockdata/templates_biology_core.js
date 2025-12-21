(function (global) {
    'use strict';

    function init() {
        const G = global.RigorousGenerator || (window.global && window.global.RigorousGenerator);
        if (!G || !G.registerTemplate) {
            setTimeout(init, 100);
            return;
        }

        const { pick, shuffle } = G.utils;

        // ===============================
        // 自然科核心資料庫（生物）
        // ===============================
        const natureDB = [
            // ===== 國七：細胞 =====
            { s:"生物", t:["國七","細胞"], q:"細胞的發電廠，產生能量(ATP)", a:"粒線體" },
            { s:"生物", t:["國七","細胞"], q:"植物細胞進行光合作用的場所", a:"葉綠體" },
            { s:"生物", t:["國七","細胞"], q:"細胞的生命中樞，內含遺傳物質", a:"細胞核" },
            { s:"生物", t:["國七","細胞"], q:"植物細胞外層，提供支持與保護", a:"細胞壁" },
            { s:"生物", t:["國七","細胞"], q:"暫存水分、廢物與養分", a:"液泡" },
            { s:"生物", t:["國七","細胞"], q:"控制物質進出細胞的構造", a:"細胞膜" },

            // ===== 國七：循環 =====
            { s:"生物", t:["國七","循環"], q:"攜帶氧氣的血球", a:"紅血球" },
            { s:"生物", t:["國七","循環"], q:"負責防禦與免疫的血球", a:"白血球" },
            { s:"生物", t:["國七","循環"], q:"負責血液凝固的血球", a:"血小板" },
            { s:"生物", t:["國七","循環"], q:"將血液帶離心臟的血管", a:"動脈" },
            { s:"生物", t:["國七","循環"], q:"將血液帶回心臟的血管", a:"靜脈" },

            // ===== 國七：遺傳 =====
            { s:"生物", t:["國七","遺傳"], q:"遺傳學之父", a:"孟德爾" },
            { s:"生物", t:["國七","遺傳"], q:"控制性狀的特徵因子", a:"基因" },
            { s:"生物", t:["國七","遺傳"], q:"人類體細胞的染色體數目", a:"46條 (23對)" },
            { s:"生物", t:["國七","遺傳"], q:"人類精子或卵子的染色體數", a:"23條" },

            // ===== 高一：細胞 =====
            { s:"生物", t:["高一","細胞"], q:"細胞膜的主要成分", a:"磷脂質與蛋白質" },
            { s:"生物", t:["高一","細胞"], q:"原核細胞與真核細胞的差異", a:"是否具有核膜" },

            // ===== 高一：遺傳 =====
            { s:"生物", t:["高一","遺傳"], q:"DNA 的中文名稱", a:"去氧核糖核酸" },
            { s:"生物", t:["高一","遺傳"], q:"DNA 的鹼基配對", a:"A-T、C-G" },

            // ===== 高二：生理 =====
            { s:"生物", t:["高二","生理"], q:"神經衝動的傳導方向", a:"樹突 → 本體 → 軸突" }
        ];

        // ===============================
        // 工具：嚴格過濾
        // ===============================
        function byGrade(grade) {
            return natureDB.filter(x => x.t[0] === grade);
        }

        function byGradeAndUnit(grade, unit) {
            return natureDB.filter(x => x.t[0] === grade && x.t[1] === unit);
        }

        // ===============================
        // 安全出題（不跨年級）
        // ===============================
        function makeBioQuestion(grade) {
            const gradeData = byGrade(grade);
            if (gradeData.length < 4) return null;

            let item, pool;
            let tries = 0;

            while (tries < 20) {
                item = pick(gradeData);
                pool = byGradeAndUnit(grade, item.t[1]).filter(x => x.q !== item.q);
                if (pool.length >= 3) break;
                tries++;
            }

            if (!item || pool.length < 3) return null;

            const wrong = shuffle(pool).slice(0, 3).map(x => x.a);
            const opts = shuffle([item.a, ...wrong]);

            return {
                question: `【生物｜${grade}｜${item.t[1]}】${item.q}`,
                options: opts,
                answer: opts.indexOf(item.a),
                concept: item.t[1],
                explanation: [`正確答案：${item.a}`]
            };
        }

        // ===============================
        // 註冊模板（分年級）
        // ===============================
        ["國七", "高一", "高二"].forEach(grade => {
            G.registerTemplate(`bio_${grade}`, () => {
                return makeBioQuestion(grade) || makeBioQuestion(grade);
            }, ["biology", "生物", "自然", grade]);
        });

        console.log("✅ 生物題庫（嚴格鎖年級）已載入完成");
    }

    init();
})(window);
